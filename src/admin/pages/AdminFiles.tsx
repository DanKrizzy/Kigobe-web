import { useRef, useState } from "react";
import { Copy, FolderOpen, HardDrive, Loader2, Trash2, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { PageHeader, EmptyState } from "@/admin/components/AdminUI";
import { useMedia, readFileAsDataUrl, MAX_UPLOAD_BYTES } from "@/admin/stores/adminDataStore";
import { logActivity } from "@/data/siteData";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function AdminFiles() {
  const { items, add, remove } = useMedia();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const totalBytes = items.reduce((sum, file) => sum + (file.size || 0), 0);

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    let success = 0;
    for (const file of Array.from(files)) {
      try {
        const dataUrl = await readFileAsDataUrl(file);
        add({
          name: file.name,
          dataUrl,
          size: file.size,
          createdAt: new Date().toISOString(),
        });
        success += 1;
      } catch (error) {
        toast.error(error instanceof Error ? error.message : `Could not upload ${file.name}`);
      }
    }
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
    if (success > 0) {
      logActivity("uploaded", `${success} file${success > 1 ? "s" : ""}`);
      toast.success(`${success} file${success > 1 ? "s" : ""} uploaded`);
    }
  };

  const copyUrl = async (dataUrl: string) => {
    try {
      await navigator.clipboard.writeText(dataUrl);
      toast.success("Image data copied to clipboard");
    } catch {
      toast.error("Could not copy to clipboard");
    }
  };

  return (
    <div>
      <PageHeader
        title="Files"
        description="A media library of images you can reuse anywhere on the site."
        actions={
          <>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleUpload(e.target.files)}
            />
            <Button
              onClick={() => inputRef.current?.click()}
              className="gradient-primary gap-1.5"
              disabled={uploading}
            >
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
              {uploading ? "Uploading..." : "Upload files"}
            </Button>
          </>
        }
      />

      <div className="flex flex-wrap items-center gap-3 mb-4 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <HardDrive className="w-4 h-4" /> {items.length} files · {formatBytes(totalBytes)}
        </span>
        <span className="text-xs">Limit {formatBytes(MAX_UPLOAD_BYTES)} per file · browser storage ~5 MB</span>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={<FolderOpen className="w-6 h-6" />}
          title="Your media library is empty"
          description="Upload images here to keep them organised and reuse them across the website."
          action={
            <Button onClick={() => inputRef.current?.click()} className="gradient-primary gap-1.5">
              <UploadCloud className="w-4 h-4" /> Upload files
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map((file) => (
            <Card key={file.id} className="overflow-hidden group">
              <div className="aspect-square bg-muted">
                <img src={file.dataUrl} alt={file.name} className="w-full h-full object-cover" />
              </div>
              <CardContent className="p-3">
                <p className="text-sm font-semibold text-foreground truncate">{file.name}</p>
                <div className="flex items-center justify-between mt-1">
                  <Badge variant="secondary" className="text-[10px]">{formatBytes(file.size)}</Badge>
                  <div className="flex items-center gap-0.5">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => copyUrl(file.dataUrl)} aria-label="Copy">
                      <Copy className="w-3.5 h-3.5" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" aria-label="Delete">
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete file?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Delete “{file.name}” from your media library? Places where it is already used will not change.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => {
                              remove(file.id);
                              logActivity("deleted", `file “${file.name}”`);
                              toast.success("File deleted");
                            }}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
