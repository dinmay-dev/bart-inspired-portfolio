import { useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import heroPhotoFallback from "@/assets/hero-photo.webp";
import { useSiteContent } from "@/hooks/useSiteContent";

const HeroSection = () => {
  const { get, getImageUrl } = useSiteContent();
  const sectionRef = useRef(null);
  const [mode, setMode] = useState<"real" | "corporate">("real");

  const availability = get("availability", "available");
  const heroImage = getImageUrl(get("hero_image", "")) || heroPhotoFallback;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const content = {
    real: {
      headline: get("hero_headline", "I code and build\ndigital things that _work_"),
      subtext: get("hero_subtext", "Open source contributor, full-stack developer, and ML enthusiast. Building things that matter. No filler, no fluff."),
      cta: get("hero_cta_text", "Scroll for work"),
      github: get("hero_github_text", "GitHub, if you must"),
      bottom: get("hero_bottom_text", "Building open source since 2022. Keep scrollin'"),
    },
    corporate: {
      headline: "Delivering scalable\ndigital _solutions_",
      subtext: "Full-stack engineer specializing in machine learning and modern web applications. Proven track record of impactful open-source contributions.",
      cta: "View portfolio",
      github: "View GitHub profile",
      bottom: "Engineering excellence since 2022",
    },
  };

  const c = content[mode];

  const renderHeadline = (raw: string) => {
    const lines = raw.split("\n");
    return lines.map((line, li) => {
      const parts = line.split(/(_[^_]+_)/g);
      return (
        <span key={li}>
          {li > 0 && <br />}
          {parts.map((part, pi) => {
            if (part.startsWith("_") && part.endsWith("_")) {
              return (
                <em key={pi} className="font-script font-normal italic text-accent">
                  {part.slice(1, -1)}
                </em>
              );
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
        {/* Mode toggle + Availability */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-6 mb-10"
        >
          <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
            <span
              className={`w-2.5 h-2.5 rounded-full ${availability === "available" ? "bg-green-500 animate-pulse" : "bg-muted-foreground"}`}
            />
            <span>{availability === "available" ? "Available for work" : "Currently busy"}</span>
          </div>

          {/* Real / Corporate toggle */}
          <button
            onClick={() => setMode(mode === "real" ? "corporate" : "real")}
            className="relative flex items-center bg-muted rounded-full p-0.5 text-xs font-semibold overflow-hidden"
          >
            <span
              className={`relative z-10 px-4 py-1.5 rounded-full transition-colors duration-300 ${mode === "real" ? "text-accent-foreground" : "text-muted-foreground"}`}
            >
              Real
            </span>
            <span
              className={`relative z-10 px-4 py-1.5 rounded-full transition-colors duration-300 ${mode === "corporate" ? "text-accent-foreground" : "text-muted-foreground"}`}
            >
              Corporate
            </span>
            <motion.div
              className="absolute top-0.5 bottom-0.5 rounded-full bg-accent"
              animate={{ left: mode === "real" ? "2px" : "calc(50% - 2px)", width: "calc(50%)" }}
              transition={{ type: "spring", stiffness: 500, damping: 35 }}
            />
          </button>
        </motion.div>

        {/* Headline */}
        <AnimatePresence mode="wait">
          <motion.h1
            key={mode + "-headline"}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-5xl md:text-6xl lg:text-7xl font-headline font-bold tracking-tight leading-[1.05] text-foreground max-w-2xl"
          >
            {renderHeadline(c.headline)}
          </motion.h1>
        </AnimatePresence>

        {/* Sub */}
        <AnimatePresence mode="wait">
          <motion.p
            key={mode + "-sub"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mt-8 text-lg md:text-xl leading-relaxed text-muted-foreground max-w-lg"
          >
            {c.subtext}
          </motion.p>
        </AnimatePresence>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex flex-wrap items-center gap-6 mt-12"
        >
          <a
            href="#work"
            className="bg-accent text-accent-foreground px-8 py-4 rounded-full text-sm font-semibold hover:scale-105 hover:shadow-lg hover:shadow-accent/20 transition-all inline-block"
          >
            {c.cta}
          </a>

          {/* Animated GitHub button */}
          <motion.a
            href={get("hero_github_url", "https://github.com/dino65-dev")}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative text-accent text-sm font-semibold inline-flex items-center gap-2 overflow-hidden"
            whileHover={{ x: 4 }}
          >
            <motion.span
              className="inline-block"
              animate={{ x: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              →
            </motion.span>
            <span className="relative">
              {c.github}
              <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-accent group-hover:w-full transition-all duration-300" />
            </span>
          </motion.a>
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
      <AnimatePresence mode="wait">
        <motion.p
          key={mode + "-bottom"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute bottom-8 right-8 text-xs text-muted-foreground hidden lg:block z-30 font-script italic"
        >
          {c.bottom}
        </motion.p>
      </AnimatePresence>
    </section>
  );
};

export default HeroSection;
