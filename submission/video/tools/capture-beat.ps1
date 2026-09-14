param(
  [string]$WsUrl,
  [string]$OutFile,
  [string]$Navigate = "",
  [string]$PreJs = "",
  [int]$Width = 1920,
  [int]$Height = 1080
)
$ws = [System.Net.WebSockets.ClientWebSocket]::new()
$ct = [System.Threading.CancellationToken]::None
$ws.ConnectAsync([uri]$WsUrl, $ct).Wait()
$buf = New-Object byte[] 16777216

function Send-Cdp([int]$id, [string]$msg) {
  $bytes = [Text.Encoding]::UTF8.GetBytes($msg)
  $ws.SendAsync([ArraySegment[byte]]$bytes, [System.Net.WebSockets.WebSocketMessageType]::Text, $true, $ct).Wait()
  $deadline = (Get-Date).AddSeconds(20)
  do {
    $out = [Text.StringBuilder]::new()
    do {
      $seg = [ArraySegment[byte]]$buf
      $res = $ws.ReceiveAsync($seg, $ct).Result
      [void]$out.Append([Text.Encoding]::UTF8.GetString($buf, 0, $res.Count))
    } while (-not $res.EndOfMessage)
    $text = $out.ToString()
    if ($text -match ('"id":' + $id + '\b')) { return $text }
  } while ((Get-Date) -lt $deadline)
  return ""
}

Send-Cdp 1 ('{"id":1,"method":"Emulation.setDeviceMetricsOverride","params":{"width":' + $Width + ',"height":' + $Height + ',"deviceScaleFactor":1,"mobile":false}}') | Out-Null
Send-Cdp 2 '{"id":2,"method":"Page.enable"}' | Out-Null

if ($Navigate -ne "") {
  $navJson = $Navigate | ConvertTo-Json -Compress
  Send-Cdp 3 ('{"id":3,"method":"Page.navigate","params":{"url":' + $navJson + '}}') | Out-Null
  Start-Sleep -Milliseconds 2500
}
if ($PreJs -ne "") {
  $jsJson = $PreJs | ConvertTo-Json -Compress
  Send-Cdp 4 ('{"id":4,"method":"Runtime.evaluate","params":{"expression":' + $jsJson + ',"awaitPromise":true}}') | Out-Null
  Start-Sleep -Milliseconds 900
}
$shot = Send-Cdp 5 '{"id":5,"method":"Page.captureScreenshot","params":{"format":"png"}}'
$m = [regex]::Match($shot, '"data":"([^"]+)"')
if ($m.Success) {
  [IO.File]::WriteAllBytes($OutFile, [Convert]::FromBase64String($m.Groups[1].Value))
  Write-Output "saved $OutFile"
} else {
  Write-Output "FAILED $OutFile"
}
try { $ws.CloseAsync([System.Net.WebSockets.WebSocketCloseStatus]::NormalClosure, "done", $ct).Wait() } catch {}
