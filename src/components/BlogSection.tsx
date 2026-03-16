import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import {
  Calendar,
  Clock,
  ArrowRight,
  BookOpen,
  Sparkles,
  ExternalLink,
  RefreshCw,
} from "lucide-react";

// Medium RSS feed via rss2json
const MEDIUM_USERNAME = "dinmaybrahma";
const RSS2JSON_API = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(`https://medium.com/feed/@${MEDIUM_USERNAME}`)}`;
const BLOG_SITE_URL = "https://dinmaysblog.onrender.com";
const MEDIUM_URL = `https://medium.com/@${MEDIUM_USERNAME}`;

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
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .trim();
}

function extractThumbnail(content: string): string | null {
  const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
  return imgMatch ? imgMatch[1] : null;
}

function estimateReadTime(content: string): string {
  const words = stripHtml(content).split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} min read`;
}

function extractDescription(content: string, maxLength = 160): string {
  const text = stripHtml(content);
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
}

const placeholderImages = [
  "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
  "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&q=80",
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80",
  "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
];

const categoryColors: Record<string, string> = {
  "Machine Learning": "bg-purple-500/20 text-purple-300",
  MLOps: "bg-sky-500/20 text-sky-300",
  "Open Source": "bg-green-500/20 text-green-300",
  "Deep Learning": "bg-fuchsia-500/20 text-fuchsia-300",
  AI: "bg-orange-500/20 text-orange-300",
  Python: "bg-blue-500/20 text-blue-300",
  Programming: "bg-indigo-500/20 text-indigo-300",
  Technology: "bg-cyan-500/20 text-cyan-300",
  Blog: "bg-violet-500/20 text-violet-300",
};

function handleSpotlight(e: React.MouseEvent<HTMLDivElement>) {
  const rect = e.currentTarget.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
  e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
}

const BlogSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [posts, setPosts] = useState<MediumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(RSS2JSON_API);
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
            categories:
              item.categories?.length > 0 ? item.categories : ["Blog"],
            thumbnail:
              item.thumbnail ||
              extractThumbnail(item.content || item.description || ""),
            description: extractDescription(
              item.description || item.content || ""
            ),
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

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchPosts();
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const getPostImage = (post: MediumPost, index: number) =>
    post.thumbnail || placeholderImages[index % placeholderImages.length];

  const getCategoryColor = (category: string) =>
    categoryColors[category] || "bg-violet-500/20 text-violet-300";

  // Empty / error state
  if (!loading && (error || posts.length === 0)) {
    return (
      <section id="blog" ref={sectionRef} className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <p className="text-accent text-sm font-medium mb-2 flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> Blog & Articles
            </p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
              Thoughts & <em className="font-normal italic">Insights</em>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-xl">
              I write about AI, machine learning, and software development.
              Check out my blog for the latest articles and tutorials.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-2xl">
            <a
              href={BLOG_SITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <div
                onMouseMove={handleSpotlight}
                className="spotlight-card p-6 border border-border bg-card hover:border-accent/30 transition-all duration-300"
              >
                <Sparkles className="w-5 h-5 text-accent mb-3" />
                <h3 className="font-bold text-foreground mb-2">
                  Dinmay's Blog
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Visit my personal blog for in-depth articles on machine
                  learning, MLOps, and software engineering.
                </p>
                <span className="text-accent text-sm font-semibold inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  Visit Blog <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </a>
            <a
              href={MEDIUM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <div
                onMouseMove={handleSpotlight}
                className="spotlight-card p-6 border border-border bg-card hover:border-accent/30 transition-all duration-300"
              >
                <ExternalLink className="w-5 h-5 text-accent mb-3" />
                <h3 className="font-bold text-foreground mb-2">
                  View on Medium
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Read all articles on Medium with community engagement and
                  discussions.
                </p>
                <span className="text-accent text-sm font-semibold inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  Open Medium <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </a>
          </div>
        </div>
      </section>
    );
  }

  // Loading state
  if (loading) {
    return (
      <section id="blog" ref={sectionRef} className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-16">
          <p className="text-accent text-sm font-medium mb-2 flex items-center gap-2">
            <BookOpen className="w-4 h-4" /> Blog & Articles
          </p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-8">
            Thoughts & <em className="font-normal italic">Insights</em>
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="border border-border bg-card p-6 animate-pulse"
              >
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
    <section id="blog" ref={sectionRef} className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="text-accent text-sm font-medium mb-2 flex items-center gap-2">
            <BookOpen className="w-4 h-4" /> Blog & Articles
          </p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Thoughts & <em className="font-normal italic">Insights</em>
          </h2>
          <div className="flex items-center justify-between mt-4">
            <p className="text-lg text-muted-foreground max-w-xl">
              Sharing knowledge about AI, machine learning, and software
              development through articles and tutorials.
            </p>
            <div className="hidden md:flex items-center gap-3">
              <span className="flex items-center gap-2 text-xs text-green-400">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Live from Medium
              </span>
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="text-muted-foreground hover:text-foreground transition-colors p-1"
              >
                <RefreshCw
                  className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
                />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Featured Post */}
        {posts.length > 0 && (
          <motion.a
            href={posts[0].link}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="group block mb-8"
          >
            <div
              onMouseMove={handleSpotlight}
              className="spotlight-card border border-border bg-card hover:border-accent/30 transition-all duration-300 grid md:grid-cols-2 overflow-hidden"
            >
              {/* Image */}
              <div className="relative h-64 md:h-80 overflow-hidden">
                <img
                  src={getPostImage(posts[0], 0)}
                  alt={posts[0].title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              {/* Content */}
              <div className="p-6 md:p-8 flex flex-col justify-center">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {posts[0].categories.slice(0, 2).map((cat, idx) => (
                    <span
                      key={idx}
                      className={`text-xs px-2 py-1 rounded-sm font-medium ${getCategoryColor(cat)}`}
                    >
                      {cat}
                    </span>
                  ))}
                  <span className="text-xs px-2 py-1 rounded-sm font-medium bg-accent/20 text-accent">
                    Latest
                  </span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3 group-hover:text-accent transition-colors leading-snug">
                  {posts[0].title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {posts[0].description}
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />{" "}
                    {formatDate(posts[0].pubDate)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {posts[0].readTime}
                  </span>
                </div>
              </div>
            </div>
          </motion.a>
        )}

        {/* Other Posts Grid */}
        {posts.length > 1 && (
          <div className="grid md:grid-cols-3 gap-6">
            {posts.slice(1).map((post, index) => (
              <motion.a
                key={post.id}
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: (index + 1) * 0.1 }}
                className="group block"
              >
                <div
                  onMouseMove={handleSpotlight}
                  className="spotlight-card h-full border border-border bg-card hover:border-accent/30 transition-all duration-300 flex flex-col overflow-hidden"
                >
                  {/* Image */}
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={getPostImage(post, index + 1)}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex gap-1">
                      {post.categories.slice(0, 1).map((cat, idx) => (
                        <span
                          key={idx}
                          className={`text-[10px] px-2 py-0.5 rounded-sm font-medium ${getCategoryColor(cat)}`}
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />{" "}
                        {formatDate(post.pubDate)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {post.readTime}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-foreground mb-2 group-hover:text-accent transition-colors leading-snug">
                      {post.title}
                    </h3>

                    <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-4">
                      {post.description}
                    </p>

                    <span className="text-accent text-xs font-semibold inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                      Read on Medium{" "}
                      <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        )}

        {/* View All CTAs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="mt-10 flex items-center justify-center gap-6"
        >
          <a
            href={MEDIUM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-accent font-semibold text-sm hover:gap-3 transition-all"
          >
            View All on Medium <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href={BLOG_SITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-muted-foreground font-semibold text-sm hover:text-foreground hover:gap-3 transition-all"
          >
            Visit Blog Site <ExternalLink className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default BlogSection;
