#!/usr/bin/env python3
"""
Setup Utility for Animal Photo Sorter
=====================================

This script helps set up the Animal Photo Sorter with all necessary
dependencies and folder structure.
"""

import os
import sys
import subprocess
from pathlib import Path

def print_header(title):
    """Print a formatted header."""
    print("\n" + "="*60)
    print(title.center(60))
    print("="*60)

def print_step(step_num, title):
    """Print a formatted step."""
    print(f"\n[Step {step_num}] {title}")
    print("-" * 40)

def check_python():
    """Check Python version."""
    version = sys.version_info
    if version.major >= 3 and version.minor >= 7:
        print(f"✓ Python {version.major}.{version.minor}.{version.micro} detected")
        return True
    else:
        print(f"✗ Python {version.major}.{version.minor} is too old")
        print("Please install Python 3.7+ from https://python.org")
        return False

def install_dependencies():
    """Install required dependencies."""
    print("Installing required packages...")
    
    # List of required packages
    packages = [
        "torch",
        "torchvision", 
        "transformers",
        "pillow",
        "numpy"
    ]
    
    try:
        # Try installing from requirements.txt first
        if Path("requirements.txt").exists():
            print("Installing from requirements.txt...")
            subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        else:
            print("Installing packages individually...")
            for package in packages:
                print(f"  Installing {package}...")
                subprocess.check_call([sys.executable, "-m", "pip", "install", package])
        
        print("✓ All dependencies installed successfully!")
        return True
        
    except subprocess.CalledProcessError as e:
        print(f"✗ Failed to install dependencies: {e}")
        print("\nTry installing manually:")
        print("pip install torch torchvision transformers pillow numpy")
        return False

def create_folder_structure():
    """Create necessary folder structure."""
    print("Creating folder structure...")
    
    folders = [
        "media",
        "sorted_animals", 
        "logs"
    ]
    
    for folder in folders:
        try:
            Path(folder).mkdir(exist_ok=True)
            print(f"✓ Created folder: {folder}/")
        except Exception as e:
            print(f"✗ Failed to create {folder}: {e}")
            return False
    
    # Create sample README in media folder
    try:
        readme_path = Path("media") / "README.txt"
        with open(readme_path, "w") as f:
            f.write("Animal Carving Photos\n")
            f.write("====================\n\n")
            f.write("Place your animal carving photos in this folder.\n")
            f.write("Supported formats: .jpg, .jpeg, .png\n\n")
            f.write("The script will automatically sort them into:\n")
            f.write("- SeaBass/\n")
            f.write("- Trout/\n") 
            f.write("- Goldfish/\n")
            f.write("- Butterfly/\n")
            f.write("- Dragonfly/\n")
            f.write("- Eagle/\n")
            f.write("- Unknown/ (for manual review)\n")
            f.write("- And more categories...\n\n")
            f.write("Run: python animal_photo_sorter.py\n")
        
        print(f"✓ Created: {readme_path}")
        
    except Exception as e:
        print(f"✗ Failed to create README: {e}")
    
    return True

def test_installation():
    """Test if everything is working."""
    print("Testing installation...")
    
    try:
        # Test imports
        import torch
        import transformers
        from PIL import Image
        import numpy as np
        
        print("✓ All packages imported successfully")
        
        # Test CUDA
        if torch.cuda.is_available():
            print(f"✓ CUDA available: {torch.cuda.get_device_name(0)}")
        else:
            print("ℹ CUDA not available (will use CPU)")
        
        print(f"✓ PyTorch version: {torch.__version__}")
        print(f"✓ Transformers version: {transformers.__version__}")
        
        return True
        
    except ImportError as e:
        print(f"✗ Import test failed: {e}")
        return False

def main():
    """Main setup process."""
    print_header("ANIMAL PHOTO SORTER SETUP")
    
    print("This script will set up the Animal Photo Sorter with all")
    print("necessary dependencies and folder structure.")
    
    # Step 1: Check Python
    print_step(1, "Checking Python Version")
    if not check_python():
        return False
    
    # Step 2: Install dependencies
    print_step(2, "Installing Dependencies")
    install_choice = input("\nInstall required packages? (y/n): ").lower().strip()
    
    if install_choice in ['y', 'yes']:
        if not install_dependencies():
            return False
    else:
        print("Skipping dependency installation.")
        print("Make sure to install: torch torchvision transformers pillow numpy")
    
    # Step 3: Create folders
    print_step(3, "Creating Folder Structure") 
    if not create_folder_structure():
        return False
    
    # Step 4: Test installation
    print_step(4, "Testing Installation")
    test_choice = input("\nTest the installation? (y/n): ").lower().strip()
    
    if test_choice in ['y', 'yes']:
        if not test_installation():
            print("\n⚠ Installation test failed. Check the errors above.")
            return False
    
    # Success!
    print_header("SETUP COMPLETE!")
    print("🎉 Animal Photo Sorter is ready to use!")
    print()
    print("Next steps:")
    print("1. Add your animal carving photos to the 'media/' folder")
    print("2. Run: python animal_photo_sorter.py")
    print("3. Check the 'sorted_animals/' folder for results")
    print()
    print("For detailed usage instructions, see: README_Animal_Sorter.md")
    print("To test your setup, run: python test_setup.py")
    
    return True

if __name__ == "__main__":
    try:
        success = main()
        if not success:
            sys.exit(1)
    except KeyboardInterrupt:
        print("\n\nSetup interrupted by user.")
        sys.exit(1)
    except Exception as e:
        print(f"\nUnexpected error during setup: {e}")
        sys.exit(1)
