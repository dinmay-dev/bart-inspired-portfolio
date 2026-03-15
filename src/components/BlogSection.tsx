import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Calendar, Clock, ArrowRight, BookOpen, ExternalLink } from "lucide-react";

interface BlogPost {
  title: string;
  description: string;
  date: string;
  readTime: string;
  category: string;
  url: string;
}

const posts: BlogPost[] = [
  {
    title: "Getting Started with Machine Learning in Python",
    description: "A comprehensive guide to setting up your ML environment and building your first model with scikit-learn.",
    date: "Mar 10, 2026",
    readTime: "8 min",
    category: "Machine Learning",
    url: "https://medium.com/@dinmaybrahma",
  },
  {
    title: "Building Full-Stack Apps with TanStack & React",
    description: "How to leverage TanStack Router, Query, and modern React patterns for production apps.",
    date: "Feb 22, 2026",
    readTime: "6 min",
    category: "Programming",
    url: "https://medium.com/@dinmaybrahma",
  },
  {
    title: "Open Source: How to Make Your First Contribution",
    description: "Demystifying the open source contribution process — from finding issues to submitting PRs.",
    date: "Jan 15, 2026",
    readTime: "5 min",
    category: "Open Source",
    url: "https://medium.com/@dinmaybrahma",
  },
];

const categoryColors: Record<string, string> = {
  "Machine Learning": "bg-purple-500/20 text-purple-300",
  Programming: "bg-blue-500/20 text-blue-300",
  "Open Source": "bg-green-500/20 text-green-300",
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
            <BookOpen className="w-4 h-4" /> Blog
          </p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Writing & thoughts
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-xl">
            Sharing what I learn along the way. Mostly about ML, dev tools, and open source.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <motion.a
              key={post.title}
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group block"
            >
              <div
                onMouseMove={handleSpotlight}
                className="spotlight-card h-full p-6 border border-border bg-card hover:border-accent/30 transition-all duration-300 flex flex-col"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className={`text-xs px-2 py-1 rounded-sm font-medium ${categoryColors[post.category] || "bg-muted text-muted-foreground"}`}>
                    {post.category}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-foreground mb-3 group-hover:text-accent transition-colors leading-snug">
                  {post.title}
                </h3>

                <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-4">
                  {post.description}
                </p>

                <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {post.readTime}
                    </span>
                  </div>
                  <ExternalLink className="w-3 h-3 group-hover:text-accent transition-colors" />
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        {/* View all link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="mt-10 text-center"
        >
          <a
            href="https://dinmaysblog.onrender.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-accent font-semibold text-sm hover:gap-3 transition-all"
          >
            Read all posts <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default BlogSection;
