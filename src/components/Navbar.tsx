import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useSiteContent } from "@/hooks/useSiteContent";

const Navbar = () => {
  const { get } = useSiteContent();
  const resumeUrl = get("resume_url", "");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-5 transition-all duration-300 ${
        scrolled ? "backdrop-blur-md bg-background/80" : ""
      }`}
    >
      {/* Logo */}
      <Link to="/" className="text-xl font-headline font-bold tracking-tighter-3 text-foreground hover:text-accent transition-colors">
        D<span className="text-accent">.</span>
      </Link>

      {/* Center nav */}
      <div className="hidden md:flex items-center gap-1 bg-foreground text-background px-5 py-2.5 rounded-full">
        <a href="#work" className="px-4 py-1.5 text-[13px] font-medium tracking-tight hover:text-accent transition-colors">
          Work
        </a>
        {resumeUrl && (
          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-1.5 text-[13px] font-medium tracking-tight hover:text-accent transition-colors"
          >
            Résumé
          </a>
        )}
        <a href="#blog" className="px-4 py-1.5 text-[13px] font-medium tracking-tight hover:text-accent transition-colors">
          Blog
        </a>
        <a href="#research" className="px-4 py-1.5 text-[13px] font-medium tracking-tight hover:text-accent transition-colors">
          Research
        </a>
      </div>

      {/* CTA */}
      <a
        href="#contact"
        className="bg-accent text-accent-foreground px-6 py-2.5 rounded-full text-[13px] font-semibold hover:scale-105 hover:shadow-lg hover:shadow-accent/20 transition-all"
      >
        Let's talk
      </a>
    </motion.nav>
  );
};

export default Navbar;
