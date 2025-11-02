import { useEffect, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  language: string;
}

export const CodeEditor = ({ code, onChange, onKeyDown, language }: CodeEditorProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Focus on mount for immediate keyboard access
    textareaRef.current?.focus();
  }, []);

  const placeholders = {
    javascript: `// Write your JavaScript code here
// Press Ctrl+Enter to run
// Press Ctrl+K to clear

console.log('Hello, CodeAble!');`,
    python: `# Write your Python code here
# Press Ctrl+Enter to run
# Press Ctrl+K to clear

print('Hello, CodeAble!')`,
    html: `<!-- Write your HTML/CSS code here -->
<!-- Press Ctrl+Enter to run -->
<!-- Press Ctrl+K to clear -->

<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial; padding: 20px; }
    h1 { color: #00d9ff; }
  </style>
</head>
<body>
  <h1>Hello, CodeAble!</h1>
</body>
</html>`
  };

  return (
    <div className="flex-1 flex flex-col">
      <label htmlFor="code-editor" className="sr-only">
        {language === 'javascript' ? 'JavaScript' : language === 'python' ? 'Python' : 'HTML/CSS'} Code Editor
      </label>
      <Textarea
        ref={textareaRef}
        id="code-editor"
        value={code}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholders[language as keyof typeof placeholders]}
        className="flex-1 font-mono text-lg resize-none bg-card border-2 border-border focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all"
        aria-label={`${language} code editor. Press Control plus Enter to run code. Press Control plus K to clear code.`}
        aria-describedby="editor-instructions"
        spellCheck={false}
      />
      <div id="editor-instructions" className="sr-only">
        This is the code editor. Type your code here. Use Control plus Enter to execute the code, Control plus K to clear the editor, and Tab to navigate to the controls.
      </div>
    </div>
  );
};
