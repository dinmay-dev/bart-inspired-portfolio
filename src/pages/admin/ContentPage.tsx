import { useState } from "react";
import { Save, Loader2, CheckCircle } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";
import { toast } from "sonner";

const contentGroups = [
  {
    title: "Hero Section",
    fields: [
      { key: "hero_headline", label: "Headline (use \\n for line break, _text_ for italic)", type: "textarea" },
      { key: "hero_subtext", label: "Subtext", type: "textarea" },
      { key: "hero_cta_text", label: "CTA Button Text", type: "text" },
      { key: "hero_github_text", label: "GitHub Link Text", type: "text" },
      { key: "hero_github_url", label: "GitHub URL", type: "url" },
      { key: "hero_bottom_text", label: "Bottom Text", type: "text" },
      { key: "availability", label: "Availability (available / busy)", type: "text" },
    ],
  },
  {
    title: "About Section",
    fields: [
      { key: "about_intro", label: "Intro Line", type: "text" },
      { key: "about_text", label: "About Text", type: "textarea" },
    ],
  },
  {
    title: "Work Section",
    fields: [
      { key: "work_title", label: "Title", type: "text" },
      { key: "work_subtitle", label: "Subtitle", type: "text" },
      { key: "work_description", label: "Description", type: "textarea" },
    ],
  },
  {
    title: "Stats Section",
    fields: [
      { key: "stats_title", label: "Section Title", type: "text" },
      { key: "stat_1_value", label: "Stat 1 Value", type: "text" },
      { key: "stat_1_label", label: "Stat 1 Label", type: "text" },
      { key: "stat_2_value", label: "Stat 2 Value", type: "text" },
      { key: "stat_2_label", label: "Stat 2 Label", type: "text" },
      { key: "stat_3_value", label: "Stat 3 Value", type: "text" },
      { key: "stat_3_label", label: "Stat 3 Label", type: "text" },
      { key: "stat_4_value", label: "Stat 4 Value", type: "text" },
      { key: "stat_4_label", label: "Stat 4 Label", type: "text" },
    ],
  },
  {
    title: "Contact Section",
    fields: [
      { key: "contact_heading", label: "Heading", type: "text" },
      { key: "contact_subtext", label: "Subtext", type: "textarea" },
      { key: "contact_email", label: "Email", type: "email" },
      { key: "contact_location", label: "Location", type: "text" },
    ],
  },
  {
    title: "Social & Links",
    fields: [
      { key: "github_url", label: "GitHub URL", type: "url" },
      { key: "linkedin_url", label: "LinkedIn URL", type: "url" },
      { key: "twitter_url", label: "Twitter URL", type: "url" },
      { key: "medium_username", label: "Medium Username", type: "text" },
      { key: "blog_site_url", label: "Blog Site URL", type: "url" },
    ],
  },
  {
    title: "Footer",
    fields: [
      { key: "footer_text", label: "Footer Text", type: "text" },
    ],
  },
];

const ContentPage = () => {
  const { get, update } = useSiteContent();
  const [localValues, setLocalValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});

  const getValue = (key: string) => localValues[key] ?? get(key, "");

  const handleChange = (key: string, value: string) => {
    setLocalValues((prev) => ({ ...prev, [key]: value }));
    setSaved((prev) => ({ ...prev, [key]: false }));
  };

  const handleSave = async (key: string) => {
    setSaving((prev) => ({ ...prev, [key]: true }));
    try {
      await update(key, getValue(key));
      setSaved((prev) => ({ ...prev, [key]: true }));
      toast.success(`Saved "${key}"`);
    } catch {
      toast.error(`Failed to save "${key}"`);
    } finally {
      setSaving((prev) => ({ ...prev, [key]: false }));
    }
  };

  const handleSaveAll = async () => {
    const changedKeys = Object.keys(localValues).filter(
      (key) => localValues[key] !== get(key, "")
    );
    if (changedKeys.length === 0) {
      toast.info("No changes to save");
      return;
    }
    for (const key of changedKeys) {
      await handleSave(key);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Content Editor</h1>
          <p className="text-muted-foreground mt-1">Edit all text content on your portfolio.</p>
        </div>
        <button
          onClick={handleSaveAll}
          className="bg-accent text-accent-foreground px-5 py-2.5 text-sm font-semibold flex items-center gap-2 hover:scale-[1.02] transition-transform"
        >
          <Save className="w-4 h-4" /> Save All Changes
        </button>
      </div>

      {contentGroups.map((group) => (
        <div key={group.title} className="border border-border bg-card">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="font-semibold text-foreground">{group.title}</h3>
          </div>
          <div className="p-6 space-y-5">
            {group.fields.map((field) => (
              <div key={field.key}>
                <label className="block text-xs text-muted-foreground uppercase tracking-wider mb-2">
                  {field.label}
                </label>
                <div className="flex gap-2">
                  {field.type === "textarea" ? (
                    <textarea
                      value={getValue(field.key)}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      rows={3}
                      className="flex-1 px-4 py-3 bg-background border border-border text-foreground text-sm focus:outline-none focus:border-accent transition-colors resize-none"
                    />
                  ) : (
                    <input
                      type={field.type}
                      value={getValue(field.key)}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      className="flex-1 px-4 py-3 bg-background border border-border text-foreground text-sm focus:outline-none focus:border-accent transition-colors"
                    />
                  )}
                  <button
                    onClick={() => handleSave(field.key)}
                    disabled={saving[field.key]}
                    className="px-3 py-2 border border-border text-muted-foreground hover:text-accent hover:border-accent transition-colors disabled:opacity-50"
                    title="Save this field"
                  >
                    {saving[field.key] ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : saved[field.key] ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ContentPage;
