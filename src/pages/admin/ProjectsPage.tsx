import { useState, useMemo } from "react";
import { Plus, Save, Loader2, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";
import { toast } from "sonner";

const defaultProjects = [
  {
    title: "Open Source ML Contributions",
    subtitle: "Contributing to machine learning projects that power real applications",
    role: "Developer & Contributor",
    date: "2023-Present",
    link: "https://github.com/dino65-dev",
    linkText: "View on GitHub",
    highlight: "Multiple repos, real-world impact",
  },
  {
    title: "Full-Stack Portfolio",
    subtitle: "Built with TanStack, Tailwind, and Appwrite — a showcase of modern web dev",
    role: "Full-stack developer",
    date: "2026",
    link: "https://github.com/dino65-dev/Portfolio",
    linkText: "View project",
    highlight: "Shipped in a weekend",
  },
  {
    title: "Developer Tools & CLIs",
    subtitle: "Automation scripts and developer tooling for improved workflows",
    role: "Solo developer",
    date: "2023-2026",
    link: "https://github.com/dino65-dev",
    linkText: "Explore repos",
    highlight: "Built for developers, by a developer",
  },
];

interface Project {
  title: string;
  subtitle: string;
  role: string;
  date: string;
  link: string;
  linkText: string;
  highlight: string;
}

const emptyProject: Project = {
  title: "",
  subtitle: "",
  role: "",
  date: "",
  link: "",
  linkText: "View project",
  highlight: "",
};

const ProjectsPage = () => {
  const { get, update } = useSiteContent();
  const [saving, setSaving] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const initialProjects = useMemo(() => {
    const raw = get("projects_json", "");
    if (!raw) return defaultProjects;
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultProjects;
    } catch {
      return defaultProjects;
    }
  }, [get]);

  const [projects, setProjects] = useState<Project[]>(initialProjects);

  const handleFieldChange = (index: number, field: keyof Project, value: string) => {
    const updated = [...projects];
    updated[index] = { ...updated[index], [field]: value };
    setProjects(updated);
  };

  const handleAdd = () => {
    setProjects([...projects, { ...emptyProject }]);
    setExpandedIndex(projects.length);
  };

  const handleRemove = (index: number) => {
    setProjects(projects.filter((_, i) => i !== index));
    setExpandedIndex(null);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await update("projects_json", JSON.stringify(projects));
      toast.success("Projects saved!");
    } catch {
      toast.error("Failed to save projects");
    } finally {
      setSaving(false);
    }
  };

  const fields: { key: keyof Project; label: string; type: string }[] = [
    { key: "title", label: "Title", type: "text" },
    { key: "subtitle", label: "Subtitle", type: "text" },
    { key: "highlight", label: "Highlight Tag", type: "text" },
    { key: "role", label: "Role", type: "text" },
    { key: "date", label: "Date", type: "text" },
    { key: "link", label: "Link URL", type: "url" },
    { key: "linkText", label: "Link Text", type: "text" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Projects</h1>
          <p className="text-muted-foreground mt-1">Add, edit, or remove portfolio projects.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleAdd}
            className="border border-border px-4 py-2.5 text-sm font-semibold text-foreground hover:border-accent transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Project
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
        {projects.map((project, index) => (
          <div key={index} className="border border-border bg-card">
            <button
              onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
              className="w-full px-6 py-4 flex items-center justify-between text-left"
            >
              <div>
                <h3 className="font-semibold text-foreground text-sm">
                  {project.title || `Project ${index + 1}`}
                </h3>
                {project.highlight && (
                  <p className="text-xs text-accent mt-0.5">{project.highlight}</p>
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
                    <input
                      type={field.type}
                      value={project[field.key]}
                      onChange={(e) => handleFieldChange(index, field.key, e.target.value)}
                      className="w-full px-4 py-3 bg-background border border-border text-foreground text-sm focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>
                ))}
                <button
                  onClick={() => handleRemove(index)}
                  className="text-sm text-muted-foreground hover:text-accent transition-colors flex items-center gap-2 mt-2"
                >
                  <Trash2 className="w-4 h-4" /> Remove Project
                </button>
              </div>
            )}
          </div>
        ))}

        {projects.length === 0 && (
          <div className="border border-border bg-card p-12 text-center">
            <p className="text-muted-foreground text-sm">No projects yet. Add your first project above.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;
