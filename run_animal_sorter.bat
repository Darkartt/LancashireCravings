@echo off
echo ================================================
echo Animal Photo Sorter - Easy Launch Script
echo ================================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.7+ from https://python.org
    pause
    exit /b 1
)

echo Python found! Checking dependencies...
echo.

REM Test dependencies
python animal_photo_sorter.py test
if errorlevel 1 (
    echo.
    echo Installing required dependencies...
    pip install -r requirements.txt
    if errorlevel 1 (
        echo ERROR: Failed to install dependencies
        echo Please run: pip install torch torchvision transformers pillow numpy
        pause
        exit /b 1
    )
)

echo.
echo Starting Animal Photo Sorter...
echo.

REM Run the main script
python animal_photo_sorter.py

echo.
echo Script completed! Check the sorted_animals folder for results.
echo.
pause
