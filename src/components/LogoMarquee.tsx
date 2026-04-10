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

  const items = [...technologies, ...technologies, ...technologies, ...technologies];

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-8%"]);

  return (
    <section ref={sectionRef} className="py-24 md:py-32 border-t border-border overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 md:px-16 mb-14">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-mono-label text-muted-foreground mb-6"
        >
          Technologies
        </motion.p>
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-headline font-bold text-foreground"
          style={{ letterSpacing: "-0.03em" }}
        >
          Name-dropping, <em className="font-script font-normal italic text-accent">briefly</em>
        </motion.h3>
      </div>

      <div className="relative">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-32 z-10" style={{ background: "linear-gradient(to right, hsl(var(--background)), transparent)" }} />
        <div className="absolute right-0 top-0 bottom-0 w-32 z-10" style={{ background: "linear-gradient(to left, hsl(var(--background)), transparent)" }} />

        {/* Row 1 */}
        <motion.div style={{ x }} className="flex animate-marquee whitespace-nowrap mb-6">
          {items.map((tech, i) => (
            <span
              key={`r1-${i}`}
              className="mx-8 text-2xl md:text-3xl font-headline font-semibold text-foreground/10 hover:text-accent transition-colors duration-300 cursor-default select-none"
              style={{ letterSpacing: "-0.02em" }}
            >
              {tech}
            </span>
          ))}
        </motion.div>

        {/* Row 2 - reverse */}
        <div
          className="flex whitespace-nowrap"
          style={{ animation: "marquee 30s linear infinite reverse" }}
        >
          {items.map((tech, i) => (
            <span
              key={`r2-${i}`}
              className="mx-8 text-lg md:text-xl font-headline font-medium text-foreground/5 hover:text-foreground/30 transition-colors duration-300 cursor-default select-none"
              style={{ letterSpacing: "-0.02em" }}
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
