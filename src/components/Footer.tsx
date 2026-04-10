import { useSiteContent } from "@/hooks/useSiteContent";

const Footer = () => {
  const { get } = useSiteContent();

  return (
    <footer className="py-12 px-6 md:px-16 border-t border-border">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="font-mono-label text-muted-foreground">
          © {new Date().getFullYear()} {get("footer_text", "dino65-dev. Built with conviction.")}
        </div>
        <div className="flex items-center gap-8">
          {[
            { label: "GitHub", href: get("github_url", "https://github.com/dino65-dev") },
            { label: "Email", href: `mailto:${get("contact_email", "dino65dev@gmail.com")}` },
            { label: "LinkedIn", href: get("linkedin_url", "https://linkedin.com") },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target={label !== "Email" ? "_blank" : undefined}
              rel={label !== "Email" ? "noopener noreferrer" : undefined}
              className="text-[13px] text-muted-foreground hover:text-accent transition-colors font-medium tracking-tight"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
