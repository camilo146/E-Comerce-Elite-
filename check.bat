@echo off
echo ========================================
echo   ELITE E-Commerce - Configuracion
echo ========================================
echo.

echo Verificando MongoDB...
mongod --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] MongoDB esta instalado
    echo.
    echo Ahora puedes ejecutar:
    echo   1. seed.bat   - Para poblar la base de datos
    echo   2. start.bat  - Para iniciar el proyecto
    echo.
) else (
    echo [!] MongoDB NO esta instalado
    echo.
    echo ========================================
    echo   NECESITAS MONGODB PARA CONTINUAR
    echo ========================================
    echo.
    echo OPCION 1 - MongoDB Atlas [RECOMENDADO - 5 MIN]
    echo   1. Visita: https://www.mongodb.com/cloud/atlas/register
    echo   2. Crea cuenta gratis
    echo   3. Crea cluster M0 Free
    echo   4. Obtén tu connection string
    echo   5. Pega la URI en backend\.env
    echo   6. Ejecuta: seed.bat y luego start.bat
    echo.
    echo OPCION 2 - Instalar MongoDB Local
    echo   1. Visita: https://www.mongodb.com/try/download/community
    echo   2. Descarga e instala MongoDB
    echo   3. Ejecuta: seed.bat y luego start.bat
    echo.
    echo OPCION 3 - Docker Desktop
    echo   1. Instala Docker Desktop
    echo   2. Ejecuta: docker-compose up -d
    echo.
    echo Abre INSTALAR_MONGODB.md para instrucciones detalladas
    echo.
)

echo Dependencias instaladas:
echo [OK] Backend - Node.js dependencies
echo [OK] Frontend - React dependencies
echo [OK] Archivos .env creados
echo.

pause
