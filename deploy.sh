#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# --- Configuration ---
# The directory containing your portfolio's source code.
SOURCE_DIR="portfolio"
# The directory where the built files are placed by 'npm run build'.
# Changed from 'build' to 'dist' based on your output.
BUILD_DIR_NAME="dist"
BUILD_DIR="$SOURCE_DIR/$BUILD_DIR_NAME"

# --- Script ---
echo "Building the portfolio..."
# Navigate into the source directory, install dependencies, and build.
(cd "$SOURCE_DIR" && npm install && npm run build)

echo "Cleaning old build files from the root directory..."
# Remove old files from the root. This is safer than 'rm -rf *'
# It removes specific known files and directories.
# Add or remove items here based on what your build generates.
rm -f index.html
rm -rf assets

echo "Copying new build files to the root directory..."
# Copy the contents of the 'dist' directory to the root.
# The `/.` ensures the contents are copied, not the directory itself.
cp -a "$BUILD_DIR/." .

echo "Cleaning up the empty build directory..."
# This might not be necessary if you don't commit the build dir, but it's clean.
# Note: This command removes the now-empty 'dist' directory.
# rm -rf "$BUILD_DIR"

echo ""
echo "✅ Build complete."
echo "The built files have been copied to the root directory."
echo "Please review the changes, then commit and push them to deploy."
echo ""
echo "You can now run:"
echo "git status"
echo "git add ."
echo "git commit -m \"Deploy new version of portfolio\""
echo "git push"