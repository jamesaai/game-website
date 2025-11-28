#!/bin/bash

# Script to convert the uploaded husky logo to different icon formats
# Usage: ./convert-icons.sh path/to/source-image.png

SOURCE_IMAGE="$1"

if [ -z "$SOURCE_IMAGE" ]; then
    echo "Usage: $0 path/to/source-image.png"
    exit 1
fi

if [ ! -f "$SOURCE_IMAGE" ]; then
    echo "Error: Source image not found: $SOURCE_IMAGE"
    exit 1
fi

echo "Converting icons from: $SOURCE_IMAGE"

# Create apple-icon.png (180x180 for Apple touch icon)
sips -z 180 180 "$SOURCE_IMAGE" --out public/apple-icon.png

# Create atlanta-high-logo.png (32x32 for general favicon use)
sips -z 32 32 "$SOURCE_IMAGE" --out public/atlanta-high-logo.png

# Create favicon.ico (48x48)
# First create a PNG version, then convert to ICO
sips -z 48 48 "$SOURCE_IMAGE" --out public/favicon-temp.png

# Convert PNG to ICO using ImageMagick if available, otherwise keep as PNG
if command -v convert &> /dev/null; then
    convert public/favicon-temp.png public/favicon.ico
    rm public/favicon-temp.png
else
    echo "Warning: ImageMagick not found. Keeping favicon as PNG."
    mv public/favicon-temp.png public/favicon.ico
fi

echo "Icon conversion complete!"
echo "Files created:"
echo "  - public/apple-icon.png (180x180)"
echo "  - public/atlanta-high-logo.png (32x32)"
echo "  - public/favicon.ico (48x48)"
