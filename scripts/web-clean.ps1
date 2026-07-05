param(
  [string]$BuildDir = "build"
)

$ErrorActionPreference = "Stop"

$workspace = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$path = Join-Path $workspace $BuildDir

if (Test-Path -LiteralPath $path) {
  $resolved = (Resolve-Path -LiteralPath $path).Path

  if (-not $resolved.StartsWith($workspace)) {
    throw "Refusing to remove path outside workspace: $resolved"
  }

  compact /U /S:$resolved | Out-Null
  Get-ChildItem -LiteralPath $resolved -Recurse -Force | ForEach-Object {
    if ($_ -is [System.IO.FileInfo]) {
      $_.IsReadOnly = $false
    }
  }

  Remove-Item -LiteralPath $resolved -Recurse -Force
}
