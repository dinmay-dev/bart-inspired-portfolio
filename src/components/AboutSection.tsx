import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import whiteboardFallback from "@/assets/whiteboard.webp";
import { useSiteContent } from "@/hooks/useSiteContent";

const WordReveal = ({ text }: { text: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const words = text.split(" ");

  return (
    <span ref={ref} className="inline">
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0.12, y: 8 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: i * 0.035, duration: 0.4, ease: "easeOut" }}
          className="inline-block mr-[0.3em]"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
};

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { get, getImageUrl } = useSiteContent();
  const sectionRef = useRef(null);

  const aboutImage = getImageUrl(get("about_image", "")) || whiteboardFallback;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);

  return (
    <section id="about" ref={sectionRef} className="bg-foreground text-background py-28 md:py-40">
      <div className="max-w-6xl mx-auto px-6 md:px-16">
        <motion.p
          ref={ref}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          className="font-mono-label text-background/40 mb-8"
        >
          {get("about_intro", "About")}
        </motion.p>

        <div className="text-[clamp(1.25rem,2.5vw,2.25rem)] leading-[1.4] font-light text-background/75 max-w-4xl" style={{ letterSpacing: "-0.01em" }}>
          <WordReveal text={get("about_text", "I don't do chaos disguised as creativity. Everything I build has a reason to exist: a logic, a flow, a point. Code isn't decoration. It's systematised common sense. Whether it's a product for millions or a tiny CLI tool, it has to work, feel right, and earn its place in the repo.")} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-20 overflow-hidden rounded-lg"
        >
          <motion.img
            style={{ y: imgY }}
            src={aboutImage}
            alt="Creative workspace"
            className="w-full h-auto max-h-[500px] object-cover scale-110"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
