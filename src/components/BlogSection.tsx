import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import {
  Calendar, Clock, ArrowRight, BookOpen, Sparkles, ExternalLink, RefreshCw,
} from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";

interface MediumPost {
  id: string;
  title: string;
  link: string;
  pubDate: string;
  creator: string;
  categories: string[];
  thumbnail: string | null;
  description: string;
  readTime: string;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').trim();
}

function extractThumbnail(content: string): string | null {
  const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
  return imgMatch ? imgMatch[1] : null;
}

function estimateReadTime(content: string): string {
  const words = stripHtml(content).split(/\s+/).length;
  return `${Math.ceil(words / 200)} min read`;
}

function extractDescription(content: string, maxLength = 160): string {
  const text = stripHtml(content);
  return text.length <= maxLength ? text : text.substring(0, maxLength).trim() + "...";
}

const placeholderImages = [
  "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
  "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&q=80",
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80",
  "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
];

function handleSpotlight(e: React.MouseEvent<HTMLDivElement>) {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
}

const BlogSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const { get } = useSiteContent();
  const [posts, setPosts] = useState<MediumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const mediumUsername = get("medium_username", "dinmaybrahma");
  const blogSiteUrl = get("blog_site_url", "https://dinmaysblog.onrender.com");
  const mediumUrl = `https://medium.com/@${mediumUsername}`;

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const rssUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(`https://medium.com/feed/@${mediumUsername}`)}`;
      const response = await fetch(rssUrl);
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();

      if (data.status === "ok" && data.items?.length > 0) {
        const mediumPosts: MediumPost[] = data.items.slice(0, 6).map(
          (item: any, index: number) => ({
            id: item.guid || item.link || `post-${index}`,
            title: item.title || "Untitled",
            link: item.link || "",
            pubDate: item.pubDate || new Date().toISOString(),
            creator: item.author || "Dinmay Brahma",
            categories: item.categories?.length > 0 ? item.categories : ["Blog"],
            thumbnail: item.thumbnail || extractThumbnail(item.content || item.description || ""),
            description: extractDescription(item.description || item.content || ""),
            readTime: estimateReadTime(item.content || item.description || ""),
          })
        );
        setPosts(mediumPosts);
      } else {
        setError("No posts found");
      }
    } catch {
      setError("Could not fetch blog posts");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => { fetchPosts(); }, [mediumUsername]);

  const handleRefresh = () => { setIsRefreshing(true); fetchPosts(); };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const getPostImage = (post: MediumPost, index: number) =>
    post.thumbnail || placeholderImages[index % placeholderImages.length];

  const SectionHeader = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="mb-16">
      <p className="font-mono-label text-muted-foreground mb-6">Blog</p>
      <h2 className="text-[clamp(2rem,4.5vw,4rem)] font-headline font-bold text-foreground" style={{ letterSpacing: "-0.03em" }}>
        Thoughts & <em className="font-script font-normal italic text-accent">Insights</em>
      </h2>
      <div className="flex items-center justify-between mt-4">
        <p className="text-lg text-muted-foreground max-w-xl font-light" style={{ letterSpacing: "-0.01em" }}>
          Writing about AI, machine learning, and software development.
        </p>
        <div className="hidden md:flex items-center gap-3">
          <span className="flex items-center gap-2 font-mono-label text-green-500">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />Live from Medium
          </span>
          <button onClick={handleRefresh} disabled={isRefreshing} className="text-muted-foreground hover:text-foreground transition-colors p-1">
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>
    </motion.div>
  );

  if (!loading && (error || posts.length === 0)) {
    return (
      <section id="blog" ref={sectionRef} className="py-28 md:py-40">
        <div className="max-w-6xl mx-auto px-6 md:px-16">
          <SectionHeader />
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl">
            <a href={blogSiteUrl} target="_blank" rel="noopener noreferrer" className="group block">
              <div onMouseMove={handleSpotlight} className="spotlight-card p-6 border border-border hover:border-accent/30 transition-all duration-300">
                <Sparkles className="w-5 h-5 text-accent mb-3" />
                <h3 className="font-headline font-bold text-foreground mb-2" style={{ letterSpacing: "-0.02em" }}>Dinmay's Blog</h3>
                <p className="text-sm text-muted-foreground mb-4 font-light">Visit my personal blog for in-depth articles.</p>
                <span className="text-accent text-[13px] font-semibold inline-flex items-center gap-1 group-hover:gap-2 transition-all tracking-tight">Visit Blog <ArrowRight className="w-4 h-4" /></span>
              </div>
            </a>
            <a href={mediumUrl} target="_blank" rel="noopener noreferrer" className="group block">
              <div onMouseMove={handleSpotlight} className="spotlight-card p-6 border border-border hover:border-accent/30 transition-all duration-300">
                <ExternalLink className="w-5 h-5 text-accent mb-3" />
                <h3 className="font-headline font-bold text-foreground mb-2" style={{ letterSpacing: "-0.02em" }}>View on Medium</h3>
                <p className="text-sm text-muted-foreground mb-4 font-light">Read all articles on Medium.</p>
                <span className="text-accent text-[13px] font-semibold inline-flex items-center gap-1 group-hover:gap-2 transition-all tracking-tight">Open Medium <ArrowRight className="w-4 h-4" /></span>
              </div>
            </a>
          </div>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section id="blog" ref={sectionRef} className="py-28 md:py-40">
        <div className="max-w-6xl mx-auto px-6 md:px-16">
          <p className="font-mono-label text-muted-foreground mb-6">Blog</p>
          <h2 className="text-[clamp(2rem,4.5vw,4rem)] font-headline font-bold text-foreground mb-12" style={{ letterSpacing: "-0.03em" }}>
            Thoughts & <em className="font-script font-normal italic text-accent">Insights</em>
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-border p-6 animate-pulse">
                <div className="h-40 bg-muted rounded mb-4" />
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-3 bg-muted rounded w-full mb-2" />
                <div className="h-3 bg-muted rounded w-2/3" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="blog" ref={sectionRef} className="py-28 md:py-40">
      <div className="max-w-6xl mx-auto px-6 md:px-16">
        <SectionHeader />

        {posts.length > 0 && (
          <motion.a href={posts[0].link} target="_blank" rel="noopener noreferrer" initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="group block mb-8">
            <div onMouseMove={handleSpotlight} className="spotlight-card border border-border hover:border-accent/30 transition-all duration-300 grid md:grid-cols-2 overflow-hidden">
              <div className="relative h-64 md:h-80 overflow-hidden">
                <img src={getPostImage(posts[0], 0)} alt={posts[0].title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              <div className="p-6 md:p-8 flex flex-col justify-center">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {posts[0].categories.slice(0, 2).map((cat, idx) => (
                    <span key={idx} className="font-mono-label px-2 py-1 bg-accent/10 text-accent">{cat}</span>
                  ))}
                  <span className="font-mono-label px-2 py-1 bg-accent/20 text-accent">Latest</span>
                </div>
                <h3 className="text-xl md:text-2xl font-headline font-bold text-foreground mb-3 group-hover:text-accent transition-colors leading-snug" style={{ letterSpacing: "-0.02em" }}>{posts[0].title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 font-light">{posts[0].description}</p>
                <div className="flex items-center gap-4 font-mono-label text-muted-foreground">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatDate(posts[0].pubDate)}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {posts[0].readTime}</span>
                </div>
              </div>
            </div>
          </motion.a>
        )}

        {posts.length > 1 && (
          <div className="grid md:grid-cols-3 gap-6">
            {posts.slice(1).map((post, index) => (
              <motion.a key={post.id} href={post.link} target="_blank" rel="noopener noreferrer" initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: (index + 1) * 0.1 }} className="group block">
                <div onMouseMove={handleSpotlight} className="spotlight-card h-full border border-border hover:border-accent/30 transition-all duration-300 flex flex-col overflow-hidden">
                  <div className="relative h-44 overflow-hidden">
                    <img src={getPostImage(post, index + 1)} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-3 left-3 flex gap-1">
                      {post.categories.slice(0, 1).map((cat, idx) => (
                        <span key={idx} className="font-mono-label px-2 py-0.5 bg-foreground/80 text-background">{cat}</span>
                      ))}
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-3 font-mono-label text-muted-foreground mb-3">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {formatDate(post.pubDate)}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
                    </div>
                    <h3 className="text-base font-headline font-bold text-foreground mb-2 group-hover:text-accent transition-colors leading-snug" style={{ letterSpacing: "-0.02em" }}>{post.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-4 font-light">{post.description}</p>
                    <span className="text-accent text-[13px] font-semibold inline-flex items-center gap-1 group-hover:gap-2 transition-all tracking-tight">Read on Medium <ExternalLink className="w-3 h-3" /></span>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        )}

        <motion.div initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 0.5 }} className="mt-12 flex items-center justify-center gap-8">
          <a href={mediumUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-accent font-semibold text-[13px] hover:gap-3 transition-all tracking-tight">
            View All on Medium <ArrowRight className="w-4 h-4" />
          </a>
          <a href={blogSiteUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-muted-foreground font-semibold text-[13px] hover:text-foreground hover:gap-3 transition-all tracking-tight">
            Visit Blog Site <ExternalLink className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default BlogSection;
