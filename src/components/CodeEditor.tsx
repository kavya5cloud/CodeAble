import { useEffect, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

export const CodeEditor = ({ code, onChange, onKeyDown }: CodeEditorProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Focus on mount for immediate keyboard access
    textareaRef.current?.focus();
  }, []);

  return (
    <div className="h-full flex flex-col">
      <label
        htmlFor="code-editor"
        className="text-sm font-semibold mb-2 text-foreground"
      >
        JavaScript Code Editor
      </label>
      <Textarea
        ref={textareaRef}
        id="code-editor"
        value={code}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="// Write your JavaScript code here
// Press Ctrl+Enter to run
// Press Ctrl+K to clear

console.log('Hello, CodeAble!');"
        className="flex-1 font-mono text-lg resize-none bg-card border-2 border-border focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all"
        aria-label="JavaScript code editor. Press Control plus Enter to run code. Press Control plus K to clear code."
        aria-describedby="editor-instructions"
        spellCheck={false}
      />
      <div id="editor-instructions" className="sr-only">
        This is the code editor. Type your JavaScript code here. Use Control plus Enter to execute the code, Control plus K to clear the editor, and Tab to navigate to the controls.
      </div>
    </div>
  );
};
