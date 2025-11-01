import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Play, Trash2, Volume2, VolumeX } from "lucide-react";

interface ControlPanelProps {
  onRun: () => void;
  onClear: () => void;
  audioEnabled: boolean;
  onAudioToggle: (enabled: boolean) => void;
}

export const ControlPanel = ({
  onRun,
  onClear,
  audioEnabled,
  onAudioToggle,
}: ControlPanelProps) => {
  return (
    <div className="flex flex-wrap items-center gap-4 p-4 bg-card border-2 border-border rounded-md">
      <Button
        onClick={onRun}
        size="lg"
        className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-4 focus:ring-primary/50 transition-all"
        aria-label="Run code. Keyboard shortcut: Control plus Enter"
      >
        <Play className="h-5 w-5" aria-hidden="true" />
        Run Code
      </Button>

      <Button
        onClick={onClear}
        size="lg"
        variant="secondary"
        className="gap-2 focus:ring-4 focus:ring-secondary/50 transition-all"
        aria-label="Clear code editor. Keyboard shortcut: Control plus K"
      >
        <Trash2 className="h-5 w-5" aria-hidden="true" />
        Clear
      </Button>

      <div className="flex items-center gap-3 ml-auto">
        <Label
          htmlFor="audio-toggle"
          className="text-base font-medium cursor-pointer"
        >
          Audio Feedback
        </Label>
        <div className="flex items-center gap-2">
          {audioEnabled ? (
            <Volume2 className="h-5 w-5 text-primary" aria-hidden="true" />
          ) : (
            <VolumeX className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
          )}
          <Switch
            id="audio-toggle"
            checked={audioEnabled}
            onCheckedChange={onAudioToggle}
            aria-label={`Audio feedback is currently ${audioEnabled ? "enabled" : "disabled"}`}
            className="focus:ring-4 focus:ring-primary/50"
          />
        </div>
      </div>
    </div>
  );
};
