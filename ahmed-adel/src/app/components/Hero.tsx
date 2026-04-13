import { ArrowRight, FileText } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useSite } from "../context/SiteContext";
import { resolveFileUrl } from "../services/api";

export function Hero() {
  const { heroInfo } = useSite();

  return (
    <section
      id="hero"
      className="relative min-h-[100svh] flex flex-col justify-center pt-24 pb-12 md:pt-32 md:pb-20 lg:py-0 overflow-hidden bg-slate-50 dark:bg-slate-950"
    >
      {/* Decorative background blobs */}
      <div className="absolute top-10 md:top-20 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-blue-100/50 dark:bg-blue-900/20 rounded-full blur-3xl -z-10 mix-blend-multiply dark:mix-blend-lighten opacity-70" />
      <div className="absolute bottom-0 left-[-50px] md:left-10 w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-indigo-50 dark:bg-indigo-900/20 rounded-full blur-3xl -z-10 mix-blend-multiply dark:mix-blend-lighten opacity-70" />

      <div className="max-w-6xl mx-auto px-6 w-full grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center md:items-start md:text-left order-2 md:order-1"
        >
          <span className="inline-block py-1.5 px-4 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs md:text-sm font-semibold tracking-wide mb-6 border border-blue-100 dark:border-blue-800">
            {heroInfo.tagline}
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-900 dark:text-slate-50 leading-tight mb-4 md:mb-6">
            {heroInfo.headline.split(' ').slice(0, -2).join(' ')}{' '}
            <br className="hidden md:block" />
            <span className="text-blue-600 dark:text-blue-500">{heroInfo.headline.split(' ').slice(-2).join(' ')}</span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-slate-600 dark:text-slate-400 mb-6 md:mb-8 max-w-lg leading-relaxed px-2 md:px-0">
            {heroInfo.description}
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <Link
              to="/#projects"
              className="w-full sm:w-auto justify-center px-6 py-3.5 rounded-full bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 dark:shadow-blue-900/30 flex items-center gap-2"
            >
              {heroInfo.primaryBtn}
              <ArrowRight className="w-4 h-4" />
            </Link>
            {heroInfo.cvUrl ? (
              <a
                href={resolveFileUrl(heroInfo.cvUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto justify-center px-6 py-3.5 rounded-full bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-medium border border-slate-200 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                {heroInfo.secondaryBtn}
              </a>
            ) : (
              <Link
                to="/#contact"
                className="w-full sm:w-auto justify-center px-6 py-3.5 rounded-full bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-medium border border-slate-200 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                {heroInfo.secondaryBtn}
              </Link>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative order-1 md:order-2 mx-auto w-full max-w-[260px] sm:max-w-[320px] md:max-w-sm lg:max-w-md"
        >
          <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/10 dark:shadow-blue-900/30 border-4 md:border-8 border-white dark:border-slate-800">
            <ImageWithFallback
              src={resolveFileUrl(heroInfo.imageUrl)}
              alt="Profile"
              className="object-cover w-full h-full"
            />
          </div>
          {/* Floating badge */}
          <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-black/50 flex items-center gap-3 border border-slate-100 dark:border-slate-800 transform scale-90 sm:scale-100 origin-bottom-left">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center">
              <span className="text-lg sm:text-xl font-bold">{heroInfo.badgeNum}</span>
            </div>
            <div>
              <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">{heroInfo.badgeText}</p>
              <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">{heroInfo.badgeSubtext}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
