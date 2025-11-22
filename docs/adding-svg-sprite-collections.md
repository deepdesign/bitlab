# Complete Guide: Adding SVG Sprite Collections to Pixli

## Table of Contents
1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [Step-by-Step Instructions](#step-by-step-instructions)
4. [SVG File Requirements](#svg-file-requirements)
5. [Automatic Discovery System](#automatic-discovery-system)
6. [Testing & Verification](#testing--verification)
7. [Troubleshooting](#troubleshooting)
8. [Best Practices](#best-practices)

---

## Overview

Pixli supports two types of sprite collections:
- **Primitives**: Code-defined geometric shapes (circle, star, hexagon, etc.)
- **SVG Collections**: Custom SVG files organized in folders (e.g., Christmas sprites)

This guide covers adding new **SVG sprite collections** with custom SVG files.

### How SVG Collections Work

- SVG files are placed in `public/sprites/{collection-name}/*.svg`
- **Collections are automatically discovered** - no code changes needed!
- SVG files are **automatically processed**:
  - ✅ Optimized with SVGO (like SVGOMG)
  - ✅ Frame/background rectangles automatically removed
  - ✅ Path data extracted for direct canvas rendering
  - ✅ ViewBox calculated from actual path bounds
  - ✅ Aspect ratio preserved automatically
- SVG files are loaded and cached automatically
- **Rendering**: SVGs are rendered directly on canvas using `Path2D` (no rasterization artifacts!)
- Sprites are tinted with palette colors and support all animations (rotation, movement, depth of field)
- SVG icons appear in the UI selector, matching the theme (white/black)
- Names are automatically generated from filenames
- Square frames are automatically removed (no visible containers!)

---

## Quick Start

**Adding a new sprite collection is now automatic!**

1. **Create a folder**: `public/sprites/your-collection-name/`
2. **Add SVG files** to the folder
3. **Run the dev server** or build - collections are auto-generated!

That's it! The system automatically:
- ✅ Discovers your collection
- ✅ Generates sprite IDs from filenames
- ✅ Creates display names from filenames
- ✅ Sets up proper paths
- ✅ Optimizes SVGs with SVGO
- ✅ Removes background/frame rectangles automatically
- ✅ Calculates tight viewBox from actual path bounds
- ✅ Extracts path data for direct canvas rendering
- ✅ Removes square frames from icons (no visible containers!)
- ✅ Applies correct coloring (white on canvas, theme-aware in UI)
- ✅ Updates labels when selected
- ✅ Preserves aspect ratio automatically

---

## Prerequisites

Before adding a new collection, ensure you have:

1. **SVG files ready** in a folder structure
2. **SVG files properly formatted** (see requirements below)
3. **Basic understanding** of the file structure

---

## Step-by-Step Instructions

### Step 1: Create Collection Folder

1. **Create a folder** in `public/sprites/` for your collection:
   ```
   public/sprites/
   └── your-collection-name/
       ├── sprite-01.svg
       ├── sprite-02.svg
       └── sprite-03.svg
   ```

   **Folder naming:**
   - ✅ Use lowercase with hyphens: `halloween`, `nature-icons`, `winter-theme`
   - ❌ Avoid spaces or special characters

### Step 2: Add SVG Files

1. **Add your SVG files** to the collection folder

2. **Name your SVG files** descriptively:
   - ✅ Good: `snowflake.svg`, `christmas-tree.svg`, `pumpkin.svg`
   - ✅ Spaces OK: `bauble 01.svg` (will be converted to "Bauble 01" in UI)
   - ❌ Avoid special characters: `sprite@01.svg`

3. **Ensure SVG files meet requirements** (see [SVG File Requirements](#svg-file-requirements) below)

### Step 3: Regenerate Collections (Automatic)

**The system automatically discovers your collection!**

Collections are regenerated automatically when you:
- Run `npm run dev` (runs before dev server starts)
- Run `npm run build` (runs before build)

**Manual regeneration** (if needed):
```bash
npm run generate:collections
```

This scans `public/sprites/` and generates `src/constants/spriteCollections.generated.ts`

### Step 4: Test Your Collection

1. **Start the development server** (if not running):
   ```bash
   npm run dev
   ```

2. **Navigate to the Sprites tab** in the UI

3. **Open the Collection dropdown** and verify your collection appears

4. **Select your collection** and verify sprites appear as buttons

5. **Click a sprite button** and verify:
   - The label updates with the sprite name
   - The canvas renders the SVG sprites
   - Sprites are white (or colored by palette)
   - Sprites animate correctly

---

## SVG File Requirements

### 1. SVG Format

Your SVG files must:
- ✅ Be valid SVG format
- ✅ Have a `viewBox` attribute (recommended)
- ✅ Use `fill` or `stroke` attributes for coloring
- ✅ Be sized appropriately (recommended: 24x24 or square aspect ratio)

**Example good SVG:**
```xml
<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <circle cx="12" cy="12" r="10" fill="black"/>
</svg>
```

### 2. Color Handling

**Important:** SVG files are automatically processed:
- **On Canvas**: SVGs are rendered directly using `Path2D` with **white fill**, then tinted with palette colors using multiply compositing
- **In UI Icons**: SVG fills/strokes are replaced with `currentColor` for theme support

**What this means:**
- You can use any color in your SVG (black, white, colors, etc.)
- The system will convert them automatically
- The original SVG color doesn't matter - it will be white on canvas before palette tinting
- **Direct Path2D rendering** means no rasterization artifacts or square containers!

### 3. Automatic Processing & Frame Removal

**Automatic SVG Processing:**
The system automatically processes all SVG files with:

1. **SVGO Optimization**: Like SVGOMG, removes metadata, simplifies paths, cleans IDs
2. **Frame Detection**: Automatically detects and removes:
   - Full-size background rectangles (matching viewBox dimensions)
   - Clip paths and masks (common in Icons8 SVGs)
   - Boolean shape outer frames (punched-out designs)
3. **Path Bounds Calculation**: Calculates tight bounding box from actual path data
4. **ViewBox Adjustment**: Creates new viewBox that fits the actual content (no padding!)
5. **Path Data Extraction**: Extracts clean path data for direct canvas rendering

**Square frame removal:**
- ✅ Automatically removes background rectangles ≥90% of viewBox size
- ✅ Filters out frame paths that match viewBox dimensions
- ✅ Calculates tight viewBox from content paths only
- ✅ Reconstructs SVG with minimal padding (2% of content size)

**Result:** No visible square containers! Sprites render cleanly with proper aspect ratios.

### 4. File Size & Performance

- ✅ Keep SVG files **under 10KB** for best performance (before SVGO)
- ✅ SVGO automatically optimizes on load (removes metadata, simplifies paths)
- ✅ Use simple paths (avoid overly complex curves)
- ✅ **Direct Path2D rendering** is very efficient (no Image element overhead)
- ✅ SVG processing happens once on load, then cached

### 5. ViewBox & Dimensions

**Automatic ViewBox Handling:**
- The system **automatically calculates** a tight viewBox from your path data
- Original viewBox is used as a fallback if bounds calculation fails
- Non-square viewBoxes are **preserved** (aspect ratio maintained automatically)
- 2% padding is added to prevent edge clipping

**Recommended (Original SVG):**
- Include a viewBox in your source SVG (helps with processing)
- Square viewBox recommended: `viewBox="0 0 24 24"` or `viewBox="0 0 100 100"`
- Non-square viewBoxes work fine (system preserves aspect ratio)

**Processing Result:**
- System creates a tight viewBox that fits only the actual path content
- Adds explicit `width` and `height` attributes matching the viewBox
- Sets `preserveAspectRatio="none"` to prevent square enforcement
- Stores aspect ratio for correct rendering

**Width/Height:**
- Original SVG width/height are ignored after processing
- System uses calculated viewBox dimensions for rendering
- Aspect ratio is stored and used for correct scaling

---

## Automatic Discovery System

### How It Works

1. **Build Script**: `scripts/generate-sprite-collections.js` scans `public/sprites/`
2. **Auto-Generation**: Creates `src/constants/spriteCollections.generated.ts`
3. **Integration**: `spriteCollections.ts` imports the generated collections
4. **No Manual Editing**: Everything is automatic!

### File Structure

```
public/sprites/
└── your-collection/
    ├── sprite-01.svg  ← Just add files here!
    └── sprite-02.svg

scripts/
└── generate-sprite-collections.js  ← Scans and generates

src/constants/
├── spriteCollections.ts  ← Imports generated collections
└── spriteCollections.generated.ts  ← Auto-generated (don't edit!)
```

### Automatic Name Generation

**Filename → Display Name:**
- `snowflake.svg` → "Snowflake"
- `christmas-tree.svg` → "Christmas Tree"
- `bauble 01.svg` → "Bauble 01"
- `sprite_icon.svg` → "Sprite Icon"

**Filename → Sprite ID:**
- `snowflake.svg` → `snowflake`
- `christmas-tree.svg` → `christmas-tree`
- `bauble 01.svg` → `bauble-01` (spaces become hyphens)

### What's Automatic

✅ **Collection Discovery**: Finds all folders in `public/sprites/`  
✅ **Sprite Discovery**: Finds all `.svg` files in each folder  
✅ **ID Generation**: Creates unique IDs from filenames  
✅ **Name Generation**: Creates display names from filenames  
✅ **Path Generation**: Creates correct file paths automatically  
✅ **SVG Processing**: Automatically optimizes with SVGO, removes frames, calculates bounds  
✅ **Path Extraction**: Extracts path data for direct canvas rendering  
✅ **Aspect Ratio**: Automatically preserved from viewBox  
✅ **Icon Rendering**: Automatically removes frames, applies theme colors  
✅ **Canvas Rendering**: Direct Path2D rendering (no square containers!)  
✅ **Color Tinting**: Automatically renders white, then applies palette colors  
✅ **Label Updates**: Automatically updates when sprites are selected  

**No code changes needed!** Just add SVG files to folders.

---

## Testing & Verification

### Visual Testing Checklist

After adding a collection, verify:

- [ ] Collection appears in the Collection dropdown
- [ ] Collection name is properly capitalized (e.g., "Christmas", "Your Collection Name")
- [ ] All sprites appear as icon buttons
- [ ] Sprite icons are visible and properly sized
- [ ] Sprite icons follow theme (white in light mode, black in dark mode)
- [ ] No square frames/outlines visible in sprite icons
- [ ] Clicking a sprite updates the label correctly
- [ ] Canvas renders SVG sprites correctly
- [ ] SVGs appear white on the canvas (before palette tinting)
- [ ] Palette colors apply correctly to SVGs
- [ ] Rotation works with SVG sprites
- [ ] Movement animations work with SVG sprites
- [ ] Depth of field blur works with SVG sprites
- [ ] Scale sliders affect SVG sprite size correctly
- [ ] "Random sprites" mode includes SVG sprites

### Console Testing

1. **Open browser console** (F12)
2. **Check for errors**:
   - No 404 errors for missing SVG files
   - No CORS errors
   - No rendering errors

3. **Verify image loading**:
   - Images should load and cache automatically
   - You may see warnings for images loading on first frame (this is normal)

### Common Issues

**Sprites not appearing:**
- Check file paths match exactly (including spaces)
- Verify files are in `public/sprites/` folder
- Check browser console for 404 errors

**Square frames in icons:**
- System automatically removes background rectangles and frames
- If frames persist, check SVG for complex clipping paths or masks
- Try running SVG through SVGO manually to simplify
- Very complex boolean shapes may need manual cleanup

**SVGs appearing black:**
- This is expected during loading
- Once loaded, they should render white then be tinted
- Check that images are loading correctly

**Collection not appearing:**
- Verify `collectionId` is added to `manualSvgCollections` array
- Check for syntax errors in the array
- Restart development server if needed

---

## Troubleshooting

### Problem: Collection Not Appearing in Dropdown

**Solution:**
1. Check `src/constants/spriteCollections.ts` - is the collection added to `manualSvgCollections`?
2. Verify syntax is correct (commas, brackets, quotes)
3. Restart the development server: `npm run dev`
4. Check browser console for JavaScript errors

### Problem: Sprites Not Loading (404 Errors)

**Solution:**
1. Verify file paths in code match actual file locations:
   ```
   Code:  svgPath: "/sprites/christmas/tree.svg"
   File:  public/sprites/christmas/tree.svg  ✅
   ```
2. Check for typos in filenames (case-sensitive)
3. Check for spaces in filenames - must match exactly
4. Verify files are in `public/` folder, not `src/`

### Problem: SVG Icons Have Square Frames

**Solution:**
1. The system automatically removes frames during processing
2. If frames persist, check SVG for:
   - Complex clipping paths (`<clipPath>`)
   - Masks (`<mask>`)
   - Boolean shapes with `fill-rule="evenodd"`
3. Try running SVG through SVGO manually: https://jakearchibald.github.io/svgomg/
4. The processing pipeline handles most cases automatically - persistent frames are rare
5. Check browser console for processed SVG output (logged for Christmas sprites)

### Problem: SVGs Appearing Wrong Color

**Expected behavior:**
- SVGs are rendered directly using `Path2D` with **white fill**
- Then tinted with palette colors using multiply compositing
- After palette application, they should match palette colors

**If SVGs appear black or wrong:**
1. Check that images are loading (browser console)
2. Wait a few frames for images to load and process
3. Verify path data is extracted correctly (stored on image object)
4. Check browser console for processed SVG output
5. Ensure SVG has valid path data (not just shapes)

### Problem: Sprites Not Selecting

**Solution:**
1. Check that sprite IDs are unique within the collection
2. Verify `setSpriteMode` in `generator.ts` accepts SVG sprite IDs
3. Check browser console for errors
4. Verify the collection ID matches the folder name exactly

---

## Best Practices

### File Organization

1. **Use descriptive folder names:**
   - ✅ `christmas`, `halloween`, `nature`
   - ❌ `collection1`, `new`, `test`

2. **Use consistent naming for sprites:**
   - ✅ `snowflake.svg`, `tree.svg`, `gift.svg`
   - ❌ `sprite1.svg`, `item.svg`, `thing.svg`

3. **Group related sprites:**
   - Keep sprites with a common theme in the same collection
   - Use separate collections for different themes

### SVG Optimization

1. **Before adding SVGs:**
   - **Optional**: Pre-optimize with SVGO (system does this automatically)
   - Include a viewBox attribute (helps with processing)
   - Remove obvious background rectangles if possible (system will catch most)
   - System automatically optimizes on load, so basic SVGs work fine

**Note:** The system automatically processes all SVGs, so minimal preparation is needed!

2. **Design guidelines:**
   - Design for 24x24 or square aspect ratio
   - Keep details simple (they'll be small on canvas)
   - Test at small sizes to ensure visibility

### Code Organization

1. **Keep collections organized:**
   - Add collections in a logical order
   - Group related collections together
   - Add comments for complex collections

2. **Naming conventions:**
   - `collectionId`: lowercase, hyphens OK (e.g., `christmas`, `halloween-night`)
   - `id`: lowercase, hyphens OK, no spaces (e.g., `snowflake`, `christmas-tree`)
   - `name`: title case, spaces OK (e.g., `Snowflake`, `Christmas Tree`)
   - `svgPath`: exact path with `/sprites/` prefix

### Performance

1. **Optimize SVG files:**
   - Keep file sizes small (< 10KB)
   - Use simple paths
   - Remove unnecessary elements

2. **Limit collection size:**
   - Keep collections to reasonable sizes (< 20 sprites)
   - Large collections may slow down UI rendering
   - Consider splitting very large collections

---

## Example: Adding a "Halloween" Collection

Here's a complete example of adding a Halloween sprite collection:

### Step 1: Create Folder Structure
```
public/sprites/
└── halloween/
    ├── pumpkin.svg
    ├── bat.svg
    ├── ghost.svg
    └── witch-hat.svg
```

### Step 2: Add to `spriteCollections.ts`

```typescript
const manualSvgCollections: Array<{
  collectionId: string;
  sprites: Array<{ id: string; name: string; svgPath: string }>;
}> = [
  {
    collectionId: "christmas",
    sprites: [
      // ... existing Christmas sprites
    ]
  },
  // NEW COLLECTION:
  {
    collectionId: "halloween",
    sprites: [
      { id: "pumpkin", name: "Pumpkin", svgPath: "/sprites/halloween/pumpkin.svg" },
      { id: "bat", name: "Bat", svgPath: "/sprites/halloween/bat.svg" },
      { id: "ghost", name: "Ghost", svgPath: "/sprites/halloween/ghost.svg" },
      { id: "witch-hat", name: "Witch Hat", svgPath: "/sprites/halloween/witch-hat.svg" },
    ]
  }
];
```

### Step 3: Test

1. Start dev server: `npm run dev`
2. Go to Sprites tab
3. Select "Halloween" from Collection dropdown
4. Verify all 4 sprites appear as buttons
5. Click each sprite and verify it renders on canvas
6. Verify sprites are white (then tinted by palette)

---

## Summary

To add a new SVG sprite collection:

1. ✅ Create folder: `public/sprites/{collection-name}/`
2. ✅ Add SVG files to the folder
3. ✅ Run `npm run dev` or `npm run build` (collections auto-generate)
4. ✅ Test in browser

**That's it!** Everything is automatic:
- ✅ Collection discovery from folder structure
- ✅ Sprite discovery from SVG files
- ✅ ID and name generation from filenames
- ✅ Path generation
- ✅ SVG optimization with SVGO
- ✅ Automatic frame/background removal
- ✅ Tight viewBox calculation from path bounds
- ✅ Path data extraction for direct rendering
- ✅ Image loading and caching
- ✅ **Direct Path2D rendering** (no square containers!)
- ✅ Canvas rendering with proper coloring (white → palette colors)
- ✅ UI icon display with theme support (white/black)
- ✅ Frame removal from icons (automatic!)
- ✅ Aspect ratio preservation
- ✅ All animations (rotation, movement, depth of field)
- ✅ Label updates when selected

---

## Related Documentation

- [Sprite Shapes Guide](./sprite-shapes.md) - For adding code-defined primitive shapes
- [Color Palettes Guide](./adding-color-palettes.md) - For adding color palettes

---

## Quick Reference

### Required File Structure
```
public/
└── sprites/
    └── {collection-name}/      ← Just create folder
        ├── sprite-01.svg       ← Add SVG files
        ├── sprite-02.svg
        └── ...
```

### No Code Changes Needed!

The system automatically:
- Discovers collections from folder names
- Generates IDs from filenames (lowercase, hyphens)
- Generates names from filenames (title case)
- Generates paths automatically
- Handles spaces in filenames correctly

### Manual Regeneration (if needed)
```bash
npm run generate:collections
```

This regenerates `src/constants/spriteCollections.generated.ts` from your file structure.

### SVG Requirements
- ✅ Valid SVG format
- ✅ Has viewBox attribute (recommended - helps with processing)
- ✅ Any color (will be converted to white on canvas automatically)
- ✅ Background rectangles OK (auto-removed during processing)
- ✅ Any aspect ratio OK (preserved automatically)
- ✅ Complex paths OK (SVGO automatically optimizes)
- ✅ File size < 10KB recommended (before optimization)

### Automatic Processing
All SVGs are automatically processed on load:
1. **SVGO optimization** - removes metadata, simplifies paths
2. **Frame detection** - removes background rectangles and frames
3. **Bounds calculation** - calculates tight viewBox from path data
4. **Path extraction** - extracts clean path data for direct rendering
5. **Aspect ratio storage** - preserves correct aspect ratio

**Result:** Clean rendering with no visible frames or containers!

---

**Last Updated:** 2025-01-16  
**Version:** 1.0.9

## Implementation Details

### SVG Processing Pipeline

When an SVG is loaded, it goes through this pipeline:

1. **SVGO Optimization** (`spriteImageLoader.ts`)
   - Removes metadata, empty elements, unused definitions
   - Simplifies paths and cleans IDs
   - Handles complex SVG structures (clipping paths, masks)

2. **Frame Detection & Removal**
   - Detects background rectangles ≥90% of viewBox size
   - Filters out frame paths matching viewBox dimensions
   - Handles boolean shapes with `fill-rule="evenodd"`

3. **Path Bounds Calculation**
   - Uses `svg-path-bounds` library for accurate bounds
   - Calculates tight bounding box from actual path data
   - Excludes filtered frame paths from bounds

4. **ViewBox Reconstruction**
   - Creates new viewBox that tightly fits content
   - Adds 2% padding to prevent edge clipping
   - Sets `preserveAspectRatio="none"` and explicit width/height

5. **Path Data Extraction**
   - Extracts path data string from processed SVG
   - Stores on image object for direct canvas rendering

6. **Canvas Rendering** (`generator.ts`)
   - Uses `Path2D` to render path directly on canvas
   - Applies correct scaling and translation from viewBox
   - Tints with palette colors using multiply compositing
   - **No Image element rasterization** - eliminates square containers!

### Key Files

- `src/lib/services/spriteImageLoader.ts` - SVG loading and processing
- `src/generator.ts` - Canvas rendering (Path2D direct rendering)
- `scripts/generate-sprite-collections.js` - Collection discovery
- `src/constants/spriteCollections.generated.ts` - Auto-generated collections

---

## Automatic Discovery Details

### Build Integration

The collection generation script runs automatically:
- **Before dev**: `predev` hook runs `generate:collections`
- **Before build**: `prebuild` hook runs `generate:collections`

This ensures collections are always up-to-date.

### Generated File

`src/constants/spriteCollections.generated.ts` is auto-generated and should:
- ✅ Be committed to git (so builds work without running script)
- ❌ Not be edited manually (will be overwritten)

### Script Location

`scripts/generate-sprite-collections.js` - Node.js script that:
1. Scans `public/sprites/` for folders
2. Finds all `.svg` files in each folder
3. Generates collection definitions
4. Writes `spriteCollections.generated.ts`

### Customization

If you need custom behavior:
- Edit `scripts/generate-sprite-collections.js`
- Run `npm run generate:collections` to regenerate
- Commit the updated generated file

