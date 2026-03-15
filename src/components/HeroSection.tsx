import { useState } from "react";
import { motion } from "framer-motion";
import heroPhoto from "@/assets/hero-photo.webp";

const glassStrips = [
  { left: '0%', blur: 3 }, { left: '2.5%', blur: 14 }, { left: '5%', blur: 5 },
  { left: '7.5%', blur: 18 }, { left: '10%', blur: 4 }, { left: '12.5%', blur: 22 },
  { left: '15%', blur: 6 }, { left: '17.5%', blur: 16 }, { left: '20%', blur: 3 },
  { left: '22.5%', blur: 20 }, { left: '25%', blur: 5 }, { left: '27.5%', blur: 12 },
  { left: '30%', blur: 7 }, { left: '32.5%', blur: 24 }, { left: '35%', blur: 4 },
  { left: '37.5%', blur: 18 }, { left: '40%', blur: 6 }, { left: '42.5%', blur: 14 },
  { left: '45%', blur: 3 }, { left: '47.5%', blur: 20 }, { left: '50%', blur: 5 },
  { left: '52.5%', blur: 16 }, { left: '55%', blur: 8 }, { left: '57.5%', blur: 22 },
  { left: '60%', blur: 4 }, { left: '62.5%', blur: 12 }, { left: '65%', blur: 6 },
  { left: '67.5%', blur: 18 }, { left: '70%', blur: 3 }, { left: '72.5%', blur: 24 },
  { left: '75%', blur: 5 }, { left: '77.5%', blur: 14 }, { left: '80%', blur: 7 },
  { left: '82.5%', blur: 20 }, { left: '85%', blur: 4 }, { left: '87.5%', blur: 16 },
  { left: '90%', blur: 6 }, { left: '92.5%', blur: 22 }, { left: '95%', blur: 3 },
  { left: '97.5%', blur: 10 },
];

const HeroSection = () => {
  const [mode, setMode] = useState<"available" | "busy">("available");

  return (
    <section className="relative min-h-screen flex">
      {/* Left content */}
      <div className="flex-1 flex flex-col justify-center px-6 md:px-16 lg:px-24 pt-24 pb-12 z-10">
        {/* Availability Toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-3 mb-10 text-sm font-medium text-muted-foreground"
        >
          <span>Available</span>
          <button
            onClick={() => setMode(mode === "available" ? "busy" : "available")}
            className="relative w-11 h-6 rounded-full transition-colors duration-300 focus:outline-none"
            style={{
              backgroundColor: mode === "available" ? "hsl(var(--accent))" : "hsl(var(--border))",
            }}
            aria-label="Toggle availability"
          >
            <div
              className="absolute top-1 w-4 h-4 rounded-full bg-background transition-transform duration-300"
              style={{
                left: "4px",
                transform: mode === "busy" ? "translateX(20px)" : "translateX(0)",
              }}
            />
          </button>
          <span>Busy</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] text-foreground max-w-2xl"
        >
          I code and build
          <br />
          digital things that{" "}
          <em className="font-normal italic">work</em>
        </motion.h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8 text-lg md:text-xl leading-relaxed text-muted-foreground max-w-lg"
        >
          Open source contributor, full-stack developer, and ML enthusiast.
          Building things that matter. No filler, no fluff.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex items-center gap-6 mt-12"
        >
          <a
            href="#work"
            className="bg-accent text-accent-foreground px-8 py-4 rounded-full text-sm font-semibold hover:scale-105 transition-transform inline-block"
          >
            Scroll for work
          </a>
          <a
            href="https://github.com/dino65-dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent text-sm font-semibold hover:underline"
          >
            GitHub, if you must
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
      </div>

      {/* Right image with ribbed glass effect */}
      <div className="hidden lg:block w-[45%] relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="absolute inset-0"
        >
          {/* SVG filter for displacement */}
          <svg className="absolute w-0 h-0">
            <defs>
              <filter id="ribbed-glass">
                <feTurbulence
                  type="turbulence"
                  baseFrequency="0.04 0.001"
                  numOctaves={3}
                  result="noise"
                />
                <feDisplacementMap
                  in="SourceGraphic"
                  in2="noise"
                  scale={25}
                  xChannelSelector="R"
                  yChannelSelector="G"
                />
              </filter>
            </defs>
          </svg>

          {/* Base image with filter */}
          <img
            src={heroPhoto}
            alt="Developer portrait"
            className="w-full h-full object-cover"
            style={{
              filter: "url(#ribbed-glass) contrast(1.05) brightness(0.95)",
            }}
          />

          {/* Vertical ribbed glass strips overlay */}
          <div className="absolute inset-0 z-10">
            {glassStrips.map((strip, i) => (
              <div
                key={i}
                className="absolute top-0 h-full"
                style={{
                  left: strip.left,
                  width: "2.5%",
                  backdropFilter: `blur(${strip.blur}px)`,
                  WebkitBackdropFilter: `blur(${strip.blur}px)`,
                  background: "rgba(255, 255, 255, 0.02)",
                  borderLeft: "1px solid rgba(255, 255, 255, 0.06)",
                }}
              />
            ))}
          </div>

          {/* Left edge blend — fades into the left panel */}
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
        <img src={heroPhoto} alt="Developer" className="w-full h-full object-cover" />
      </motion.div>

      {/* Bottom text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 right-8 text-xs text-muted-foreground hidden lg:block z-30"
      >
        Building open source since 2022. Keep scrollin'
      </motion.p>
    </section>
  );
};

export default HeroSection;
