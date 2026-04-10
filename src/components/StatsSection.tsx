import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useSiteContent } from "@/hooks/useSiteContent";

const StatsSection = () => {
  const { get } = useSiteContent();
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["2%", "-2%"]);

  const stats = [
    { value: get("stat_1_value", "50+"), label: get("stat_1_label", "open source contributions") },
    { value: get("stat_2_value", "20+"), label: get("stat_2_label", "projects shipped") },
    { value: get("stat_3_value", "3+"), label: get("stat_3_label", "years building") },
    { value: get("stat_4_value", "∞"), label: get("stat_4_label", "cups of coffee") },
  ];

  return (
    <section ref={sectionRef} className="bg-foreground text-background py-28 md:py-40 overflow-hidden">
      <motion.div style={{ y }} className="max-w-6xl mx-auto px-6 md:px-16">
        <p className="font-mono-label text-background/30 mb-6">Impact</p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-headline font-bold mb-20"
          style={{ letterSpacing: "-0.03em" }}
        >
          Measured in <em className="font-script font-normal italic text-accent">shipped code</em>
        </motion.h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group"
            >
              <div
                className="text-[clamp(2.5rem,6vw,4.5rem)] font-headline font-bold text-accent mb-3 group-hover:scale-105 transition-transform duration-300 origin-left"
                style={{ letterSpacing: "-0.04em", lineHeight: 1 }}
              >
                {stat.value}
              </div>
              <div className="font-mono-label text-background/40">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default StatsSection;
