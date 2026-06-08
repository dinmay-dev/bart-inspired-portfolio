import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { PostMedia } from "@/types/post";
import S3Image from "./S3Image";

interface Props {
  media: PostMedia[];
  startIndex: number;
  onClose: () => void;
}

const Lightbox = ({ media, startIndex, onClose }: Props) => {
  const [i, setI] = useState(startIndex);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") setI((p) => (p - 1 + media.length) % media.length);
      if (e.key === "ArrowRight") setI((p) => (p + 1) % media.length);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [media.length, onClose]);

  const cur = media[i];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-foreground/95 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <button onClick={onClose} className="absolute top-5 right-5 text-background hover:text-accent transition-colors z-10">
          <X className="w-7 h-7" />
        </button>
        {media.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); setI((p) => (p - 1 + media.length) % media.length); }}
              className="absolute left-4 md:left-8 text-background hover:text-accent transition-colors z-10"
            >
              <ChevronLeft className="w-10 h-10" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setI((p) => (p + 1) % media.length); }}
              className="absolute right-4 md:right-8 text-background hover:text-accent transition-colors z-10"
            >
              <ChevronRight className="w-10 h-10" />
            </button>
          </>
        )}
        <div className="max-w-6xl max-h-full w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
          <div className="max-w-full max-h-full" style={{ aspectRatio: `${cur.width} / ${cur.height}`, width: "min(100%, calc(90vh * " + cur.width + " / " + cur.height + "))" }}>
            <S3Image
              s3Key={cur.s3_key}
              blurhash={cur.blurhash}
              width={cur.width}
              height={cur.height}
              alt=""
              priority
              objectFit="contain"
              className="w-full h-full"
            />
          </div>
        </div>
        {media.length > 1 && (
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-background/80 text-mono text-xs">
            {i + 1} / {media.length}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default Lightbox;
