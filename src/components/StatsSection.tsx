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
    <section ref={sectionRef} className="bg-section-dark text-section-dark-fg py-24 md:py-32 overflow-hidden">
      <motion.div style={{ y }} className="max-w-7xl mx-auto px-6 md:px-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-headline font-bold tracking-tight mb-16 text-center"
        >
          Impact measured in <em className="font-script font-normal italic text-accent">shipped code</em>
        </motion.h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center group"
            >
              <div className="text-5xl md:text-6xl lg:text-7xl font-headline font-bold text-accent mb-3 group-hover:scale-110 transition-transform duration-300">
                {stat.value}
              </div>
              <div className="text-sm text-section-dark-fg/60">
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
