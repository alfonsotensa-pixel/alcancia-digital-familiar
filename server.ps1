# SmartPiggy Cloud - Servidor Nativo Windows PowerShell (.NET HttpListener)
# Sirve la aplicación web en http://localhost:8090 y el endpoint REST /api/cloud/<familyCode>
# para sincronización en la nube y multi-dispositivo en tiempo real sin requerir Node ni Python.

param(
  [int]$Port = 8090
)

$BaseDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$DbFile = Join-Path $BaseDir "cloud_db.json"

if (-not (Test-Path $DbFile)) {
  "{}" | Set-Content -Path $DbFile -Encoding UTF8
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()

Write-Output "SmartPiggy Cloud Server activo en http://localhost:$Port"

$mimeTypes = @{
  ".html" = "text/html; charset=utf-8"
  ".css"  = "text/css; charset=utf-8"
  ".js"   = "application/javascript; charset=utf-8"
  ".json" = "application/json; charset=utf-8"
  ".svg"  = "image/svg+xml"
  ".png"  = "image/png"
  ".ico"  = "image/x-icon"
}

while ($listener.IsListening) {
  try {
    $context = $listener.GetContext()
    $req = $context.Request
    $res = $context.Response

    $res.Headers.Add("Access-Control-Allow-Origin", "*")
    $res.Headers.Add("Access-Control-Allow-Methods", "GET, POST, PUT, OPTIONS")
    $res.Headers.Add("Access-Control-Allow-Headers", "Content-Type, Authorization")

    if ($req.HttpMethod -eq "OPTIONS") {
      $res.StatusCode = 204
      $res.Close()
      continue
    }

    $path = $req.Url.LocalPath

    if ($path.StartsWith("/api/cloud/")) {
      $familyCode = [System.Uri]::UnescapeDataString($path.Substring(11)).Trim().ToUpper()
      $dbRaw = Get-Content -Path $DbFile -Raw -Encoding UTF8
      if ([string]::IsNullOrWhiteSpace($dbRaw)) { $dbRaw = "{}" }
      $dbObj = ConvertFrom-Json $dbRaw

      if ($req.HttpMethod -eq "GET") {
        $famData = $dbObj.$familyCode
        $jsonOut = if ($null -ne $famData) { ConvertTo-Json $famData -Depth 20 } else { "{}" }
        $buffer = [System.Text.Encoding]::UTF8.GetBytes($jsonOut)
        $res.StatusCode = 200
        $res.ContentType = "application/json; charset=utf-8"
        $res.ContentLength64 = $buffer.Length
        $res.OutputStream.Write($buffer, 0, $buffer.Length)
        $res.Close()
        continue
      }

      if ($req.HttpMethod -eq "POST" -or $req.HttpMethod -eq "PUT") {
        $reader = New-Object System.IO.StreamReader($req.InputStream, [System.Text.Encoding]::UTF8)
        $bodyText = $reader.ReadToEnd()
        $reader.Close()

        $incomingObj = ConvertFrom-Json $bodyText
        $dbObj | Add-Member -MemberType NoteProperty -Name $familyCode -Value $incomingObj -Force
        $savedJson = ConvertTo-Json $dbObj -Depth 20
        Set-Content -Path $DbFile -Value $savedJson -Encoding UTF8

        $outBytes = [System.Text.Encoding]::UTF8.GetBytes($bodyText)
        $res.StatusCode = 200
        $res.ContentType = "application/json; charset=utf-8"
        $res.ContentLength64 = $outBytes.Length
        $res.OutputStream.Write($outBytes, 0, $outBytes.Length)
        $res.Close()
        continue
      }
    }

    if ($path -eq "/" -or [string]::IsNullOrEmpty($path)) {
      $path = "/index.html"
    }

    $relativePath = $path.TrimStart("/").Replace("/", "\")
    $filePath = Join-Path $BaseDir $relativePath

    if (Test-Path $filePath -PathType Leaf) {
      $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
      $res.ContentType = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }
      $fileBytes = [System.IO.File]::ReadAllBytes($filePath)
      $res.StatusCode = 200
      $res.ContentLength64 = $fileBytes.Length
      $res.OutputStream.Write($fileBytes, 0, $fileBytes.Length)
    } else {
      $res.StatusCode = 404
    }
    $res.Close()
  } catch {
    # continue listening
  }
}
