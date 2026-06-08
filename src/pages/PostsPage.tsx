import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { usePosts } from "@/hooks/usePosts";
import PostCard from "@/components/posts/PostCard";
import FilterBar from "@/components/posts/FilterBar";
import SmoothScroll from "@/components/SmoothScroll";
import type { PostType } from "@/types/post";

const PostsPage = () => {
  const { posts, loaded } = usePosts();
  const [filter, setFilter] = useState<PostType | "all">("all");
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    return posts
      .filter((p) => p.published)
      .filter((p) => (filter === "all" ? true : p.type === filter))
      .filter((p) => {
        if (!query.trim()) return true;
        const q = query.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.caption.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
  }, [posts, filter, query]);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    posts.filter((p) => p.published).forEach((p) => { c[p.type] = (c[p.type] ?? 0) + 1; });
    return c;
  }, [posts]);

  return (
    <SmoothScroll>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border">
          <div className="max-w-3xl mx-auto px-4 py-6 flex items-center justify-between">
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back
            </Link>
            <div className="text-center">
              <div className="text-[10px] uppercase tracking-widest text-mono text-muted-foreground">Feed</div>
              <h1 className="font-headline text-2xl tracking-tighter-2 text-foreground">Posts & Credentials</h1>
            </div>
            <div className="w-12" />
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 pb-24">
          <FilterBar active={filter} onChange={setFilter} query={query} onQuery={setQuery} counts={counts} />

          <div className="space-y-6 pt-6">
            {!loaded && <div className="text-center py-20 text-muted-foreground text-sm">Loading…</div>}
            {loaded && visible.length === 0 && (
              <div className="text-center py-20">
                <p className="font-headline text-2xl tracking-tighter-2 text-foreground mb-2">Nothing here yet</p>
                <p className="text-sm text-muted-foreground">Posts you publish will appear in this feed.</p>
              </div>
            )}
            {visible.map((post, i) => (
              <PostCard key={post.id} post={post} priority={i === 0} />
            ))}
          </div>
        </main>
      </div>
    </SmoothScroll>
  );
};

export default PostsPage;
