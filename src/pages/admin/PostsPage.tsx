import { useState, useRef, useEffect } from "react";
import { Plus, Trash2, Loader2, Upload, X, GripVertical, Save, Eye, EyeOff, Edit2 } from "lucide-react";
import { toast } from "sonner";
import { usePosts } from "@/hooks/usePosts";
import { POST_TYPES, type Post, type PostMedia, type PostType } from "@/types/post";
import { processImage } from "@/lib/imageProcess";
import { uploadToS3, getReadUrl } from "@/lib/s3";

const emptyPost = (): Post => ({
  id: crypto.randomUUID(),
  title: "",
  caption: "",
  type: "photo",
  tags: [],
  media: [],
  created_at: new Date().toISOString(),
  published: true,
});

const MediaThumb = ({ s3Key, onRemove, onDragStart, onDragOver, onDrop }: { s3Key: string; onRemove: () => void; onDragStart: () => void; onDragOver: (e: React.DragEvent) => void; onDrop: () => void; }) => {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => { getReadUrl(s3Key).then(setUrl).catch(() => {}); }, [s3Key]);
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className="relative group aspect-square bg-muted border border-border rounded-md overflow-hidden cursor-move"
    >
      {url && <img src={url} alt="" className="w-full h-full object-cover" />}
      <div className="absolute top-1 left-1 bg-foreground/70 text-background rounded p-1 opacity-0 group-hover:opacity-100">
        <GripVertical className="w-3 h-3" />
      </div>
      <button type="button" onClick={onRemove} className="absolute top-1 right-1 bg-foreground/80 text-background rounded-full p-1 opacity-0 group-hover:opacity-100 hover:bg-accent">
        <X className="w-3 h-3" />
      </button>
    </div>
  );
};

const PostEditor = ({ initial, onSave, onCancel }: { initial: Post; onSave: (p: Post) => Promise<void>; onCancel: () => void; }) => {
  const [post, setPost] = useState<Post>(initial);
  const [tagInput, setTagInput] = useState("");
  const [uploading, setUploading] = useState(0); // count of files in flight
  const [saving, setSaving] = useState(false);
  const dragIndex = useRef<number | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const set = <K extends keyof Post>(k: K, v: Post[K]) => setPost((p) => ({ ...p, [k]: v }));

  const handleFiles = async (files: FileList | File[]) => {
    const arr = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (arr.length === 0) return;
    setUploading((n) => n + arr.length);
    for (const file of arr) {
      try {
        const isCert = post.type === "certificate";
        const proc = await processImage(file, isCert);
        const key = `posts/${post.id}/${crypto.randomUUID()}.webp`;
        await uploadToS3(proc.blob, key);
        const m: PostMedia = {
          s3_key: key,
          width: proc.width,
          height: proc.height,
          blurhash: proc.blurhash,
          mime: proc.mime,
        };
        setPost((p) => ({ ...p, media: [...p.media, m] }));
      } catch (err: any) {
        toast.error(`Upload failed: ${err.message}`);
      } finally {
        setUploading((n) => n - 1);
      }
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
  };

  const removeMedia = (i: number) => {
    setPost((p) => ({ ...p, media: p.media.filter((_, idx) => idx !== i) }));
  };

  const reorder = (to: number) => {
    if (dragIndex.current === null || dragIndex.current === to) return;
    const next = [...post.media];
    const [item] = next.splice(dragIndex.current, 1);
    next.splice(to, 0, item);
    dragIndex.current = null;
    set("media", next);
  };

  const addTag = () => {
    const t = tagInput.trim().replace(/^#/, "");
    if (!t) return;
    if (!post.tags.includes(t)) set("tags", [...post.tags, t]);
    setTagInput("");
  };

  const save = async () => {
    setSaving(true);
    try {
      await onSave(post);
      toast.success("Saved");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-foreground/50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-card border border-border rounded-2xl max-w-2xl w-full my-8 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between z-10">
          <h2 className="font-headline text-lg tracking-tighter-2 text-foreground">{initial.title ? "Edit post" : "New post"}</h2>
          <button onClick={onCancel} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] uppercase tracking-widest font-mono text-muted-foreground">Type</label>
              <select
                value={post.type}
                onChange={(e) => set("type", e.target.value as PostType)}
                className="mt-1 w-full px-3 py-2 rounded-md bg-background border border-border text-sm"
              >
                {POST_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={() => set("published", !post.published)}
                className={`px-4 py-2 rounded-full text-xs font-medium border transition-colors ${post.published ? "bg-accent text-accent-foreground border-accent" : "bg-card text-muted-foreground border-border"}`}
              >
                {post.published ? "Published" : "Draft"}
              </button>
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-widest font-mono text-muted-foreground">Title</label>
            <input
              value={post.title}
              onChange={(e) => set("title", e.target.value)}
              className="mt-1 w-full px-3 py-2 rounded-md bg-background border border-border text-sm"
              placeholder="Optional headline"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-widest font-mono text-muted-foreground">Caption</label>
            <textarea
              value={post.caption}
              onChange={(e) => set("caption", e.target.value)}
              rows={5}
              className="mt-1 w-full px-3 py-2 rounded-md bg-background border border-border text-sm resize-none"
              placeholder="Write something…"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-widest font-mono text-muted-foreground">Tags</label>
            <div className="flex flex-wrap gap-2 mt-1 mb-2">
              {post.tags.map((t) => (
                <span key={t} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-muted text-xs">
                  #{t}
                  <button onClick={() => set("tags", post.tags.filter((x) => x !== t))}><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(); } }}
              className="w-full px-3 py-2 rounded-md bg-background border border-border text-sm"
              placeholder="Type and press Enter…"
            />
          </div>

          {post.type === "certificate" && (
            <div className="grid grid-cols-2 gap-3 p-4 rounded-md bg-muted/30 border border-border">
              <div className="col-span-2 text-[10px] uppercase tracking-widest font-mono text-muted-foreground">Credential details</div>
              <div>
                <label className="text-xs text-muted-foreground">Issuer</label>
                <input value={post.issuer ?? ""} onChange={(e) => set("issuer", e.target.value)} className="mt-1 w-full px-3 py-2 rounded-md bg-background border border-border text-sm" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Issue date</label>
                <input value={post.issue_date ?? ""} onChange={(e) => set("issue_date", e.target.value)} className="mt-1 w-full px-3 py-2 rounded-md bg-background border border-border text-sm" placeholder="May 2025" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Credential URL</label>
                <input value={post.credential_url ?? ""} onChange={(e) => set("credential_url", e.target.value)} className="mt-1 w-full px-3 py-2 rounded-md bg-background border border-border text-sm" placeholder="https://…" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Credential ID</label>
                <input value={post.credential_id ?? ""} onChange={(e) => set("credential_id", e.target.value)} className="mt-1 w-full px-3 py-2 rounded-md bg-background border border-border text-sm" />
              </div>
            </div>
          )}

          <div>
            <label className="text-[10px] uppercase tracking-widest font-mono text-muted-foreground">Media</label>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={onDrop}
              className="mt-1 border-2 border-dashed border-border rounded-lg p-4"
            >
              {post.media.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {post.media.map((m, i) => (
                    <MediaThumb
                      key={m.s3_key}
                      s3Key={m.s3_key}
                      onRemove={() => removeMedia(i)}
                      onDragStart={() => { dragIndex.current = i; }}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => reorder(i)}
                    />
                  ))}
                </div>
              )}
              <input
                ref={fileInput}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => { if (e.target.files) handleFiles(e.target.files); e.target.value = ""; }}
              />
              <button
                type="button"
                onClick={() => fileInput.current?.click()}
                disabled={uploading > 0}
                className="w-full flex items-center justify-center gap-2 py-3 text-sm rounded-md border border-border bg-background hover:border-accent transition-colors disabled:opacity-50"
              >
                {uploading > 0 ? <><Loader2 className="w-4 h-4 animate-spin" /> Uploading {uploading}…</> : <><Upload className="w-4 h-4" /> Drop or click to add images</>}
              </button>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-card border-t border-border px-6 py-4 flex items-center justify-end gap-2">
          <button onClick={onCancel} className="px-4 py-2 text-sm rounded-full text-muted-foreground hover:text-foreground">Cancel</button>
          <button
            onClick={save}
            disabled={saving || uploading > 0}
            className="px-5 py-2 text-sm font-semibold rounded-full bg-accent text-accent-foreground hover:opacity-90 disabled:opacity-50 inline-flex items-center gap-2"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save
          </button>
        </div>
      </div>
    </div>
  );
};

const PostsAdminPage = () => {
  const { posts, save, loaded } = usePosts();
  const [editing, setEditing] = useState<Post | null>(null);

  const handleSave = async (p: Post) => {
    const exists = posts.some((x) => x.id === p.id);
    const next = exists ? posts.map((x) => (x.id === p.id ? p : x)) : [p, ...posts];
    await save(next);
    setEditing(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post? (media in S3 will remain — delete from bucket manually if needed.)")) return;
    await save(posts.filter((p) => p.id !== id));
    toast.success("Deleted");
  };

  const togglePublish = async (id: string) => {
    await save(posts.map((p) => (p.id === id ? { ...p, published: !p.published } : p)));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Posts</h1>
          <p className="text-muted-foreground mt-1">Photos, certificates, and stories — published to /posts.</p>
        </div>
        <button
          onClick={() => setEditing(emptyPost())}
          className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-full text-sm font-semibold"
        >
          <Plus className="w-4 h-4" /> New post
        </button>
      </div>

      {!loaded ? (
        <div className="text-center py-12 text-muted-foreground">Loading…</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border rounded-lg">
          <p className="text-foreground font-medium mb-1">No posts yet</p>
          <p className="text-sm text-muted-foreground">Click "New post" to publish your first one.</p>
        </div>
      ) : (
        <div className="border border-border bg-card rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/30 text-[10px] uppercase tracking-widest font-mono text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3">Title</th>
                <th className="text-left px-4 py-3">Type</th>
                <th className="text-left px-4 py-3">Media</th>
                <th className="text-left px-4 py-3">Date</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium text-foreground">{p.title || <span className="text-muted-foreground italic">untitled</span>}</td>
                  <td className="px-4 py-3 text-muted-foreground capitalize">{p.type}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.media.length}</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">{new Date(p.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button onClick={() => togglePublish(p.id)} title={p.published ? "Unpublish" : "Publish"} className="p-2 hover:text-accent">
                        {p.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <button onClick={() => setEditing(p)} className="p-2 hover:text-accent"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(p.id)} className="p-2 hover:text-accent"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && <PostEditor initial={editing} onSave={handleSave} onCancel={() => setEditing(null)} />}
    </div>
  );
};

export default PostsAdminPage;
