import { HeartHandshake, Droplets, Smile, Calendar, MapPin } from "lucide-react";
import { motion } from "motion/react";
import { useSite } from "../context/SiteContext";

export function Volunteering() {
  const { volunteerList } = useSite();

  const getIconForTitle = (title: string, color: string) => {
    const t = title.toLowerCase();
    if (t.includes("blood") || t.includes("donation")) return <Droplets className={`w-6 h-6 ${color.split(' ')[2]}`} />;
    if (t.includes("child") || t.includes("kid")) return <Smile className={`w-6 h-6 ${color.split(' ')[2]}`} />;
    return <HeartHandshake className={`w-6 h-6 ${color.split(' ')[2]}`} />;
  };

  return (
    <section id="volunteering" className="py-16 md:py-24 bg-white dark:bg-slate-900 relative">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-4">Volunteering & Community Service</h2>
            <div className="w-20 h-1 bg-blue-600 dark:bg-blue-500 mx-auto rounded-full mb-6"></div>
            <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto text-lg">
              Giving back to the community is at the core of my medical philosophy. 
              Here are some of the initiatives I've been proud to be part of.
            </p>
          </motion.div>
        </div>

        <div className="space-y-6 max-w-4xl mx-auto">
          {volunteerList.map((exp, idx) => (
            <motion.div
              key={exp.id || idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 md:p-8 border border-slate-100 dark:border-slate-700 hover:shadow-md dark:hover:shadow-black/50 transition-shadow flex flex-col md:flex-row gap-6 md:items-start"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border ${exp.color.split(' ').slice(0, 2).join(' ')}`}>
                {getIconForTitle(exp.title, exp.color)}
              </div>
              
              <div className="flex-grow">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 gap-2">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{exp.title}</h3>
                  <div className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full w-fit">
                    <Calendar className="w-4 h-4" />
                    {exp.date}
                  </div>
                </div>
                
                <h4 className="text-base font-medium text-slate-700 dark:text-slate-300 mb-4">
                  {exp.organization}
                </h4>
                
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  {exp.description}
                </p>
                
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
                  <MapPin className="w-4 h-4" />
                  {exp.location}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
