interface OutputConsoleProps {
  output: string[];
  error: string | null;
}

export const OutputConsole = ({ output, error }: OutputConsoleProps) => {
  return (
    <div className="h-full flex flex-col">
      <label htmlFor="output-console" className="text-sm font-semibold mb-2 text-foreground">
        Output Console
      </label>
      <div
        id="output-console"
        role="log"
        aria-live="polite"
        aria-atomic="false"
        aria-label="Code output console"
        className="flex-1 p-4 bg-card border-2 border-border rounded-md font-mono text-base overflow-y-auto"
      >
        {error ? (
          <div className="text-destructive" role="alert" aria-live="assertive">
            <strong>Error:</strong> {error}
          </div>
        ) : output.length > 0 ? (
          output.map((line, index) => (
            <div key={index} className="text-foreground mb-1">
              {line}
            </div>
          ))
        ) : (
          <div className="text-muted-foreground italic">
            Output will appear here...
          </div>
        )}
      </div>
    </div>
  );
};
