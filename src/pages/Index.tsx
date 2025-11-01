import { useState, useCallback, useEffect } from "react";
import { CodeEditor } from "@/components/CodeEditor";
import { OutputConsole } from "@/components/OutputConsole";
import { ControlPanel } from "@/components/ControlPanel";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { toast } from "sonner";
const Index = () => {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [language, setLanguage] = useState("javascript");
  const [pyodideInstance, setPyodideInstance] = useState<any>(null);
  const {
    speak
  } = useTextToSpeech(audioEnabled);

  // Initialize Pyodide for Python execution
  useEffect(() => {
    if (language === "python" && !pyodideInstance) {
      const loadPyodide = async () => {
        try {
          // @ts-ignore
          const pyodide = await window.loadPyodide({
            indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/"
          });
          setPyodideInstance(pyodide);
        } catch (err) {
          console.error("Failed to load Pyodide:", err);
        }
      };
      loadPyodide();
    }
  }, [language, pyodideInstance]);
  const runCode = useCallback(async () => {
    setOutput([]);
    setError(null);
    try {
      if (language === "javascript") {
        // Override console.log to capture output
        const logs: string[] = [];
        const originalLog = console.log;
        console.log = (...args: any[]) => {
          const message = args.map(arg => String(arg)).join(" ");
          logs.push(message);
          originalLog.apply(console, args);
        };
        try {
          eval(code);
          setOutput(logs);
          if (logs.length > 0) {
            speak(`JavaScript executed successfully. Output: ${logs.join(". ")}`);
            toast.success("Code executed successfully");
          } else {
            speak("JavaScript executed successfully with no output");
            toast.success("Code executed successfully");
          }
        } finally {
          console.log = originalLog;
        }
      } else if (language === "python") {
        if (!pyodideInstance) {
          speak("Python environment is loading, please wait");
          toast.error("Python environment is still loading");
          return;
        }
        try {
          // Capture Python stdout
          pyodideInstance.runPython(`
import sys
from io import StringIO
sys.stdout = StringIO()
          `);

          // Run user code
          pyodideInstance.runPython(code);

          // Get output
          const pythonOutput = pyodideInstance.runPython("sys.stdout.getvalue()");
          const outputLines = pythonOutput ? pythonOutput.split("\n").filter((line: string) => line.trim()) : [];
          setOutput(outputLines);
          if (outputLines.length > 0) {
            speak(`Python executed successfully. Output: ${outputLines.join(". ")}`);
            toast.success("Code executed successfully");
          } else {
            speak("Python executed successfully with no output");
            toast.success("Code executed successfully");
          }
        } catch (err: any) {
          throw new Error(err.message || String(err));
        }
      } else if (language === "html") {
        // For HTML, we'll display it in the output console as rendered HTML
        setOutput([`[HTML Rendered Below]`]);
        speak("HTML code rendered successfully");
        toast.success("HTML rendered successfully");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      speak(`Error: ${errorMessage}`);
      toast.error("Code execution failed");
    }
  }, [code, speak, language, pyodideInstance]);
  const clearCode = useCallback(() => {
    setCode("");
    setOutput([]);
    setError(null);
    speak("Code editor cleared");
    toast.info("Editor cleared");
  }, [speak]);
  const handleLanguageChange = useCallback((newLanguage: string) => {
    setLanguage(newLanguage);
    setCode("");
    setOutput([]);
    setError(null);
    speak(`Switched to ${newLanguage}`);
    toast.info(`Language changed to ${newLanguage}`);
  }, [speak]);
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey && e.key === "Enter") {
      e.preventDefault();
      runCode();
    } else if (e.ctrlKey && e.key === "k") {
      e.preventDefault();
      clearCode();
    }
  }, [runCode, clearCode]);
  const handleAudioToggle = useCallback((enabled: boolean) => {
    setAudioEnabled(enabled);
    speak(enabled ? "Audio feedback enabled" : "Audio feedback disabled");
    toast.info(enabled ? "Audio feedback enabled" : "Audio feedback disabled");
  }, [speak]);
  return <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b-2 border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            
            <div>
              <h1 className="text-4xl font-bold text-primary">
                CodeAble
              </h1>
              <p className="text-muted-foreground text-lg">Accessible Code Editor for all minds</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6" role="main" aria-label="Code editor workspace">
          {/* Screen reader announcement for keyboard shortcuts */}
          <div className="sr-only" role="status" aria-live="polite">
            Welcome to CodeAble. Use Control plus Enter to run code, Control plus K to clear the editor.
          </div>

          {/* Control Panel */}
          <ControlPanel onRun={runCode} onClear={clearCode} audioEnabled={audioEnabled} onAudioToggle={handleAudioToggle} language={language} onLanguageChange={handleLanguageChange} />

          {/* Editor and Output Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[600px]">
            <CodeEditor code={code} onChange={setCode} onKeyDown={handleKeyDown} language={language} />
            <OutputConsole output={output} error={error} htmlCode={language === "html" ? code : undefined} />
          </div>

          {/* Keyboard Shortcuts Info */}
          <div className="bg-card border-2 border-border rounded-md p-4" role="region" aria-label="Keyboard shortcuts">
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
    </div>;
};
export default Index;