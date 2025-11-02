import { useState, useCallback, useEffect } from "react";
import { CodeEditor } from "@/components/CodeEditor";
import { OutputConsole } from "@/components/OutputConsole";
import { ControlPanel } from "@/components/ControlPanel";
import { FileManager, CodeFile } from "@/components/FileManager";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { toast } from "sonner";
import codeableLogo from "@/assets/codeable-logo.png";
const Index = () => {
  const [files, setFiles] = useState<CodeFile[]>([
    {
      id: "1",
      name: "untitled.js",
      content: "",
      language: "javascript",
    },
  ]);
  const [currentFileId, setCurrentFileId] = useState("1");
  const [output, setOutput] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [pyodideInstance, setPyodideInstance] = useState<any>(null);

  const currentFile = files.find((f) => f.id === currentFileId) || files[0];
  const code = currentFile.content;
  const language = currentFile.language;
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
  const updateCurrentFileContent = useCallback((newContent: string) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === currentFileId ? { ...f, content: newContent } : f
      )
    );
  }, [currentFileId]);

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
    updateCurrentFileContent("");
    setOutput([]);
    setError(null);
    speak("Code editor cleared");
    toast.info("Editor cleared");
  }, [speak, updateCurrentFileContent]);
  const handleLanguageChange = useCallback(
    (newLanguage: string) => {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === currentFileId ? { ...f, language: newLanguage } : f
        )
      );
      setOutput([]);
      setError(null);
      speak(`Switched to ${newLanguage}`);
      toast.info(`Language changed to ${newLanguage}`);
    },
    [speak, currentFileId]
  );
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

  const handleFileUpload = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;

        // Detect language from file extension
        const extension = file.name.split(".").pop()?.toLowerCase();
        let detectedLanguage = "javascript";

        if (extension === "js") {
          detectedLanguage = "javascript";
        } else if (extension === "py") {
          detectedLanguage = "python";
        } else if (extension === "html" || extension === "css") {
          detectedLanguage = "html";
        }

        // Create new file with uploaded content
        const newFile: CodeFile = {
          id: Date.now().toString(),
          name: file.name,
          content: content,
          language: detectedLanguage,
        };

        setFiles((prev) => [...prev, newFile]);
        setCurrentFileId(newFile.id);

        speak(`File ${file.name} uploaded successfully`);
        toast.success(`File uploaded: ${file.name}`);
      };

      reader.onerror = () => {
        speak("Error reading file");
        toast.error("Failed to read file");
      };

      reader.readAsText(file);
    },
    [speak]
  );

  const handleFileDownload = useCallback(() => {
    if (!code.trim()) {
      speak("No code to download");
      toast.error("Editor is empty");
      return;
    }

    const fileName = currentFile.name;

    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    speak(`Code downloaded as ${fileName}`);
    toast.success(`Downloaded: ${fileName}`);
  }, [code, currentFile.name, speak]);

  const handleFileCreate = useCallback(() => {
    const newFile: CodeFile = {
      id: Date.now().toString(),
      name: "untitled.js",
      content: "",
      language: "javascript",
    };
    setFiles((prev) => [...prev, newFile]);
    setCurrentFileId(newFile.id);
    setOutput([]);
    setError(null);
    speak("New file created");
    toast.success("New file created");
  }, [speak]);

  const handleFileDelete = useCallback(
    (fileId: string) => {
      if (files.length === 1) {
        toast.error("Cannot delete the last file");
        return;
      }

      const fileToDelete = files.find((f) => f.id === fileId);
      setFiles((prev) => prev.filter((f) => f.id !== fileId));

      if (currentFileId === fileId) {
        const remainingFiles = files.filter((f) => f.id !== fileId);
        setCurrentFileId(remainingFiles[0].id);
      }

      speak(`File ${fileToDelete?.name} deleted`);
      toast.success("File deleted");
    },
    [files, currentFileId, speak]
  );

  const handleFileRename = useCallback(
    (fileId: string, newName: string) => {
      setFiles((prev) =>
        prev.map((f) => (f.id === fileId ? { ...f, name: newName } : f))
      );
      speak(`File renamed to ${newName}`);
      toast.success("File renamed");
    },
    [speak]
  );
  return <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b-2 border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <img 
              src={codeableLogo} 
              alt="CodeAble Logo" 
              className="h-16 w-auto"
            />
            <div>
              <h1 className="sr-only">
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
          <ControlPanel 
            onRun={runCode} 
            onClear={clearCode} 
            audioEnabled={audioEnabled} 
            onAudioToggle={handleAudioToggle} 
            language={language} 
            onLanguageChange={handleLanguageChange}
            onUpload={handleFileUpload}
            onDownload={handleFileDownload}
          />

          {/* Editor and Output Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_1fr] gap-6 h-[600px]">
            <FileManager
              files={files}
              currentFileId={currentFileId}
              onFileSelect={setCurrentFileId}
              onFileCreate={handleFileCreate}
              onFileDelete={handleFileDelete}
              onFileRename={handleFileRename}
            />
            <CodeEditor
              code={code}
              onChange={updateCurrentFileContent}
              onKeyDown={handleKeyDown}
              language={language}
            />
            <OutputConsole
              output={output}
              error={error}
              htmlCode={language === "html" ? code : undefined}
            />
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