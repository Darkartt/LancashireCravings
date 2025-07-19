#!/bin/bash

# Quick Folder Opener for Manual Review
# This script opens the key folders in Windows Explorer for manual image review

echo "🔍 Opening key folders for manual review..."

# St Collen folder - highest priority
echo "📁 Opening St Collen project folders..."
explorer.exe "C:\gladen\FixtureSync\daniel\woodcrave\opit2\check2\public\media\projects\stcollen\images\process"
sleep 2
explorer.exe "C:\gladen\FixtureSync\daniel\woodcrave\opit2\check2\public\media\projects\stcollen\images\final"
sleep 2

# Nature/Fish folder
echo "📁 Opening Nature/Fish folder..."
explorer.exe "C:\gladen\FixtureSync\daniel\woodcrave\opit2\check2\public\media\nature\fish"
sleep 2

# Eagle project folder
echo "📁 Opening Eagle project folders..."
explorer.exe "C:\gladen\FixtureSync\daniel\woodcrave\opit2\check2\public\media\projects\eagle\images\process"
sleep 2
explorer.exe "C:\gladen\FixtureSync\daniel\woodcrave\opit2\check2\public\media\projects\eagle\images\final"

echo "✅ All key folders opened in Windows Explorer"
echo ""
echo "📋 MANUAL REVIEW INSTRUCTIONS:"
echo "1. Look at thumbnail previews in each folder"
echo "2. Note any obvious misplacements (fish in statue folder, etc.)"
echo "3. Write down problematic filenames"
echo "4. Use the STRATEGIC_MANUAL_REVIEW_PLAN.md as your guide"
echo ""
echo "🎯 Focus on finding the most obvious misplacements first!"
