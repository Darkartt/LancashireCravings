#!/usr/bin/env python3
"""
Test Script for Animal Photo Sorter
===================================

This script tests the animal photo sorter setup and dependencies.
Run this before using the main sorting script to ensure everything works.
"""

import sys
import os
from pathlib import Path

def test_python_version():
    """Test Python version compatibility."""
    print("Testing Python version...")
    version = sys.version_info
    if version.major >= 3 and version.minor >= 7:
        print(f"✓ Python {version.major}.{version.minor}.{version.micro} is supported")
        return True
    else:
        print(f"✗ Python {version.major}.{version.minor}.{version.micro} is not supported")
        print("  Please upgrade to Python 3.7 or higher")
        return False

def test_dependencies():
    """Test if all required packages are available."""
    print("\nTesting dependencies...")
    
    dependencies = [
        ("torch", "PyTorch"),
        ("torchvision", "TorchVision"), 
        ("transformers", "Hugging Face Transformers"),
        ("PIL", "Pillow (PIL)"),
        ("numpy", "NumPy")
    ]
    
    all_good = True
    
    for module, name in dependencies:
        try:
            __import__(module)
            print(f"✓ {name} is installed")
        except ImportError:
            print(f"✗ {name} is NOT installed")
            all_good = False
    
    if not all_good:
        print("\nTo install missing dependencies, run:")
        print("pip install -r requirements.txt")
        print("or")
        print("pip install torch torchvision transformers pillow numpy")
    
    return all_good

def test_cuda_availability():
    """Test CUDA availability for GPU acceleration."""
    print("\nTesting GPU/CUDA availability...")
    
    try:
        import torch
        if torch.cuda.is_available():
            print(f"✓ CUDA is available! GPU: {torch.cuda.get_device_name(0)}")
            print(f"  CUDA version: {torch.version.cuda}")
            return True
        else:
            print("ℹ CUDA is not available (will use CPU - this is normal)")
            return False
    except ImportError:
        print("? Cannot test CUDA (PyTorch not installed)")
        return False

def test_model_download():
    """Test downloading the CLIP model."""
    print("\nTesting CLIP model download...")
    
    try:
        from transformers import CLIPProcessor, CLIPModel
        
        print("  Downloading CLIP model (this may take a minute)...")
        model_name = "openai/clip-vit-base-patch32"
        
        model = CLIPModel.from_pretrained(model_name)
        processor = CLIPProcessor.from_pretrained(model_name)
        
        print("✓ CLIP model downloaded and loaded successfully")
        print(f"  Model size: ~{model.num_parameters() / 1e6:.1f}M parameters")
        return True
        
    except Exception as e:
        print(f"✗ Failed to download CLIP model: {e}")
        return False

def test_folder_structure():
    """Test folder structure and permissions."""
    print("\nTesting folder structure...")
    
    # Test source folder
    source_folder = Path("media")
    if source_folder.exists():
        print(f"✓ Source folder '{source_folder}' exists")
        
        # Count image files
        image_extensions = {'.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG'}
        image_files = [f for f in source_folder.iterdir() 
                      if f.is_file() and f.suffix in image_extensions]
        
        if image_files:
            print(f"  Found {len(image_files)} image files to process")
        else:
            print("  ⚠ No image files found in source folder")
            print("    Add some .jpg, .jpeg, or .png files to test sorting")
    else:
        print(f"ℹ Source folder '{source_folder}' does not exist")
        print("  Creating sample folder structure...")
        try:
            source_folder.mkdir(exist_ok=True)
            readme_file = source_folder / "README.txt"
            with open(readme_file, "w") as f:
                f.write("Add your animal carving photos here (.jpg, .jpeg, .png)\n")
                f.write("The script will sort them automatically.\n")
            print(f"✓ Created '{source_folder}' folder")
        except Exception as e:
            print(f"✗ Failed to create folder: {e}")
            return False
    
    # Test write permissions
    try:
        test_folder = Path("test_permissions")
        test_folder.mkdir(exist_ok=True)
        test_file = test_folder / "test.txt"
        with open(test_file, "w") as f:
            f.write("test")
        test_file.unlink()
        test_folder.rmdir()
        print("✓ Write permissions are OK")
        return True
    except Exception as e:
        print(f"✗ Write permission test failed: {e}")
        return False

def run_quick_classification_test():
    """Run a quick test classification."""
    print("\nRunning quick classification test...")
    
    try:
        from PIL import Image
        import torch
        from transformers import CLIPProcessor, CLIPModel
        import numpy as np
        
        # Create a simple test image (solid color)
        test_image = Image.new('RGB', (224, 224), color='brown')
        
        # Load model
        model_name = "openai/clip-vit-base-patch32"
        model = CLIPModel.from_pretrained(model_name)
        processor = CLIPProcessor.from_pretrained(model_name)
        
        # Test labels
        test_labels = [
            "a wooden carving of a fish",
            "a wooden carving of a bird", 
            "a wooden sculpture",
            "a piece of wood"
        ]
        
        # Process
        inputs = processor(text=test_labels, images=test_image, 
                          return_tensors="pt", padding=True)
        
        with torch.no_grad():
            outputs = model(**inputs)
            probs = outputs.logits_per_image.softmax(dim=1)
        
        # Get best prediction
        best_idx = torch.argmax(probs).item()
        confidence = probs[0][best_idx].item()
        
        print(f"✓ Classification test successful!")
        print(f"  Test prediction: '{test_labels[best_idx]}' (confidence: {confidence:.3f})")
        return True
        
    except Exception as e:
        print(f"✗ Classification test failed: {e}")
        return False

def main():
    """Run all tests."""
    print("="*60)
    print("ANIMAL PHOTO SORTER - SETUP TEST")
    print("="*60)
    
    tests = [
        ("Python Version", test_python_version),
        ("Dependencies", test_dependencies),
        ("GPU/CUDA", test_cuda_availability),
        ("Model Download", test_model_download),
        ("Folder Structure", test_folder_structure),
        ("Classification", run_quick_classification_test)
    ]
    
    results = []
    
    for test_name, test_func in tests:
        try:
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"✗ {test_name} test crashed: {e}")
            results.append((test_name, False))
    
    # Summary
    print("\n" + "="*60)
    print("TEST SUMMARY")
    print("="*60)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for test_name, result in results:
        status = "PASS" if result else "FAIL"
        print(f"{test_name:<20}: {status}")
    
    print(f"\nOverall: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 All tests passed! The animal photo sorter is ready to use.")
        print("Run: python animal_photo_sorter.py")
    else:
        print(f"\n⚠ {total - passed} test(s) failed. Please fix the issues above.")
        print("Check the README_Animal_Sorter.md for troubleshooting help.")
    
    print("\n" + "="*60)

if __name__ == "__main__":
    main()
