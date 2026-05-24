# -------------------------------------------------------------------------
# verify-production.ps1
# Script de verificacion de produccion para VisualSCH
# Levanta next start, prueba rutas criticas, y reporta resultados.
# -------------------------------------------------------------------------

$ErrorActionPreference = "Stop"
$PORT = 3000
$BASE = "http://localhost:$PORT"

Write-Host ""
Write-Host "=================================================="
Write-Host "  VERIFICACION DE PRODUCCION - VisualSCH"
Write-Host "=================================================="
Write-Host ""

# -- 1. Verificar que el build existe --
Write-Host "[1/5] Verificando build..."
if (-Not (Test-Path ".next/BUILD_ID")) {
    Write-Host "  [FAIL] No se encontro .next/BUILD_ID. Ejecuta 'npm run build' primero."
    exit 1
}
$buildId = (Get-Content ".next/BUILD_ID" -Raw).Trim()
Write-Host "  [OK] Build encontrado: $buildId"

# -- 2. Levantar next start en background --
Write-Host ""
Write-Host "[2/5] Levantando servidor de produccion en puerto $PORT..."
$serverProcess = Start-Process -FilePath "cmd" -ArgumentList "/c", "npx next start -p $PORT" -PassThru -WindowStyle Hidden

# Esperar a que el servidor este listo (max 20s)
$ready = $false
for ($i = 0; $i -lt 20; $i++) {
    Start-Sleep -Seconds 1
    try {
        $null = Invoke-WebRequest -Uri $BASE -UseBasicParsing -TimeoutSec 2 -ErrorAction SilentlyContinue
        $ready = $true
        break
    } catch {
        # aun no listo
    }
}

if (-Not $ready) {
    Write-Host "  [FAIL] El servidor no respondio en 20s."
    Stop-Process -Id $serverProcess.Id -Force -ErrorAction SilentlyContinue
    exit 1
}
Write-Host "  [OK] Servidor activo en $BASE (PID: $($serverProcess.Id))"

# -- 3. Probar rutas criticas --
Write-Host ""
Write-Host "[3/5] Probando rutas criticas..."

$routes = @(
    @{ Path = "/"; Name = "Inicio" },
    @{ Path = "/reportes/suspendidos"; Name = "Suspendidos (SSG 598B)" },
    @{ Path = "/ventas"; Name = "Ventas (dynamic import)" },
    @{ Path = "/reportes"; Name = "Reportes (client)" },
    @{ Path = "/alumnos"; Name = "Alumnos" }
)

$allPassed = $true
foreach ($route in $routes) {
    try {
        $response = Invoke-WebRequest -Uri "$BASE$($route.Path)" -UseBasicParsing -TimeoutSec 5
        $status = $response.StatusCode
        $sizeKB = [math]::Round($response.Content.Length / 1024, 1)
        if ($status -eq 200) {
            Write-Host "  [OK] $($route.Name) - HTTP $status ($sizeKB KB)"
        } else {
            Write-Host "  [WARN] $($route.Name) - HTTP $status ($sizeKB KB)"
            $allPassed = $false
        }
    } catch {
        Write-Host "  [FAIL] $($route.Name) - ERROR: $($_.Exception.Message)"
        $allPassed = $false
    }
}

# -- 4. Verificar lazy-loading del TicketImprimible --
Write-Host ""
Write-Host "[4/5] Verificando lazy-loading del TicketImprimible..."
try {
    $ventasHtml = (Invoke-WebRequest -Uri "$BASE/ventas" -UseBasicParsing -TimeoutSec 5).Content
    if ($ventasHtml -match "SPORTING CLUB HUARAZ" -and $ventasHtml -match "COMPROBANTE DE PAGO") {
        Write-Host "  [WARN] El contenido del ticket se encontro en el HTML inicial."
    } else {
        Write-Host "  [OK] El ticket NO aparece en la carga inicial (lazy-load confirmado)."
    }
} catch {
    Write-Host "  [FAIL] No se pudo verificar: $($_.Exception.Message)"
}

# -- 5. Verificar contenido de /reportes/suspendidos --
Write-Host ""
Write-Host "[5/5] Verificando contenido del reporte de suspendidos..."
try {
    $susHtml = (Invoke-WebRequest -Uri "$BASE/reportes/suspendidos" -UseBasicParsing -TimeoutSec 5).Content

    $checks = @(
        @{ Pattern = "Reporte de Alumnos Suspendidos"; Label = "Titulo del reporte" },
        @{ Pattern = "Sporting Club Huaraz"; Label = "Nombre del club" },
        @{ Pattern = "Deuda total acumulada"; Label = "Totalizador de deuda" },
        @{ Pattern = "btn-imprimir"; Label = "Boton de impresion" }
    )

    foreach ($check in $checks) {
        if ($susHtml -match [regex]::Escape($check.Pattern)) {
            Write-Host "  [OK] $($check.Label)"
        } else {
            Write-Host "  [FAIL] $($check.Label) - no encontrado en el HTML"
            $allPassed = $false
        }
    }
} catch {
    Write-Host "  [FAIL] No se pudo verificar: $($_.Exception.Message)"
    $allPassed = $false
}

# -- Cleanup --
Write-Host ""
Write-Host "Deteniendo servidor de produccion (PID: $($serverProcess.Id))..."
Stop-Process -Id $serverProcess.Id -Force -ErrorAction SilentlyContinue

# -- Resultado final --
Write-Host ""
if ($allPassed) {
    Write-Host "=================================================="
    Write-Host "  [PASS] TODAS LAS VERIFICACIONES PASARON"
    Write-Host "=================================================="
} else {
    Write-Host "=================================================="
    Write-Host "  [WARN] ALGUNAS VERIFICACIONES TIENEN OBSERVACIONES"
    Write-Host "=================================================="
}
Write-Host ""
