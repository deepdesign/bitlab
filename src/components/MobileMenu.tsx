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
              <h2 className="mobile-menu-title">Settings</h2>
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
                <label className="mobile-menu-label">Shape</label>
                <Select value={themeShape} onValueChange={onThemeShapeChange}>
                  <SelectTrigger className="mobile-menu-select">
                    <SelectValue placeholder="Shape">
                      {themeShape === "rounded" ? "Rounded" : "Box"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="mobile-menu-dropdown">
                    <SelectGroup>
                      <SelectItem value="box" className="mobile-menu-item">
                        Box
                      </SelectItem>
                      <SelectItem value="rounded" className="mobile-menu-item">
                        Rounded
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="mobile-menu-section">
                <label className="mobile-menu-label">Theme Mode</label>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onThemeModeCycle}
                  className="mobile-menu-button"
                  aria-label={`Switch theme mode (current ${themeModeText})`}
                >
                  <ThemeModeIcon className="h-4 w-4" aria-hidden="true" />
                  <span>{themeModeText}</span>
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

