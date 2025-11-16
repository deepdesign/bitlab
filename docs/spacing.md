# Complete Guide: Spacing System in Pixli

## Table of Contents
1. [Project Overview](#project-overview)
2. [Spacing Token System](#spacing-token-system)
3. [Spacing Patterns by Area](#spacing-patterns-by-area)
4. [Component-Level Spacing](#component-level-spacing)
5. [Responsive Spacing](#responsive-spacing)
6. [Current Inconsistencies](#current-inconsistencies)
7. [Recommended Improvements](#recommended-improvements)
8. [Implementation Guide](#implementation-guide)
9. [Testing & Verification](#testing--verification)

---

## Project Overview

**Pixli** uses Tailwind CSS spacing tokens consistently throughout the application. This document provides a complete audit of all spacing patterns and recommendations for consistency.

### Tailwind Spacing Scale

Tailwind uses a 4px base unit system:
- `spacing.1` = 4px
- `spacing.2` = 8px
- `spacing.3` = 12px
- `spacing.4` = 16px
- `spacing.5` = 20px
- `spacing.6` = 24px
- `spacing.7` = 28px
- `spacing.8` = 32px

All spacing in Pixli should use `theme("spacing.n")` for consistency.

---

## Spacing Token System

### Layout Container Spacing

#### Main Container (`.app-main`)
- **Padding (horizontal)**: `spacing.6` (24px) - Both sides
- **When stacked**: Locked at `spacing.6` (24px) - Never collapses

#### Header (`.app-header`)
- **Padding (horizontal)**: `spacing.6` (24px) - Both sides
- **Padding (top)**: `spacing.5` (20px)
- **Padding (bottom)**: `spacing.5` (20px)
- **Gap (internal)**: `spacing.5` (20px) - Between logo and toolbar
- **Mobile (max-width: 768px)**:
  - Padding (horizontal): `spacing.4` (16px)
  - Padding (top): `spacing.5` (20px)
- **Very small (max-width: 800px)**: Padding (horizontal): `spacing.2` (8px)
- **When stacked**: Locked at `spacing.6` (24px) horizontal padding

#### Footer (`.app-footer`)
- **Padding (horizontal)**: `spacing.6` (24px) - Both sides
- **Padding (top)**: `spacing.2` (8px)
- **Padding (bottom)**: `spacing.5` (20px) - Internal bottom padding only
- **Gap (internal)**: `spacing.3` (12px) - Between logo and text
- **Mobile**: Padding (horizontal): `spacing.2` (8px)
- **Mobile variant (`.app-footer--mobile`)**:
  - Padding (horizontal): `spacing.4` (16px)
  - Padding (top): `spacing.2` (8px)
  - Padding (bottom): `spacing.5` (20px)
  - Gap: `spacing.2` (8px)

#### Footer Frame (`.app-frame--footer`)
- **Margin (top)**: 64px (NOT a spacing token - should be standardized)

---

## Spacing Patterns by Area

### Cards

#### Card Base (`.panel`, `.control-card`, `.motion-card`, `.utility-card`, `.canvas-card`)
- **Padding (horizontal)**: `spacing.5` (20px) - Both sides
- **Padding (vertical)**: `spacing.5` (20px) - Top and bottom
- **Gap (internal)**: `spacing.4` (16px) - Between child elements
- **When stacked**: Locked at `spacing.5` (20px) - Never collapses

#### Canvas Card Shell
- **Gap**: `spacing.6` (24px) - Between canvas and status bar

#### Panel Footer (`.panel-footer`)
- **Margin (top)**: `spacing.5` (20px)
- **Gap**: `spacing.3` (12px) - Between buttons

### Layout Columns

#### App Layout (`.app-layout`)
- **Gap**: `spacing.5` (20px) - Between columns (mirrors card padding)
- **Small canvas**: `spacing.5` (20px) - Locked
- **Studio layout**: `spacing.6` (24px) - When not small-canvas
- **Mobile (max-width: 768px)**: `spacing.4` (16px) - When not small-canvas

#### Display Column (`.display-column`)
- **Gap**: `spacing.6` (24px) - Between canvas and controls

#### Control Column (`.control-column`)
- **Small canvas gap**: `spacing.6` (24px) - Internal gap for panel spacing

### Sections

#### Section (`.section`)
- **Gap**: `spacing.5` (20px) - Between child elements
- **Spaced variant (`.section--spaced`)**: Margin (top): `spacing.8` (32px)
- **Section + Section**: Margin (top): `0` - No extra margin between sections
- **Touch devices**: Gap: `spacing.6` (24px), Section + Section: Margin (top): `spacing.6` (24px)

#### Section Divider (`.section-divider`)
- **Margin (top)**: `spacing.5` (20px) - Gap between slider and divider
- **Margin (bottom)**: `spacing.1` (4px)
- **Margin (horizontal)**: `-spacing.5` (negative 20px) - Extends to card edges

#### Section Title (`.section-title`)
- **Margin**: `0` - No margin, relies on parent gap

#### Section Hint (`.section-hint`)
- **Margin (top)**: `-spacing.1` (negative 4px) - Pulls up to attach to title

### Control Fields

#### Control Field (`.control-field`)
- **Gap**: `spacing.3` (12px) - Between label and component
- **Touch devices**: Gap: `spacing.4` (16px)
- **Touch devices**: Control Field + Control Field: Margin (top): `spacing.5` (20px)

#### Control Field Variants
- **Spaced (`.control-field--spaced`)**: Margin (bottom): `spacing.5` (20px)
- **Rotation (`.control-field--rotation`)**: Margin (bottom): `spacing.1 / 2` (2px)
- **Spaced Top (`.control-field--spaced-top`)**: Margin (top): `spacing.2` (8px)

#### Control Grid (`.control-grid`)
- **Gap**: `spacing.5` (20px) - Between grid items

### Labels and Headings

#### Field Heading (`.field-heading`)
- **Gap**: `spacing.2` (8px) - Between label and value

#### Field Heading Left (`.field-heading-left`)
- **Gap**: `spacing.1` (4px) - Between label text and tooltip icon

#### Field Label (`.field-label`)
- **Margin**: Inherited from parent gap - No direct margin

#### Sprite Icon Buttons (`.sprite-icon-buttons`)
- **Margin (top)**: `0`
- **Margin (bottom)**: `0`
- **Child gap**: `spacing.2` (8px) - Between icon buttons
- **Note**: Margin-top removed to avoid double spacing with parent

### Switch Rows

#### Switch Row (`.switch-row`)
- **Gap**: `spacing.3` (12px) - Between switch and label
- **Note**: Some instances use inline `style={{ gap: "0.75rem" }}` (12px) - Should use spacing token

### Select Components

#### Control Select With Lock (`.control-select-with-lock`)
- **Gap**: `spacing.2` (8px) - Between select and lock button

#### Field Heading (within selects)
- **Gap**: `spacing.2` (8px) - Between label and value display

### Tabs

#### Retro Tabs (`.retro-tabs`)
- **Gap**: `spacing.3` (12px) - Between tab buttons
- **Margin (bottom)**: `spacing.7` (28px) - Below tabs
- **Mobile (max-width: 768px)**: Gap: `spacing.1.5` (6px), Margin (bottom): `spacing.5` (20px)

#### Retro Tab (`.retro-tab`)
- **Padding (horizontal)**: `spacing.4` (16px)
- **Padding (vertical)**: `spacing.2` (8px)
- **Mobile**: Padding (horizontal): `spacing.1.5` (6px), Padding (vertical): `spacing.2` (8px)
- **Touch devices**: Padding (horizontal): `spacing.5` (20px), Padding (vertical): `spacing.3` (12px)

### Sliders

#### Control Slider (`.control-slider`)
- **Gap**: `spacing.2` (8px) - Between track and value display

#### Rotation Slider Wrapper (`.rotation-slider-wrapper`)
- **Margin (top)**: `0`
- **Margin (bottom)**: `spacing.6` (24px) - Below slider

---

## Component-Level Spacing

### Buttons

#### Button Groups
- **Gap**: Varies by context
- **Icon buttons**: Gap: `spacing.2` (8px) when grouped

#### Header Icon Buttons
- **Gap**: `spacing.2` (8px) - Between buttons in header actions
- **Touch devices**: Minimum 48px × 48px touch target

### Headers

#### Header Toolbar (`.header-toolbar`)
- **Gap**: `spacing.3` (12px) - Between toolbar items
- **When stacked**: Gap: `spacing.3` (12px) - Locked

#### Header Actions (`.header-actions`)
- **Gap**: `spacing.2` (8px) - Between action buttons
- **When stacked**: Gap: `spacing.2` (8px) - Locked

#### Header Overflow
- **Divider**: Uses border/separator with appropriate spacing
- **Content gap**: `spacing.2` (8px) - Between overflow items

### Modals

#### Modal Spacing Rules (Authoritative)

Use these tokens for all modals to ensure consistent rhythm.

- Inside padding (modal content box): `spacing.5` (all sides)
- Header row padding (x/y): `spacing.3`
- Header → content gap: `spacing.4`
- Tabs bottom margin: `spacing.4`
- Image export tab
  - Tabs → Preview: `spacing.4`
  - Preview → Advanced options: `spacing.4`
  - Advanced options (Accordion.Content) bottom spacing: `0` (no implicit gap)
  - Advanced options → Primary CTA: `spacing.4`
- Movie export tab
  - Tabs → Section title: `spacing.4`
  - Title → Fields row: `spacing.3`
  - Fields row internal gap: `spacing.3`
  - Fields → Primary CTA: `spacing.4`
  - CTA → Tip text: `spacing.2`
- Labels to inputs: `spacing.2`

Implementation notes
- Normalize section spacing inside export modals to avoid hidden vertical gaps from the base `.section`:
  - `.export-modal .section { gap: 0; }`
  - Prefer explicit `mt-[theme(spacing.n)]` between stacked blocks
- Enforce compact inputs row spacing:
  - `.export-modal .export-dimension-inputs-compact { gap: theme("spacing.3"); }`
- Zero bottom spacing on the last content section when followed by a primary CTA:
  - Set container bottom to `0`, then apply explicit `mt-[theme(spacing.4)]` on the CTA

#### Modal Overlays
- **Padding**: `spacing.4` (16px) typically
- **Gap**: `spacing.3` to `spacing.5` - Varies by modal

#### Modal Content
- **Padding**: `spacing.4` to `spacing.6` - Varies by modal
- **Section gap**: `spacing.5` (20px) typically

---

## Responsive Spacing

### Mobile Breakpoints

#### max-width: 768px
- **Layout gap**: `spacing.4` (16px) - Reduced from `spacing.5`
- **Small canvas**: Remains `spacing.5` (20px) - Locked
- **Header padding**: `spacing.4` (16px) horizontal
- **Tabs gap**: `spacing.1.5` (6px)
- **Tabs margin-bottom**: `spacing.5` (20px)

#### max-width: 800px
- **Header/footer padding**: `spacing.2` (8px) horizontal

#### max-width: 760px
- **Header/footer padding**: `spacing.2` (8px) horizontal

#### max-width: 640px
- **Header toolbar gap**: `spacing.3` (12px)

#### max-width: 420px
- **Header gap**: `spacing.2` (8px)

### Touch Devices (pointer: coarse)

#### Control Fields
- **Gap**: `spacing.4` (16px) - Increased from `spacing.3`
- **Control Field + Control Field**: Margin (top): `spacing.5` (20px)

#### Sections
- **Gap**: `spacing.6` (24px) - Increased from `spacing.5`
- **Section + Section**: Margin (top): `spacing.6` (24px)

---

## Current Inconsistencies

### 1. **Footer Frame Margin**
- **Issue**: `.app-frame--footer` uses `margin-top: 64px` (not a spacing token)
- **Location**: `src/index.css` line 1366
- **Recommendation**: Should use `spacing.16` (64px) or convert to spacing token

### 2. **Logo Margin Top**
- **Issue**: `.app-logo-button` uses `margin-top: 64px` (not a spacing token)
- **Location**: `src/index.css` line 1411
- **Recommendation**: Should use `spacing.16` (64px) or remove (handled by header padding)

### 3. **Inline Style Spacing**
- **Issue**: `FxControls.tsx` uses `style={{ gap: "0.75rem" }}` (12px)
- **Location**: `src/components/ControlPanel/FxControls.tsx` line 125
- **Recommendation**: Should use `className="switch-row"` with CSS class using `spacing.3`

### 4. **Negative Margin Calculations**
- **Issue**: Some spacing uses `calc(theme("spacing.1") * -1)` instead of direct negative values
- **Location**: `.section-hint`, `.control-field--rotation`
- **Recommendation**: Consider creating negative spacing utility classes

### 5. **Mixed Spacing Values**
- **Issue**: Some areas use `spacing.7` (28px) while most use multiples of 4px
- **Location**: `.retro-tabs` margin-bottom
- **Recommendation**: Consider if `spacing.7` should be `spacing.6` or `spacing.8`

### 6. **Touch Device Spacing**
- **Issue**: Touch device spacing differs significantly from default
- **Recommendation**: Ensure touch spacing is intentional and documented

---

## Recommended Improvements

### Priority 1: Critical Consistency

#### 1. Standardize All Non-Token Spacing
```css
/* Before */
.app-frame--footer {
  margin-top: 64px;
}

.app-logo-button {
  margin-top: 64px;
}

/* After */
.app-frame--footer {
  margin-top: theme("spacing.16"); /* 64px */
}

/* Or better - remove margin, use header padding */
.app-logo-button {
  margin-top: 0; /* Use header padding-top instead */
}
```

#### 2. Remove Inline Style Spacing
```tsx
// Before (FxControls.tsx)
<div className="switch-row" style={{ gap: "0.75rem" }}>

// After - ensure .switch-row uses spacing token
<div className="switch-row">
```

Ensure `.switch-row` class has:
```css
.switch-row {
  gap: theme("spacing.3"); /* 12px = 0.75rem */
}
```

#### 3. Create Negative Spacing Utilities
```css
/* Add to index.css */
.margin-top-negative-1 {
  margin-top: calc(theme("spacing.1") * -1);
}

.margin-bottom-half-1 {
  margin-bottom: calc(theme("spacing.1") / 2);
}
```

### Priority 2: Spacing Token Validation

#### 4. Audit All Hardcoded Values
- Search for all `px`, `rem`, `em` values in CSS
- Replace with appropriate spacing tokens
- Document any exceptions (e.g., border widths, font sizes)

#### 5. Standardize Touch Device Spacing
- Review all touch device spacing increases
- Ensure they follow a consistent pattern
- Document the rationale for each increase

### Priority 3: Documentation & Organization

#### 6. Create Spacing Reference Sheet
- Quick reference table of all spacing tokens
- Common use cases for each token
- Visual examples

#### 7. Add Spacing Comments
- Add inline comments explaining spacing choices
- Reference related spacing patterns
- Note any responsive variations

---

## Implementation Guide

### Step 1: Audit Current Spacing

1. **Search for hardcoded spacing**:
   ```bash
   # Search for px values
   grep -r "px" src/index.css | grep -v "/*" | grep -v "*/"
   
   # Search for rem values that might be spacing
   grep -r "rem" src/index.css | grep "gap\|margin\|padding"
   ```

2. **Identify components using inline styles**:
   ```bash
   grep -r "style.*gap\|style.*margin\|style.*padding" src/components
   ```

3. **Document all spacing variations**:
   - Create a spreadsheet or document listing:
     - Component/class name
     - Current spacing value
     - Spacing token equivalent
     - Responsive variations

### Step 2: Fix Critical Issues

1. **Replace hardcoded footer margin**:
   ```css
   /* src/index.css line 1366 */
   .app-frame--footer {
     margin-top: theme("spacing.16"); /* 64px - space between footer and content */
   }
   ```

2. **Remove logo margin-top**:
   ```css
   /* src/index.css line 1411 */
   .app-logo-button {
     /* Remove margin-top: 64px; - header padding handles this */
     margin-top: 0;
   }
   ```

3. **Fix inline switch-row gap**:
   ```css
   /* Ensure .switch-row has gap defined */
   .switch-row {
     gap: theme("spacing.3"); /* 12px = 0.75rem */
   }
   ```
   
   Then remove inline style from `FxControls.tsx`.

### Step 3: Create Spacing Utilities

Add to `src/index.css`:
```css
/* Negative Spacing Utilities */
.spacing-negative-1 {
  margin-top: calc(theme("spacing.1") * -1);
}

.spacing-negative-2 {
  margin-top: calc(theme("spacing.2") * -1);
}

.spacing-half-1 {
  margin-bottom: calc(theme("spacing.1") / 2);
}
```

### Step 4: Standardize Responsive Spacing

Create a clear pattern for responsive spacing:
```css
/* Base spacing */
.component {
  gap: theme("spacing.3");
}

/* Mobile adjustments */
@media (max-width: 768px) {
  .component {
    gap: theme("spacing.4"); /* Slightly larger for touch */
  }
}

/* Touch device adjustments */
@media (pointer: coarse) {
  .component {
    gap: theme("spacing.4"); /* Larger for easier touch */
  }
}
```

---

## Testing & Verification

### Visual Testing Checklist

1. **Desktop Layout (1200px+)**
   - [ ] Header spacing matches cards
   - [ ] Footer spacing consistent
   - [ ] Cards align properly
   - [ ] Sections have consistent gaps
   - [ ] Controls are evenly spaced

2. **Tablet Layout (768px - 1200px)**
   - [ ] Spacing adapts appropriately
   - [ ] Cards maintain alignment
   - [ ] Touch targets are adequate

3. **Mobile Layout (< 768px)**
   - [ ] Stacked layout spacing is correct
   - [ ] Header/header spacing is `spacing.5`
   - [ ] Logo is appropriately sized
   - [ ] Cards maintain padding
   - [ ] Touch targets meet 44px minimum

4. **Touch Devices**
   - [ ] All interactive elements are 44px minimum
   - [ ] Spacing is adequate for touch
   - [ ] No spacing feels cramped

### Automated Testing

1. **CSS Lint Rules**:
   - Enforce `theme("spacing.n")` usage
   - Flag hardcoded px/rem values in spacing properties
   - Warn on inline style spacing

2. **Visual Regression Testing**:
   - Capture screenshots at key breakpoints
   - Compare before/after spacing changes
   - Verify spacing consistency

### Manual Verification Steps

1. **Open DevTools**
   - Inspect spacing on all major components
   - Verify spacing tokens are used
   - Check computed values match expectations

2. **Responsive Testing**
   - Resize browser window through all breakpoints
   - Verify spacing transitions smoothly
   - Check for layout shifts

3. **Component Inspection**
   - Review each control panel tab
   - Check modals and overlays
   - Verify header/footer spacing

---

## Spacing Reference Quick Sheet

### Common Spacing Tokens

| Token | Pixels | Use Case |
|-------|--------|----------|
| `spacing.1` | 4px | Tight spacing, tooltip icon to label |
| `spacing.2` | 8px | Close spacing, icon buttons, switch row gap |
| `spacing.3` | 12px | Standard field gap, toolbar items |
| `spacing.4` | 16px | Card internal gap, section elements |
| `spacing.5` | 20px | Card padding, section gaps, divider spacing |
| `spacing.6` | 24px | Container padding, column gaps, display column |
| `spacing.7` | 28px | Tab margin-bottom (consider standardizing) |
| `spacing.8` | 32px | Large section spacing variant |

### Spacing Patterns by Context

#### **Container Padding**
- Main container: `spacing.6` (24px)
- Cards: `spacing.5` (20px)

#### **Internal Gaps**
- Cards: `spacing.4` (16px)
- Sections: `spacing.5` (20px)
- Control fields: `spacing.3` (12px)
- Switch rows: `spacing.3` (12px)

#### **Component Spacing**
- Between sections: Use divider with `spacing.5` top margin
- Between controls: Use parent gap
- Label to component: `spacing.3` (12px) via control-field gap

#### **Responsive Adjustments**
- Mobile: Generally reduce by one step (e.g., `spacing.6` → `spacing.4`)
- Touch: Increase by one step (e.g., `spacing.3` → `spacing.4`)

---

## Summary

Pixli uses a consistent spacing system based on Tailwind's 4px base unit. The primary spacing tokens are:
- **spacing.5** (20px) - Most common for cards, sections
- **spacing.6** (24px) - Containers, column gaps
- **spacing.3** (12px) - Field gaps, toolbars
- **spacing.4** (16px) - Card internal gaps

**Key Improvements Needed**:
1. Replace hardcoded `64px` values with `spacing.16`
2. Remove inline style spacing from components
3. Standardize all spacing to use tokens
4. Document responsive spacing patterns
5. Create negative spacing utilities where needed

This spacing system ensures visual consistency and makes the design maintainable and scalable.

