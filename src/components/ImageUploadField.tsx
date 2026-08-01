import { useRef, useState } from "react";
import { Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { uploadOptimizedImage } from "@/lib/image-upload";

type Props = {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  required?: boolean;
};

export function ImageUploadField({ value, onChange, label = "Image", required }: Props) {
  const [busy, setBusy] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  const pick = async (file?: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("Please choose an image file");
    setBusy(true);
    try {
      const url = await uploadOptimizedImage(file);
      onChange(url);
      toast.success("Image optimized & uploaded");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
      if (ref.current) ref.current.value = "";
    }
  };

  return (
    <label className="block text-sm">
      <span className="text-xs uppercase tracking-widest text-muted-foreground">{label}</span>
      <div className="mt-1.5 flex items-center gap-3">
        {value ? (
          <img src={value} alt="" className="w-14 h-14 rounded-md object-cover border hairline shrink-0" />
        ) : (
          <div className="w-14 h-14 rounded-md bg-secondary border hairline shrink-0" />
        )}
        <div className="min-w-0 flex-1 space-y-1.5">
          <input
            value={value}
            required={required}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Paste a URL or upload"
            className="w-full px-3 py-2 rounded-md border hairline bg-background text-sm"
          />
          <button
            type="button"
            disabled={busy}
            onClick={() => ref.current?.click()}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border hairline text-xs uppercase tracking-widest hover:bg-secondary disabled:opacity-60"
          >
            {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
            {busy ? "Optimizing…" : "Upload image"}
          </button>
          <p className="text-[11px] text-muted-foreground">Auto-resized to 1600px and converted to WebP.</p>
        </div>
        <input ref={ref} type="file" accept="image/*" className="hidden" onChange={(e) => pick(e.target.files?.[0])} />
      </div>
    </label>
  );
}
