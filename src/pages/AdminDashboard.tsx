import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, FileText, Image as ImageIcon, Settings, LogOut, Menu, X,
  ExternalLink, Save, Upload, Trash2, RefreshCw, Eye, Loader2, CheckCircle
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useSiteContent } from "@/hooks/useSiteContent";
import { toast } from "sonner";

const navItems = [
  { path: "/admin", label: "Overview", icon: Home, exact: true },
  { path: "/admin/content", label: "Content", icon: FileText },
  { path: "/admin/images", label: "Images", icon: ImageIcon },
  { path: "/admin/settings", label: "Settings", icon: Settings },
];

// ── Content field definitions ──
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

// ── Image definitions ──
const imageSlots = [
  { key: "hero_image", label: "Hero Photo", path: "hero.webp" },
  { key: "about_image", label: "About / Whiteboard Image", path: "about.webp" },
];

// ── Overview Page ──
const OverviewPage = () => {
  const { get } = useSiteContent();
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back. Manage your portfolio content.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Content Fields", value: String(contentGroups.reduce((a, g) => a + g.fields.length, 0)), icon: FileText },
          { label: "Image Slots", value: String(imageSlots.length), icon: ImageIcon },
          { label: "Status", value: get("availability", "available") === "available" ? "Available" : "Busy", icon: Eye },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="border border-border p-6 bg-card">
            <div className="flex items-center justify-between mb-4">
              <Icon className="w-5 h-5 text-accent" />
              <span className="text-xs text-muted-foreground uppercase tracking-wider">{label}</span>
            </div>
            <p className="text-3xl font-bold text-foreground">{value}</p>
          </div>
        ))}
      </div>
      <div className="border border-border p-6 bg-card">
        <h3 className="font-semibold text-foreground mb-2">Quick Links</h3>
        <div className="flex flex-wrap gap-3 mt-3">
          <Link to="/admin/content" className="bg-accent text-accent-foreground px-4 py-2 text-sm font-semibold hover:scale-[1.02] transition-transform">
            Edit Content
          </Link>
          <Link to="/admin/images" className="border border-border px-4 py-2 text-sm font-semibold text-foreground hover:border-accent transition-colors">
            Manage Images
          </Link>
        </div>
      </div>
    </div>
  );
};

// ── Content Editor ──
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

// ── Image Manager ──
const ImagesPage = () => {
  const { get, update, getImageUrl, uploadImage, refresh } = useSiteContent();
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleUpload = async (slot: typeof imageSlots[0], file: File) => {
    setUploading((prev) => ({ ...prev, [slot.key]: true }));
    try {
      const ext = file.name.split(".").pop() || "webp";
      const path = `${slot.key}.${ext}`;
      const publicUrl = await uploadImage(file, path);
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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Image Manager</h1>
        <p className="text-muted-foreground mt-1">Upload and manage site images. Removing an image will show the default.</p>
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
                    <img
                      src={imageUrl}
                      alt={slot.label}
                      className="w-full h-48 object-cover border border-border"
                    />
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
      </div>
    </div>
  );
};

// ── Settings Page ──
const SettingsPage = () => (
  <div className="space-y-8">
    <h1 className="text-3xl font-bold text-foreground">Settings</h1>
    <div className="border border-border p-6 bg-card">
      <h3 className="font-semibold text-foreground mb-2">About</h3>
      <p className="text-sm text-muted-foreground">
        This admin panel lets you manage all visible content on your portfolio. Changes are saved to your database and reflected instantly on the live site.
      </p>
    </div>
  </div>
);

// ── Content resolver ──
const getPageContent = (pathname: string) => {
  if (pathname === "/admin" || pathname === "/admin/") return <OverviewPage />;
  if (pathname.startsWith("/admin/content")) return <ContentPage />;
  if (pathname.startsWith("/admin/images")) return <ImagesPage />;
  if (pathname.startsWith("/admin/settings")) return <SettingsPage />;
  return <OverviewPage />;
};

// ── Main Layout ──
const AdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const isActive = (path: string, exact?: boolean) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b border-border px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-lg font-bold text-foreground">
          D<span className="text-accent">.</span> Admin
        </Link>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-foreground">
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/50 z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed left-0 top-0 bottom-0 w-[280px] bg-card border-r border-border z-50 p-6 pt-16 lg:hidden"
            >
              <nav className="space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2.5 text-sm transition-colors ${
                      isActive(item.path, item.exact)
                        ? "text-accent font-semibold bg-accent/10"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-col w-64 border-r border-border bg-card p-6 fixed inset-y-0 left-0">
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="text-xl font-bold text-foreground">
            D<span className="text-accent">.</span> Admin
          </Link>
          <a href="/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        <nav className="space-y-1 flex-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm transition-colors ${
                isActive(item.path, item.exact)
                  ? "text-accent font-semibold bg-accent/10"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="text-xs text-muted-foreground mb-4 truncate px-3">
          {user?.email}
        </div>

        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-full"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 p-6 md:p-10 pt-16 lg:pt-10">
        {getPageContent(location.pathname)}
      </div>
    </div>
  );
};

export default AdminDashboard;
