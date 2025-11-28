# Icon Update Instructions

To update the icons with the new husky logo:

## Option 1: Use the conversion script (Recommended)

1. Save the uploaded husky logo image as `husky-logo.png` in the project root
2. Run: `./convert-icons.sh husky-logo.png`

## Option 2: Manual conversion

1. Save the husky logo image
2. Convert to these sizes and formats:
   - `public/apple-icon.png` - 180x180 PNG (for Apple touch icon)
   - `public/atlanta-high-logo.png` - 32x32 PNG (for favicon)
   - `public/favicon.ico` - 48x48 ICO format

## Current icon references in index.html:

- `/favicon.ico` (48x48) - Main favicon
- `/atlanta-high-logo.png` (16x16, 32x32, 180x180) - Multi-size favicon
- Apple touch icon uses `/atlanta-high-logo.png` (180x180)

## Files to replace:
- ✅ `public/apple-icon.png` 
- ✅ `public/atlanta-high-logo.png`
- ✅ `public/favicon.ico`

The script will handle all the resizing and format conversion automatically.
