import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import whiteboardFallback from "@/assets/whiteboard.webp";
import { useSiteContent } from "@/hooks/useSiteContent";

const AnimatedText = ({ text }: { text: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <span ref={ref} className="inline">
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: i * 0.015, duration: 0.1 }}
          className="inline"
        >
          {char}
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
    <section id="about" ref={sectionRef} className="bg-section-dark text-section-dark-fg py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-16">
        <motion.p
          ref={ref}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          className="text-sm text-muted-foreground mb-6"
        >
          {get("about_intro", "Everything I build has to make sense")}
        </motion.p>

        <div className="text-2xl md:text-3xl lg:text-4xl leading-relaxed font-light text-section-dark-fg/80 max-w-4xl">
          <AnimatedText text={get("about_text", "I don't do chaos disguised as creativity. Everything I build has a reason to exist: a logic, a flow, a point. Code isn't decoration. It's systematised common sense. Whether it's a product for millions or a tiny CLI tool, it has to work, feel right, and earn its place in the repo.")} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-16 overflow-hidden"
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
