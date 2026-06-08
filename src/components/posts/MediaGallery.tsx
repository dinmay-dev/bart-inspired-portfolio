import { useState } from "react";
import type { PostMedia } from "@/types/post";
import S3Image from "./S3Image";
import Lightbox from "./Lightbox";

interface Props {
  media: PostMedia[];
  priority?: boolean;
}

const MediaGallery = ({ media, priority = false }: Props) => {
  const [open, setOpen] = useState<number | null>(null);
  if (!media.length) return null;

  const n = media.length;
  const handleOpen = (i: number) => setOpen(i);

  const tiles = (
    <>
      {n === 1 && (
        <S3Image
          s3Key={media[0].s3_key}
          blurhash={media[0].blurhash}
          width={media[0].width}
          height={media[0].height}
          alt=""
          priority={priority}
          onClick={() => handleOpen(0)}
          className="cursor-zoom-in"
          objectFit="cover"
        />
      )}
      {n === 2 && (
        <div className="grid grid-cols-2 gap-0.5">
          {media.map((m, i) => (
            <S3Image
              key={i}
              s3Key={m.s3_key}
              blurhash={m.blurhash}
              width={1}
              height={1}
              alt=""
              priority={priority && i === 0}
              onClick={() => handleOpen(i)}
              className="cursor-zoom-in aspect-square"
            />
          ))}
        </div>
      )}
      {n === 3 && (
        <div className="grid grid-cols-2 gap-0.5">
          <S3Image
            s3Key={media[0].s3_key}
            blurhash={media[0].blurhash}
            width={1}
            height={2}
            alt=""
            priority={priority}
            onClick={() => handleOpen(0)}
            className="cursor-zoom-in row-span-2"
          />
          {[1, 2].map((i) => (
            <S3Image
              key={i}
              s3Key={media[i].s3_key}
              blurhash={media[i].blurhash}
              width={1}
              height={1}
              alt=""
              onClick={() => handleOpen(i)}
              className="cursor-zoom-in aspect-square"
            />
          ))}
        </div>
      )}
      {n >= 4 && (
        <div className="grid grid-cols-2 gap-0.5">
          {media.slice(0, 4).map((m, i) => (
            <div key={i} className="relative">
              <S3Image
                s3Key={m.s3_key}
                blurhash={m.blurhash}
                width={1}
                height={1}
                alt=""
                priority={priority && i === 0}
                onClick={() => handleOpen(i)}
                className="cursor-zoom-in aspect-square"
              />
              {i === 3 && n > 4 && (
                <button
                  onClick={() => handleOpen(3)}
                  className="absolute inset-0 bg-foreground/60 text-background flex items-center justify-center text-2xl font-headline font-semibold"
                >
                  +{n - 4}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );

  return (
    <>
      {tiles}
      {open !== null && <Lightbox media={media} startIndex={open} onClose={() => setOpen(null)} />}
    </>
  );
};

export default MediaGallery;
