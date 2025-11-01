import { useState, useCallback } from "react";
import { CodeEditor } from "@/components/CodeEditor";
import { OutputConsole } from "@/components/OutputConsole";
import { ControlPanel } from "@/components/ControlPanel";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { toast } from "sonner";
import { Code2 } from "lucide-react";

const Index = () => {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(true);

  const { speak } = useTextToSpeech(audioEnabled);

  const runCode = useCallback(() => {
    setOutput([]);
    setError(null);

    // Override console.log to capture output
    const logs: string[] = [];
    const originalLog = console.log;
    console.log = (...args: any[]) => {
      const message = args.map((arg) => String(arg)).join(" ");
      logs.push(message);
      originalLog.apply(console, args);
    };

    try {
      // Execute the code
      eval(code);
      setOutput(logs);

      if (logs.length > 0) {
        speak(`Code executed successfully. Output: ${logs.join(". ")}`);
        toast.success("Code executed successfully");
      } else {
        speak("Code executed successfully with no output");
        toast.success("Code executed successfully");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      speak(`Error: ${errorMessage}`);
      toast.error("Code execution failed");
    } finally {
      // Restore console.log
      console.log = originalLog;
    }
  }, [code, speak]);

  const clearCode = useCallback(() => {
    setCode("");
    setOutput([]);
    setError(null);
    speak("Code editor cleared");
    toast.info("Editor cleared");
  }, [speak]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.ctrlKey && e.key === "Enter") {
        e.preventDefault();
        runCode();
      } else if (e.ctrlKey && e.key === "k") {
        e.preventDefault();
        clearCode();
      }
    },
    [runCode, clearCode]
  );

  const handleAudioToggle = useCallback(
    (enabled: boolean) => {
      setAudioEnabled(enabled);
      speak(enabled ? "Audio feedback enabled" : "Audio feedback disabled");
      toast.info(enabled ? "Audio feedback enabled" : "Audio feedback disabled");
    },
    [speak]
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b-2 border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Code2 className="h-10 w-10 text-primary" aria-hidden="true" />
            <div>
              <h1 className="text-4xl font-bold text-primary">
                CodeAble
              </h1>
              <p className="text-muted-foreground text-lg">
                Accessible JavaScript Code Editor
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div
          className="space-y-6"
          role="main"
          aria-label="Code editor workspace"
        >
          {/* Screen reader announcement for keyboard shortcuts */}
          <div className="sr-only" role="status" aria-live="polite">
            Welcome to CodeAble. Use Control plus Enter to run code, Control plus K to clear the editor.
          </div>

          {/* Control Panel */}
          <ControlPanel
            onRun={runCode}
            onClear={clearCode}
            audioEnabled={audioEnabled}
            onAudioToggle={handleAudioToggle}
          />

          {/* Editor and Output Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[600px]">
            <CodeEditor
              code={code}
              onChange={setCode}
              onKeyDown={handleKeyDown}
            />
            <OutputConsole output={output} error={error} />
          </div>

          {/* Keyboard Shortcuts Info */}
          <div
            className="bg-card border-2 border-border rounded-md p-4"
            role="region"
            aria-label="Keyboard shortcuts"
          >
            <h2 className="text-xl font-semibold mb-3 text-primary">
              Keyboard Shortcuts
            </h2>
            <ul className="space-y-2 text-base">
              <li>
                <kbd className="px-2 py-1 bg-secondary rounded text-sm font-mono">
                  Ctrl + Enter
                </kbd>
                <span className="ml-2">Run code</span>
              </li>
              <li>
                <kbd className="px-2 py-1 bg-secondary rounded text-sm font-mono">
                  Ctrl + K
                </kbd>
                <span className="ml-2">Clear editor</span>
              </li>
              <li>
                <kbd className="px-2 py-1 bg-secondary rounded text-sm font-mono">
                  Tab
                </kbd>
                <span className="ml-2">Navigate between controls</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
