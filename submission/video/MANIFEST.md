# ChangeLock demo video — build manifest

Output: `changelock-demo-draft.mp4` — 1920×1080, H.264 + AAC, 2:55.9, ~36 MB.
Narrative authority: `../DEMO_SCRIPT.md`. All scenarios are deterministic
replay; the one live-call mention (segment 9) states a real authorized test
call reached **no answer** — not presented as confirmation or denial.

## Pipeline (reproduce)

1. **Demo server (isolated).** Fresh DB, port 3200 (3000/3100 are used by
   other QA rigs):
   `CHANGELOCK_DB_PATH=data/demo-video.db PORT=3200 npm run db:migrate && npm run db:seed`
   then `CHANGELOCK_MODE=replay CHANGELOCK_DB_PATH=data/demo-video.db PORT=3200 npm start`.
   Drive the flows over HTTP: preview → replay(denied) on Northstar,
   replay(confirmed) on Halcyon, replay(unable-to-verify) on Bluepine.

2. **Frames.** Headless Chrome + CDP at true 1920×1080:
   `tools/capture-beat.ps1 -WsUrl <devtools ws> -OutFile <frame>.png
   -Navigate <url> [-PreJs <js>]`. Eleven captures in `01…11` order matching
   `build-video.sh`'s `ORDER` array. Title/close cards render
   `tools/title-card.html` / `tools/close-card.html` via `chrome --screenshot`.
   Frames are temporary — keep them outside the repo (default:
   `%TEMP%\changelock-video\frames`).

3. **Narration.** `narration.txt` holds the 11 segments (name|text).
   `tools/tts-segments.ps1` synthesizes each with Windows SAPI
   (Microsoft Zira Desktop, rate +1) to `%TEMP%\changelock-video\audio\`.

4. **Assemble.** `build-video.sh` (git-bash; needs ffmpeg/ffprobe — a local
   `D:\tools\ffmpeg` essentials build was used; no downloads required):
   - each still → `zoompan` clip (restrained ≤3% zoom; cards static)
   - `xfade` 0.6 s crossfades, offsets computed from measured WAV durations
   - narration `adelay`ed to each shot start, `amix` + `loudnorm` (I=-16,
     TP=-1.5), AAC 48 kHz
   - `subtitles` filter burns `changelock-demo-captions.srt` (Segoe UI,
     boxed, bottom-aligned)

   `FRAMES_DIR=… AUDIO_DIR=… bash build-video.sh` regenerates the MP4.

5. **Verify.** `ffprobe` for duration/codec/resolution/audio; sample frames
   for styling/captions; `npm run verify:no-secrets`; confirm no full phone
   numbers or keys in any artifact.

## Files

| File | Role |
|------|------|
| `changelock-demo-draft.mp4` | Final draft video (burned-in captions) |
| `changelock-demo-captions.srt` | Caption cues (also burned in; reusable as sidecar) |
| `changelock-demo-transcript.md` | Timestamped narration transcript |
| `narration.txt` | TTS source segments (name\|text) |
| `build-video.sh` | Deterministic assembly script |
| `tools/` | CDP capture helper, SAPI TTS helper, title/close card HTML |

## Truth claims in this video

- Replay scenarios are labeled deterministic replay in narration and on the
  title card. No live call is claimed.
- The live-test mention: one real authorized call was placed to a consented
  test contact in local live mode and reached no answer; the narration
  states no answer is not proof either way and the request stayed held.
- "Confirmed" is always paired with "evidence, not approval"; every outcome
  shows the payment change remaining held.
