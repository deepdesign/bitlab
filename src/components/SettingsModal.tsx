import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Switch } from "@/components/retroui/Switch";
import { Accordion } from "@/components/retroui/Accordion";
import { X, Settings, Keyboard, Info, RotateCcw, Download, Upload } from "lucide-react";
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
}

const KEYBOARD_SHORTCUTS = [
  { key: "R", description: "Randomise all sprites" },
  { key: "F / F11", description: "Toggle fullscreen mode" },
  { key: "P", description: "Open Presets manager" },
  { key: "E", description: "Open Export modal" },
  { key: "T", description: "Cycle theme mode (System → Light → Dark)" },
  { key: "1, 2, 3, 4", description: "Switch between control tabs" },
  { key: "ESC", description: "Exit fullscreen / Close modals" },
  { key: "?", description: "Open Help menu" },
];

export const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
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
          {/* Accessibility Section */}
          <div className="settings-section">
            <h3 className="settings-section-title">Accessibility</h3>
            <div className="settings-item">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="field-heading-left mb-1">
                    <span className="field-label">Reduce Motion</span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)]">
                    Minimize animations and transitions for better accessibility
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

          {/* Keyboard Shortcuts Section */}
          <div className="settings-section">
            <h3 className="settings-section-title">Keyboard Shortcuts</h3>
            <div className="settings-shortcuts">
              {KEYBOARD_SHORTCUTS.map((shortcut, index) => (
                <div key={index} className="settings-shortcut-item">
                  <kbd className="settings-shortcut-key">{shortcut.key}</kbd>
                  <span className="settings-shortcut-description">
                    {shortcut.description}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* About Section */}
          <Accordion type="single" collapsible className="settings-accordion">
            <Accordion.Item value="about">
              <Accordion.Header className="settings-accordion-trigger">
                <Info className="h-4 w-4" />
                <span>About</span>
              </Accordion.Header>
              <Accordion.Content className="settings-accordion-content">
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
              </Accordion.Content>
            </Accordion.Item>
          </Accordion>

          {/* Data Management Section */}
          <div className="settings-section">
            <h3 className="settings-section-title">Data Management</h3>
            <div className="space-y-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleExportData}
                className="w-full justify-start gap-2"
              >
                <Download className="h-4 w-4" />
                Export All Data
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleImportData}
                className="w-full justify-start gap-2"
              >
                <Upload className="h-4 w-4" />
                Import Data
              </Button>
            </div>
          </div>

          {/* Reset Section */}
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
                Reset Onboarding
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="w-full justify-start gap-2 text-[var(--destructive)]"
              >
                <RotateCcw className="h-4 w-4" />
                Reset All Settings
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
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

