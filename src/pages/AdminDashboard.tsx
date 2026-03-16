import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, User, FolderKanban, MessageSquare, Settings, 
  LogOut, Menu, X, ExternalLink, Plus, Edit, Trash2, 
  Eye, Mail, Clock, CheckCircle 
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
  { path: "/admin", label: "Overview", icon: Home, exact: true },
  { path: "/admin/profile", label: "Profile", icon: User },
  { path: "/admin/projects", label: "Projects", icon: FolderKanban },
  { path: "/admin/messages", label: "Messages", icon: MessageSquare },
  { path: "/admin/settings", label: "Settings", icon: Settings },
];

// Sample data
const sampleProjects = [
  { id: "1", title: "ML Pipeline", status: "published", views: 234 },
  { id: "2", title: "Portfolio Site", status: "published", views: 567 },
  { id: "3", title: "CLI Tools", status: "draft", views: 0 },
];

const sampleMessages = [
  { id: "1", name: "John Doe", email: "john@example.com", subject: "Collaboration", date: "2 hours ago", read: false },
  { id: "2", name: "Jane Smith", email: "jane@example.com", subject: "Job Offer", date: "1 day ago", read: true },
  { id: "3", name: "Alex K.", email: "alex@example.com", subject: "Great portfolio!", date: "3 days ago", read: true },
];

// Overview Page
const OverviewPage = () => (
  <div className="space-y-8">
    <div>
      <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
      <p className="text-muted-foreground mt-1">Welcome back, here's your overview.</p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[
        { label: "Total Projects", value: "3", icon: FolderKanban },
        { label: "Messages", value: "3", icon: MessageSquare },
        { label: "Profile Views", value: "801", icon: Eye },
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
      <h3 className="font-semibold text-foreground mb-4">Recent Messages</h3>
      <div className="space-y-3">
        {sampleMessages.slice(0, 2).map((msg) => (
          <div key={msg.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
            <div className="flex items-center gap-3">
              {!msg.read && <div className="w-2 h-2 rounded-full bg-accent" />}
              <div>
                <p className="text-sm font-medium text-foreground">{msg.name}</p>
                <p className="text-xs text-muted-foreground">{msg.subject}</p>
              </div>
            </div>
            <span className="text-xs text-muted-foreground">{msg.date}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Profile Page
const ProfilePage = () => (
  <div className="space-y-8">
    <h1 className="text-3xl font-bold text-foreground">Profile</h1>
    <div className="border border-border p-6 bg-card space-y-6">
      {[
        { label: "Display Name", value: "dino65-dev", type: "text" },
        { label: "Tagline", value: "Developer & ML Enthusiast", type: "text" },
        { label: "Bio", value: "Open source contributor and full-stack developer passionate about building great software.", type: "textarea" },
        { label: "Location", value: "India", type: "text" },
        { label: "Email", value: "dino65dev@gmail.com", type: "email" },
        { label: "GitHub Username", value: "dino65-dev", type: "text" },
        { label: "LinkedIn URL", value: "", type: "url" },
      ].map((field) => (
        <div key={field.label}>
          <label className="block text-xs text-muted-foreground uppercase tracking-wider mb-2">
            {field.label}
          </label>
          {field.type === "textarea" ? (
            <textarea
              defaultValue={field.value}
              rows={4}
              className="w-full px-4 py-3 bg-background border border-border text-foreground text-sm focus:outline-none focus:border-accent transition-colors resize-none"
            />
          ) : (
            <input
              type={field.type}
              defaultValue={field.value}
              className="w-full px-4 py-3 bg-background border border-border text-foreground text-sm focus:outline-none focus:border-accent transition-colors"
            />
          )}
        </div>
      ))}
      <button className="bg-accent text-accent-foreground px-6 py-3 text-sm font-semibold hover:scale-[1.02] transition-transform">
        Save Changes
      </button>
    </div>
  </div>
);

// Projects Page
const ProjectsPage = () => (
  <div className="space-y-8">
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold text-foreground">Projects</h1>
      <button className="bg-accent text-accent-foreground px-4 py-2 text-sm font-semibold flex items-center gap-2 hover:scale-[1.02] transition-transform">
        <Plus className="w-4 h-4" /> Add Project
      </button>
    </div>

    <div className="border border-border bg-card divide-y divide-border">
      {sampleProjects.map((project) => (
        <div key={project.id} className="p-4 flex items-center justify-between">
          <div>
            <p className="font-medium text-foreground">{project.title}</p>
            <div className="flex items-center gap-3 mt-1">
              <span className={`text-xs px-2 py-0.5 ${project.status === "published" ? "bg-green-500/20 text-green-400" : "bg-muted text-muted-foreground"}`}>
                {project.status}
              </span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Eye className="w-3 h-3" /> {project.views}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
              <Edit className="w-4 h-4" />
            </button>
            <button className="p-2 text-muted-foreground hover:text-accent transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Messages Page
const MessagesPage = () => (
  <div className="space-y-8">
    <h1 className="text-3xl font-bold text-foreground">Messages</h1>
    <div className="border border-border bg-card divide-y divide-border">
      {sampleMessages.map((msg) => (
        <div key={msg.id} className="p-4 flex items-start gap-4 hover:bg-muted/30 transition-colors cursor-pointer">
          <div className="mt-1">
            {msg.read ? (
              <CheckCircle className="w-4 h-4 text-muted-foreground" />
            ) : (
              <Mail className="w-4 h-4 text-accent" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className={`text-sm ${msg.read ? "text-foreground" : "font-semibold text-foreground"}`}>{msg.name}</p>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" /> {msg.date}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">{msg.subject}</p>
            <p className="text-xs text-muted-foreground mt-1">{msg.email}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Settings Page
const SettingsPage = () => (
  <div className="space-y-8">
    <h1 className="text-3xl font-bold text-foreground">Settings</h1>
    <div className="border border-border p-6 bg-card space-y-6">
      <div>
        <h3 className="font-semibold text-foreground mb-4">General</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-muted-foreground uppercase tracking-wider mb-2">Site Title</label>
            <input
              defaultValue="dino65-dev Portfolio"
              className="w-full px-4 py-3 bg-background border border-border text-foreground text-sm focus:outline-none focus:border-accent transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground uppercase tracking-wider mb-2">Medium URL</label>
            <input
              defaultValue="https://medium.com/@dinmaybrahma"
              className="w-full px-4 py-3 bg-background border border-border text-foreground text-sm focus:outline-none focus:border-accent transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground uppercase tracking-wider mb-2">Blog Site URL</label>
            <input
              defaultValue="https://dinmaysblog.onrender.com"
              className="w-full px-4 py-3 bg-background border border-border text-foreground text-sm focus:outline-none focus:border-accent transition-colors"
            />
          </div>
        </div>
      </div>
      <button className="bg-accent text-accent-foreground px-6 py-3 text-sm font-semibold hover:scale-[1.02] transition-transform">
        Save Settings
      </button>
    </div>
  </div>
);

// Content resolver
const getPageContent = (pathname: string) => {
  if (pathname === "/admin" || pathname === "/admin/") return <OverviewPage />;
  if (pathname.startsWith("/admin/profile")) return <ProfilePage />;
  if (pathname.startsWith("/admin/projects")) return <ProjectsPage />;
  if (pathname.startsWith("/admin/messages")) return <MessagesPage />;
  if (pathname.startsWith("/admin/settings")) return <SettingsPage />;
  return <OverviewPage />;
};

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
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
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

        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Back to site
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 p-6 md:p-10 pt-16 lg:pt-10">
        {getPageContent(location.pathname)}
      </div>
    </div>
  );
};

export default AdminDashboard;
