import { useState, useCallback } from "react";
import { Button } from "@/components/Button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectValue,
} from "@/components/retroui/Select";
import { Menu, X } from "lucide-react";
import type { CSSProperties } from "react";

interface MobileMenuProps {
  themeColor: string;
  themeShape: "box" | "rounded";
  themeModeText: string;
  ThemeModeIcon: React.ComponentType<{ className?: string }>;
  onThemeColorChange: (value: string) => void;
  onThemeShapeChange: (value: string) => void;
  onThemeModeCycle: () => void;
  themeColorOptions: Array<{ value: string; label: string }>;
  themeColorPreview: Record<string, string>;
}

export const MobileMenu = ({
  themeColor,
  themeShape,
  themeModeText,
  ThemeModeIcon,
  onThemeColorChange,
  onThemeShapeChange,
  onThemeModeCycle,
  themeColorOptions,
  themeColorPreview,
}: MobileMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <div className="mobile-menu">
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={handleToggle}
        aria-label="Open menu"
        aria-expanded={isOpen}
        className="mobile-menu-trigger"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>
      {isOpen && (
        <>
          <div className="mobile-menu-overlay" onClick={handleClose} />
          <div className="mobile-menu-content">
            <div className="mobile-menu-header">
              <h2 className="mobile-menu-title">Theme</h2>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleClose}
                aria-label="Close menu"
                className="mobile-menu-close"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="mobile-menu-body">
              <div className="mobile-menu-section">
                <label className="mobile-menu-label">Theme Color</label>
                <Select value={themeColor} onValueChange={onThemeColorChange}>
                  <SelectTrigger className="mobile-menu-select">
                    <SelectValue placeholder="Theme">
                      {themeColorOptions.find(
                        (option) => option.value === themeColor,
                      )?.label ?? "Theme"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="mobile-menu-dropdown">
                    <SelectGroup>
                      {themeColorOptions.map((option) => (
                        <SelectItem
                          key={option.value}
                          value={option.value}
                          className="mobile-menu-item"
                          style={
                            {
                              "--theme-preview": themeColorPreview[option.value],
                            } as CSSProperties
                          }
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="mobile-menu-section">
                <label className="mobile-menu-label">Shape &amp; Mode</label>
                <div className="mobile-menu-icon-buttons">
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    onClick={() => onThemeShapeChange(themeShape === "box" ? "rounded" : "box")}
                    className="mobile-menu-icon-button"
                    aria-label={`Switch theme shape (current ${themeShape === "rounded" ? "rounded" : "box"})`}
                    title={`Shape: ${themeShape === "rounded" ? "Rounded" : "Box"}`}
                  >
                    {themeShape === "rounded" ? (
                      <svg
                        width={16}
                        height={16}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        style={{ display: "block" }}
                        aria-hidden="true"
                      >
                        <rect x={4} y={4} width={16} height={16} rx={3} ry={3} />
                      </svg>
                    ) : (
                      <svg
                        width={16}
                        height={16}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        style={{ display: "block" }}
                        aria-hidden="true"
                      >
                        <rect x={4} y={4} width={16} height={16} />
                      </svg>
                    )}
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    onClick={onThemeModeCycle}
                    className="mobile-menu-icon-button"
                    aria-label={`Switch theme mode (current ${themeModeText})`}
                    title={`Theme: ${themeModeText}`}
                  >
                    <ThemeModeIcon className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

