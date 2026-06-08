import { useEffect, useMemo, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { getReadUrl } from "@/lib/s3";
import { blurhashToDataUrl } from "@/lib/blurhashToCss";

interface Props {
  s3Key: string;
  blurhash?: string;
  width: number;
  height: number;
  alt: string;
  className?: string;
  priority?: boolean;
  onClick?: () => void;
  objectFit?: "cover" | "contain";
}

const S3Image = ({ s3Key, blurhash, width, height, alt, className, priority = false, onClick, objectFit = "cover" }: Props) => {
  const { ref, inView } = useInView({ rootMargin: "300px", triggerOnce: true, skip: priority });
  const [url, setUrl] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const mounted = useRef(true);

  useEffect(() => () => { mounted.current = false; }, []);

  useEffect(() => {
    if (!priority && !inView) return;
    let cancelled = false;
    getReadUrl(s3Key)
      .then((u) => { if (!cancelled && mounted.current) setUrl(u); })
      .catch(() => { /* swallow */ });
    return () => { cancelled = true; };
  }, [s3Key, priority, inView]);

  const placeholder = useMemo(() => (blurhash ? blurhashToDataUrl(blurhash) : ""), [blurhash]);

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden bg-muted ${className ?? ""}`}
      style={{ aspectRatio: width && height ? `${width} / ${height}` : undefined }}
      onClick={onClick}
    >
      {placeholder && (
        <img
          src={placeholder}
          alt=""
          aria-hidden
          className={`absolute inset-0 w-full h-full ${objectFit === "cover" ? "object-cover" : "object-contain"} scale-110 blur-xl transition-opacity duration-500 ${loaded ? "opacity-0" : "opacity-100"}`}
        />
      )}
      {url && (
        <img
          src={url}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
          onLoad={() => setLoaded(true)}
          className={`relative w-full h-full ${objectFit === "cover" ? "object-cover" : "object-contain"} transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
        />
      )}
    </div>
  );
};

export default S3Image;
