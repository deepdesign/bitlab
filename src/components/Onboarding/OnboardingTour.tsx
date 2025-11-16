import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { X, ChevronRight, ChevronLeft, Sparkles } from "lucide-react";
import { markTourCompleted } from "@/lib/storage/onboardingStorage";

interface TourStep {
  id: string;
  title: string;
  description: string;
  image?: string; // Optional screenshot/image path
  targetSelector?: string; // CSS selector for element to highlight (not used when centered)
  position?: "top" | "bottom" | "left" | "right" | "center";
}

const TOUR_STEPS: TourStep[] = [
  {
    id: "welcome",
    title: "Welcome to Pixli!",
    description: "Create beautiful, animated pixel art. Let's take a quick tour of the main features.",
    image: "/tour/welcome.png",
    position: "center",
  },
  {
    id: "shapes",
    title: "Choose Your Shapes",
    description: "Pick from circles, stars, hexagons, and more. Each shape creates a different look!",
    image: "/tour/shapes.png",
    position: "center",
  },
  {
    id: "colors",
    title: "Pick Your Colors",
    description: "Select a color palette or create your own from images. Mix and match to find your style!",
    image: "/tour/colors.png",
    position: "center",
  },
  {
    id: "animation",
    title: "Make It Move",
    description: "Choose how your shapes move - drift, pulse, spiral, and more. Adjust speed and intensity!",
    image: "/tour/animation.png",
    position: "center",
  },
  {
    id: "export",
    title: "Save Your Art",
    description: "Export your creations in high resolution. Perfect for wallpapers, prints, or sharing!",
    image: "/tour/export.png",
    position: "center",
  },
  {
    id: "complete",
    title: "You're All Set!",
    description: "Start creating! Try different combinations and see what you can make. Have fun!",
    position: "center",
  },
];

interface OnboardingTourProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * OnboardingTour Component
 * 
 * Interactive step-by-step tour that highlights features
 * and guides users through the app.
 */
export function OnboardingTour({ isOpen, onClose }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setCurrentStep(0);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isVisible || !isOpen) return;

    // Always center the tour card
    if (overlayRef.current) {
      overlayRef.current.style.top = "50%";
      overlayRef.current.style.left = "50%";
      overlayRef.current.style.transform = "translate(-50%, -50%)";
    }
    if (highlightRef.current) {
      highlightRef.current.style.display = "none";
    }
  }, [currentStep, isVisible, isOpen]);

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    markTourCompleted();
    setIsVisible(false);
    setTimeout(onClose, 200);
  };

  const handleSkip = () => {
    handleComplete();
  };

  if (!isOpen || !isVisible) return null;

  const step = TOUR_STEPS[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === TOUR_STEPS.length - 1;

  return (
    <>
      {/* Backdrop with cutout for highlighted element */}
      <div
        className="fixed inset-0 z-40"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.75)",
          backdropFilter: "blur(4px)",
          opacity: isVisible ? 1 : 0,
          transition: "opacity 0.2s ease",
        }}
        onClick={handleSkip}
      />

      {/* Highlight overlay */}
      <div
        ref={highlightRef}
        className="fixed z-45 pointer-events-none"
        style={{
          border: "3px solid var(--accent-primary)",
          borderRadius: "8px",
          boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.75), 0 0 20px var(--accent-primary)",
          display: "none",
          transition: "all 0.3s ease",
        }}
      />

      {/* Tour Card */}
      <div
        ref={overlayRef}
        className="fixed z-50 w-full max-w-md"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: step.position === "center" ? "translate(-50%, -50%)" : "translateX(-50%)",
          transition: "opacity 0.2s ease, transform 0.2s ease",
        }}
      >
        <Card className="p-6">
          <div className="flex items-start gap-3 mb-4">
            <Sparkles className="h-5 w-5 text-[var(--accent-primary)] flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold uppercase tracking-wider">
                  {step.title}
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleSkip}
                  aria-label="Skip tour"
                  className="flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs leading-relaxed text-[var(--text-muted)] mb-4">
                {step.description}
              </p>
              
              {/* Screenshot Image */}
              {step.image && (
                <div className="mb-4 rounded border-2 border-[var(--card-border)] overflow-hidden bg-[var(--card-bg)]">
                  <img
                    src={step.image}
                    alt={step.title}
                    className="w-full h-auto"
                    style={{
                      display: "block",
                      maxHeight: "300px",
                      objectFit: "contain",
                    }}
                    onError={(e) => {
                      // Hide image if it fails to load
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--text-muted)]">
                  {currentStep + 1} of {TOUR_STEPS.length}
                </span>
                <div className="flex gap-2">
                  {!isFirst && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handlePrevious}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="default"
                    size="sm"
                    onClick={handleNext}
                  >
                    {isLast ? "Finish" : "Next"}
                    {!isLast && <ChevronRight className="h-4 w-4 ml-1" />}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}


