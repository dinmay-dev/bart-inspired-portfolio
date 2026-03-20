import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Download } from "lucide-react";
import heroPhotoFallback from "@/assets/hero-photo.webp";
import { useSiteContent } from "@/hooks/useSiteContent";

const HeroSection = () => {
  const { get, getImageUrl } = useSiteContent();
  const sectionRef = useRef(null);

  const availability = get("availability", "available");
  const heroImage = getImageUrl(get("hero_image", "")) || heroPhotoFallback;
  const resumeUrl = get("resume_url", "");

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const renderHeadline = (raw: string) => {
    const lines = raw.split("\n");
    return lines.map((line, li) => {
      const parts = line.split(/(_[^_]+_)/g);
      return (
        <span key={li}>
          {li > 0 && <br />}
          {parts.map((part, pi) => {
            if (part.startsWith("_") && part.endsWith("_")) {
              return <em key={pi} className="font-normal italic">{part.slice(1, -1)}</em>;
            }
            return <span key={pi}>{part}</span>;
          })}
        </span>
      );
    });
  };

  return (
    <section ref={sectionRef} className="relative min-h-screen flex overflow-hidden">
      {/* Left content */}
      <motion.div
        style={{ y: textY, opacity }}
        className="flex-1 flex flex-col justify-center px-6 md:px-16 lg:px-24 pt-24 pb-12 z-10"
      >
        {/* Availability indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-3 mb-10 text-sm font-medium text-muted-foreground"
        >
          <span
            className={`w-2.5 h-2.5 rounded-full ${availability === "available" ? "bg-green-500 animate-pulse" : "bg-muted-foreground"}`}
          />
          <span>{availability === "available" ? "Available for work" : "Currently busy"}</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] text-foreground max-w-2xl"
        >
          {renderHeadline(get("hero_headline", "I code and build\ndigital things that _work_"))}
        </motion.h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8 text-lg md:text-xl leading-relaxed text-muted-foreground max-w-lg"
        >
          {get("hero_subtext", "Open source contributor, full-stack developer, and ML enthusiast. Building things that matter. No filler, no fluff.")}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex flex-wrap items-center gap-6 mt-12"
        >
          <a
            href="#work"
            className="bg-accent text-accent-foreground px-8 py-4 rounded-full text-sm font-semibold hover:scale-105 transition-transform inline-block"
          >
            {get("hero_cta_text", "Scroll for work")}
          </a>
          {resumeUrl && (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="border border-accent text-accent px-8 py-4 rounded-full text-sm font-semibold hover:scale-105 transition-transform inline-flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Resume
            </a>
          )}
          <a
            href={get("hero_github_url", "https://github.com/dino65-dev")}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent text-sm font-semibold hover:underline"
          >
            {get("hero_github_text", "GitHub, if you must")}
          </a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-auto pt-8 flex items-center gap-2 text-xs text-muted-foreground"
        >
          <span>Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-4 h-4"
          >
            ↓
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Right image with parallax */}
      <div className="hidden lg:block w-[45%] relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          style={{ y: imageY }}
          className="absolute inset-0 -top-[10%] -bottom-[10%]"
        >
          <img
            src={heroImage}
            alt="Developer portrait"
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-y-0 left-0 w-24 z-20"
            style={{
              background: "linear-gradient(to right, hsl(var(--background)), transparent)",
            }}
          />
        </motion.div>
      </div>

      {/* Mobile avatar */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="lg:hidden absolute top-24 right-6 w-20 h-20 rounded-full overflow-hidden border-2 border-accent/30"
      >
        <img src={heroImage} alt="Developer" className="w-full h-full object-cover" />
      </motion.div>

      {/* Bottom text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 right-8 text-xs text-muted-foreground hidden lg:block z-30"
      >
        {get("hero_bottom_text", "Building open source since 2022. Keep scrollin'")}
      </motion.p>
    </section>
  );
};

export default HeroSection;
