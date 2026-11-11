import { useRef, useState, type ReactNode } from "react";
import { Loader2, Trash2, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
import { readFileAsDataUrl } from "@/admin/stores/adminDataStore";

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">{title}</h1>
        {description && <p className="text-muted-foreground text-sm mt-1">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Field({
  label,
  hint,
  children,
  className = "",
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="block text-sm font-semibold text-foreground mb-1.5">{label}</span>
      {children}
      {hint && <span className="block text-xs text-muted-foreground mt-1">{hint}</span>}
    </label>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 bg-card rounded-2xl border border-dashed border-border">
      {icon && <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4 text-muted-foreground">{icon}</div>}
      <h3 className="font-display font-bold text-foreground text-lg">{title}</h3>
      {description && <p className="text-muted-foreground text-sm mt-1 max-w-md">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function ConfirmDeleteButton({
  onConfirm,
  label = "Delete",
  description = "This action cannot be undone.",
}: {
  onConfirm: () => void;
  label?: string;
  description?: string;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" aria-label={label}>
          <Trash2 className="w-4 h-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{label}?</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function ImageUploader({
  value,
  onChange,
  label = "Upload image",
  className = "",
}: {
  value?: string;
  onChange: (dataUrl: string) => void;
  label?: string;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file?: File) => {
    if (!file) return;
    setUploading(true);
    try {
      const dataUrl = await readFileAsDataUrl(file);
      onChange(dataUrl);
      toast.success("Image uploaded");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className={className}>
      <div className="flex items-center gap-3">
        <div className="w-20 h-20 rounded-xl overflow-hidden bg-muted border border-border shrink-0 flex items-center justify-center">
          {value ? (
            <img src={value} alt="Upload preview" className="w-full h-full object-cover" />
          ) : (
            <UploadCloud className="w-6 h-6 text-muted-foreground" />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="gap-1.5"
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
            {uploading ? "Uploading..." : label}
          </Button>
          {value && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onChange("")}
              className="justify-start text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-1.5" />
              Remove image
            </Button>
          )}
          <span className="text-xs text-muted-foreground">PNG, JPG or WEBP · max 2 MB</span>
        </div>
      </div>
    </div>
  );
}
