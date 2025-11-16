import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { X, HelpCircle, BookOpen, Sparkles, RotateCcw } from "lucide-react";
import { resetOnboarding } from "@/lib/storage/onboardingStorage";

interface HelpMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onStartTour: () => void;
}

/**
 * HelpMenu Component
 * 
 * Quick access help menu with:
 * - Quick tips
 * - Links to documentation
 * - Option to restart onboarding
 * - Option to start tour
 */
export function HelpMenu({ isOpen, onClose, onStartTour }: HelpMenuProps) {
  const [isVisible, setIsVisible] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  const handleResetOnboarding = () => {
    if (confirm("Reset onboarding? You'll see the welcome screen and tips again.")) {
      resetOnboarding();
      onClose();
      // Reload to show welcome screen
      window.location.reload();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(2px)",
          opacity: isVisible ? 1 : 0,
          transition: "opacity 0.2s ease",
        }}
        onClick={onClose}
      />

      {/* Help Menu */}
      <div
        ref={menuRef}
        className="fixed top-16 right-4 z-50 w-full max-w-sm"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateY(0)" : "translateY(-10px)",
          transition: "opacity 0.2s ease, transform 0.2s ease",
        }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-[var(--accent-primary)]" />
              <h3 className="text-sm font-bold uppercase tracking-wider">Help</h3>
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={onClose}
              aria-label="Close help menu"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
            {/* Quick Tips */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider mb-2 text-[var(--text-muted)]">
                Quick Tips
              </h4>
              <ul className="space-y-2 text-xs text-[var(--text-muted)]">
                <li>• Click the ? icons for help on any control</li>
                <li>• Use the shuffle button to randomize everything</li>
                <li>• Lock controls to keep them while experimenting</li>
                <li>• Export your art in high resolution</li>
                <li>• Create custom color palettes from images</li>
              </ul>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-[var(--card-border)]">
              <div className="space-y-2">
                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  onClick={() => {
                    onClose();
                    onStartTour();
                  }}
                  className="w-full justify-start gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  Take a Tour
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleResetOnboarding}
                  className="w-full justify-start gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset Onboarding
                </Button>
              </div>
            </div>

            {/* Documentation Links */}
            <div className="pt-4 border-t border-[var(--card-border)]">
              <h4 className="text-xs font-semibold uppercase tracking-wider mb-2 text-[var(--text-muted)]">
                Learn More
              </h4>
              <div className="space-y-1">
                <a
                  href="https://github.com/Logging-Studio/RetroUI"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-[var(--accent-primary)] hover:underline flex items-center gap-1"
                >
                  <BookOpen className="h-3 w-3" />
                  RetroUI Documentation
                </a>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}

