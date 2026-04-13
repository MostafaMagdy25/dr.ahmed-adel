import { useParams, Link } from "react-router";
import { ArrowLeft, Calendar, MapPin, User, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import { useSite } from "../context/SiteContext";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { resolveFileUrl } from "../services/api";
import { useEffect } from "react";

export function ProjectDetails() {
  const { id } = useParams();
  const { projectsList } = useSite();
  const project = projectsList.find((p) => p.id === id || p._id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24 pb-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">Project not found</h2>
          <Link to="/#projects" className="text-blue-600 dark:text-blue-400 hover:underline">
            Return to Portfolio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 md:pt-28 pb-16 md:pb-24 bg-white dark:bg-slate-900 min-h-screen transition-colors">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            to="/#projects"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 mb-8 transition-colors bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-full border border-slate-100 dark:border-slate-700 hover:border-blue-100 dark:hover:border-blue-800"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Link>

          <div className="mb-6 flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm font-bold border border-blue-100 dark:border-blue-800">
              {project.category}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-50 mb-6 leading-tight">
            {project.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-slate-600 dark:text-slate-400 mb-10 pb-10 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-500 dark:text-blue-400" />
              <span>{project.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-blue-500 dark:text-blue-400" />
              <span>{project.role}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-500 dark:text-blue-400" />
              <span>{project.location}</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="w-full aspect-[21/9] md:aspect-[21/9] rounded-3xl overflow-hidden mb-12 shadow-lg border border-slate-100 dark:border-slate-800">
            <ImageWithFallback
              src={resolveFileUrl(project.image)}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none prose-lg">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">Overview</h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-10 text-lg">
              {project.description}
            </p>

            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">Key Contributions & Outcomes</h3>
            <div className="grid gap-4 mb-12">
              {project.details.map((detail, idx) => (
                <div key={idx} className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                  <CheckCircle2 className="w-6 h-6 text-blue-500 dark:text-blue-400 shrink-0 mt-0.5" />
                  <p className="text-slate-700 dark:text-slate-300 m-0 leading-relaxed">{detail}</p>
                </div>
              ))}
            </div>

            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">Skills & Technologies Applied</h3>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium shadow-sm dark:shadow-none"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
