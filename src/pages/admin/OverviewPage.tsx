import { FileText, Image as ImageIcon, Eye, FolderKanban, Mail, Code } from "lucide-react";
import { Link } from "react-router-dom";
import { useSiteContent } from "@/hooks/useSiteContent";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const OverviewPage = () => {
  const { get } = useSiteContent();
  const [messageCount, setMessageCount] = useState(0);

  useEffect(() => {
    supabase.from("messages").select("id", { count: "exact", head: true }).then(({ count }) => {
      setMessageCount(count || 0);
    });
  }, []);

  const stats = [
    { label: "Content Fields", value: "30+", icon: FileText },
    { label: "Messages", value: String(messageCount), icon: Mail },
    { label: "Status", value: get("availability", "available") === "available" ? "Available" : "Busy", icon: Eye },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back. Manage your portfolio content.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map(({ label, value, icon: Icon }) => (
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
          <Link to="/admin/projects" className="border border-border px-4 py-2 text-sm font-semibold text-foreground hover:border-accent transition-colors flex items-center gap-2">
            <FolderKanban className="w-4 h-4" /> Projects
          </Link>
          <Link to="/admin/technologies" className="border border-border px-4 py-2 text-sm font-semibold text-foreground hover:border-accent transition-colors flex items-center gap-2">
            <Code className="w-4 h-4" /> Technologies
          </Link>
          <Link to="/admin/messages" className="border border-border px-4 py-2 text-sm font-semibold text-foreground hover:border-accent transition-colors flex items-center gap-2">
            <Mail className="w-4 h-4" /> Messages
          </Link>
          <Link to="/admin/images" className="border border-border px-4 py-2 text-sm font-semibold text-foreground hover:border-accent transition-colors flex items-center gap-2">
            <ImageIcon className="w-4 h-4" /> Images
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;
