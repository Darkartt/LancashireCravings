#!/bin/bash

# Video compression script for GitHub compatibility
# Target: Keep files under 50MB for safe GitHub storage

FFMPEG="./ffmpeg.exe"

# List of files to compress (over 100MB)
files=(
    "public/media/nature/fish/videos/fish_fish_001.mp4"
    "public/media/nature/insects/videos/insects_butterfly_001.mp4"
    "public/media/nature/insects/videos/insects_butterfly_002.mp4"
    "public/media/projects/bass/videos/bass_bass_014.mov"
    "public/media/projects/bass/videos/bass_bass_028.mov"
    "public/media/projects/bass/videos/bass_bass_039.mov"
    "public/media/projects/stcollen/videos/stcollen_stcollen_053.mov"
    "public/media/projects/stcollen/videos/stcollen_stcollen_149.mov"
    "public/media/projects/stcollen/videos/stcollen_stcollen_215.mov"
)

echo "Starting video compression..."
echo "Target: Files under 50MB for GitHub compatibility"

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "Processing: $file"
        
        # Get file size in MB
        size_mb=$(du -m "$file" | cut -f1)
        echo "  Current size: ${size_mb}MB"
        
        # Create backup
        backup_file="${file}.original"
        if [ ! -f "$backup_file" ]; then
            cp "$file" "$backup_file"
            echo "  Created backup: $backup_file"
        fi
        
        # Determine output file with proper extension
        dir=$(dirname "$file")
        basename=$(basename "$file")
        name="${basename%.*}"
        ext="${basename##*.}"
        temp_file="${dir}/${name}_compressed.${ext}"
        
        # Compression settings based on file size
        if [ $size_mb -gt 300 ]; then
            # Very large files (371MB) - aggressive compression
            echo "  Applying aggressive compression..."
            "$FFMPEG" -i "$file" -c:v libx264 -crf 28 -c:a aac -b:a 128k -vf "scale=1280:720" -preset medium -y "$temp_file"
        elif [ $size_mb -gt 100 ]; then
            # Large files (100-300MB) - moderate compression
            echo "  Applying moderate compression..."
            "$FFMPEG" -i "$file" -c:v libx264 -crf 24 -c:a aac -b:a 192k -vf "scale=1920:1080" -preset medium -y "$temp_file"
        else
            # Files just over threshold - light compression
            echo "  Applying light compression..."
            "$FFMPEG" -i "$file" -c:v libx264 -crf 23 -c:a aac -b:a 256k -preset medium -y "$temp_file"
        fi
        
        if [ $? -eq 0 ] && [ -f "$temp_file" ]; then
            # Check new file size
            new_size_mb=$(du -m "$temp_file" | cut -f1)
            echo "  New size: ${new_size_mb}MB"
            
            if [ $new_size_mb -lt 50 ]; then
                # Replace original with compressed version
                mv "$temp_file" "$file"
                echo "  ✅ Successfully compressed: $file"
            else
                echo "  ⚠️  Still too large, trying more aggressive compression..."
                aggressive_temp="${dir}/${name}_aggressive.${ext}"
                "$FFMPEG" -i "$backup_file" -c:v libx264 -crf 30 -c:a aac -b:a 96k -vf "scale=1280:720" -preset medium -y "$aggressive_temp"
                
                new_size_mb=$(du -m "$aggressive_temp" | cut -f1)
                echo "  New size (aggressive): ${new_size_mb}MB"
                
                if [ $new_size_mb -lt 50 ]; then
                    mv "$aggressive_temp" "$file"
                    rm -f "$temp_file"
                    echo "  ✅ Successfully compressed (aggressive): $file"
                else
                    rm -f "$temp_file" "$aggressive_temp"
                    echo "  ❌ Failed to compress below 50MB: $file"
                fi
            fi
        else
            echo "  ❌ Compression failed: $file"
            [ -f "$temp_file" ] && rm "$temp_file"
        fi
        
        echo ""
    else
        echo "File not found: $file"
    fi
done

echo "Compression complete!"
echo ""
echo "Checking final sizes..."
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        size_mb=$(du -m "$file" | cut -f1)
        if [ $size_mb -lt 50 ]; then
            echo "✅ $file: ${size_mb}MB"
        else
            echo "❌ $file: ${size_mb}MB (still too large)"
        fi
    fi
done
