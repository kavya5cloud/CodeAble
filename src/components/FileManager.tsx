import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { File, Plus, Trash2, Edit2, X, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CodeFile {
  id: string;
  name: string;
  content: string;
  language: string;
}

interface FileManagerProps {
  files: CodeFile[];
  currentFileId: string;
  onFileSelect: (fileId: string) => void;
  onFileCreate: () => void;
  onFileDelete: (fileId: string) => void;
  onFileRename: (fileId: string, newName: string) => void;
}

export const FileManager = ({
  files,
  currentFileId,
  onFileSelect,
  onFileCreate,
  onFileDelete,
  onFileRename,
}: FileManagerProps) => {
  const [editingFileId, setEditingFileId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const startRename = (file: CodeFile) => {
    setEditingFileId(file.id);
    setEditingName(file.name);
  };

  const confirmRename = () => {
    if (editingFileId && editingName.trim()) {
      onFileRename(editingFileId, editingName.trim());
      setEditingFileId(null);
      setEditingName("");
    }
  };

  const cancelRename = () => {
    setEditingFileId(null);
    setEditingName("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      confirmRename();
    } else if (e.key === "Escape") {
      cancelRename();
    }
  };

  return (
    <div className="h-full flex flex-col bg-card border-2 border-border rounded-md">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h2 className="text-lg font-semibold text-primary">Files</h2>
        <Button
          size="sm"
          onClick={onFileCreate}
          className="gap-2"
          aria-label="Create new file"
        >
          <Plus className="h-4 w-4" />
          New
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {files.map((file) => (
            <div
              key={file.id}
              className={cn(
                "group flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 transition-colors",
                currentFileId === file.id && "bg-muted"
              )}
            >
              {editingFileId === file.id ? (
                <>
                  <Input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="h-7 text-sm"
                    autoFocus
                    aria-label="Rename file"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 w-7 p-0"
                    onClick={confirmRename}
                    aria-label="Confirm rename"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 w-7 p-0"
                    onClick={cancelRename}
                    aria-label="Cancel rename"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <File className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <button
                    onClick={() => onFileSelect(file.id)}
                    className={cn(
                      "flex-1 text-left text-sm truncate",
                      currentFileId === file.id
                        ? "text-primary font-medium"
                        : "text-foreground"
                    )}
                    aria-label={`Open ${file.name}`}
                    aria-current={currentFileId === file.id ? "true" : undefined}
                  >
                    {file.name}
                  </button>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0"
                      onClick={() => startRename(file)}
                      aria-label={`Rename ${file.name}`}
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                    {files.length > 1 && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                        onClick={() => onFileDelete(file.id)}
                        aria-label={`Delete ${file.name}`}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
