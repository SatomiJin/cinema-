$ErrorActionPreference = "Stop"

$workspace = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$buildDirName = "android-build-" + (Get-Date -Format "yyyyMMddHHmmss")
$buildDir = Join-Path $workspace $buildDirName
$targetDir = Join-Path $workspace "android\app\src\main\assets\public"
$reactScripts = Join-Path $workspace "node_modules\.bin\react-scripts.cmd"

$env:BUILD_PATH = $buildDirName
& $reactScripts build

if ($LASTEXITCODE -ne 0) {
  throw "React Android build failed with exit code $LASTEXITCODE"
}

if (-not (Test-Path -LiteralPath $targetDir)) {
  New-Item -ItemType Directory -Path $targetDir | Out-Null
}

Copy-Item -Path (Join-Path $buildDir "*") -Destination $targetDir -Recurse -Force
