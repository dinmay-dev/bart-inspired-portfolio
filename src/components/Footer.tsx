import { useSiteContent } from "@/hooks/useSiteContent";

const Footer = () => {
  const { get } = useSiteContent();

  return (
    <footer className="py-12 px-6 md:px-16 border-t border-border">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} {get("footer_text", "dino65-dev. Built with conviction.")}
        </div>
        <div className="flex items-center gap-6 text-sm">
          <a
            href={get("github_url", "https://github.com/dino65-dev")}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-accent transition-colors"
          >
            GitHub
          </a>
          <a
            href={`mailto:${get("contact_email", "dino65dev@gmail.com")}`}
            className="text-muted-foreground hover:text-accent transition-colors"
          >
            Email
          </a>
          <a
            href={get("linkedin_url", "https://linkedin.com")}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-accent transition-colors"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
