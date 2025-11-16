import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { X, Lightbulb } from "lucide-react";
import { markTabOnboarded, needsTabOnboarding } from "@/lib/storage/onboardingStorage";

export type TabName = "sprites" | "motion" | "fx" | "canvas";

interface TabOnboardingProps {
  tab: TabName;
  isOpen: boolean;
  onClose: () => void;
  targetElement?: HTMLElement | null;
}

const TAB_CONTENT: Record<TabName, { title: string; tips: string[] }> = {
  sprites: {
    title: "Shapes & Size",
    tips: [
      "Pick a shape you like! Try different ones to see what you prefer.",
      "Use the shuffle button to mix things up and discover new combinations.",
      "Lock a shape to keep it while you experiment with other settings.",
      "Adjust the size and amount sliders to control how your canvas looks.",
    ],
  },
  motion: {
    title: "Animation",
    tips: [
      "Choose how your shapes move - try different styles to see what you like!",
      "Speed controls how fast everything animates - slower can be more calming.",
      "Intensity changes how far shapes travel - more intensity = more movement.",
      "Try combining different movement styles with rotation for unique effects!",
    ],
  },
  fx: {
    title: "Colors & Effects",
    tips: [
      "Pick colors that work together - try different palettes to find your style!",
      "Color mixing styles blend colors in different ways - experiment to see what you like.",
      "Make your own color palette from photos! Click the + button to get started.",
      "Adjust opacity to make layers more or less transparent.",
    ],
  },
  canvas: {
    title: "Canvas Settings",
    tips: [
      "Change the background color or pattern to match your art style.",
      "Export your art to save or share - try different sizes for different uses!",
      "Use presets to quickly try common sizes like wallpapers or social media posts.",
    ],
  },
};

/**
 * TabOnboarding Component
 * 
 * Contextual onboarding overlay that appears when a tab is first opened.
 * Provides tips specific to that tab's features.
 */
export function TabOnboarding({
  tab,
  isOpen,
  onClose,
  targetElement,
}: TabOnboardingProps) {
  const [isVisible, setIsVisible] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && needsTabOnboarding(tab)) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isOpen, tab]);

  useEffect(() => {
    if (!isVisible) return;

    // Position overlay - if no target element, center it
    const updatePosition = () => {
      if (!overlayRef.current) return;

      const overlay = overlayRef.current;
      
      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        // Position below the target element
        overlay.style.top = `${rect.bottom + 16}px`;
        overlay.style.left = `${rect.left}px`;
        overlay.style.right = "auto";
        overlay.style.transform = "none";
      } else {
        // Center on screen
        overlay.style.top = "50%";
        overlay.style.left = "50%";
        overlay.style.right = "auto";
        overlay.style.transform = "translate(-50%, -50%)";
      }
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isVisible, targetElement]);

  const handleGotIt = () => {
    markTabOnboarded(tab);
    setIsVisible(false);
    setTimeout(onClose, 200);
  };

  if (!isVisible || !needsTabOnboarding(tab)) {
    return null;
  }

  const content = TAB_CONTENT[tab];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(2px)",
        }}
        onClick={handleGotIt}
      />

      {/* Onboarding Card */}
      <div
        ref={overlayRef}
        className="fixed z-50 w-full max-w-sm p-4"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: targetElement 
            ? (isVisible ? "translateY(0)" : "translateY(-10px)")
            : (isVisible ? "translate(-50%, -50%)" : "translate(-50%, -60%)"),
          transition: "opacity 0.2s ease, transform 0.2s ease",
        }}
      >
        <Card className="p-6">
          <div className="flex items-start gap-3 mb-4">
            <Lightbulb className="h-5 w-5 text-[var(--accent-primary)] flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-bold uppercase tracking-wider mb-2">
                {content.title}
              </h3>
              <ul className="space-y-2">
                {content.tips.map((tip, index) => (
                  <li key={index} className="text-xs leading-relaxed text-[var(--text-muted)]">
                    • {tip}
                  </li>
                ))}
              </ul>
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleGotIt}
              aria-label="Close tips"
              className="flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={handleGotIt}
            className="w-full"
          >
            Got it!
          </Button>
        </Card>
      </div>
    </>
  );
}

