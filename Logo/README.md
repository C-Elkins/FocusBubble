# FocusBubble Logo Assets 🫧

This folder contains all branding and logo assets for the FocusBubble project.

## 📁 Available Files

### Main Logos

1. **`focusbubble-logo.svg`** (200x200)
   - Full logo with bubble, timer, and glow effects
   - Best for: Marketing materials, presentations, documentation
   - Features: Gradient fill, glass effect, floating mini bubbles

2. **`focusbubble-logo-text.svg`** (400x100)
   - Horizontal logo with icon + "FocusBubble" text
   - Best for: Website headers, social media banners, email signatures
   - Features: Combined icon and wordmark

3. **`focusbubble-wordmark.svg`** (300x60)
   - Text-only logo without icon
   - Best for: Tight spaces, footer credits, text-heavy designs
   - Features: Gradient text with bubble emoji

### Icons

4. **`focusbubble-icon.svg`** (128x128)
   - Circular icon version
   - Best for: Favicons, app icons, profile pictures
   - Features: Simplified timer design, no background

5. **`focusbubble-icon-rounded.svg`** (128x128)
   - Rounded square icon (iOS/Android style)
   - Best for: Mobile app icons, PWA icons
   - Features: 28px border radius, app-style design

---

## 🎨 Color Palette

The FocusBubble brand uses a gradient color scheme:

```css
/* Primary Gradient */
--indigo: #6366f1  /* Indigo 500 */
--purple: #a855f7  /* Purple 500 */
--pink: #ec4899    /* Pink 500 */

/* Supporting Colors */
--gray-900: #1f2937  /* Dark text */
--white: #ffffff     /* Backgrounds */
```

### Gradient CSS
```css
background: linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%);
```

---

## 📐 Usage Guidelines

### Minimum Sizes
- **Logo with text**: Minimum width 200px
- **Icon only**: Minimum 32x32px
- **Wordmark**: Minimum width 150px

### Clear Space
Maintain clear space around the logo equal to the height of the bubble icon on all sides.

### Don'ts
❌ Don't stretch or distort the logo  
❌ Don't change the gradient colors  
❌ Don't add drop shadows or effects  
❌ Don't place on busy backgrounds without proper contrast  

### Do's
✅ Use on white or light backgrounds for best visibility  
✅ Scale proportionally  
✅ Maintain aspect ratio  
✅ Use SVG format when possible for crisp display  

---

## 🖼️ File Format Reference

### SVG (Scalable Vector Graphics)
- ✅ **Recommended** for web and print
- Scales infinitely without quality loss
- Small file size
- Editable in design software

### Converting to Other Formats

If you need PNG, ICO, or other formats:

**Using Online Tools:**
1. [CloudConvert](https://cloudconvert.com/svg-to-png) - SVG to PNG
2. [Favicon.io](https://favicon.io/favicon-converter/) - SVG to ICO/Favicon
3. [RealFaviconGenerator](https://realfavicongenerator.net/) - Complete favicon package

**Using Command Line (ImageMagick):**
```bash
# Convert to PNG
convert focusbubble-icon.svg -resize 512x512 focusbubble-512.png

# Create favicon
convert focusbubble-icon.svg -resize 32x32 favicon.ico

# Multiple sizes
convert focusbubble-icon.svg -resize 16x16 icon-16.png
convert focusbubble-icon.svg -resize 32x32 icon-32.png
convert focusbubble-icon.svg -resize 180x180 icon-180.png
convert focusbubble-icon.svg -resize 512x512 icon-512.png
```

---

## 📱 Recommended Icon Sizes for Web

### Favicon Sizes
- 16x16 - Browser tab
- 32x32 - Browser tab (Retina)
- 48x48 - Windows site icons

### Apple Touch Icons
- 180x180 - iPhone/iPad (iOS)

### Android Chrome
- 192x192 - Android home screen
- 512x512 - Splash screens

### Microsoft Tiles
- 144x144 - Windows 8/10 tiles

### Social Media
- 1200x630 - Facebook/LinkedIn sharing
- 1024x512 - Twitter card
- 400x400 - Profile pictures

---

## 🚀 Quick Setup for Website

Add these to your `public/index.html`:

```html
<!-- Favicon -->
<link rel="icon" type="image/svg+xml" href="/Logo/focusbubble-icon.svg">
<link rel="alternate icon" type="image/png" href="/favicon.png">

<!-- Apple Touch Icon -->
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">

<!-- Android Chrome -->
<link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png">
<link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png">

<!-- Microsoft Tile -->
<meta name="msapplication-TileImage" content="/mstile-144x144.png">
<meta name="msapplication-TileColor" content="#6366f1">

<!-- Theme Color -->
<meta name="theme-color" content="#6366f1">
```

---

## 🎯 Logo Usage Examples

### In Markdown (README, Docs)
```markdown
![FocusBubble Logo](./Logo/focusbubble-logo.svg)
```

### In HTML
```html
<img src="./Logo/focusbubble-logo-text.svg" alt="FocusBubble" width="300">
```

### In React
```jsx
import logo from './Logo/focusbubble-logo.svg';

function Header() {
  return <img src={logo} alt="FocusBubble" className="w-12 h-12" />;
}
```

### As Background
```css
.hero {
  background-image: url('./Logo/focusbubble-logo.svg');
  background-size: contain;
  background-repeat: no-repeat;
}
```

---

## 🛠️ Editing the Logos

These SVG files can be edited with:

- **Vector Editors:**
  - Adobe Illustrator
  - Figma
  - Inkscape (Free)
  - Sketch
  
- **Code Editors:**
  - VS Code (with SVG extension)
  - Any text editor (SVG is XML-based)

### Quick Color Changes

To change gradient colors, edit the `<linearGradient>` section in any SVG file:

```xml
<linearGradient id="bubbleGradient">
  <stop offset="0%" style="stop-color:#YOUR_COLOR_1" />
  <stop offset="50%" style="stop-color:#YOUR_COLOR_2" />
  <stop offset="100%" style="stop-color:#YOUR_COLOR_3" />
</linearGradient>
```

---

## 📄 License

These logo assets are part of the FocusBubble project and are licensed under the same MIT License as the project.

**Usage Rights:**
- ✅ Use in FocusBubble project and derivatives
- ✅ Use in promotional materials for FocusBubble
- ✅ Modify for personal forks/adaptations
- ❌ Use to impersonate official FocusBubble project
- ❌ Use in competing products without attribution

---

## 👥 Credits

**Created by:** Krubles Team  
**Designer:** FocusBubble Contributors  
**GitHub:** [@C-Elkins](https://github.com/C-Elkins)  

---

## 📞 Questions or Custom Needs?

Need a custom size, format, or variation? Open an issue on the GitHub repository!

**Made with focus by the Krubles Team 🫧**
