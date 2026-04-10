import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Home, FileText, Image as ImageIcon, Settings, LogOut, Menu, X,
  ExternalLink, Code, FolderKanban, Mail, BookOpen,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import OverviewPage from "@/pages/admin/OverviewPage";
import ContentPage from "@/pages/admin/ContentPage";
import ImagesPage from "@/pages/admin/ImagesPage";
import SettingsPage from "@/pages/admin/SettingsPage";
import TechnologiesPage from "@/pages/admin/TechnologiesPage";
import ProjectsPage from "@/pages/admin/ProjectsPage";
import MessagesPage from "@/pages/admin/MessagesPage";
import ResearchPage from "@/pages/admin/ResearchPage";

const navItems = [
  { path: "/admin", label: "Overview", icon: Home, exact: true },
  { path: "/admin/content", label: "Content", icon: FileText },
  { path: "/admin/projects", label: "Projects", icon: FolderKanban },
  { path: "/admin/research", label: "Research", icon: BookOpen },
  { path: "/admin/technologies", label: "Technologies", icon: Code },
  { path: "/admin/images", label: "Images", icon: ImageIcon },
  { path: "/admin/messages", label: "Messages", icon: Mail },
  { path: "/admin/settings", label: "Settings", icon: Settings },
];

const getPageContent = (pathname: string) => {
  if (pathname === "/admin" || pathname === "/admin/") return <OverviewPage />;
  if (pathname.startsWith("/admin/content")) return <ContentPage />;
  if (pathname.startsWith("/admin/projects")) return <ProjectsPage />;
  if (pathname.startsWith("/admin/research")) return <ResearchPage />;
  if (pathname.startsWith("/admin/technologies")) return <TechnologiesPage />;
  if (pathname.startsWith("/admin/images")) return <ImagesPage />;
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
