import { Activity, Stethoscope, Microscope, Users } from "lucide-react";
import { motion } from "motion/react";
import { useSite } from "../context/SiteContext";

export function Skills() {
  const { skillsList } = useSite();

  const getIconForCategory = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes("clinical")) return <Stethoscope className="w-6 h-6 text-blue-600 dark:text-blue-400" />;
    if (t.includes("knowledge") || t.includes("medical")) return <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400" />;
    if (t.includes("research") || t.includes("technical")) return <Microscope className="w-6 h-6 text-blue-600 dark:text-blue-400" />;
    return <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />;
  };

  return (
    <section id="skills" className="py-16 md:py-24 bg-white dark:bg-slate-900 relative">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-4">Competencies & Skills</h2>
          <div className="w-20 h-1 bg-blue-600 dark:bg-blue-500 mx-auto rounded-full"></div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {skillsList.map((category, idx) => (
            <motion.div
              key={category.id || idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-6">
                {getIconForCategory(category.title)}
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                {category.title}
              </h3>
              <ul className="space-y-3">
                {category.skills.map((skill, sIdx) => (
                  <li key={sIdx} className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 dark:bg-blue-500"></div>
                    {skill}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
