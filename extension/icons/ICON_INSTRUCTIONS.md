# FocusBubble Icon Instructions

The extension requires three icon sizes:

- **icon16.png** - 16x16 pixels (toolbar small)
- **icon48.png** - 48x48 pixels (extension management)
- **icon128.png** - 128x128 pixels (Chrome Web Store)

## Design Concept

The FocusBubble icon should represent:
- **Focus** - A central target or concentrated element
- **Bubble** - Circular, soft, rounded aesthetic
- **Timer** - Subtle clock or time element

### Recommended Design

**Style:** Minimalist circular gradient with a timer arc

**Colors:**
- Primary: Purple gradient (#667eea → #764ba2)
- Accent: Light blue (#38bdf8)
- Background: Transparent or white

**Elements:**
1. Circular gradient background (purple → violet)
2. White timer/clock face in center
3. Subtle arc or progress indicator
4. Optional: Small target/bullseye icon

## How to Create Icons

### Option 1: Using Figma (Recommended)

1. Create a new frame: 128x128 pixels
2. Draw a circle with gradient fill:
   - Start: #667eea (top-left)
   - End: #764ba2 (bottom-right)
3. Add a white circle in the center (70% size)
4. Add a subtle timer icon or arc element
5. Export as PNG at 128x128, 48x48, and 16x16

### Option 2: Using Online Tools

1. Go to https://favicon.io/favicon-generator/
2. Configure:
   - Text: "FB" or "🎯"
   - Font: Rounded sans-serif
   - Background: Gradient or solid (#667eea)
   - Shape: Circle
3. Download and resize to required dimensions

### Option 3: Using Canva

1. Create a new design: 128x128 pixels
2. Add a circle shape with purple gradient
3. Add text "FB" or a timer icon in the center
4. Download as PNG
5. Resize to 48x48 and 16x16 using an image editor

## SVG Template

Here's an SVG template you can convert to PNG:

```svg
<svg width="128" height="128" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bubbleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- Outer circle with gradient -->
  <circle cx="64" cy="64" r="60" fill="url(#bubbleGradient)" />

  <!-- Inner white circle -->
  <circle cx="64" cy="64" r="48" fill="white" />

  <!-- Timer arc (quarter circle) -->
  <path d="M 64 16 A 48 48 0 0 1 112 64"
        fill="none"
        stroke="#667eea"
        stroke-width="6"
        stroke-linecap="round"/>

  <!-- Center dot -->
  <circle cx="64" cy="64" r="4" fill="#667eea" />
</svg>
```

### Converting SVG to PNG

**Online:**
- https://cloudconvert.com/svg-to-png
- Upload SVG, select output size (128x128, 48x48, 16x16)

**Command Line (requires ImageMagick):**
```bash
# Install ImageMagick
brew install imagemagick  # macOS
apt-get install imagemagick  # Linux

# Convert SVG to PNG at different sizes
convert icon.svg -resize 128x128 icon128.png
convert icon.svg -resize 48x48 icon48.png
convert icon.svg -resize 16x16 icon16.png
```

## Quick Solution

For development/testing, you can use emoji icons:

1. Go to https://favicon.io/emoji-favicons/
2. Search for "🎯" (target emoji)
3. Download the generated favicons
4. Rename to icon16.png, icon48.png, icon128.png

## Final Checklist

- [ ] icon16.png (16x16 pixels)
- [ ] icon48.png (48x48 pixels)
- [ ] icon128.png (128x128 pixels)
- [ ] All icons have transparent background (or white)
- [ ] All icons use the purple gradient color scheme
- [ ] Icons are recognizable at small sizes (16x16)
- [ ] Icons match the FocusBubble brand aesthetic

---

**Note:** Place the final PNG files in the `extension/icons/` directory and they will be automatically copied during the build process.
