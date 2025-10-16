# FocusBubble Extension Icons

## Required Icons

Place the following icon files in this directory:

### Required Sizes
- `icon16.png` - 16x16 pixels (browser toolbar)
- `icon32.png` - 32x32 pixels (Windows taskbar)
- `icon48.png` - 48x48 pixels (extension management page)
- `icon128.png` - 128x128 pixels (Chrome Web Store, installation)

## Design Guidelines

### Visual Style
- **Theme:** Bubble/water droplet motif
- **Colors:** Gradient from #667eea (purple) to #764ba2 (deep purple)
- **Background:** Transparent PNG
- **Style:** Modern, minimal, recognizable at small sizes

### Technical Requirements
- **Format:** PNG with transparency
- **Color Space:** sRGB
- **Compression:** Optimized for web
- **Naming:** Exact match (case-sensitive)

### Design Tips
1. **Keep it Simple:** Icon should be recognizable at 16x16px
2. **High Contrast:** Test on both light and dark backgrounds
3. **No Text:** Avoid text that becomes unreadable at small sizes
4. **Center Focus:** Main element centered in icon
5. **Consistent Style:** All sizes should look cohesive

## Quick Creation Methods

### Option 1: Design Tool (Recommended)
1. Use Figma, Sketch, or Canva
2. Create 128x128px artboard
3. Design bubble icon with gradient
4. Export at all 4 sizes

### Option 2: Logo Conversion
1. Start with your existing logo
2. Simplify if needed (remove fine details)
3. Apply circular crop or bubble shape
4. Export at required sizes

### Option 3: Online Generator
- [RealFaviconGenerator](https://realfavicongenerator.net/)
- [IconGenerator](https://www.websiteplanet.com/webtools/favicon-generator/)
- Upload base image, download all sizes

### Option 4: Command Line (ImageMagick)
```bash
# If you have a 512x512 source icon
convert icon-512.png -resize 16x16 icon16.png
convert icon-512.png -resize 32x32 icon32.png
convert icon-512.png -resize 48x48 icon48.png
convert icon-512.png -resize 128x128 icon128.png
```

## Example Design Concept

```
┌────────────────┐
│                │
│    🫧         │  <- Bubble/water droplet
│   ⏱️         │  <- Subtle timer element
│                │
└────────────────┘
Purple gradient background
White/light icon elements
```

## Placeholder SVG (Convert to PNG)

If you need a quick placeholder to start testing:

```svg
<svg width="128" height="128" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  <circle cx="64" cy="64" r="60" fill="url(#grad)" />
  <circle cx="64" cy="64" r="48" fill="none" stroke="white" stroke-width="4" opacity="0.6" />
  <circle cx="50" cy="50" r="8" fill="white" opacity="0.4" />
</svg>
```

## Testing Your Icons

After adding icons:

1. **Load Extension:**
   - Chrome: `chrome://extensions/` → Load unpacked
   - Firefox: `about:debugging` → Load temporary add-on

2. **Check All Locations:**
   - Browser toolbar (16x16)
   - Extension management page (48x48)
   - Installation dialog (128x128)
   - Task manager (32x32 on Windows)

3. **Test Backgrounds:**
   - Light mode toolbar
   - Dark mode toolbar
   - Extension page with different themes

## Icon Checklist

Before submitting to stores:

- [ ] All 4 sizes created (16, 32, 48, 128)
- [ ] PNG format with transparency
- [ ] Correct file names (icon16.png, icon32.png, etc.)
- [ ] Tested in light mode
- [ ] Tested in dark mode
- [ ] Recognizable at 16x16 size
- [ ] Consistent design across all sizes
- [ ] Optimized file sizes (< 50KB each)
- [ ] Files placed in this directory

## Color Reference

**Primary Gradient:**
- Start: `#667eea` (RGB: 102, 126, 234)
- End: `#764ba2` (RGB: 118, 75, 162)

**Accent Colors:**
- White: `#ffffff` (for highlights)
- Light Purple: `#a5b4fc` (for accents)

## Need Help?

- Search "browser extension icon design" for examples
- Look at popular productivity extensions for inspiration
- Keep it simple - complexity doesn't scale well

**Remember:** You can always update icons later through store updates!

---

Made by Krubles Team | GitHub: @C-Elkins
