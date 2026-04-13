import { HeartPulse } from "lucide-react";
import { useSite } from "../context/SiteContext";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { contactInfo } = useSite();
  
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2 text-xl font-semibold text-white">
          <HeartPulse className="w-6 h-6 text-blue-500" />
          <span>Ahmed Adel</span>
        </div>
        
        <p className="text-sm text-center md:text-left">
          &copy; {currentYear} Ahmed Adel. All rights reserved. 
          <span className="block md:inline md:ml-2">
            Designed for medical excellence.
          </span>
        </p>
        
        <div className="flex items-center flex-wrap justify-center gap-6">
          {contactInfo.linkedin && (
            <a href={contactInfo.linkedin} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
          )}
          {contactInfo.twitter && (
            <a href={contactInfo.twitter} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Twitter</a>
          )}
          {contactInfo.facebook && (
            <a href={contactInfo.facebook} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Facebook</a>
          )}
          {contactInfo.whatsapp && (
            <a href={contactInfo.whatsapp} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">WhatsApp</a>
          )}
        </div>
      </div>
    </footer>
  );
}
