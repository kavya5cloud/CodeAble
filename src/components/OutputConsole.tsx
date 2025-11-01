import { Terminal } from "lucide-react";

interface OutputConsoleProps {
  output: string[];
  error: string | null;
  htmlCode?: string;
}

export const OutputConsole = ({ output, error, htmlCode }: OutputConsoleProps) => {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 mb-2">
        <Terminal className="h-5 w-5 text-primary" aria-hidden="true" />
        <label className="text-sm font-semibold text-foreground">
          Output Console
        </label>
      </div>
      <div
        className="flex-1 overflow-auto font-mono text-base p-4 bg-secondary/20 rounded-md"
        role="log"
        aria-live="polite"
        aria-atomic="false"
      >
        {error ? (
          <div className="text-destructive" role="alert">
            <strong>Error:</strong> {error}
          </div>
        ) : htmlCode ? (
          <iframe
            srcDoc={htmlCode}
            title="HTML Output"
            className="w-full h-full border-0 bg-white rounded"
            sandbox="allow-scripts"
          />
        ) : output.length > 0 ? (
          output.map((line, index) => (
            <div key={index} className="mb-1">
              {line}
            </div>
          ))
        ) : (
          <div className="text-muted-foreground italic">
            Output will appear here after running code
          </div>
        )}
      </div>
    </div>
  );
};
