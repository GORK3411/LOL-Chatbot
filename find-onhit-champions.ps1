$jsonDir = Join-Path $PSScriptRoot "LOLChatbot.Agent\json\champions"

$alwaysNull = $null

Get-ChildItem -Path $jsonDir -Filter "*.json" | ForEach-Object {
    $champ = Get-Content $_.FullName -Raw | ConvertFrom-Json

    $champ.abilities.PSObject.Properties.Value | ForEach-Object { $_ } | ForEach-Object {
        $ability = $_
        $nullFields = $ability.PSObject.Properties |
            Where-Object { $_.Value -eq $null } |
            ForEach-Object { $_.Name }

        if ($null -eq $alwaysNull) {
            $script:alwaysNull = [System.Collections.Generic.HashSet[string]]($nullFields)
        } else {
            $script:alwaysNull.IntersectWith([System.Collections.Generic.HashSet[string]]$nullFields)
        }
    }
}

$alwaysNull | Sort-Object
