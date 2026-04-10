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
    <section id="research" className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-16">
        <motion.h2
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-headline font-bold tracking-tight text-foreground mb-4"
        >
          Research & <em className="font-script font-normal italic text-accent">Publications</em>
        </motion.h2>
        <p className="text-lg text-muted-foreground mb-16 max-w-2xl">
          {get("research_subtitle", "Papers, preprints, and academic contributions")}
        </p>

        <div className="space-y-8">
          {publications.map((pub: Publication, i: number) => (
            <motion.div
              key={pub.title + i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="border-t border-border pt-8 group"
            >
              <div className="flex items-start gap-4">
                <FileText className="w-5 h-5 text-accent mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-xl md:text-2xl font-headline font-bold text-foreground mb-2 group-hover:text-accent transition-colors">
                    {pub.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {pub.authors} · <span className="text-accent">{pub.venue}</span> · {pub.year}
                  </p>
                  {pub.abstract && (
                    <p className="text-sm text-muted-foreground/80 leading-relaxed max-w-3xl mb-4">
                      {pub.abstract}
                    </p>
                  )}
                  {pub.link && (
                    <a
                      href={pub.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-accent font-semibold text-sm hover:gap-3 transition-all"
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
