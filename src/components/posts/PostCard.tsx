import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Share2, ExternalLink, Award, MapPin, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Post } from "@/types/post";
import MediaGallery from "./MediaGallery";
import { useSiteContent } from "@/hooks/useSiteContent";
import { toast } from "sonner";

interface Props {
  post: Post;
  priority?: boolean;
}

const typeIcon: Record<string, JSX.Element> = {
  certificate: <Award className="w-3 h-3" />,
  photo: <MapPin className="w-3 h-3" />,
  project: <ExternalLink className="w-3 h-3" />,
  event: <Calendar className="w-3 h-3" />,
};

const PostCard = ({ post, priority }: Props) => {
  const { get, getImageUrl } = useSiteContent();
  const [expanded, setExpanded] = useState(false);
  const [liked, setLiked] = useState(false);

  const ownerName = get("hero_name", "Dinmay");
  const ownerRole = get("hero_role", "Developer & Creator");
  const avatarPath = get("hero_image", "");
  const avatarUrl = avatarPath ? getImageUrl(avatarPath) : null;

  const longCaption = post.caption.length > 280;
  const caption = expanded || !longCaption ? post.caption : post.caption.slice(0, 280) + "…";

  const share = async () => {
    const url = window.location.href + "#post-" + post.id;
    try {
      if (navigator.share) {
        await navigator.share({ title: post.title || ownerName, text: post.caption, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied");
      }
    } catch { /* user cancelled */ }
  };

  return (
    <motion.article
      id={`post-${post.id}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className="bg-card border border-border rounded-2xl overflow-hidden"
    >
      {/* Header */}
      <header className="flex items-center gap-3 p-5">
        {avatarUrl ? (
          <img src={avatarUrl} alt={ownerName} className="w-11 h-11 rounded-full object-cover" loading="lazy" />
        ) : (
          <div className="w-11 h-11 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-headline font-bold">
            {ownerName.charAt(0)}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-headline font-semibold tracking-tighter-2 text-foreground">{ownerName}</span>
            <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest font-mono bg-foreground text-background px-2 py-0.5 rounded-full">
              {typeIcon[post.type]} {post.type}
            </span>
          </div>
          <div className="text-xs text-muted-foreground tracking-tight">
            {ownerRole} · <time>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</time>
          </div>
        </div>
      </header>

      {/* Title + caption */}
      {(post.title || post.caption) && (
        <div className="px-5 pb-4">
          {post.title && <h3 className="font-headline text-xl tracking-tighter-2 text-foreground mb-2">{post.title}</h3>}
          {post.caption && (
            <p className="text-sm text-foreground/80 whitespace-pre-wrap leading-relaxed font-light">
              {caption}{" "}
              {longCaption && (
                <button onClick={() => setExpanded(!expanded)} className="text-accent hover:underline text-xs font-medium">
                  {expanded ? "show less" : "see more"}
                </button>
              )}
            </p>
          )}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {post.tags.map((t) => (
                <span key={t} className="text-[10px] uppercase tracking-widest font-mono text-muted-foreground border border-border px-2 py-0.5 rounded-full">
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Media */}
      {post.media.length > 0 && (
        <div className="border-y border-border">
          <MediaGallery media={post.media} priority={priority} />
        </div>
      )}

      {/* Certificate details */}
      {post.type === "certificate" && (post.issuer || post.issue_date || post.credential_url) && (
        <div className="px-5 py-4 border-b border-border bg-muted/30">
          <div className="text-[10px] uppercase tracking-widest font-mono text-muted-foreground mb-2">Credential</div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
            {post.issuer && <span className="font-medium text-foreground">{post.issuer}</span>}
            {post.issue_date && <span className="text-muted-foreground">· Issued {post.issue_date}</span>}
            {post.credential_id && <span className="text-muted-foreground text-xs font-mono">ID: {post.credential_id}</span>}
          </div>
          {post.credential_url && (
            <a
              href={post.credential_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-3 text-xs font-semibold text-accent hover:underline"
            >
              View credential <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      )}

      {/* Actions */}
      <footer className="flex items-center gap-2 px-3 py-2">
        <button
          onClick={() => setLiked(!liked)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium tracking-tight transition-colors ${
            liked ? "text-accent" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} /> Like
        </button>
        <button onClick={share} className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium tracking-tight text-muted-foreground hover:text-foreground transition-colors">
          <Share2 className="w-4 h-4" /> Share
        </button>
      </footer>
    </motion.article>
  );
};

export default PostCard;
