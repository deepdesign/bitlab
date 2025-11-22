# Make Help Modal Responsive

## Overview
Transform the onboarding panel to be mobile-responsive at the 640px breakpoint. The vertical stepper will become horizontal scrollable tabs, and the layout will be optimized for small screens.

## Implementation Steps

### 1. Add Viewport-Based Mobile Detection
- **File**: `src/components/Onboarding/OnboardingPanel.tsx`
- Create a custom hook or state to detect viewport width < 640px
- Use `useState` + `useEffect` with `window.innerWidth` and resize listener
- Alternative: Use `window.matchMedia('(max-width: 640px)')` for reactive detection

### 2. Transform Vertical Stepper to Horizontal Tabs (Mobile)
- **File**: `src/components/Onboarding/OnboardingPanel.tsx`
- On mobile (< 640px):
  - Change stepper container from vertical (`flex-col`) to horizontal (`flex-row`)
  - Make stepper scrollable horizontally (`overflow-x-auto`)
  - Adjust stepper width from fixed `w-64` to `w-full` or auto
  - Remove the empty filler tab (only needed for vertical layout)
  - Update tab styling: remove right borders, add bottom borders for selected state
  - Adjust tab padding and sizing for touch targets (minimum 44px height)

### 3. Adjust Main Layout for Mobile
- **File**: `src/components/Onboarding/OnboardingPanel.tsx`
- On mobile:
  - Change main container from `flex` (side-by-side) to `flex-col` (stacked)
  - Stepper appears above content area
  - Reduce padding: change `p-4` to `p-2` on modal container
  - Adjust card padding: reduce `p-6` to `p-4` on header/footer
  - Make modal full-width or near-full-width: remove or reduce `max-w-4xl`

### 4. Update Tab Styling for Horizontal Layout
- **File**: `src/components/Onboarding/OnboardingPanel.tsx`
- For horizontal tabs on mobile:
  - Selected tab: bottom border, no right border
  - Unselected tabs: bottom border (inset shadow)
  - Tabs should butt up against each other horizontally
  - Ensure proper touch targets (44px minimum height)
  - Add horizontal scroll indicators if needed

### 5. Adjust Content Area for Mobile
- **File**: `src/components/Onboarding/OnboardingPanel.tsx`
- On mobile:
  - Reduce padding: `p-6` to `p-4`
  - Adjust grid layout in welcome step: change `grid-cols-2` to `grid-cols-1` for mobile
  - Ensure text remains readable
  - Adjust icon/heading spacing if needed

### 6. Update Navigation Footer for Mobile
- **File**: `src/components/Onboarding/OnboardingPanel.tsx`
- On mobile:
  - Reduce padding: `p-6` to `p-4`
  - Ensure buttons are touch-friendly
  - Consider stacking buttons vertically if space is tight (optional)

### 7. Test Responsive Behavior
- Verify layout at 640px breakpoint
- Test horizontal scrolling of tabs
- Ensure all touch targets meet 44px minimum
- Verify content readability on small screens
- Test on actual mobile devices if possible

## Key Changes Summary

**Desktop (> 640px)**: 
- Vertical stepper on left (w-64)
- Content area on right
- Standard padding (p-6)

**Mobile (< 640px)**:
- Horizontal scrollable tabs at top
- Content area below
- Reduced padding (p-2/p-4)
- Full-width or near-full-width modal
- Stacked layout (flex-col)

