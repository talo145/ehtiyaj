# إعداد قاعدة بيانات التطوير لمنصة احتياج.
#
# يُشغَّل مرة واحدة. ينشئ دور التطبيق وقاعدة البيانات، ثم يكتب DATABASE_URL
# في .env.local (مستثنى من git).
#
# كلمة مرور مستخدم postgres تُكتب في موجّه psql نفسه ولا تمرّ عبر هذا السكربت،
# وكلمة مرور دور التطبيق تُولَّد عشوائيًا هنا ولا يكتبها أحد.
#
#   powershell -ExecutionPolicy Bypass -File scripts\db-setup.ps1

$ErrorActionPreference = "Stop"

$Role     = "ehtiyaj"
$Database = "ehtiyaj_dev"
$PgHost   = "localhost"
$PgPort   = 5432
$Super    = "postgres"

$root = Split-Path -Parent $PSScriptRoot
$envFile = Join-Path $root ".env.local"

$psql = "C:\Program Files\PostgreSQL\17\bin\psql.exe"
if (-not (Test-Path $psql)) {
  $found = Get-Command psql -ErrorAction SilentlyContinue
  if (-not $found) { throw "لم أجد psql. ثبّت PostgreSQL أو أضف مجلد bin إلى PATH." }
  $psql = $found.Source
}

if (Test-Path $envFile) {
  $existing = Get-Content $envFile -Raw
  if ($existing -match "DATABASE_URL") {
    Write-Host "‎.env.local يحتوي DATABASE_URL بالفعل." -ForegroundColor Yellow
    $answer = Read-Host "هل أعيد إنشاء الدور وقاعدة البيانات وأستبدل الملف؟ (y/N)"
    if ($answer -ne "y") { Write-Host "أُلغي الإعداد."; exit 0 }
  }
}

# كلمة مرور دور التطبيق: 32 بايت عشوائية بترميز آمن للروابط
$bytes = New-Object byte[] 24
[System.Security.Cryptography.RandomNumberGenerator]::Fill($bytes)
$AppPassword = [Convert]::ToBase64String($bytes).Replace("+", "-").Replace("/", "_").Replace("=", "")

# سر توقيع الجلسات
$sbytes = New-Object byte[] 32
[System.Security.Cryptography.RandomNumberGenerator]::Fill($sbytes)
$SessionSecret = [Convert]::ToBase64String($sbytes).Replace("+", "-").Replace("/", "_").Replace("=", "")

$escaped = $AppPassword.Replace("'", "''")

$sql = @"
DO `$`$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = '$Role') THEN
    ALTER ROLE $Role WITH LOGIN PASSWORD '$escaped';
  ELSE
    CREATE ROLE $Role WITH LOGIN PASSWORD '$escaped';
  END IF;
END
`$`$;

SELECT 'CREATE DATABASE $Database OWNER $Role ENCODING ''UTF8'''
WHERE NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = '$Database')\gexec

GRANT ALL PRIVILEGES ON DATABASE $Database TO $Role;
"@

Write-Host ""
Write-Host "سيطلب psql الآن كلمة مرور المستخدم $Super — اكتبها في الموجّه." -ForegroundColor Cyan
Write-Host ""

$sql | & $psql -U $Super -h $PgHost -p $PgPort -d postgres -v ON_ERROR_STOP=1 -f -
if ($LASTEXITCODE -ne 0) { throw "فشل إنشاء الدور أو قاعدة البيانات." }

# الامتدادات ومنح الصلاحيات داخل قاعدة البيانات نفسها
$inner = @"
CREATE EXTENSION IF NOT EXISTS citext;
CREATE EXTENSION IF NOT EXISTS pgcrypto;
GRANT ALL ON SCHEMA public TO $Role;
ALTER SCHEMA public OWNER TO $Role;
"@

$inner | & $psql -U $Super -h $PgHost -p $PgPort -d $Database -v ON_ERROR_STOP=1 -f -
if ($LASTEXITCODE -ne 0) { throw "فشل تجهيز الامتدادات." }

$url = "postgresql://${Role}:${AppPassword}@${PgHost}:${PgPort}/${Database}"

$content = @"
# مولّد بـ scripts/db-setup.ps1 — لا يُرفع إلى git.
DATABASE_URL="$url"
SESSION_SECRET="$SessionSecret"
"@

Set-Content -Path $envFile -Value $content -Encoding utf8 -NoNewline

Write-Host ""
Write-Host "تم. قاعدة البيانات: $Database — الدور: $Role" -ForegroundColor Green
Write-Host "كُتب DATABASE_URL و SESSION_SECRET في .env.local"
Write-Host ""
Write-Host "الخطوة التالية:  npm run db:push  ثم  npm run db:seed"
