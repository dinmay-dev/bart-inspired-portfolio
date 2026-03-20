import { useState, useRef } from "react";
import { Upload, Trash2, Loader2, FileText } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const imageSlots = [
  { key: "hero_image", label: "Hero Photo", path: "hero.webp" },
  { key: "about_image", label: "About / Whiteboard Image", path: "about.webp" },
];

const ImagesPage = () => {
  const { get, update, getImageUrl, uploadImage, refresh } = useSiteContent();
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const [resumeUploading, setResumeUploading] = useState(false);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const resumeInputRef = useRef<HTMLInputElement | null>(null);

  const handleUpload = async (slot: typeof imageSlots[0], file: File) => {
    setUploading((prev) => ({ ...prev, [slot.key]: true }));
    try {
      const ext = file.name.split(".").pop() || "webp";
      const path = `${slot.key}.${ext}`;
      await uploadImage(file, path);
      await update(slot.key, path);
      refresh();
      toast.success(`${slot.label} uploaded!`);
    } catch (err: any) {
      toast.error(`Upload failed: ${err.message}`);
    } finally {
      setUploading((prev) => ({ ...prev, [slot.key]: false }));
    }
  };

  const handleRemove = async (slot: typeof imageSlots[0]) => {
    try {
      await update(slot.key, "");
      refresh();
      toast.success(`${slot.label} removed (will use default)`);
    } catch {
      toast.error("Failed to remove image");
    }
  };

  const handleResumeUpload = async (file: File) => {
    setResumeUploading(true);
    try {
      const ext = file.name.split(".").pop() || "pdf";
      const path = `resume.${ext}`;
      const { error } = await supabase.storage
        .from("site-images")
        .upload(path, file, { upsert: true });
      if (error) throw error;
      const { data } = supabase.storage.from("site-images").getPublicUrl(path);
      await update("resume_url", data.publicUrl);
      refresh();
      toast.success("Resume uploaded!");
    } catch (err: any) {
      toast.error(`Resume upload failed: ${err.message}`);
    } finally {
      setResumeUploading(false);
    }
  };

  const handleResumeRemove = async () => {
    try {
      await update("resume_url", "");
      refresh();
      toast.success("Resume removed");
    } catch {
      toast.error("Failed to remove resume");
    }
  };

  const resumeUrl = get("resume_url", "");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Image & File Manager</h1>
        <p className="text-muted-foreground mt-1">Upload and manage site images and files.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {imageSlots.map((slot) => {
          const currentPath = get(slot.key, "");
          const imageUrl = currentPath ? getImageUrl(currentPath) : null;

          return (
            <div key={slot.key} className="border border-border bg-card overflow-hidden">
              <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                <h3 className="font-semibold text-foreground text-sm">{slot.label}</h3>
                {currentPath && (
                  <button
                    onClick={() => handleRemove(slot)}
                    className="text-muted-foreground hover:text-accent transition-colors"
                    title="Remove (use default)"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="p-6">
                {imageUrl ? (
                  <div className="relative group mb-4">
                    <img src={imageUrl} alt={slot.label} className="w-full h-48 object-cover border border-border" />
                    <div className="absolute inset-0 bg-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        onClick={() => fileInputRefs.current[slot.key]?.click()}
                        className="bg-accent text-accent-foreground px-4 py-2 text-sm font-semibold"
                      >
                        Replace
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="h-48 border-2 border-dashed border-border flex items-center justify-center mb-4">
                    <p className="text-sm text-muted-foreground">Using default image</p>
                  </div>
                )}

                <input
                  ref={(el) => { fileInputRefs.current[slot.key] = el; }}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUpload(slot, file);
                    e.target.value = "";
                  }}
                />

                <button
                  onClick={() => fileInputRefs.current[slot.key]?.click()}
                  disabled={uploading[slot.key]}
                  className="w-full border border-border py-2.5 text-sm font-semibold text-foreground hover:border-accent transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {uploading[slot.key] ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</>
                  ) : (
                    <><Upload className="w-4 h-4" /> Upload Image</>
                  )}
                </button>
              </div>
            </div>
          );
        })}

        {/* Resume Upload Card */}
        <div className="border border-border bg-card overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <h3 className="font-semibold text-foreground text-sm">Resume / CV</h3>
            {resumeUrl && (
              <button
                onClick={handleResumeRemove}
                className="text-muted-foreground hover:text-accent transition-colors"
                title="Remove resume"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="p-6">
            {resumeUrl ? (
              <div className="h-48 border border-border flex flex-col items-center justify-center gap-3 mb-4 bg-muted/30">
                <FileText className="w-12 h-12 text-accent" />
                <p className="text-sm text-foreground font-medium">Resume uploaded</p>
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-accent hover:underline"
                >
                  View / Download
                </a>
              </div>
            ) : (
              <div className="h-48 border-2 border-dashed border-border flex items-center justify-center mb-4">
                <p className="text-sm text-muted-foreground">No resume uploaded</p>
              </div>
            )}

            <input
              ref={resumeInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleResumeUpload(file);
                e.target.value = "";
              }}
            />

            <button
              onClick={() => resumeInputRef.current?.click()}
              disabled={resumeUploading}
              className="w-full border border-border py-2.5 text-sm font-semibold text-foreground hover:border-accent transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {resumeUploading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</>
              ) : (
                <><Upload className="w-4 h-4" /> Upload Resume</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImagesPage;
