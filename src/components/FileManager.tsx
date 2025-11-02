import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, X, Edit2, Check } from "lucide-react";
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

  const startRename = (file: CodeFile, e: React.MouseEvent) => {
    e.stopPropagation();
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

  const handleDelete = (fileId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onFileDelete(fileId);
  };

  return (
    <div className="flex items-center gap-2 bg-card border-b-2 border-border px-2 py-1">
      <ScrollArea className="flex-1">
        <div className="flex items-center gap-1">
          {files.map((file) => (
            <div
              key={file.id}
              onClick={() => !editingFileId && onFileSelect(file.id)}
              className={cn(
                "group flex items-center gap-1.5 px-3 py-1.5 rounded-md cursor-pointer transition-colors text-sm",
                currentFileId === file.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/50 hover:bg-muted text-foreground"
              )}
            >
              {editingFileId === file.id ? (
                <>
                  <Input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="h-6 w-32 text-xs px-2"
                    autoFocus
                    aria-label="Rename file"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-5 w-5 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      confirmRename();
                    }}
                    aria-label="Confirm rename"
                  >
                    <Check className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-5 w-5 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      cancelRename();
                    }}
                    aria-label="Cancel rename"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </>
              ) : (
                <>
                  <span className="truncate max-w-[120px]" title={file.name}>
                    {file.name}
                  </span>
                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-4 w-4 p-0"
                      onClick={(e) => startRename(file, e)}
                      aria-label={`Rename ${file.name}`}
                    >
                      <Edit2 className="h-2.5 w-2.5" />
                    </Button>
                    {files.length > 1 && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-4 w-4 p-0 hover:text-destructive"
                        onClick={(e) => handleDelete(file.id, e)}
                        aria-label={`Close ${file.name}`}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
      <Button
        size="sm"
        variant="ghost"
        onClick={onFileCreate}
        className="h-7 w-7 p-0 flex-shrink-0"
        aria-label="Create new file"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
};
