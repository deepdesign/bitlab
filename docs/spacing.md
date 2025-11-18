# Complete Guide: Spacing System in Pixli

## Spacing Taxonomy

All spacing labels follow a consistent taxonomy pattern:

```
[component].[subcomponent].[property].[direction].[device]
```

### Properties
- **`gap`** - CSS `gap` property (flexbox/grid spacing between children) - *no direction component*
- **`margin`** - CSS `margin` property (space outside element) - *requires direction*
- **`padding`** - CSS `padding` property (space inside element) - *requires direction*

### Directions (for margin/padding only)
- `top` - Top margin/padding
- `bottom` - Bottom margin/padding
- `left` - Left margin/padding
- `right` - Right margin/padding
- `inline` - Horizontal margin/padding (left + right)
- `block` - Vertical margin/padding (top + bottom)

### Examples
- `section.gap.desktop` - Gap between section children (no direction for gap)
- `section.margin.bottom.desktop` - Margin at bottom of section
- `section.heading.margin.top.desktop` - Margin above section heading
- `header.padding.inline.desktop` - Horizontal padding inside header
- `section.control.label.margin.left.desktop` - Negative margin-left on tooltip icon

**Note:** Every spacing label explicitly includes the property type (`gap`, `margin`, or `padding`) to make it clear which CSS property is being used. This helps engineers understand the implementation.

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Spacing Token System](#spacing-token-system)
3. [Spacing Patterns by Area](#spacing-patterns-by-area)
4. [Control Card Spacing Labels](#control-card-spacing-labels)
5. [Component-Level Spacing](#component-level-spacing)
6. [Responsive Spacing](#responsive-spacing)
7. [Current Inconsistencies](#current-inconsistencies)
8. [Recommended Improvements](#recommended-improvements)
9. [Implementation Guide](#implementation-guide)
10. [Testing & Verification](#testing--verification)

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

## Layout-Level Spacing Labels

This section defines all spacing labels for layout containers, header, footer, main content, and cards. Labels include `.desktop` and `.mobile` suffixes where values differ between layouts, even when values are identical to allow for future independent modifications.

### Header Spacing

#### Header Container
- **header.padding.top.desktop** - Space between the top of the viewport and the header content (desktop: `spacing.7`)
- **header.padding.top.mobile** - Space between the top of the viewport and the header content (mobile: `spacing.5`)
- **header.padding.bottom.desktop** - Space between the header content and the main content area below (desktop: `spacing.5`)
- **header.padding.bottom.mobile** - Space between the header content and the main content area below (mobile: `spacing.5`)
- **header.padding.inline.desktop** - Horizontal padding on the left and right sides of the header (desktop: `spacing.6`)
- **header.padding.inline.mobile** - Horizontal padding on the left and right sides of the header (mobile: `spacing.4`)
- **header.padding.inline.small** - Horizontal padding on very small screens (max-width: 800px: `spacing.2`)
- **header.gap.desktop** - Space between the logo and the toolbar (theme controls, help button) (desktop: `spacing.5`)
- **header.gap.mobile** - Space between the logo and the toolbar (theme controls, help button) (mobile: `spacing.5`)
- **header.min-height.desktop** - Minimum height of the header container (desktop: `spacing.20` = 80px)
- **header.min-height.mobile** - Minimum height of the header container (mobile: `spacing.20` = 80px)

### Footer Spacing

#### Footer Container
- **footer.padding.top.desktop** - Space between the main content above and the footer content (desktop: `spacing.2`)
- **footer.padding.top.mobile** - Space between the main content above and the footer content (mobile: `spacing.2`)
- **footer.padding.bottom.desktop** - Space between the footer content and the bottom of the viewport (desktop: `spacing.5`)
- **footer.padding.bottom.mobile** - Space between the footer content and the bottom of the viewport (mobile: `spacing.5`)
- **footer.padding.inline.desktop** - Horizontal padding on the left and right sides of the footer (desktop: `spacing.6`)
- **footer.padding.inline.mobile** - Horizontal padding on the left and right sides of the footer (mobile: `spacing.2`)
- **footer.padding.inline.mobile-variant** - Horizontal padding for the mobile variant footer layout (mobile: `spacing.4`)
- **footer.gap.desktop** - Space between the footer logo/brand and the footer text (desktop: `spacing.3`)
- **footer.gap.mobile** - Space between the footer logo/brand and the footer text (mobile: `spacing.2`)
- **footer.frame.margin.top.desktop** - Margin between the bottom of the main content area and the top of the footer frame (desktop: `spacing.16` = 64px)
- **footer.frame.margin.top.mobile** - Margin between the bottom of the main content area and the top of the footer frame (mobile: `spacing.16` = 64px)

### Main Container Spacing

#### Main Container
- **main.padding.inline.desktop** - Horizontal padding on the left and right sides of the main content area (desktop: `spacing.6`)
- **main.padding.inline.mobile** - Horizontal padding on the left and right sides of the main content area (mobile: `spacing.6`)
- **main.padding.inline.stacked** - Horizontal padding when cards are stacked vertically (stacked: `spacing.6`)

### Layout Spacing

#### App Layout
- **layout.gap.desktop** - Space between the control column, display column, and motion column (desktop: `spacing.6` for studio, `spacing.5` for small-canvas)
- **layout.gap.mobile** - Space between columns when stacked vertically on mobile (mobile: `spacing.4`)
- **layout.gap.small-canvas** - Space between columns when small-canvas mode is active (small-canvas: `spacing.5`)

#### Control Column
- **layout.control-column.gap.desktop** - Space between consecutive control cards stacked vertically in the control column (desktop: `spacing.6`)
- **layout.control-column.gap.mobile** - Space between consecutive control cards stacked vertically in the control column (mobile: `spacing.6`)
- **layout.control-column.padding.bottom.desktop** - Extra space at the bottom of the control column to prevent drop shadows from being clipped (desktop: `0`)
- **layout.control-column.padding.bottom.mobile** - Extra space at the bottom of the control column to prevent drop shadows from being clipped (mobile: `spacing.2`)

#### Motion Column
- **layout.motion-column.gap.desktop** - Space between consecutive motion cards stacked vertically in the motion column (desktop: `spacing.6`)
- **layout.motion-column.gap.mobile** - Space between consecutive motion cards stacked vertically in the motion column (mobile: `spacing.6`)

#### Display Column
- **layout.display-column.gap.desktop** - Space between the canvas card and any controls below it in the display column (desktop: `spacing.6`)
- **layout.display-column.gap.mobile** - Space between the canvas card and any controls below it in the display column (mobile: `spacing.6`)
- **layout.display-column.padding.bottom.desktop** - Extra space at the bottom of the display column to prevent drop shadows from being clipped (desktop: `0`)
- **layout.display-column.padding.bottom.mobile** - Extra space at the bottom of the display column to prevent drop shadows from being clipped (mobile: `spacing.2`)

### Card Spacing

#### Card Padding
- **card.padding.inline.desktop** - Horizontal padding on the left and right sides inside all cards (control-card, motion-card, canvas-card, etc.) (desktop: `spacing.5`)
- **card.padding.inline.mobile** - Horizontal padding on the left and right sides inside all cards (control-card, motion-card, canvas-card, etc.) (mobile: `spacing.5`)
- **card.padding.block.desktop** - Vertical padding on the top and bottom inside all cards (desktop: `spacing.5`)
- **card.padding.block.mobile** - Vertical padding on the top and bottom inside all cards (mobile: `spacing.5`)
- **card.gap.desktop** - Space between direct children inside cards (e.g., between sections, between tabs and content) (desktop: `spacing.4`)
- **card.gap.mobile** - Space between direct children inside cards (e.g., between sections, between tabs and content) (mobile: `spacing.4`)

#### Card-to-Card Spacing
- **card.margin.bottom.desktop** - Extra space below the last card in a column to prevent drop shadows from being clipped (desktop: `0`)
- **card.margin.bottom.mobile** - Extra space below the last card in a column to prevent drop shadows from being clipped (mobile: `spacing.1`)

#### Canvas Card Shell
- **card.canvas-shell.gap.desktop** - Space between the canvas element and the status bar below it (desktop: `spacing.6`)
- **card.canvas-shell.gap.mobile** - Space between the canvas element and the status bar below it (mobile: `spacing.6`)

### Layout Spacing Values Reference

#### Desktop
- `header.padding.top.desktop`: `spacing.7` (28px)
- `header.padding.bottom.desktop`: `spacing.5` (20px)
- `header.padding.inline.desktop`: `spacing.6` (24px)
- `header.gap.desktop`: `spacing.5` (20px)
- `header.min-height.desktop`: `spacing.20` (80px)
- `footer.padding.top.desktop`: `spacing.2` (8px)
- `footer.padding.bottom.desktop`: `spacing.5` (20px)
- `footer.padding.inline.desktop`: `spacing.6` (24px)
- `footer.gap.desktop`: `spacing.3` (12px)
- `footer.frame.margin.top.desktop`: `spacing.16` (64px)
- `main.padding.inline.desktop`: `spacing.6` (24px)
- `layout.gap.desktop`: `spacing.6` (24px) for studio, `spacing.5` (20px) for small-canvas
- `layout.control-column.gap.desktop`: `spacing.6` (24px)
- `layout.control-column.padding.bottom.desktop`: `0`
- `layout.motion-column.gap.desktop`: `spacing.6` (24px)
- `layout.display-column.gap.desktop`: `spacing.6` (24px)
- `layout.display-column.padding.bottom.desktop`: `0`
- `card.padding.inline.desktop`: `spacing.5` (20px)
- `card.padding.block.desktop`: `spacing.5` (20px)
- `card.gap.desktop`: `spacing.4` (16px)
- `card.margin.bottom.desktop`: `0`
- `card.canvas-shell.gap.desktop`: `spacing.6` (24px)

#### Mobile
- `header.padding.top.mobile`: `spacing.5` (20px)
- `header.padding.bottom.mobile`: `spacing.5` (20px)
- `header.padding.inline.mobile`: `spacing.4` (16px)
- `header.padding.inline.small`: `spacing.2` (8px)
- `header.gap.mobile`: `spacing.5` (20px)
- `header.min-height.mobile`: `spacing.20` (80px)
- `footer.padding.top.mobile`: `spacing.2` (8px)
- `footer.padding.bottom.mobile`: `spacing.5` (20px)
- `footer.padding.inline.mobile`: `spacing.2` (8px)
- `footer.padding.inline.mobile-variant`: `spacing.4` (16px)
- `footer.gap.mobile`: `spacing.2` (8px)
- `footer.frame.margin.top.mobile`: `spacing.16` (64px)
- `main.padding.inline.mobile`: `spacing.6` (24px)
- `layout.gap.mobile`: `spacing.4` (16px)
- `layout.control-column.gap.mobile`: `spacing.6` (24px)
- `layout.control-column.padding.bottom.mobile`: `spacing.2` (8px)
- `layout.motion-column.gap.mobile`: `spacing.6` (24px)
- `layout.display-column.gap.mobile`: `spacing.6` (24px)
- `layout.display-column.padding.bottom.mobile`: `spacing.2` (8px)
- `card.padding.inline.mobile`: `spacing.5` (20px)
- `card.padding.block.mobile`: `spacing.5` (20px)
- `card.gap.mobile`: `spacing.4` (16px)
- `card.margin.bottom.mobile`: `spacing.1` (4px)
- `card.canvas-shell.gap.mobile`: `spacing.6` (24px)

---

## Control Card Spacing Labels

This section defines all spacing labels for control cards, following a hierarchical naming convention that matches the CSS structure. Labels include `.desktop` and `.mobile` suffixes where values differ between layouts.

### Section Spacing

#### Section Container
- **section.gap.desktop** - Space between all direct children of a section (e.g., between section title and first control field, between consecutive control fields) (desktop: `spacing.5`)
- **section.gap.mobile** - Space between all direct children of a section (e.g., between section title and first control field, between consecutive control fields) (mobile: `spacing.1`)
- **section.margin.top.spaced.desktop** - Extra space above a section when it uses the `.section--spaced` class (adds additional separation above major sections like "Shape", "Density & Scale", "Rotation") (desktop: `spacing.2`)
- **section.margin.top.spaced.mobile** - Extra space above a section when it uses the `.section--spaced` class (adds additional separation above major sections like "Shape", "Density & Scale", "Rotation") (mobile: `spacing.2`)
- **section.margin.bottom.desktop** - Space at the bottom of a section (after its last control, before the divider line) - implemented as margin-top on the divider element (desktop: `spacing.4`)
- **section.margin.bottom.mobile** - Space at the bottom of a section (after its last control, before the divider line) - implemented as margin-top on the divider element (mobile: `spacing.4`)
- **section.margin.top.desktop** - Space at the top of a section (after the divider line, before the section heading) - implemented as margin-bottom on the divider element (desktop: `spacing.1`)
- **section.margin.top.mobile** - Space at the top of a section (after the divider line, before the section heading) - implemented as margin-bottom on the divider element (mobile: `spacing.4`)

#### Section Heading
- **section.heading.margin.top.desktop** - Margin above the section title/heading (desktop: 0, relies on parent gap)
- **section.heading.margin.top.mobile** - Margin above the section title/heading (mobile: 0, relies on parent gap)
- **section.heading.margin.bottom.desktop** - Margin below the section title/heading, before the first control field or content below (desktop: `spacing.0`)
- **section.heading.margin.bottom.mobile** - Margin below the section title/heading, before the first control field or content below (mobile: `spacing.0`)
- **section.heading.hint.margin.top.desktop** - Negative margin to pull the section hint text up closer to the section title (desktop: `-spacing.1`)
- **section.heading.hint.margin.top.mobile** - Negative margin to pull the section hint text up closer to the section title (mobile: `-spacing.1`)

### Tabs Spacing

- **section.tabs.margin.bottom.desktop** - Margin below the tab bar, before the first section heading or content (desktop: `spacing.8`)
- **section.tabs.margin.bottom.mobile** - Margin below the tab bar, before the first section heading or content (mobile: `spacing.6`)
- **section.tabs.gap.desktop** - Space between individual tab buttons (desktop: `spacing.3`)
- **section.tabs.gap.mobile** - Space between individual tab buttons (mobile: `spacing.1.5`)
- **section.tabs.tab.padding.inline.desktop** - Horizontal padding inside each tab button (left and right) (desktop: `spacing.4`)
- **section.tabs.tab.padding.inline.mobile** - Horizontal padding inside each tab button (left and right) (mobile: `spacing.1.5`)
- **section.tabs.tab.padding.block.desktop** - Vertical padding inside each tab button (top and bottom) (desktop: `spacing.2`)
- **section.tabs.tab.padding.block.mobile** - Vertical padding inside each tab button (top and bottom) (mobile: `spacing.2`)

### Control Field Spacing

#### Control Field Container
- **section.control.gap.desktop** - Gap between the label/heading and the control component (slider, select, switch, etc.) below it (desktop: `spacing.3`)
- **section.control.gap.mobile** - Gap between the label/heading and the control component (slider, select, switch, etc.) below it (mobile: `spacing.0`)
- **section.control.margin.top.desktop** - Margin between consecutive control fields (between one control field and the next) (desktop: implicit via parent section gap)
- **section.control.margin.top.mobile** - Margin between consecutive control fields (between one control field and the next) (mobile: `spacing.1`)
- **section.control.margin.top.spaced.desktop** - Extra margin above a control field when using `.control-field--spaced-top` (e.g., space between sprite buttons and Random switch) (desktop: `spacing.2`)
- **section.control.margin.top.spaced.mobile** - Extra margin above a control field when using `.control-field--spaced-top` (e.g., space between sprite buttons and Random switch) (mobile: `spacing.4`)
- **section.control.margin.bottom.desktop** - Margin below a control field when using `.control-field--spaced` (desktop: `spacing.5`)
- **section.control.margin.bottom.mobile** - Margin below a control field when using `.control-field--spaced` (mobile: `spacing.5`)

#### Control Field Label
- **section.control.label.gap.desktop** - Gap between the label text and the tooltip icon (`?`) to the right (desktop: `spacing.1`)
- **section.control.label.gap.mobile** - Gap between the label text and the tooltip icon (`?`) to the right (mobile: `spacing.0`)
- **section.control.label.margin.left.desktop** - Negative margin-left on tooltip icon to create effective space between label text and `?` icon (desktop: `-spacing.1`, effective gap: `spacing.1`)
- **section.control.label.margin.left.mobile** - Negative margin-left on tooltip icon to create effective space between label text and `?` icon (mobile: `-spacing.1`, effective gap: `spacing.0`)

#### Control Field Heading
- **section.control.heading.gap.desktop** - Space between the label and the value display in a field heading (e.g., "Select Sprites" label and current selection value) (desktop: `spacing.2`)
- **section.control.heading.gap.mobile** - Space between the label and the value display in a field heading (e.g., "Select Sprites" label and current selection value) (mobile: `spacing.2`)

### Special Control Spacing

#### Rotation Slider
- **section.control.rotation.margin.top.desktop** - Margin above the rotation slider wrapper (desktop: `spacing.0`)
- **section.control.rotation.margin.top.mobile** - Margin above the rotation slider wrapper (mobile: `spacing.0`)
- **section.control.rotation.margin.bottom.desktop** - Margin below the rotation slider wrapper, before the next element (desktop: `spacing.6`)
- **section.control.rotation.margin.bottom.mobile** - Margin below the rotation slider wrapper, before the next element (mobile: `spacing.6`)

#### Sprite Icon Buttons
- **section.control.sprite.buttons.margin.top.desktop** - Margin above sprite icon button groups (desktop: `spacing.0`)
- **section.control.sprite.buttons.margin.top.mobile** - Margin above sprite icon button groups (mobile: `spacing.0`)
- **section.control.sprite.buttons.margin.bottom.desktop** - Margin below sprite icon button groups (desktop: `spacing.0`)
- **section.control.sprite.buttons.margin.bottom.mobile** - Margin below sprite icon button groups (mobile: `spacing.0`)
- **section.control.sprite.buttons.gap.desktop** - Space between individual sprite icon button groups (desktop: `spacing.2`)
- **section.control.sprite.buttons.gap.mobile** - Space between individual sprite icon button groups (mobile: `spacing.2`)

#### Control Slider
- **section.control.slider.gap.desktop** - Space between the slider track and the value display (desktop: `spacing.2`)
- **section.control.slider.gap.mobile** - Space between the slider track and the value display (mobile: `spacing.2`)

#### Switch Row
- **section.control.switch.gap.desktop** - Space between the switch toggle and its label text (desktop: `spacing.3`)
- **section.control.switch.gap.mobile** - Space between the switch toggle and its label text (mobile: `spacing.3`)

#### Control Select with Lock
- **section.control.select.lock.gap.desktop** - Space between the select dropdown and the lock button (desktop: `spacing.2`)
- **section.control.select.lock.gap.mobile** - Space between the select dropdown and the lock button (mobile: `spacing.2`)

#### Control Grid
- **section.control.grid.gap.desktop** - Space between items in a control grid layout (desktop: `spacing.5`)
- **section.control.grid.gap.mobile** - Space between items in a control grid layout (mobile: `spacing.5`)

#### Panel Footer
- **section.panel.footer.margin.top.desktop** - Margin above the panel footer (button group at bottom of panel) (desktop: `spacing.5`)
- **section.panel.footer.margin.top.mobile** - Margin above the panel footer (button group at bottom of panel) (mobile: `spacing.5`)
- **section.panel.footer.gap.desktop** - Space between buttons in the panel footer (desktop: `spacing.3`)
- **section.panel.footer.gap.mobile** - Space between buttons in the panel footer (mobile: `spacing.3`)

### Spacing Values Reference

#### Desktop
- `section.gap.desktop`: `spacing.5` (20px)
- `section.margin.top.spaced.desktop`: `spacing.2` (8px)
- `section.margin.bottom.desktop`: `spacing.4` (16px)
- `section.margin.top.desktop`: `spacing.1` (4px)
- `section.heading.margin.top.desktop`: `0`
- `section.heading.margin.bottom.desktop`: `spacing.0` (0px)
- `section.heading.hint.margin.top.desktop`: `-spacing.1` (-4px)
- `section.tabs.margin.bottom.desktop`: `spacing.8` (32px)
- `section.tabs.gap.desktop`: `spacing.3` (12px)
- `section.tabs.tab.padding.inline.desktop`: `spacing.4` (16px)
- `section.tabs.tab.padding.block.desktop`: `spacing.2` (8px)
- `section.control.gap.desktop`: `spacing.3` (12px)
- `section.control.margin.top.desktop`: implicit via parent section gap
- `section.control.margin.top.spaced.desktop`: `spacing.2` (8px)
- `section.control.margin.bottom.desktop`: `spacing.5` (20px)
- `section.control.label.gap.desktop`: `spacing.1` (4px)
- `section.control.label.margin.left.desktop`: `-spacing.1` (-4px, effective gap: `spacing.1`)
- `section.control.heading.gap.desktop`: `spacing.2` (8px)
- `section.control.rotation.margin.top.desktop`: `spacing.0` (0px)
- `section.control.rotation.margin.bottom.desktop`: `spacing.6` (24px)
- `section.control.sprite.buttons.margin.top.desktop`: `spacing.0` (0px)
- `section.control.sprite.buttons.margin.bottom.desktop`: `spacing.0` (0px)
- `section.control.sprite.buttons.gap.desktop`: `spacing.2` (8px)
- `section.control.slider.gap.desktop`: `spacing.2` (8px)
- `section.control.switch.gap.desktop`: `spacing.3` (12px)
- `section.control.select.lock.gap.desktop`: `spacing.2` (8px)
- `section.control.grid.gap.desktop`: `spacing.5` (20px)
- `section.panel.footer.margin.top.desktop`: `spacing.5` (20px)
- `section.panel.footer.gap.desktop`: `spacing.3` (12px)

#### Mobile
- `section.gap.mobile`: `spacing.1` (4px)
- `section.margin.top.spaced.mobile`: `spacing.2` (8px)
- `section.margin.bottom.mobile`: `spacing.4` (16px)
- `section.margin.top.mobile`: `spacing.4` (16px)
- `section.heading.margin.top.mobile`: `0`
- `section.heading.margin.bottom.mobile`: `spacing.0` (0px)
- `section.heading.hint.margin.top.mobile`: `-spacing.1` (-4px)
- `section.tabs.margin.bottom.mobile`: `spacing.6` (24px)
- `section.tabs.gap.mobile`: `spacing.1.5` (6px)
- `section.tabs.tab.padding.inline.mobile`: `spacing.1.5` (6px)
- `section.tabs.tab.padding.block.mobile`: `spacing.2` (8px)
- `section.control.gap.mobile`: `spacing.0` (0px)
- `section.control.margin.top.mobile`: `spacing.1` (4px)
- `section.control.margin.top.spaced.mobile`: `spacing.4` (16px)
- `section.control.margin.bottom.mobile`: `spacing.5` (20px)
- `section.control.label.gap.mobile`: `spacing.0` (0px)
- `section.control.label.margin.left.mobile`: `-spacing.1` (-4px, effective gap: `spacing.0`)
- `section.control.heading.gap.mobile`: `spacing.2` (8px)
- `section.control.rotation.margin.top.mobile`: `spacing.0` (0px)
- `section.control.rotation.margin.bottom.mobile`: `spacing.6` (24px)
- `section.control.sprite.buttons.margin.top.mobile`: `spacing.0` (0px)
- `section.control.sprite.buttons.margin.bottom.mobile`: `spacing.0` (0px)
- `section.control.sprite.buttons.gap.mobile`: `spacing.2` (8px)
- `section.control.slider.gap.mobile`: `spacing.2` (8px)
- `section.control.switch.gap.mobile`: `spacing.3` (12px)
- `section.control.select.lock.gap.mobile`: `spacing.2` (8px)
- `section.control.grid.gap.mobile`: `spacing.5` (20px)
- `section.panel.footer.margin.top.mobile`: `spacing.5` (20px)
- `section.panel.footer.gap.mobile`: `spacing.3` (12px)

#### Stacked Layout
- Same values as mobile (uses `body:has(.app-frame--stacked)` selectors)

### Notes

- All spacing uses Tailwind's spacing token system (4px base unit)
- Mobile and stacked layouts share the same spacing values
- The structure is consistent across layouts - only values change, not properties
- Negative margins are used for fine-tuning (e.g., tooltip icon positioning)

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

