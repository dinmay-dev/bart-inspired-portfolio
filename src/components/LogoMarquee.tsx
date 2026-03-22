import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useSiteContent } from "@/hooks/useSiteContent";

const defaultTechnologies = [
  "React", "TypeScript", "Python", "TailwindCSS", "Node.js",
  "TensorFlow", "Docker", "Git", "PostgreSQL", "Linux",
  "Vite", "Next.js", "FastAPI", "MongoDB", "Redis",
];

const LogoMarquee = () => {
  const { get } = useSiteContent();
  const sectionRef = useRef(null);

  const raw = get("technologies_list", "");
  const technologies = raw
    ? raw.split(",").map((t) => t.trim()).filter(Boolean)
    : defaultTechnologies;

  // Duplicate enough for seamless loop (4x ensures no gap on any screen)
  const items = [...technologies, ...technologies, ...technologies, ...technologies];

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-8%"]);

  return (
    <section ref={sectionRef} className="py-20 md:py-28 border-t border-b border-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-16 mb-12">
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-headline font-bold tracking-tight text-foreground mb-3"
        >
          Name-dropping, <em className="font-script font-normal italic text-accent">briefly</em>
        </motion.h3>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-muted-foreground text-lg"
        >
          Technologies I work with. Not that important, but people seem to care.
        </motion.p>
      </div>

      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-32 z-10" style={{ background: "linear-gradient(to right, hsl(var(--background)), transparent)" }} />
        <div className="absolute right-0 top-0 bottom-0 w-32 z-10" style={{ background: "linear-gradient(to left, hsl(var(--background)), transparent)" }} />

        {/* Row 1 - forward */}
        <motion.div style={{ x }} className="flex animate-marquee whitespace-nowrap mb-6">
          {items.map((tech, i) => (
            <span
              key={`r1-${i}`}
              className="mx-8 text-2xl md:text-3xl font-headline font-semibold text-muted-foreground/20 hover:text-accent transition-colors duration-300 cursor-default select-none"
            >
              {tech}
            </span>
          ))}
        </motion.div>

        {/* Row 2 - reverse direction */}
        <div
          className="flex whitespace-nowrap"
          style={{ animation: "marquee 25s linear infinite reverse" }}
        >
          {items.map((tech, i) => (
            <span
              key={`r2-${i}`}
              className="mx-8 text-lg md:text-xl font-headline font-medium text-muted-foreground/10 hover:text-foreground/40 transition-colors duration-300 cursor-default select-none"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LogoMarquee;
