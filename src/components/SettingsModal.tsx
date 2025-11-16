import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Switch } from "@/components/retroui/Switch";
import { Accordion } from "@/components/retroui/Accordion";
import { X, Settings, Info, RotateCcw, Download, Upload, Sparkles, BookOpen } from "lucide-react";
// Tabs removed
import {
  getSettings,
  saveSettings,
  resetSettings,
  type AppSettings,
} from "@/lib/storage";
import { resetOnboarding } from "@/lib/storage/onboardingStorage";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartTour?: () => void;
}

// Keyboard shortcuts removed

export const SettingsModal = ({ isOpen, onClose, onStartTour }: SettingsModalProps) => {
  const [settings, setSettings] = useState<AppSettings>(getSettings());
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSettings(getSettings());
      setHasChanges(false);
    }
  }, [isOpen]);

  const handleReducedMotionChange = useCallback((enabled: boolean) => {
    setSettings((prev) => ({ ...prev, reducedMotion: enabled }));
    setHasChanges(true);
  }, []);

  const handleSave = useCallback(() => {
    saveSettings(settings);
    setHasChanges(false);
  }, [settings]);

  const handleReset = useCallback(() => {
    if (confirm("Reset all settings to defaults? This cannot be undone.")) {
      resetSettings();
      setSettings(getSettings());
      setHasChanges(false);
    }
  }, []);

  const handleResetOnboarding = useCallback(() => {
    if (confirm("Reset onboarding? You'll see the welcome screen and tips again.")) {
      resetOnboarding();
      onClose();
      window.location.reload();
    }
  }, [onClose]);

  const handleExportData = useCallback(() => {
    try {
      const data = {
        settings: getSettings(),
        presets: localStorage.getItem("pixli-presets"),
        customPalettes: localStorage.getItem("pixli-custom-palettes"),
        onboarding: localStorage.getItem("pixli-onboarding"),
      };
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `pixli-data-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to export data:", error);
      alert("Failed to export data. Please try again.");
    }
  }, []);

  const handleImportData = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const text = event.target?.result;
          if (typeof text !== "string") {
            throw new Error("Invalid file");
          }

          const data = JSON.parse(text);
          
          if (confirm("Import data? This will overwrite your current settings, presets, and palettes.")) {
            if (data.settings) {
              localStorage.setItem("pixli-settings", JSON.stringify(data.settings));
            }
            if (data.presets) {
              localStorage.setItem("pixli-presets", data.presets);
            }
            if (data.customPalettes) {
              localStorage.setItem("pixli-custom-palettes", data.customPalettes);
            }
            if (data.onboarding) {
              localStorage.setItem("pixli-onboarding", data.onboarding);
            }
            
            alert("Data imported successfully! The page will reload.");
            window.location.reload();
          }
        } catch (error) {
          console.error("Failed to import data:", error);
          alert("Failed to import data. Please check the file format.");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }, []);

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        if (hasChanges) {
          if (confirm("You have unsaved changes. Close without saving?")) {
            onClose();
          }
        } else {
          onClose();
        }
      }
    },
    [hasChanges, onClose],
  );

  if (!isOpen) return null;

  return (
    <div className="settings-modal-overlay" onClick={handleOverlayClick}>
      <Card className="settings-modal" onClick={(e) => e.stopPropagation()}>
        <div className="settings-modal-header">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-[var(--accent-primary)]" />
            <h2 className="settings-modal-title">Settings</h2>
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={onClose}
            aria-label="Close settings"
            className="settings-modal-close"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="settings-modal-content">
          {/* About at top */}
          <div className="settings-section">
            <h3 className="settings-section-title">About</h3>
            <div className="space-y-3">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider mb-1">
                  Version
                </div>
                <div className="text-sm text-[var(--text-muted)]">
                  {__APP_VERSION__}
                </div>
                  </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider mb-1">Pixli</div>
                <div className="text-sm text-[var(--text-muted)]">
                  Create beautiful, animated pixel art
                </div>
              </div>
            </div>
          </div>

          {/* Help */}
          <div className="settings-section">
            <h3 className="settings-section-title">Help</h3>
            <div className="space-y-2">
              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={() => {
                  onClose();
                  onStartTour?.();
                }}
                className="justify-start gap-2"
              >
                <Sparkles className="h-4 w-4" />
                Start tour
              </Button>
              <a
                href="https://www.pixli.art"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-xs text-[var(--accent-primary)] hover:underline"
                aria-label="Open Pixli website"
                title="Open Pixli website"
              >
                <BookOpen className="h-3 w-3" />
                Pixli website
              </a>
            </div>
          </div>

          {/* Accessibility */}
          <div className="settings-section">
            <h3 className="settings-section-title">Accessibility</h3>
            <div className="settings-item">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="field-heading-left mb-1">
                    <span className="field-label">Reduce motion</span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)]">
                    Minimise animations and transitions for better accessibility
                  </p>
                </div>
                <Switch
                  id="reduced-motion"
                  checked={settings.reducedMotion}
                  onCheckedChange={handleReducedMotionChange}
                  aria-label="Reduce motion"
                />
              </div>
            </div>
          </div>

          {/* Data */}
          <div className="settings-section">
            <h3 className="settings-section-title">Data management</h3>
            <div className="space-y-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleExportData}
                className="w-full justify-start gap-2"
              >
                <Download className="h-4 w-4" />
                Export all data
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleImportData}
                className="w-full justify-start gap-2"
              >
                <Upload className="h-4 w-4" />
                Import data
              </Button>
            </div>
          </div>

          {/* Reset */}
          <div className="settings-section">
            <h3 className="settings-section-title">Reset</h3>
            <div className="space-y-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleResetOnboarding}
                className="w-full justify-start gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Reset onboarding
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="w-full justify-start gap-2 text-[var(--destructive)]"
              >
                <RotateCcw className="h-4 w-4" />
                Reset all settings
              </Button>
            </div>
          </div>

          {/* Save Button */}
          {hasChanges && (
            <div className="settings-save-section">
              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={handleSave}
                className="w-full"
              >
                Save changes
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

