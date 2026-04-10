import { useState, useMemo } from "react";
import { Plus, Save, Loader2, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";
import { toast } from "sonner";

interface Publication {
  title: string;
  authors: string;
  venue: string;
  year: string;
  abstract: string;
  link: string;
  linkText: string;
}

const emptyPublication: Publication = {
  title: "",
  authors: "",
  venue: "",
  year: "",
  abstract: "",
  link: "",
  linkText: "Read paper",
};

const fields: { key: keyof Publication; label: string; type: string; multiline?: boolean }[] = [
  { key: "title", label: "Title", type: "text" },
  { key: "authors", label: "Authors", type: "text" },
  { key: "venue", label: "Venue / Conference / Journal", type: "text" },
  { key: "year", label: "Year", type: "text" },
  { key: "abstract", label: "Abstract", type: "text", multiline: true },
  { key: "link", label: "Link URL", type: "url" },
  { key: "linkText", label: "Link Text", type: "text" },
];

const ResearchPage = () => {
  const { get, update } = useSiteContent();
  const [saving, setSaving] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const initialPubs = useMemo(() => {
    const raw = get("publications_json", "");
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, [get]);

  const [publications, setPublications] = useState<Publication[]>(initialPubs);

  const handleFieldChange = (index: number, field: keyof Publication, value: string) => {
    const updated = [...publications];
    updated[index] = { ...updated[index], [field]: value };
    setPublications(updated);
  };

  const handleAdd = () => {
    setPublications([...publications, { ...emptyPublication }]);
    setExpandedIndex(publications.length);
  };

  const handleRemove = (index: number) => {
    setPublications(publications.filter((_, i) => i !== index));
    setExpandedIndex(null);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await update("publications_json", JSON.stringify(publications));
      toast.success("Publications saved!");
    } catch {
      toast.error("Failed to save publications");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Research & Publications</h1>
          <p className="text-muted-foreground mt-1">Add research papers and publications. They'll appear on the homepage once added.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleAdd}
            className="border border-border px-4 py-2.5 text-sm font-semibold text-foreground hover:border-accent transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Publication
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-accent text-accent-foreground px-5 py-2.5 text-sm font-semibold flex items-center gap-2 hover:scale-[1.02] transition-transform disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save All
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {publications.map((pub, index) => (
          <div key={index} className="border border-border bg-card">
            <button
              onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
              className="w-full px-6 py-4 flex items-center justify-between text-left"
            >
              <div>
                <h3 className="font-semibold text-foreground text-sm">
                  {pub.title || `Publication ${index + 1}`}
                </h3>
                {pub.venue && (
                  <p className="text-xs text-accent mt-0.5">{pub.venue} · {pub.year}</p>
                )}
              </div>
              {expandedIndex === index ? (
                <ChevronUp className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              )}
            </button>

            {expandedIndex === index && (
              <div className="px-6 pb-6 space-y-4 border-t border-border pt-4">
                {fields.map((field) => (
                  <div key={field.key}>
                    <label className="block text-xs text-muted-foreground uppercase tracking-wider mb-2">
                      {field.label}
                    </label>
                    {field.multiline ? (
                      <textarea
                        value={pub[field.key]}
                        onChange={(e) => handleFieldChange(index, field.key, e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 bg-background border border-border text-foreground text-sm focus:outline-none focus:border-accent transition-colors resize-none"
                      />
                    ) : (
                      <input
                        type={field.type}
                        value={pub[field.key]}
                        onChange={(e) => handleFieldChange(index, field.key, e.target.value)}
                        className="w-full px-4 py-3 bg-background border border-border text-foreground text-sm focus:outline-none focus:border-accent transition-colors"
                      />
                    )}
                  </div>
                ))}
                <button
                  onClick={() => handleRemove(index)}
                  className="text-sm text-muted-foreground hover:text-accent transition-colors flex items-center gap-2 mt-2"
                >
                  <Trash2 className="w-4 h-4" /> Remove Publication
                </button>
              </div>
            )}
          </div>
        ))}

        {publications.length === 0 && (
          <div className="border border-border bg-card p-12 text-center">
            <p className="text-muted-foreground text-sm">No publications yet. Add your first research paper above.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResearchPage;
