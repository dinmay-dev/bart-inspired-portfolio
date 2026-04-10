import { useRef, useMemo } from "react";
import { motion, useInView } from "framer-motion";
import { useSiteContent } from "@/hooks/useSiteContent";
import { ExternalLink, FileText } from "lucide-react";

interface Publication {
  title: string;
  authors: string;
  venue: string;
  year: string;
  abstract: string;
  link: string;
  linkText: string;
}

const ResearchSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const { get } = useSiteContent();

  const publications = useMemo(() => {
    const raw = get("publications_json", "");
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, [get]);

  if (publications.length === 0) return null;

  return (
    <section id="research" className="py-28 md:py-40">
      <div className="max-w-6xl mx-auto px-6 md:px-16">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="font-mono-label text-muted-foreground mb-6">Research</p>
          <h2
            className="text-[clamp(2rem,4.5vw,4rem)] font-headline font-bold text-foreground mb-4"
            style={{ letterSpacing: "-0.03em" }}
          >
            Research & <em className="font-script font-normal italic text-accent">Publications</em>
          </h2>
          <p className="text-lg text-muted-foreground font-light mb-16 max-w-2xl" style={{ letterSpacing: "-0.01em" }}>
            {get("research_subtitle", "Papers, preprints, and academic contributions")}
          </p>
        </motion.div>

        <div className="space-y-8">
          {publications.map((pub: Publication, i: number) => (
            <motion.div
              key={pub.title + i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="border-t border-border pt-10 group"
            >
              <div className="flex items-start gap-4">
                <FileText className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-xl md:text-2xl font-headline font-bold text-foreground mb-2 group-hover:text-accent transition-colors" style={{ letterSpacing: "-0.02em" }}>
                    {pub.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2 font-light">
                    {pub.authors} · <span className="text-accent">{pub.venue}</span> · {pub.year}
                  </p>
                  {pub.abstract && (
                    <p className="text-sm text-muted-foreground/70 leading-relaxed max-w-3xl mb-4 font-light">
                      {pub.abstract}
                    </p>
                  )}
                  {pub.link && (
                    <a
                      href={pub.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-accent font-semibold text-[13px] hover:gap-3 transition-all tracking-tight"
                    >
                      <ExternalLink className="w-4 h-4" />
                      {pub.linkText || "Read paper"}
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ResearchSection;
