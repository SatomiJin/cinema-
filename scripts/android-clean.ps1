$ErrorActionPreference = "Stop"

$workspace = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$targets = @(
  "android\app\src\main\assets\public",
  "android\app\src\main\res\xml\config.xml"
)

foreach ($relative in $targets) {
  $path = Join-Path $workspace $relative

  if (Test-Path -LiteralPath $path) {
    $resolved = (Resolve-Path -LiteralPath $path).Path

    if (-not $resolved.StartsWith($workspace)) {
      throw "Refusing to remove path outside workspace: $resolved"
    }

    if ((Get-Item -LiteralPath $resolved).PSIsContainer) {
      compact /U /S:$resolved | Out-Null
    } else {
      compact /U $resolved | Out-Null
    }
    Get-ChildItem -LiteralPath $resolved -Recurse -Force | ForEach-Object {
      if ($_ -is [System.IO.FileInfo]) {
        $_.IsReadOnly = $false
      }
    }

    Remove-Item -LiteralPath $resolved -Recurse -Force
  }
}
