# Tour Screenshots

Place tour screenshot images in this directory.

## Required Images

- `welcome.png` - Welcome screen screenshot
- `shapes.png` - Shapes selection screenshot
- `colors.png` - Color palette selection screenshot
- `animation.png` - Animation controls screenshot
- `export.png` - Export modal screenshot

## Image Guidelines

- **Format**: PNG (for transparency) or JPG
- **Size**: Recommended 800-1200px width
- **Aspect Ratio**: 16:9 or 4:3 works well
- **Content**: Should show the relevant UI section clearly
- **Style**: Match the app's visual style and theme

## Usage

Images are referenced in `src/components/Onboarding/OnboardingTour.tsx` as `/tour/{filename}.png`

If an image fails to load, it will be hidden automatically.

