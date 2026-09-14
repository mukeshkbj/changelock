#!/usr/bin/env bash
# ChangeLock demo video assembly.
#
# Inputs (not committed to the repo — regenerate per MANIFEST.md):
#   FRAMES_DIR : 11 styled 1920x1080 PNG captures named 01-title.png ... 11-close.png
#   AUDIO_DIR  : 11 SAPI narration WAVs named 01-title.wav ... 11-close.wav
# Inputs (committed):
#   changelock-demo-captions.srt : burned-in captions, timed to this script's pads
# Output:
#   changelock-demo-draft.mp4    1920x1080, H.264 + AAC, ~2:55
#
# Requirements: ffmpeg + ffprobe on PATH (or FFMPEG/FFPROBE env overrides).
set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
FFMPEG="${FFMPEG:-ffmpeg}"
FFPROBE="${FFPROBE:-ffprobe}"
FRAMES_DIR="${FRAMES_DIR:-${TEMP:-/tmp}/changelock-video/frames}"
AUDIO_DIR="${AUDIO_DIR:-${TEMP:-/tmp}/changelock-video/audio}"
SRT="${SRT:-$HERE/changelock-demo-captions.srt}"
OUT="${OUT:-$HERE/changelock-demo-draft.mp4}"

ORDER=(01-title 02-inbox 03-rail 04-contract 05-form-ready 06-denied 07-denied-gates 08-confirmed 09-failclosed 10-audit 11-close)
# Lead-in and tail silence (seconds) inside each shot. The SRT timings assume
# these pads; if you change them, retime the captions.
BEFORE=(1.0 0.7 0.7 0.7 0.7 0.7 0.7 0.7 0.7 0.7 0.7)
AFTER=(0.9 0.9 0.9 0.9 0.9 0.9 0.9 0.9 0.9 2.6 1.8)
FADE=0.6
FPS=30

add() { awk -v a="$1" -v b="$2" 'BEGIN{printf "%.3f", a+b}'; }
sub() { awk -v a="$1" -v b="$2" 'BEGIN{printf "%.3f", a-b}'; }
ms()  { awk -v s="$1" 'BEGIN{printf "%d", s*1000}'; }

dur_of() { "$FFPROBE" -v error -show_entries format=duration -of csv=p=0 "$1"; }

frames_of() { awk -v s="$1" -v f="$FPS" 'BEGIN{printf "%d", s*f + 0.5}'; }

INPUTS=()
N=${#ORDER[@]}
for i in "${!ORDER[@]}"; do
  name="${ORDER[$i]}"
  frame="$FRAMES_DIR/$name.png"
  wav="$AUDIO_DIR/$name.wav"
  [[ -f "$frame" ]] || { echo "missing frame: $frame" >&2; exit 1; }
  [[ -f "$wav" ]]   || { echo "missing audio: $wav" >&2; exit 1; }
  DUR[$i]=$(dur_of "$wav")
  CLIP[$i]=$(add "${DUR[$i]}" "$(add "${BEFORE[$i]}" "${AFTER[$i]}")")
  NFRAMES[$i]=$(frames_of "${CLIP[$i]}")
  CLIP[$i]=$(awk -v n="${NFRAMES[$i]}" -v f="$FPS" 'BEGIN{printf "%.6f", n/f}')
  INPUTS+=(-i "$frame")
done
for name in "${ORDER[@]}"; do INPUTS+=(-i "$AUDIO_DIR/$name.wav"); done

# Per-clip video chains: each still is expanded to CLIP frames by zoompan
# (canonical single-frame-input usage — avoids looped-input timestamp floods).
VF=""
for i in "${!ORDER[@]}"; do
  case "${ORDER[$i]}" in
    01-title|11-close) Z="1.0" ;;
    *)                 Z="1.0+0.00007*on" ;;
  esac
  VF+="[$i:v]scale=2880:1620,zoompan=z='$Z':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${NFRAMES[$i]}:s=1920x1080:fps=$FPS,settb=AVTB,format=yuv420p[v$i];"
done

# xfade chain. Offset of transition i = T_i + CLIP_i - FADE, where T_i is the
# output-timeline time at which clip i becomes fully visible. Clip 0 starts at
# 0 with no incoming fade, so the fade is only subtracted for later clips.
T=0
PREV="v0"
for ((i=0;i<N-1;i++)); do
  OFF=$(sub "$(add "$T" "${CLIP[$i]}")" "$FADE")
  if ((i==N-2)); then NEXT="vxf"; else NEXT="x$((i+1))"; fi
  VF+="[$PREV][v$((i+1))]xfade=transition=fade:duration=$FADE:offset=$OFF[$NEXT];"
  if ((i==0)); then T="${CLIP[$i]}"; else T=$(sub "$(add "$T" "${CLIP[$i]}")" "$FADE"); fi
  PREV="$NEXT"
done
SRT_WIN=$SRT
command -v cygpath >/dev/null 2>&1 && SRT_WIN=$(cygpath -m "$SRT")
SRT_ESC=$(printf '%s' "$SRT_WIN" | sed 's/\\/\\\\/g; s/:/\\:/g')
VF+="[vxf]subtitles='$SRT_ESC':force_style='FontName=Segoe UI,FontSize=21,PrimaryColour=&H00FFFFFF,BorderStyle=3,BackColour=&HA0000000,Outline=10,Shadow=0,MarginV=26,Alignment=2'[vout]"

# Audio: delay each narration WAV to its shot start, mix, normalize. Same T_i
# convention as the xfade chain above.
T=0
AF=""
for ((i=0;i<N;i++)); do
  DELAY=$(ms "$(add "$T" "${BEFORE[$i]}")")
  AF+="[$((N+i)):a]adelay=$DELAY:all=1[a$i];"
  if ((i==0)); then T="${CLIP[$i]}"; else T=$(sub "$(add "$T" "${CLIP[$i]}")" "$FADE"); fi
done
MIX=$(for ((i=0;i<N;i++)); do printf '[a%d]' "$i"; done)
AF+="${MIX}amix=inputs=$N:normalize=0,loudnorm=I=-16:TP=-1.5:LRA=11,aresample=48000[aout]"

"$FFMPEG" -y "${INPUTS[@]}" \
  -filter_complex "$VF;$AF" \
  -map "[vout]" -map "[aout]" \
  -c:v libx264 -preset medium -crf 20 -pix_fmt yuv420p \
  -c:a aac -b:a 160k -movflags +faststart \
  "$OUT"

echo "wrote $OUT"
