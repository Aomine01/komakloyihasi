
<#
.SYNOPSIS
    Syncs komakchilar/ source images → public/assets/komakchilar/ and regenerates komakchilar-data.json
.DESCRIPTION
    - Scans all people folders under komakchilar/Ozbekiston/<Viloyat>/<Person> and komakchilar/Qoraqalpogiston/<Person>
    - For each person: puts files named "personal*" first, then the rest (sorted)
    - Copies and renames images to 1.jpg, 2.jpg, etc. in public/assets/komakchilar/<slug>/<person-slug>/
    - Reads existing JSON to preserve description, featured, pdfUrl fields
    - Writes updated komakchilar-data.json
#>

$ErrorActionPreference = "Stop"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$ProjectRoot  = "c:\Users\SHAROFIDDIN\Desktop\komakWebSite"
$SourceRoot   = Join-Path $ProjectRoot "komakchilar"
$PublicRoot   = Join-Path $ProjectRoot "public\assets\komakchilar"
$DataFile     = Join-Path $ProjectRoot "komakchilar-data.json"

# --- helpers ---
function To-Slug($name) {
    $s = $name.ToLower()
    # Replace Uzbek letters
    $s = $s -replace "o'", "o" -replace "g'", "g" -replace "'", "" -replace "ʻ", ""
    # Normalize unicode (NFD → ASCII-friendly)
    $s = [System.Text.RegularExpressions.Regex]::Replace($s, '[^a-z0-9\s\-]', '')
    $s = $s.Trim() -replace '\s+', '-' -replace '-+', '-'
    return $s
}

function Get-ImageExt($file) {
    $ext = [System.IO.Path]::GetExtension($file.Name).ToLower()
    # Normalize HEIC, JPEG etc.
    if ($ext -in @('.heic', '.heif')) { return '.jpg' }
    if ($ext -eq '.jpeg') { return '.jpg' }
    return $ext
}

function Is-PersonalImage($file) {
    $n = $file.Name.ToLower()
    return $n -like "personal*" -or $n -like "*personal img*" -or $n -like "*personalimg*"
}

function Is-ImageFile($file) {
    $ext = [System.IO.Path]::GetExtension($file.Name).ToLower()
    return $ext -in @('.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif')
}

# Load existing JSON to preserve descriptions etc.
$existingJson = Get-Content $DataFile -Raw -Encoding UTF8 | ConvertFrom-Json
$existingPeopleMap = @{}
foreach ($v in $existingJson.viloyatlar) {
    foreach ($p in $v.people) {
        $existingPeopleMap[$p.slug] = $p
    }
}

# --- Viloyat definitions ---
# Each entry: @{ Name=...; Slug=...; SourcePath=...; Nested=$false/$true }
$viloyatDefs = @(
    @{ Name="Andijon viloyati";      Slug="andijon";       SourcePath=(Join-Path $SourceRoot "Ozbekiston\Andijon viloyati") }
    @{ Name="Buxoro viloyati";       Slug="buxoro";        SourcePath=(Join-Path $SourceRoot "Ozbekiston\Buxoro viloyati") }
    @{ Name="Farg'ona viloyati";     Slug="fargona";       SourcePath=(Join-Path $SourceRoot "Ozbekiston\Farg'ona viloyati") }
    @{ Name="Jizzax viloyati";       Slug="jizzax";        SourcePath=(Join-Path $SourceRoot "Ozbekiston\Jizzax viloyati") }
    @{ Name="Namangan viloyati";     Slug="namangan";      SourcePath=(Join-Path $SourceRoot "Ozbekiston\Namangan viloyati") }
    @{ Name="Navoiy viloyati";       Slug="navoiy";        SourcePath=(Join-Path $SourceRoot "Ozbekiston\Navoiy viloyati") }
    @{ Name="Qashqadaryo viloyati";  Slug="qashqadaryo";   SourcePath=(Join-Path $SourceRoot "Ozbekiston\Qashqadaryo viloyati") }
    @{ Name="Qoraqalpog'iston";      Slug="qoraqalpogiston"; SourcePath=(Join-Path $SourceRoot "Ozbekiston\Qoraqalpog'iston") }
    @{ Name="Samarqand viloyati";    Slug="samarqand";     SourcePath=(Join-Path $SourceRoot "Ozbekiston\Samarqand viloyati") }
    @{ Name="Sirdaryo viloyati";     Slug="sirdaryo";      SourcePath=(Join-Path $SourceRoot "Ozbekiston\Sirdaryo viloyati") }
    @{ Name="Surxondaryo viloyati";  Slug="surxondaryo";   SourcePath=(Join-Path $SourceRoot "Ozbekiston\Surxondaryo viloyati") }
    @{ Name="Toshkent viloyati";     Slug="toshkent";      SourcePath=(Join-Path $SourceRoot "Ozbekiston\Toshkent viloyati") }
    @{ Name="Xorazm viloyati";       Slug="xorazm";        SourcePath=(Join-Path $SourceRoot "Ozbekiston\Xorazm viloyati") }
    @{ Name="Qoraqalpog'iston";      Slug="qoraqalpogiston-res"; ExtraSlug=$true; SourcePath=(Join-Path $SourceRoot "Qoraqalpogiston") }
)

# Merge Qoraqalpog'iston into one viloyat — both source folders go to same slug
$mergedViloyatlar = @()

# Build a map: viloyatSlug -> list of person directories
$viloyatPeopleMap = @{}

foreach ($vdef in $viloyatDefs) {
    if (-not (Test-Path $vdef.SourcePath)) { continue }
    
    $slug = $vdef.Slug
    if (-not $viloyatPeopleMap.ContainsKey($slug)) {
        $viloyatPeopleMap[$slug] = @{ Name=$vdef.Name; Slug=$slug; Dirs=@() }
    }
    
    $personDirs = Get-ChildItem $vdef.SourcePath -Directory
    $viloyatPeopleMap[$slug].Dirs += $personDirs
}

# Merge the two Qoraqalpogiston entries
if ($viloyatPeopleMap.ContainsKey("qoraqalpogiston") -and $viloyatPeopleMap.ContainsKey("qoraqalpogiston-res")) {
    $viloyatPeopleMap["qoraqalpogiston"].Dirs += $viloyatPeopleMap["qoraqalpogiston-res"].Dirs
    $viloyatPeopleMap.Remove("qoraqalpogiston-res")
}

$outputViloyatlar = @()

foreach ($vslug in @("andijon","buxoro","fargona","jizzax","namangan","navoiy","qashqadaryo","qoraqalpogiston","samarqand","sirdaryo","surxondaryo","toshkent","xorazm")) {
    if (-not $viloyatPeopleMap.ContainsKey($vslug)) { continue }
    
    $vdata = $viloyatPeopleMap[$vslug]
    $viloyatName = $vdata.Name
    $people = @()
    
    foreach ($personDir in $vdata.Dirs) {
        $personName = $personDir.Name
        
        # Clean up name - remove trailing viloyat info from folder name
        $cleanName = $personName -replace ",\s*Toshkent viloyati$", "" -replace ",\s*Surxondaryo viloyati$", ""
        $cleanName = $cleanName.Trim()
        
        # Generate slug
        $personSlug = To-Slug $cleanName
        
        # Get all image files
        $allImgFiles = Get-ChildItem $personDir.FullName -File | Where-Object { Is-ImageFile $_ }
        
        if ($allImgFiles.Count -eq 0) {
            Write-Host "SKIP (no images): $personName" -ForegroundColor Yellow
            continue
        }
        
        # Sort: personal images first, then rest sorted by name
        $personalImgs = $allImgFiles | Where-Object { Is-PersonalImage $_ } | Sort-Object Name
        $otherImgs = $allImgFiles | Where-Object { -not (Is-PersonalImage $_) } | Sort-Object Name
        $orderedImgs = @($personalImgs) + @($otherImgs)
        
        # Setup destination directory
        $destDir = Join-Path $PublicRoot "$vslug\$personSlug"
        if (-not (Test-Path $destDir)) {
            New-Item -ItemType Directory -Path $destDir -Force | Out-Null
        }
        
        # Copy and rename images
        $imageNames = @()
        $originalNames = @()
        $counter = 1
        
        foreach ($img in $orderedImgs) {
            $ext = Get-ImageExt $img
            $newName = "$counter$ext"
            $destPath = Join-Path $destDir $newName
            
            Copy-Item $img.FullName $destPath -Force
            $imageNames += $newName
            $originalNames += $img.Name
            $counter++
        }
        
        # Look up existing data
        $existing = $existingPeopleMap[$personSlug]
        $featured = if ($existing) { $existing.featured } else { $false }
        $description = if ($existing) { $existing.description } else { $null }
        $pdfUrl = if ($existing) { $existing.pdfUrl } else { $null }
        
        # Read info.txt if available and description is null
        $infoPath = Join-Path $personDir.FullName "info.txt"
        if ($null -eq $description -and (Test-Path $infoPath)) {
            try {
                $infoContent = [System.IO.File]::ReadAllText($infoPath, [System.Text.Encoding]::UTF8)
                if ($infoContent -match '[a-zA-Z\u0400-\u04FF]') {
                    $description = $infoContent.Trim()
                }
            } catch {}
        }
        
        $personObj = [ordered]@{
            name = $cleanName
            slug = $personSlug
            featured = $featured
            description = $description
            images = $imageNames
            originalImages = $originalNames
            imagePath = "/assets/komakchilar/$vslug/$personSlug/"
            pdfUrl = $pdfUrl
        }
        
        $people += $personObj
        Write-Host "OK: $personName → $personSlug ($($imageNames.Count) images)" -ForegroundColor Green
    }
    
    $outputViloyatlar += [ordered]@{
        name = $viloyatName
        slug = $vslug
        people = $people
    }
}

# Write JSON
$output = [ordered]@{ viloyatlar = $outputViloyatlar }
$json = $output | ConvertTo-Json -Depth 10
[System.IO.File]::WriteAllText($DataFile, $json, [System.Text.Encoding]::UTF8)

Write-Host "`n✅ Done! Written to komakchilar-data.json" -ForegroundColor Cyan
$total = ($outputViloyatlar | ForEach-Object { $_.people.Count } | Measure-Object -Sum).Sum
Write-Host "Total people: $total" -ForegroundColor Cyan
