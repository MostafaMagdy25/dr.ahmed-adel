import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useSite } from "../context/SiteContext";
import { resolveFileUrl } from "../services/api";

export function Projects() {
  const { projectsList } = useSite();

  return (
    <section id="projects" className="py-16 md:py-24 bg-slate-50 dark:bg-slate-950 relative">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-4">Projects & Activities</h2>
            <div className="w-20 h-1 bg-blue-600 dark:bg-blue-500 rounded-full"></div>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-slate-600 dark:text-slate-400 max-w-md"
          >
            A selection of my recent medical research, community outreach initiatives, 
            and clinical volunteering experiences.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projectsList.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <Link 
                to={`/projects/${project.id}`}
                className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl dark:hover:shadow-black/50 transition-all duration-300 border border-slate-100 dark:border-slate-800 flex flex-col h-full"
              >
                <div className="relative h-56 overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <ImageWithFallback
                    src={resolveFileUrl(project.image)}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-blue-700 dark:text-blue-400 shadow-sm">
                    {project.category}
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-start justify-between">
                    {project.title}
                    <ArrowUpRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity text-blue-600 dark:text-blue-400 shrink-0" />
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm mb-6 flex-grow leading-relaxed">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {(project.tags || []).slice(0, 3).map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2.5 py-1 rounded-md bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium border border-slate-100 dark:border-slate-700"
                      >
                        {tag}
                      </span>
                    ))}
                    {(project.tags || []).length > 3 && (
                      <span className="px-2.5 py-1 rounded-md bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium border border-slate-100 dark:border-slate-700">
                        +{(project.tags || []).length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
