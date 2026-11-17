# Builds a static copy of the ASP.NET map page for GitHub Pages (no backend needed).
# Usage: pwsh scripts/build-static.ps1   (output goes to ./_site)
$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$app  = Join-Path $root 'HighwayProject\HighwayProject'
$wwwroot = Join-Path $app 'wwwroot'
$out  = Join-Path $root '_site'

if (Test-Path $out) { Remove-Item $out -Recurse -Force }
New-Item -ItemType Directory -Path $out | Out-Null

# 1. Copy static assets (css, js, img, data). Skip QGIS .qmd metadata.
foreach ($dir in 'css', 'js', 'img', 'data') {
    Copy-Item (Join-Path $wwwroot $dir) (Join-Path $out $dir) -Recurse
}
Get-ChildItem (Join-Path $out 'data') -Filter *.qmd | Remove-Item -Force

# GitHub Pages is case-sensitive; resolve real file names from disk.
function Get-DataFile([string]$name) {
    $f = Get-ChildItem (Join-Path $out 'data') -File | Where-Object { $_.Name -ieq $name } | Select-Object -First 1
    if (-not $f) { throw "Missing data file: $name" }
    return $f.Name
}

# 2. Chatbot needs the .NET backend + secret API key -> drop it from the static site.
Remove-Item (Join-Path $out 'js\ai-chat.js'), (Join-Path $out 'css\ai-chat.css') -Force

# 3. Rewrite JS: /Map/GetXxx endpoints -> static geojson files, /img -> relative.
$endpoints = @{
    GetDistrictGeoJson        = 'district.geojson'
    GetDHGeoJson              = 'DH_phone.geojson'
    GetSHGeoJson              = 'SH_phone.geojson'
    GetCHCGeoJson             = '89_CHC_Phone.geojson'
    GetTraumaGeoJson          = 'Trauma_center.geojson'
    GetTraumaGeoJson29        = 'Trauma_29.geojson'
    GetPrivateHospitalGeoJson = 'PrivateHospital.geojson'
    GetPmRahatGeoJson         = 'PMRahat204.geojson'
    GetNationalHighwayGeoJson = 'NH.geojson'
    GetExpresswayGeoJson      = 'PurvanchalExpressway.geojson'
    GetTollPlazaGeoJson       = 'PurvanchalTollPlaza.geojson'
    GetBloodBankGeoJson       = 'BloodBank.geojson'
}

Get-ChildItem (Join-Path $out 'js') -Filter *.js | ForEach-Object {
    $text = [IO.File]::ReadAllText($_.FullName)
    foreach ($key in $endpoints.Keys) {
        $real = Get-DataFile $endpoints[$key]
        $text = $text.Replace("'/Map/$key'", "'data/$real'")
    }
    $text = $text.Replace("'/Map/GetChcExpresswayGeoJson?km=' + km", "'data/CHC_' + km + 'km.geojson'")
    $text = $text.Replace("'/img/", "'img/")
    [IO.File]::WriteAllText($_.FullName, $text, (New-Object Text.UTF8Encoding($false)))
}

# 4. Turn the Razor view into plain HTML.
$html = [IO.File]::ReadAllText((Join-Path $app 'Views\Map\Index.cshtml'))
$html = $html.Replace('~/', '')
$html = [regex]::Replace($html, '(?s)\s*<!-- AI Chatbot CSS -->\s*<link[^>]*ai-chat\.css[^>]*>', '')
$html = [regex]::Replace($html, '(?s)\s*<!-- =+\s*AI CHATBOT\s*=+\s*-->.*?(?=\s*<!-- =+\s*JAVASCRIPT)', '')
$html = [regex]::Replace($html, '(?s)\s*<!-- 5\. AI CHATBOT.*?-->\s*<script[^>]*ai-chat\.js[^>]*></script>', '')
[IO.File]::WriteAllText((Join-Path $out 'index.html'), $html, (New-Object Text.UTF8Encoding($false)))

# 5. Pages niceties.
New-Item (Join-Path $out '.nojekyll') -ItemType File | Out-Null

# 6. Sanity checks: nothing should still point at the backend.
$bad = Select-String -Path (Join-Path $out 'index.html'), (Join-Path $out 'js\*.js') -Pattern "/Map/Get|/api/chat|ai-chat|id=""chatBtn""|href=""/|src=""/" -ErrorAction SilentlyContinue
if ($bad) {
    $bad | ForEach-Object { Write-Warning "$($_.Filename):$($_.LineNumber): $($_.Line.Trim())" }
    throw 'Static build still references backend endpoints.'
}
Write-Host "Static site built at $out"
