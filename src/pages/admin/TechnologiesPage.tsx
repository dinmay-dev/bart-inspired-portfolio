import { useState } from "react";
import { Plus, X, Save, Loader2, GripVertical } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";
import { toast } from "sonner";

const defaultTechnologies = [
  "React", "TypeScript", "Python", "TailwindCSS", "Node.js",
  "TensorFlow", "Docker", "Git", "PostgreSQL", "Linux",
  "Vite", "Next.js", "FastAPI", "MongoDB", "Redis",
];

const TechnologiesPage = () => {
  const { get, update } = useSiteContent();
  const [saving, setSaving] = useState(false);
  const [newTech, setNewTech] = useState("");

  const raw = get("technologies_list", "");
  const currentTechs = raw
    ? raw.split(",").map((t) => t.trim()).filter(Boolean)
    : defaultTechnologies;

  const [techs, setTechs] = useState<string[]>(currentTechs);

  const handleAdd = () => {
    const trimmed = newTech.trim();
    if (!trimmed || techs.includes(trimmed)) return;
    setTechs([...techs, trimmed]);
    setNewTech("");
  };

  const handleRemove = (index: number) => {
    setTechs(techs.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await update("technologies_list", techs.join(", "));
      toast.success("Technologies saved!");
    } catch {
      toast.error("Failed to save technologies");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Technologies</h1>
          <p className="text-muted-foreground mt-1">Edit the "Technologies I work with" marquee.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-accent text-accent-foreground px-5 py-2.5 text-sm font-semibold flex items-center gap-2 hover:scale-[1.02] transition-transform disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save
        </button>
      </div>

      <div className="border border-border bg-card p-6">
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={newTech}
            onChange={(e) => setNewTech(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAdd())}
            placeholder="Add a technology..."
            className="flex-1 px-4 py-3 bg-background border border-border text-foreground text-sm focus:outline-none focus:border-accent transition-colors"
          />
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-accent text-accent-foreground text-sm font-semibold flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {techs.map((tech, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-3 py-2 border border-border bg-background text-sm text-foreground group"
            >
              <GripVertical className="w-3 h-3 text-muted-foreground" />
              {tech}
              <button
                onClick={() => handleRemove(i)}
                className="text-muted-foreground hover:text-accent transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>

        {techs.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">
            No technologies added. The default list will be shown.
          </p>
        )}
      </div>
    </div>
  );
};

export default TechnologiesPage;
