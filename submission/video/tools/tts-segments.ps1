param(
  [string]$NarrationFile,
  [string]$OutDir,
  [string]$Voice = "Microsoft Zira Desktop",
  [int]$Rate = 0
)
Add-Type -AssemblyName System.Speech
$synth = [System.Speech.Synthesis.SpeechSynthesizer]::new()
$synth.SelectVoice($Voice)
$synth.Rate = $Rate
$synth.Volume = 100

Get-Content $NarrationFile | ForEach-Object {
  $parts = $_ -split '\|', 2
  $name = $parts[0]
  $text = $parts[1]
  $out = Join-Path $OutDir ($name + ".wav")
  $synth.SetOutputToWaveFile($out)
  $synth.Speak($text)
  Write-Output ("wrote " + $out)
}
$synth.SetOutputToNull()
$synth.Dispose()
