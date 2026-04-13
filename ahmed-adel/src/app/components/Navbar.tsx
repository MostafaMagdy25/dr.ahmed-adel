import { useState, useEffect } from "react";
import { Menu, X, HeartPulse } from "lucide-react";
import { motion } from "motion/react";
import { Link, useLocation } from "react-router";
import { useSite } from "../context/SiteContext";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { sectionsVisibility } = useSite();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle scrolling to hash sections
  useEffect(() => {
    if (location.pathname === "/") {
      if (location.hash) {
        const id = location.hash.substring(1);
        const el = document.getElementById(id);
        if (el) {
          setTimeout(() => {
            el.scrollIntoView({ behavior: "smooth" });
          }, 100);
        }
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  }, [location]);

  const navLinks = [
    ...(sectionsVisibility.about ? [{ name: "About", href: "/#about" }] : []),
    ...(sectionsVisibility.education ? [{ name: "Education", href: "/#education" }] : []),
    ...(sectionsVisibility.skills ? [{ name: "Skills", href: "/#skills" }] : []),
    ...(sectionsVisibility.projects ? [{ name: "Projects", href: "/#projects" }] : []),
    ...(sectionsVisibility.volunteering ? [{ name: "Volunteering", href: "/#volunteering" }] : []),
    ...(sectionsVisibility.contact ? [{ name: "Contact", href: "/#contact" }] : []),
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 dark:bg-slate-950/80 backdrop-blur-md shadow-sm py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        <div className="flex-1">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xl font-semibold text-slate-800 dark:text-slate-100"
          >
            <HeartPulse className="w-6 h-6 text-blue-600 dark:text-blue-500" />
            <span>Ahmed Adel</span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center justify-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors whitespace-nowrap"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="flex-1 flex justify-end items-center gap-4">
          <ThemeToggle />
          {sectionsVisibility.contact && (
            <Link
              to="/#contact"
              className="hidden lg:flex px-5 py-2.5 rounded-full bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200 dark:shadow-blue-900/50"
            >
              Get in touch
            </Link>
          )}
          {/* Mobile Nav Toggle */}
          <button
            className="lg:hidden p-2 text-slate-600 dark:text-slate-300 -mr-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:hidden absolute top-full left-0 right-0 bg-white dark:bg-slate-950 shadow-lg border-t border-slate-100 dark:border-slate-800 p-6 flex flex-col gap-4"
        >
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className="text-base font-medium text-slate-700 dark:text-slate-200 py-2 border-b border-slate-50 dark:border-slate-800"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </motion.div>
      )}
    </header>
  );
}
