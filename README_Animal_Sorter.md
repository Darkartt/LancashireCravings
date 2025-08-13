# Animal Photo Sorter

An intelligent Python script that automatically sorts animal carving photos using free, open-source AI image classification. The script uses Hugging Face's CLIP model to identify different animal types and organizes them into appropriate folders.

## Features

- 🤖 **AI-Powered Classification**: Uses OpenAI's CLIP model via Hugging Face Transformers
- 🐟 **Species-Specific Sorting**: Distinguishes between different fish species (sea bass, trout, goldfish)
- 📁 **Automatic Folder Creation**: Creates organized folder structure automatically
- 🔄 **Flexible Operations**: Choose to move or copy files
- 📊 **Detailed Reporting**: Comprehensive sorting statistics and logs
- 🆓 **Completely Free**: No paid APIs or subscriptions required
- 🛡️ **Error Handling**: Graceful handling of corrupted images and classification errors
- 📝 **Extensive Logging**: Detailed logs for troubleshooting and audit trails

## Supported Animal Categories

### Fish Species (Specific)
- **Sea Bass** → `SeaBass/` folder
- **Trout** (including rainbow trout, brown trout) → `Trout/` folder  
- **Goldfish** (including carp) → `Goldfish/` folder
- **Other Fish** (salmon, tuna, cod, etc.) → `OtherFish/` folder

### Other Animals
- **Eagles** (including hawks, falcons) → `Eagle/` folder
- **Butterflies** (including moths) → `Butterfly/` folder
- **Dragonflies** (including damselflies) → `Dragonfly/` folder
- **Other Birds** → `OtherBirds/` folder
- **Other Insects** → `OtherInsects/` folder
- **Bears** → `Bear/` folder
- **Deer** (including elk, moose) → `Deer/` folder
- **And many more...**

### Unknown Classification
- **Unknown** → `Unknown/` folder (for manual review)

## Installation

### Prerequisites
- Python 3.7 or higher
- pip (Python package installer)

### Step 1: Clone or Download
Download the `animal_photo_sorter.py` script to your computer.

### Step 2: Install Dependencies
```bash
# Option 1: Install using requirements file
pip install -r requirements.txt

# Option 2: Install manually
pip install torch torchvision transformers pillow numpy

# Option 3: Using conda
conda install pytorch torchvision transformers pillow numpy -c pytorch -c huggingface
```

### Step 3: Test Installation
```bash
python animal_photo_sorter.py test
```

This will verify that all required packages are properly installed.

## Quick Start

### 1. Prepare Your Images
Place your animal carving photos (`.jpg`, `.jpeg`, `.png`) in a folder called `media`:

```
your_project/
├── animal_photo_sorter.py
├── media/
│   ├── IMG_001.jpg
│   ├── carving_photo_123.png
│   └── animal_pic.jpeg
└── requirements.txt
```

### 2. Run the Script
```bash
python animal_photo_sorter.py
```

### 3. Check Results
The script will create a `sorted_animals/` folder with organized subfolders:

```
sorted_animals/
├── SeaBass/
│   ├── IMG_001.jpg
│   └── fish_carving_2.jpg
├── Butterfly/
│   └── butterfly_art.png
├── Eagle/
│   └── eagle_sculpture.jpg
└── Unknown/
    └── unclear_image.jpeg
```

## Configuration

Edit the configuration section at the top of `animal_photo_sorter.py`:

```python
# Source folder containing images to sort
SOURCE_FOLDER = "media"

# Base destination folder for sorted images
DESTINATION_FOLDER = "sorted_animals"

# Operation mode: True to move files, False to copy files
MOVE_FILES = False  # Set to True if you want to move instead of copy

# Confidence threshold for classification (0.0 to 1.0)
CONFIDENCE_THRESHOLD = 0.15
```

### Key Settings

- **SOURCE_FOLDER**: Change this to point to your image folder
- **DESTINATION_FOLDER**: Where sorted images will be placed
- **MOVE_FILES**: 
  - `False` = Copy files (original images remain in source folder)
  - `True` = Move files (original images are moved to sorted folders)
- **CONFIDENCE_THRESHOLD**: Minimum confidence required for classification
  - Lower values (0.1) = More aggressive classification
  - Higher values (0.3) = More conservative, more items go to "Unknown"

## Advanced Usage

### Command Line Options

```bash
# Show installation instructions
python animal_photo_sorter.py install

# Test if dependencies are installed
python animal_photo_sorter.py test

# Create sample folder structure
python animal_photo_sorter.py setup

# Show help information
python animal_photo_sorter.py help

# Run the main sorting process
python animal_photo_sorter.py
```

### Custom Animal Categories

To add or modify animal categories, edit the `ANIMAL_CATEGORIES` dictionary:

```python
ANIMAL_CATEGORIES = {
    # Add your custom mappings
    "custom_animal": "CustomFolder",
    "specific_bird": "SpecificBirds",
    # ... existing categories
}
```

### Custom Classification Labels

Modify the `CLASSIFICATION_LABELS` list to add more specific prompts:

```python
CLASSIFICATION_LABELS = [
    "a wooden carving of a [your_animal]",
    # ... existing labels
]
```

## Output and Reporting

### Console Output
The script provides real-time progress updates:
```
Processing 1/25: IMG_001.jpg
  → Sorted to: SeaBass/ (confidence: 0.847)

Processing 2/25: butterfly_pic.png
  → Sorted to: Butterfly/ (confidence: 0.923)
```

### Summary Report
At the end, you'll see a detailed report:
```
========================================
ANIMAL PHOTO SORTING SUMMARY REPORT
========================================
Operation: COPY
Source folder: media
Destination folder: sorted_animals
Total images processed: 25
Successfully sorted: 23
Classification failures: 2
File operation errors: 0

IMAGES SORTED BY CATEGORY:
----------------------------------------
  SeaBass: 8 images
  Butterfly: 5 images
  Eagle: 4 images
  Trout: 3 images
  Unknown: 3 images
  Dragonfly: 2 images
```

### Log Files
Detailed logs are saved automatically:
- Filename: `animal_sorting_YYYYMMDD_HHMMSS.log`
- Contains all classification details, errors, and operations

## Troubleshooting

### Common Issues

1. **"No module named 'torch'"**
   ```bash
   pip install torch torchvision transformers pillow numpy
   ```

2. **"Source folder does not exist"**
   - Create the `media` folder and add your images
   - Or change `SOURCE_FOLDER` in the configuration

3. **"CUDA out of memory" (if using GPU)**
   - The script automatically falls back to CPU
   - Or reduce batch size in the code

4. **Images going to "Unknown" folder**
   - Lower the `CONFIDENCE_THRESHOLD` value
   - Check image quality (blurry images are harder to classify)
   - Verify the image actually contains the expected animal

### Performance Tips

- **GPU Acceleration**: If you have NVIDIA GPU with CUDA, the script will automatically use it
- **Batch Processing**: For very large collections (1000+ images), consider processing in smaller batches
- **Image Quality**: Higher quality, well-lit images classify more accurately

### Manual Review

Always check the "Unknown" folder for:
- Images that should have been classified
- Incorrectly classified images that need manual sorting
- Corrupted or invalid image files

## Model Information

This script uses the **OpenAI CLIP-ViT-Base-Patch32** model:
- **Publisher**: OpenAI (via Hugging Face)
- **License**: MIT License
- **Model Size**: ~150MB download
- **Accuracy**: High accuracy for common animals and objects
- **Speed**: ~1-3 seconds per image on CPU, <1 second on GPU

## License

This script is provided under the MIT License. The CLIP model is also under MIT License.

## Contributing

Feel free to modify and improve the script for your specific needs:
1. Fork or copy the script
2. Add new animal categories
3. Improve classification prompts
4. Add new features
5. Share improvements with the community

## Support

If you encounter issues:
1. Check this README for common solutions
2. Review the log files for detailed error information
3. Ensure all dependencies are properly installed
4. Verify your image files are valid and readable

## Changelog

### Version 1.0 (July 21, 2025)
- Initial release
- CLIP-based classification
- Support for fish species differentiation
- Automatic folder organization
- Comprehensive logging and reporting
- Error handling and graceful fallbacks
