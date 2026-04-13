import { BookOpen, Calendar, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { useSite } from "../context/SiteContext";

export function Education() {
  const { educationList } = useSite();

  return (
    <section id="education" className="py-16 md:py-24 bg-slate-50 dark:bg-slate-950 relative">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-4">Education</h2>
          <div className="w-20 h-1 bg-blue-600 dark:bg-blue-500 mx-auto rounded-full"></div>
        </motion.div>

        <div className="space-y-8">
          {educationList.map((item, idx) => (
            <motion.div
              key={item.id || idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="relative pl-8 md:pl-0"
            >
              <div className="md:grid md:grid-cols-5 gap-8 items-start">
                <div className="hidden md:flex flex-col items-end pt-1 md:col-span-1">
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                    {item.date}
                  </span>
                </div>

                <div className="relative md:col-span-4 bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md dark:hover:shadow-black/50 transition-shadow">
                  {/* Timeline dot */}
                  <div className="absolute top-8 -left-12 md:-left-[2.3rem] w-4 h-4 rounded-full bg-blue-600 dark:bg-blue-500 border-4 border-slate-50 dark:border-slate-950 hidden md:block" />

                  <div className="md:hidden flex items-center gap-2 mb-3 text-sm font-bold text-blue-600 dark:text-blue-400">
                    <Calendar className="w-4 h-4" />
                    {item.date}
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                    {item.degree}
                  </h3>
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-medium mb-4">
                    <BookOpen className="w-4 h-4" />
                    <span>{item.institution}</span>
                  </div>
                  
                  <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                    {item.description}
                  </p>

                  <ul className="space-y-2">
                    {item.highlights.map((highlight, hIdx) => (
                      <li key={hIdx} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <ChevronRight className="w-4 h-4 text-blue-500 dark:text-blue-400 shrink-0 mt-0.5" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
