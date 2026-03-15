import { motion } from "framer-motion";
import heroPhoto from "@/assets/hero-photo.webp";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex">
      {/* Left content */}
      <div className="flex-1 flex flex-col justify-center px-6 md:px-16 lg:px-24 pt-24 pb-12 z-10">
        {/* Toggle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-3 mb-10 text-sm font-medium text-muted-foreground"
        >
          <span>Real</span>
          <div className="toggle-switch">
            <div className="toggle-dot" />
          </div>
          <span>Corporate</span>
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
      </div>

      {/* Right image */}
      <div className="hidden lg:block w-[45%] relative">
        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="absolute inset-0"
        >
          <img
            src={heroPhoto}
            alt="Developer portrait"
            className="w-full h-full object-cover"
          />
        </motion.div>
      </div>

      {/* Bottom text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 right-8 text-xs text-muted-foreground hidden lg:block"
      >
        Building open source since 2022. Keep scrollin'
      </motion.p>
    </section>
  );
};

export default HeroSection;
