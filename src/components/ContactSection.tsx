import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Send, Mail, MapPin, Github, Linkedin, Twitter, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { useSiteContent } from "@/hooks/useSiteContent";
import { supabase } from "@/lib/supabase";

interface FormData { name: string; email: string; subject: string; message: string; }
interface FormErrors { name?: string; email?: string; message?: string; }

const ContactSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const { get } = useSiteContent();
  const [formData, setFormData] = useState<FormData>({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("messages").insert({
        name: formData.name.trim(), email: formData.email.trim(),
        subject: formData.subject.trim() || null, message: formData.message.trim(),
      });
      if (error) throw error;
      setIsSubmitted(true);
      toast.success("Message sent! I'll get back to you soon.");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setIsSubmitted(false), 3000);
    } catch (err) {
      console.error("Failed to send message:", err);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const socialLinks = [
    { icon: Github, href: get("github_url", "https://github.com/dino65-dev"), label: "GitHub" },
    { icon: Linkedin, href: get("linkedin_url", "https://linkedin.com"), label: "LinkedIn" },
    { icon: Twitter, href: get("twitter_url", "https://twitter.com"), label: "Twitter" },
  ];

  return (
    <section id="contact" ref={sectionRef} className="py-28 md:py-40 bg-foreground text-background">
      <div className="max-w-6xl mx-auto px-6 md:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="font-mono-label text-background/30 mb-6">Contact</p>
          <h2
            className="text-[clamp(2rem,4.5vw,4rem)] font-headline font-bold"
            style={{ letterSpacing: "-0.03em" }}
          >
            Let's <em className="font-script font-normal italic text-accent">talk</em>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-10"
          >
            <p className="text-lg text-background/60 leading-relaxed font-light" style={{ letterSpacing: "-0.01em" }}>
              {get("contact_subtext", "Got a project, question, or just want to say hi? Drop me a message and I'll get back to you.")}
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-4 p-5 border border-background/10 hover:border-accent/30 transition-all">
                <Mail className="w-4 h-4 text-accent" />
                <div>
                  <p className="font-mono-label text-background/30 mb-1">Email</p>
                  <p className="text-sm text-background font-light">{get("contact_email", "dino65dev@gmail.com")}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-5 border border-background/10 hover:border-accent/30 transition-all">
                <MapPin className="w-4 h-4 text-accent" />
                <div>
                  <p className="font-mono-label text-background/30 mb-1">Location</p>
                  <p className="text-sm text-background font-light">{get("contact_location", "India")}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full flex items-center justify-center border border-background/10 hover:border-accent hover:text-accent hover:scale-110 transition-all text-background/40">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div>
              <input type="text" placeholder="Your name" value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-5 py-3.5 bg-background/5 border border-background/10 text-background placeholder:text-background/25 focus:outline-none focus:border-accent transition-colors text-sm font-light rounded-none" />
              {errors.name && <p className="mt-1 text-xs text-accent">{errors.name}</p>}
            </div>
            <div>
              <input type="email" placeholder="Your email" value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-5 py-3.5 bg-background/5 border border-background/10 text-background placeholder:text-background/25 focus:outline-none focus:border-accent transition-colors text-sm font-light rounded-none" />
              {errors.email && <p className="mt-1 text-xs text-accent">{errors.email}</p>}
            </div>
            <input type="text" placeholder="Subject (optional)" value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-5 py-3.5 bg-background/5 border border-background/10 text-background placeholder:text-background/25 focus:outline-none focus:border-accent transition-colors text-sm font-light rounded-none" />
            <div>
              <textarea placeholder="Your message" rows={5} value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-5 py-3.5 bg-background/5 border border-background/10 text-background placeholder:text-background/25 focus:outline-none focus:border-accent transition-colors text-sm font-light resize-none rounded-none" />
              {errors.message && <p className="mt-1 text-xs text-accent">{errors.message}</p>}
            </div>
            <button type="submit" disabled={isSubmitting || isSubmitted}
              className="bg-accent text-accent-foreground py-3.5 px-8 rounded-full font-semibold text-[13px] hover:scale-[1.02] hover:shadow-lg hover:shadow-accent/20 transition-all disabled:opacity-50 inline-flex items-center gap-2 tracking-tight">
              {isSubmitted ? (<><CheckCircle className="w-4 h-4" /> Sent!</>) : isSubmitting ? "Sending..." : (<><Send className="w-4 h-4" /> Send message</>)}
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
