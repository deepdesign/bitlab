# Custom Palette from Image Feature

## Overview
Allow users to create custom color palettes by uploading images or pasting image URLs. Extract 5 dominant colors, store in localStorage (max 5 custom palettes), and integrate seamlessly with existing palette system.

## Architecture

### Storage Layer
**File: `src/lib/customPaletteStorage.ts`** (NEW)
- Similar pattern to `presetStorage.ts`
- Store custom palettes in localStorage with key `"bitlab-custom-palettes"`
- Max 5 custom palettes
- Functions: `getAllCustomPalettes()`, `saveCustomPalette()`, `updateCustomPalette()`, `deleteCustomPalette()`
- Custom palette interface extends `Palette` with optional `imageUrl` and `createdAt`/`updatedAt` timestamps
- ID format: `"custom-{timestamp}-{random}"` to avoid conflicts with built-in palettes

### Image Processing
**File: `src/lib/imageColorExtractor.ts`** (NEW)
- Function: `extractColorsFromImage(image: File | string): Promise<string[]>`
- For File uploads: Use `FileReader` → create `Image` → draw to Canvas → extract pixels
- For URLs: Fetch image (handle CORS errors gracefully) → same process
- Algorithm: Use k-means clustering or simple frequency-based extraction to get 5 dominant colors
- Return array of 5 hex color strings
- Handle errors: invalid image, CORS blocked, image too large, etc.

### UI Components
**File: `src/components/CustomPaletteManager.tsx`** (NEW)
- Modal component matching `PresetManager.tsx` and `ExportModal.tsx` UI patterns exactly
- Props: `onClose`, `onPaletteCreated` (callback when palette is added/updated)
- UI Structure (matching existing modals):
  - Overlay: `custom-palette-manager-overlay` className (fixed, inset-0, z-index 1000, click to close)
  - Card: `custom-palette-manager-modal` className (width 90%, max-width 500px, max-height 90vh)
  - Header: `custom-palette-manager-header` with:
    - Title: "Custom Palettes" (h2, matching `preset-manager-title` style - 1rem, uppercase, letter-spacing 0.1em)
    - Close button: × character (matching `preset-manager-close` style - 32x32px, flex center)
  - Content: `custom-palette-manager-content` (flex flex-col, gap spacing-5)
- Features organized in sections (matching `.section` and `.section-title` patterns):
  - **Section 1: "Create from Image"**
    - File upload: Hidden input + styled Button (like PresetManager import pattern - `preset-import-input` + Button)
    - URL input: Text input matching `preset-name-input` style (same as name input)
    - Name input: Text input matching `preset-name-input` style
    - "Extract Colors" button (disabled when no image/name)
    - Loading state while extracting (show spinner or "Extracting..." text)
    - Color preview squares (8x8px) after extraction (matching dropdown preview style)
    - "Save" button (disabled when at max 5 palettes, matching Button size="md" pattern)
    - Error messages (matching `preset-error` style with role="alert")
  - **Section 2: "Your Custom Palettes"**
    - List of existing custom palettes (0-5)
    - Each palette shows: name, color preview squares (8x8px), edit/delete buttons
    - Empty state: "No custom palettes" (matching `preset-empty` style)
    - Edit: Click to edit name inline or re-extract colors
    - Delete: Button with confirmation (matching PresetManager delete pattern - confirm dialog)
    - Show count: "X / 5 palettes" (subtle text, matching preset count pattern)

**File: `src/App.tsx`** (MODIFY)
- Add button/icon next to palette selector to open CustomPaletteManager modal
- Integrate custom palettes into `PALETTE_OPTIONS`:
  - Merge built-in palettes with custom palettes
  - Add custom palettes to "Custom" category (appears after all built-in categories)
  - Ensure custom palettes have `category: "Custom"` and `colors` array
- Update `PALETTE_OPTIONS` to be reactive (use state/hook) so it updates when custom palettes change
- Pass custom palettes to `ControlSelect` component

### Integration Points
**File: `src/data/palettes.ts`** (MODIFY)
- Export function: `getAllPalettes(): Palette[]` that merges built-in + custom palettes
- Keep existing `palettes` array as built-in only
- Update `getPalette(id)` to check custom palettes if not found in built-in
- Update `getRandomPalette()` to include custom palettes

**File: `src/data/gradients.ts`** (NO CHANGES NEEDED)
- Already uses `getGradientsForPalette()` which will work with custom palette IDs
- `generatePaletteGradients()` will automatically generate gradients for custom palettes

**File: `src/generator.ts`** (NO CHANGES NEEDED)
- Already uses palette system generically, will work with custom palettes

**File: `src/App.tsx`** - Palette Options Generation (MODIFY)
- Change `PALETTE_OPTIONS` from static IIFE to reactive hook/state
- Use `useMemo` or `useState` to merge built-in + custom palettes
- Include "Custom" in `categoryOrder` array
- Trigger re-render when custom palettes change

## Implementation Details

### Color Extraction Algorithm
- Load image into canvas (max 200x200 for performance)
- Get ImageData pixels
- Option 1 (Simple): Sample pixels at regular intervals, group by color similarity, pick 5 most frequent
- Option 2 (Better): Use k-means clustering to find 5 dominant color clusters
- Convert RGB to hex strings
- Ensure colors are distinct (minimum distance between colors)

### CORS Handling
- Try to load image from URL
- If CORS error: Show user-friendly message "Image cannot be loaded due to security restrictions. Please upload the image file instead."
- Provide upload button as fallback
- For uploaded files: No CORS issues (local file access)

### UI/UX Flow
1. User clicks "Add Custom Palette" button (icon button near palette selector)
2. Modal opens showing:
   - List of existing custom palettes (0-5)
   - "Add New" section with:
     - File upload button
     - OR URL input field
     - Name input field
     - "Extract Colors" button
   - Loading state while extracting colors
   - Preview of extracted colors
   - "Save" button
3. After save: Modal closes, palette appears in dropdown under "Custom" category
4. Edit: Click palette in list → edit name or re-extract
5. Delete: Click delete icon → confirm → remove

### Error Handling
- Invalid image format
- Image too large (suggest resizing)
- CORS blocked (suggest upload)
- Network error (for URLs)
- Storage full (localStorage quota exceeded)
- Max palettes reached (disable add, show message)

## File Changes Summary

**New Files:**
- `src/lib/customPaletteStorage.ts` - Storage utilities
- `src/lib/imageColorExtractor.ts` - Color extraction from images
- `src/components/CustomPaletteManager.tsx` - Modal UI component

**Modified Files:**
- `src/data/palettes.ts` - Add `getAllPalettes()` function, update helpers
- `src/App.tsx` - Make `PALETTE_OPTIONS` reactive, add CustomPaletteManager button, integrate custom palettes

**No Changes Needed:**
- `src/data/gradients.ts` - Already works generically
- `src/generator.ts` - Already works generically
- `src/index.css` - Styles already support category grouping (may need to add custom-palette-manager styles matching preset-manager patterns)

## Testing Checklist
- Upload image file → extracts 5 colors → saves → appears in dropdown
- Paste image URL → extracts colors → saves → appears in dropdown
- CORS blocked URL → shows error → upload works as fallback
- Edit custom palette name → updates in dropdown
- Delete custom palette → removed from dropdown
- Max 5 palettes → "Add" button disabled
- Custom palettes appear in "Custom" category
- Gradients generated automatically for custom palettes
- Canvas backgrounds work with custom palettes
- Random palette selection includes custom palettes

