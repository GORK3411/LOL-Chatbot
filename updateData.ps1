Invoke-WebRequest https://ddragon.leagueoflegends.com/cdn/16.12.1/data/en_US/champion.json -OutFile champion.json
$names = (Get-Content champion.json | ConvertFrom-Json).data.PSObject.Properties.Name
$folder = "champions"
New-Item -ItemType Directory -Force -Path $folder | Out-Null

foreach ($name in $names) {
    $url = "https://ddragon.leagueoflegends.com/cdn/16.12.1/data/en_US/champion/$name.json"
    $out = Join-Path $folder "$name.json"
    Invoke-WebRequest $url -OutFile $out
    Write-Host "Downloaded $name"
}