#!/usr/bin/env python3
"""
Re-classify Unknown Images
==========================

This script re-processes images in the "Unknown" folder with updated 
classification labels to better identify St. Collen statues and other figures.
"""

import os
import sys
from pathlib import Path

# Import the main script functions
sys.path.append('.')
from animal_photo_sorter import AnimalClassifier, FileManager, setup_logging, CONFIDENCE_THRESHOLD

def reclassify_unknown_images():
    """Re-classify images in the Unknown folder."""
    
    # Setup logging
    logger = setup_logging()
    logger.info("Starting re-classification of Unknown images")
    
    unknown_folder = Path("sorted_animals/Unknown")
    if not unknown_folder.exists():
        print("No Unknown folder found!")
        return
    
    # Get image files from Unknown folder
    image_extensions = {'.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG'}
    unknown_images = []
    
    for file_path in unknown_folder.iterdir():
        if file_path.is_file() and file_path.suffix in image_extensions:
            unknown_images.append(file_path)
    
    if not unknown_images:
        print("No images found in Unknown folder!")
        return
    
    print(f"Found {len(unknown_images)} images to re-classify...")
    print()
    
    # Initialize classifier
    classifier = AnimalClassifier(logger)
    file_manager = FileManager("sorted_animals", "sorted_animals_reclassified", False, logger)
    
    # Re-process each unknown image
    reclassified_count = 0
    
    for i, image_file in enumerate(unknown_images, 1):
        print(f"Re-classifying {i}/{len(unknown_images)}: {image_file.name}")
        
        try:
            # Classify the image with updated labels
            animal_type, confidence = classifier.classify_image(str(image_file))
            
            print(f"  → Prediction: {animal_type} (confidence: {confidence:.3f})")
            
            # If confidence is good enough and it's not "unknown", move it
            if confidence >= CONFIDENCE_THRESHOLD and animal_type != "unknown":
                destination_folder = file_manager.create_destination_folder(animal_type)
                success = file_manager.move_or_copy_file(image_file, destination_folder)
                
                if success:
                    print(f"  → Re-classified to: {destination_folder.name}/")
                    reclassified_count += 1
                    
                    # Also move from original Unknown folder to correct folder in sorted_animals
                    original_dest = Path("sorted_animals") / destination_folder.name
                    original_dest.mkdir(parents=True, exist_ok=True)
                    
                    import shutil
                    new_file_path = original_dest / image_file.name
                    counter = 1
                    while new_file_path.exists():
                        stem = image_file.stem
                        suffix = image_file.suffix
                        new_file_path = original_dest / f"{stem}_{counter}{suffix}"
                        counter += 1
                    
                    shutil.move(str(image_file), str(new_file_path))
                    print(f"  → Moved to: sorted_animals/{destination_folder.name}/")
                else:
                    print(f"  → ERROR: Failed to move {image_file.name}")
            else:
                print(f"  → Staying in Unknown (low confidence)")
                
        except Exception as e:
            print(f"  → ERROR: {e}")
        
        print()
    
    print(f"\nRe-classification complete!")
    print(f"Successfully re-classified: {reclassified_count} images")
    print(f"Remaining in Unknown: {len(unknown_images) - reclassified_count} images")

if __name__ == "__main__":
    reclassify_unknown_images()
