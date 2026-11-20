# PowerShell 경량 로컬 웹 서버 (무설치, 제로 종속성)
$port = 8080
$prefix = "http://localhost:$port/"
$folder = $PSScriptRoot

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)

try {
    $listener.Start()
    Write-Host "=========================================================="
    Write-Host "🍎 영양쏙쏙 웹앱 로컬 서버가 시작되었습니다!" -ForegroundColor Green
    Write-Host "👉 브라우저 주소: http://localhost:$port" -ForegroundColor Cyan
    Write-Host "=========================================================="
    
    # 기본 브라우저 자동 실행
    Start-Process "http://localhost:$port"
} catch {
    Write-Host "포트 $port 바인딩 실패, 8081 시도..." -ForegroundColor Yellow
    $port = 8081
    $prefix = "http://localhost:$port/"
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add($prefix)
    $listener.Start()
    Write-Host "👉 브라우저 주소: http://localhost:$port" -ForegroundColor Cyan
    Start-Process "http://localhost:$port"
}

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
}

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $localPath = $request.Url.LocalPath
        if ($localPath -eq "/" -or $localPath -eq "") {
            $localPath = "/index.html"
        }

        # URL 디코딩 및 경로 결합
        $safePath = [System.Uri]::UnescapeDataString($localPath).TrimStart('/')
        $filePath = Join-Path $folder $safePath

        if (Test-Path $filePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $mime = $mimeTypes[$ext]
            if (-not $mime) { $mime = "application/octet-stream" }

            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentType = $mime
            $response.ContentLength64 = $bytes.Length
            $response.AddHeader("Cache-Control", "no-cache")
            $response.AddHeader("Access-Control-Allow-Origin", "*")
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $errBytes = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
            $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
        }
        $response.Close()
    } catch {
        # 예외 무시 및 지속 청취
    }
}
