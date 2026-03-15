import { useState } from "react";
import { motion } from "framer-motion";

const Navbar = () => {
  const [modeReal, setModeReal] = useState(true);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-5"
    >
      {/* Logo */}
      <div className="text-2xl font-bold tracking-tighter text-foreground">
        D<span className="text-accent">.</span>
      </div>

      {/* Center nav */}
      <div className="hidden md:flex items-center gap-1 bg-section-dark text-section-dark-fg px-6 py-3 rounded-full">
        <a href="#work" className="px-4 py-1 text-sm font-medium hover:text-accent transition-colors">
          Work worth scrolling
        </a>
        <a href="#about" className="px-4 py-1 text-sm font-medium hover:text-accent transition-colors">
          Résumé
        </a>
      </div>

      {/* CTA */}
      <a
        href="mailto:dino65dev@gmail.com"
        className="bg-accent text-accent-foreground px-6 py-3 rounded-full text-sm font-semibold hover:scale-105 transition-transform"
      >
        Let's talk
      </a>
    </motion.nav>
  );
};

export default Navbar;
