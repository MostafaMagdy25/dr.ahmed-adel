import { MapPin, GraduationCap, Award, HeartPulse } from "lucide-react";
import { motion } from "motion/react";
import { useSite } from "../context/SiteContext";

export function About() {
  const { aboutInfo } = useSite();

  const stats = [
    {
      icon: <MapPin className="w-5 h-5 text-blue-500" />,
      label: "Location",
      value: "Mansoura, Egypt",
    },
    {
      icon: <GraduationCap className="w-5 h-5 text-blue-500" />,
      label: "Education",
      value: "Mansoura University",
    },
    {
      icon: <Award className="w-5 h-5 text-blue-500" />,
      label: "Interests",
      value: "Internal Medicine",
    },
    {
      icon: <HeartPulse className="w-5 h-5 text-blue-500" />,
      label: "Goal",
      value: "Patient-centered care",
    },
  ];

  return (
    <section id="about" className="py-16 md:py-24 bg-white dark:bg-slate-900 relative">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-4">About Me</h2>
          <div className="w-20 h-1 bg-blue-600 dark:bg-blue-500 mx-auto rounded-full mb-6"></div>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
            {aboutInfo.introText}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
              My Medical Journey
            </h3>
            <div className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed">
              <p>{aboutInfo.journeyP1}</p>
              <p>{aboutInfo.journeyP2}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-2 gap-4"
          >
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-blue-100 dark:hover:border-blue-800 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 shadow-sm flex items-center justify-center mb-4">
                  {stat.icon}
                </div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{stat.label}</p>
                <p className="text-base font-semibold text-slate-900 dark:text-slate-100">{stat.value}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
