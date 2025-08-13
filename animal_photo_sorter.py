!/usr/bin/env python3
"""
Animal Photo Sorter Script
==========================

This script automatically sorts animal carving photos into organized folders based on 
the detected animal type using free, open-source AI image classification.

Features:
- Uses Hugging Face CLIP model for accurate animal classification
- Distinguishes between different fish species (sea bass, trout, goldfish)
- Creates folders automatically as needed
- Handles errors gracefully
- Provides detailed sorting report
- Configurable move/copy operation
- No paid APIs required

Author: AI Assistant
Date: July 21, 2025
License: MIT
"""

import os
import shutil
import json
from pathlib import Path
from typing import List, Dict, Tuple, Optional
import logging
from datetime import datetime

# Third-party imports (install via pip)
try:
    from PIL import Image
    import torch
    from transformers import CLIPProcessor, CLIPModel
    import numpy as np
except ImportError as e:
    print(f"Missing required packages. Please install them using:")
    print("pip install torch torchvision transformers pillow numpy")
    print(f"Error: {e}")
    exit(1)

# =============================================================================
# CONFIGURATION SECTION - MODIFY THESE SETTINGS AS NEEDED
# =============================================================================

# Source folder containing images to sort
SOURCE_FOLDER = "public/media"

# Base destination folder for sorted images
DESTINATION_FOLDER = "sorted_animals"

# Operation mode: True to move files, False to copy files
MOVE_FILES = False  # Set to True if you want to move instead of copy

# Confidence threshold for classification (0.0 to 1.0)
CONFIDENCE_THRESHOLD = 0.15

# Animal categories and their corresponding folder names
ANIMAL_CATEGORIES = {
    # Fish species - specific identification
    "sea bass": "SeaBass",
    "bass": "SeaBass", 
    "sea_bass": "SeaBass",
    "trout": "Trout",
    "rainbow trout": "Trout",
    "brown trout": "Trout",
    "goldfish": "Goldfish",
    "gold fish": "Goldfish",
    "carp": "Goldfish",  # Often confused with goldfish
    
    # Other fish - general category
    "fish": "OtherFish",
    "salmon": "OtherFish",
    "tuna": "OtherFish",
    "cod": "OtherFish",
    "mackerel": "OtherFish",
    "shark": "OtherFish",
    "ray": "OtherFish",
    "eel": "OtherFish",
    
    # Birds
    "eagle": "Eagle",
    "hawk": "Eagle",  # Group with eagles
    "falcon": "Eagle",
    "bird": "OtherBirds",
    "owl": "OtherBirds",
    "duck": "OtherBirds",
    "swan": "OtherBirds",
    "heron": "OtherBirds",
    
    # Insects
    "butterfly": "Butterfly",
    "moth": "Butterfly",  # Group with butterflies
    "dragonfly": "Dragonfly",
    "damselfly": "Dragonfly",  # Group with dragonflies
    "beetle": "OtherInsects",
    "bee": "OtherInsects",
    "fly": "OtherInsects",
    
    # Other animals
    "bear": "Bear",
    "deer": "Deer",
    "elk": "Deer",
    "moose": "Deer",
    "horse": "Horse",
    "cat": "Cat",
    "dog": "Dog",
    "wolf": "Dog",
    "fox": "Fox",
    "rabbit": "Rabbit",
    "squirrel": "Squirrel",
    "turtle": "Turtle",
    "frog": "Frog",
    "snake": "Snake",
    "lizard": "Lizard",
    
    # Human figures and statues
    "st collen": "StCollen",
    "st. collen": "StCollen",
    "saint collen": "StCollen",
    "collen": "StCollen",
    "human": "HumanFigures",
    "person": "HumanFigures",
    "man": "HumanFigures",
    "woman": "HumanFigures",
    "saint": "Saints",
    "statue": "Statues",
    "figure": "Figures"
}

# Extended label list for CLIP classification
CLASSIFICATION_LABELS = [
    # Specific fish species
    "a wooden carving of a sea bass fish",
    "a wooden carving of a bass fish", 
    "a wooden carving of a trout fish",
    "a wooden carving of a rainbow trout",
    "a wooden carving of a goldfish",
    "a wooden carving of a carp fish",
    
    # Other fish
    "a wooden carving of a salmon fish",
    "a wooden carving of a tuna fish",
    "a wooden carving of a cod fish",
    "a wooden carving of a shark",
    "a wooden carving of a fish",
    
    # Birds
    "a wooden carving of an eagle",
    "a wooden carving of a hawk",
    "a wooden carving of a falcon",
    "a wooden carving of an owl",
    "a wooden carving of a duck",
    "a wooden carving of a bird",
    
    # Insects
    "a wooden carving of a butterfly",
    "a wooden carving of a moth",
    "a wooden carving of a dragonfly",
    "a wooden carving of a damselfly",
    "a wooden carving of a beetle",
    "a wooden carving of a bee",
    
    # Other animals
    "a wooden carving of a bear",
    "a wooden carving of a deer",
    "a wooden carving of a horse",
    "a wooden carving of a cat",
    "a wooden carving of a dog",
    "a wooden carving of a wolf",
    "a wooden carving of a fox",
    "a wooden carving of a rabbit",
    "a wooden carving of a turtle",
    "a wooden carving of a frog",
    "a wooden carving of a snake",
    
    # Human figures and statues
    "a wooden carving of St. Collen",
    "a wooden carving of Saint Collen",
    "a wooden statue of St. Collen", 
    "a wooden statue of Saint Collen",
    "a carved statue of St. Collen",
    "a religious statue of St. Collen",
    "a wooden carving of a saint",
    "a wooden carving of a human figure",
    "a wooden carving of a person",
    "a wooden carving of a man",
    "a wooden carving of a woman",
    "a wooden statue",
    "a religious carving",
    "a human figure carving",
    
    # Fallback categories
    "a wooden sculpture",
    "a wood carving",
    "an animal figure",
    "unknown object"
]

# =============================================================================
# LOGGING SETUP
# =============================================================================

def setup_logging() -> logging.Logger:
    """Set up logging configuration."""
    log_filename = f"animal_sorting_{datetime.now().strftime('%Y%m%d_%H%M%S')}.log"
    
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler(log_filename),
            logging.StreamHandler()
        ]
    )
    
    logger = logging.getLogger(__name__)
    logger.info(f"Animal Photo Sorter started - Log file: {log_filename}")
    return logger

# =============================================================================
# IMAGE CLASSIFICATION CLASS
# =============================================================================

class AnimalClassifier:
    """Handles image classification using CLIP model."""
    
    def __init__(self, logger: logging.Logger):
        """Initialize the classifier with CLIP model."""
        self.logger = logger
        self.model = None
        self.processor = None
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        
        self.logger.info(f"Using device: {self.device}")
        self._load_model()
    
    def _load_model(self):
        """Load the CLIP model and processor."""
        try:
            self.logger.info("Loading CLIP model...")
            model_name = "openai/clip-vit-base-patch32"
            
            self.model = CLIPModel.from_pretrained(model_name)
            self.processor = CLIPProcessor.from_pretrained(model_name)
            
            self.model.to(self.device)
            self.model.eval()
            
            self.logger.info("CLIP model loaded successfully")
            
        except Exception as e:
            self.logger.error(f"Failed to load CLIP model: {e}")
            raise
    
    def classify_image(self, image_path: str) -> Tuple[str, float]:
        """
        Classify an image and return the predicted animal type and confidence.
        
        Args:
            image_path: Path to the image file
            
        Returns:
            Tuple of (predicted_label, confidence_score)
        """
        try:
            # Load and preprocess image
            image = Image.open(image_path).convert("RGB")
            
            # Prepare inputs
            inputs = self.processor(
                text=CLASSIFICATION_LABELS,
                images=image,
                return_tensors="pt",
                padding=True
            )
            
            # Move inputs to device
            inputs = {k: v.to(self.device) for k, v in inputs.items()}
            
            # Get predictions
            with torch.no_grad():
                outputs = self.model(**inputs)
                logits_per_image = outputs.logits_per_image
                probs = logits_per_image.softmax(dim=1)
            
            # Get the best prediction
            confidence, predicted_idx = torch.max(probs, 1)
            predicted_label = CLASSIFICATION_LABELS[predicted_idx.item()]
            confidence_score = confidence.item()
            
            # Extract animal type from label
            animal_type = self._extract_animal_type(predicted_label)
            
            self.logger.debug(f"Image: {image_path}")
            self.logger.debug(f"Predicted: {predicted_label} (confidence: {confidence_score:.3f})")
            self.logger.debug(f"Animal type: {animal_type}")
            
            return animal_type, confidence_score
            
        except Exception as e:
            self.logger.error(f"Error classifying image {image_path}: {e}")
            return "unknown", 0.0
    
    def _extract_animal_type(self, label: str) -> str:
        """Extract animal type from the classification label."""
        # Remove common prefixes
        label_clean = label.lower()
        label_clean = label_clean.replace("a wooden carving of a ", "")
        label_clean = label_clean.replace("a wooden carving of an ", "")
        label_clean = label_clean.replace("a wooden carving of ", "")
        label_clean = label_clean.replace("a wood carving of ", "")
        label_clean = label_clean.strip()
        
        # Check for specific matches in ANIMAL_CATEGORIES
        for animal_key, folder_name in ANIMAL_CATEGORIES.items():
            if animal_key in label_clean:
                return animal_key
        
        # If no match found, return the cleaned label
        return label_clean

# =============================================================================
# FILE OPERATIONS CLASS
# =============================================================================

class FileManager:
    """Handles file operations for sorting images."""
    
    def __init__(self, source_folder: str, destination_folder: str, 
                 move_files: bool, logger: logging.Logger):
        """Initialize file manager."""
        self.source_folder = Path(source_folder)
        self.destination_folder = Path(destination_folder)
        self.move_files = move_files
        self.logger = logger
        
        # Statistics
        self.stats = {
            "total_processed": 0,
            "successful_sorts": 0,
            "failed_classifications": 0,
            "errors": 0,
            "folder_counts": {}
        }
    
    def get_image_files(self) -> List[Path]:
        """Get all image files from the source folder and all subdirectories."""
        image_extensions = {'.jpg', '.jpeg', '.png', '.JPG', '.JPEG', '.PNG'}
        image_files = []
        
        try:
            # Use rglob to recursively find all image files in subdirectories
            for ext in image_extensions:
                # Search for files with each extension recursively
                pattern = f"**/*{ext}"
                matching_files = list(self.source_folder.rglob(pattern))
                image_files.extend(matching_files)
            
            # Remove duplicates and sort
            image_files = sorted(list(set(image_files)))
            
            self.logger.info(f"Found {len(image_files)} image files in {self.source_folder} and subdirectories")
            if len(image_files) > 0:
                self.logger.info(f"Sample files found: {[f.name for f in image_files[:5]]}")
            
            return image_files
            
        except Exception as e:
            self.logger.error(f"Error reading source folder {self.source_folder}: {e}")
            return []
    
    def create_destination_folder(self, animal_type: str) -> Path:
        """Create destination folder for the animal type."""
        # Map animal type to folder name
        folder_name = ANIMAL_CATEGORIES.get(animal_type, "Unknown")
        
        # Special handling for unknown or low-confidence classifications
        if animal_type == "unknown" or folder_name == "Unknown":
            folder_name = "Unknown"
        
        folder_path = self.destination_folder / folder_name
        
        try:
            folder_path.mkdir(parents=True, exist_ok=True)
            return folder_path
            
        except Exception as e:
            self.logger.error(f"Error creating folder {folder_path}: {e}")
            # Fallback to Unknown folder
            unknown_folder = self.destination_folder / "Unknown"
            unknown_folder.mkdir(parents=True, exist_ok=True)
            return unknown_folder
    
    def move_or_copy_file(self, source_file: Path, destination_folder: Path) -> bool:
        """Move or copy file to destination folder."""
        try:
            destination_file = destination_folder / source_file.name
            
            # Handle duplicate filenames
            counter = 1
            original_stem = destination_file.stem
            original_suffix = destination_file.suffix
            
            while destination_file.exists():
                new_name = f"{original_stem}_{counter}{original_suffix}"
                destination_file = destination_folder / new_name
                counter += 1
            
            if self.move_files:
                shutil.move(str(source_file), str(destination_file))
                operation = "moved"
            else:
                shutil.copy2(str(source_file), str(destination_file))
                operation = "copied"
            
            self.logger.info(f"Successfully {operation}: {source_file.name} → {destination_folder.name}/")
            return True
            
        except Exception as e:
            self.logger.error(f"Error moving/copying {source_file} to {destination_folder}: {e}")
            return False
    
    def update_stats(self, folder_name: str, success: bool):
        """Update sorting statistics."""
        self.stats["total_processed"] += 1
        
        if success:
            self.stats["successful_sorts"] += 1
            if folder_name in self.stats["folder_counts"]:
                self.stats["folder_counts"][folder_name] += 1
            else:
                self.stats["folder_counts"][folder_name] = 1
        else:
            self.stats["errors"] += 1
    
    def print_summary_report(self):
        """Print a detailed summary report."""
        print("\n" + "="*60)
        print("ANIMAL PHOTO SORTING SUMMARY REPORT")
        print("="*60)
        print(f"Operation: {'MOVE' if self.move_files else 'COPY'}")
        print(f"Source folder: {self.source_folder}")
        print(f"Destination folder: {self.destination_folder}")
        print(f"Total images processed: {self.stats['total_processed']}")
        print(f"Successfully sorted: {self.stats['successful_sorts']}")
        print(f"Classification failures: {self.stats['failed_classifications']}")
        print(f"File operation errors: {self.stats['errors']}")
        print()
        
        if self.stats["folder_counts"]:
            print("IMAGES SORTED BY CATEGORY:")
            print("-" * 40)
            for folder, count in sorted(self.stats["folder_counts"].items()):
                print(f"  {folder}: {count} images")
        else:
            print("No images were successfully sorted.")
        
        print("\n" + "="*60)
        
        # Log the same information
        self.logger.info("Sorting completed")
        self.logger.info(f"Total processed: {self.stats['total_processed']}")
        self.logger.info(f"Successfully sorted: {self.stats['successful_sorts']}")
        self.logger.info(f"Folder distribution: {self.stats['folder_counts']}")

# =============================================================================
# MAIN SORTING FUNCTION
# =============================================================================

def sort_animal_photos():
    """Main function to sort animal photos."""
    # Setup logging
    logger = setup_logging()
    
    try:
        print("Animal Photo Sorter - Starting...")
        print(f"Source folder: {SOURCE_FOLDER}")
        print(f"Destination folder: {DESTINATION_FOLDER}")
        print(f"Operation mode: {'MOVE' if MOVE_FILES else 'COPY'}")
        print(f"Confidence threshold: {CONFIDENCE_THRESHOLD}")
        print()
        
        # Validate source folder
        source_path = Path(SOURCE_FOLDER)
        if not source_path.exists():
            logger.error(f"Source folder does not exist: {SOURCE_FOLDER}")
            print(f"ERROR: Source folder '{SOURCE_FOLDER}' does not exist!")
            print("Please create the folder and add your images, or update the SOURCE_FOLDER variable.")
            return
        
        # Initialize components
        logger.info("Initializing classifier...")
        classifier = AnimalClassifier(logger)
        
        logger.info("Initializing file manager...")
        file_manager = FileManager(SOURCE_FOLDER, DESTINATION_FOLDER, MOVE_FILES, logger)
        
        # Get image files
        image_files = file_manager.get_image_files()
        if not image_files:
            logger.warning("No image files found in source folder")
            print("No image files found to process.")
            return
        
        print(f"Found {len(image_files)} images to process...")
        print()
        
        # Process each image
        for i, image_file in enumerate(image_files, 1):
            print(f"Processing {i}/{len(image_files)}: {image_file.name}")
            
            try:
                # Classify the image
                animal_type, confidence = classifier.classify_image(str(image_file))
                
                # Determine destination folder
                if confidence < CONFIDENCE_THRESHOLD:
                    animal_type = "unknown"
                    file_manager.stats["failed_classifications"] += 1
                    logger.info(f"Low confidence ({confidence:.3f}) for {image_file.name}, moving to Unknown")
                
                # Create destination folder and move/copy file
                destination_folder = file_manager.create_destination_folder(animal_type)
                folder_name = destination_folder.name
                
                success = file_manager.move_or_copy_file(image_file, destination_folder)
                file_manager.update_stats(folder_name, success)
                
                if success:
                    print(f"  → Sorted to: {folder_name}/ (confidence: {confidence:.3f})")
                else:
                    print(f"  → ERROR: Failed to sort {image_file.name}")
                
            except Exception as e:
                logger.error(f"Error processing {image_file}: {e}")
                print(f"  → ERROR: {e}")
                file_manager.stats["errors"] += 1
            
            print()
        
        # Print summary report
        file_manager.print_summary_report()
        
    except KeyboardInterrupt:
        logger.info("Sorting interrupted by user")
        print("\nSorting interrupted by user.")
        
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        print(f"ERROR: {e}")

# =============================================================================
# UTILITY FUNCTIONS
# =============================================================================

def install_dependencies():
    """Helper function to install required dependencies."""
    print("Installing required dependencies...")
    print("Please run the following command:")
    print()
    print("pip install torch torchvision transformers pillow numpy")
    print()
    print("Or if you're using conda:")
    print("conda install pytorch torchvision transformers pillow numpy -c pytorch -c huggingface")

def test_installation():
    """Test if all required packages are installed."""
    try:
        import torch
        import transformers
        from PIL import Image
        import numpy as np
        print("✓ All required packages are installed!")
        print(f"✓ PyTorch version: {torch.__version__}")
        print(f"✓ Transformers version: {transformers.__version__}")
        print(f"✓ CUDA available: {torch.cuda.is_available()}")
        return True
    except ImportError as e:
        print(f"✗ Missing packages: {e}")
        return False

def create_sample_structure():
    """Create sample folder structure for testing."""
    print("Creating sample folder structure...")
    
    # Create source folder
    os.makedirs(SOURCE_FOLDER, exist_ok=True)
    print(f"Created source folder: {SOURCE_FOLDER}")
    
    # Create a sample image placeholder
    sample_readme = os.path.join(SOURCE_FOLDER, "README.txt")
    with open(sample_readme, "w") as f:
        f.write("Place your animal carving photos (.jpg, .jpeg, .png) in this folder.\n")
        f.write("The script will automatically sort them into categorized folders.\n")
    
    print(f"Created sample structure. Add your images to: {SOURCE_FOLDER}")

# =============================================================================
# MAIN EXECUTION
# =============================================================================

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1:
        command = sys.argv[1].lower()
        
        if command == "install":
            install_dependencies()
        elif command == "test":
            test_installation()
        elif command == "setup":
            create_sample_structure()
        elif command == "help":
            print(__doc__)
            print("\nUsage:")
            print("  python animal_photo_sorter.py          - Run the sorting process")
            print("  python animal_photo_sorter.py install  - Show installation instructions")
            print("  python animal_photo_sorter.py test     - Test if dependencies are installed")
            print("  python animal_photo_sorter.py setup    - Create sample folder structure")
            print("  python animal_photo_sorter.py help     - Show this help message")
        else:
            print(f"Unknown command: {command}")
            print("Use 'python animal_photo_sorter.py help' for usage information.")
    else:
        # Run the main sorting function
        sort_animal_photos()
