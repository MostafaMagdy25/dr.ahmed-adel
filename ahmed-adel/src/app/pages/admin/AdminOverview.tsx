import { FolderKanban, Eye, Code, GraduationCap, LayoutPanelLeft, Heart } from "lucide-react";
import { useSite, SectionsVisibility } from "../../context/SiteContext";

export function AdminOverview() {
  const { sectionsVisibility, setSectionVisibility, projectsList, skillsList, educationList, volunteerList } = useSite();

  const totalSkills = skillsList.reduce((acc, cat) => acc + cat.skills.length, 0);

  const stats = [
    { name: "Total Projects", value: String(projectsList.length), icon: FolderKanban, detail: "Research & activities" },
    { name: "Skills Listed", value: String(totalSkills), icon: Code, detail: `${skillsList.length} categories` },
    { name: "Education", value: String(educationList.length), icon: GraduationCap, detail: "Degrees & diplomas" },
    { name: "Volunteering", value: String(volunteerList.length), icon: Heart, detail: "Activities & roles" },
  ];

  const sectionsList: { key: keyof SectionsVisibility; label: string; description: string }[] = [
    { key: "hero", label: "Hero Section", description: "The top introductory section" },
    { key: "about", label: "About Me", description: "Personal and professional summary" },
    { key: "education", label: "Education", description: "Academic history and degrees" },
    { key: "skills", label: "Skills", description: "Technical and soft skills" },
    { key: "projects", label: "Projects", description: "Research and medical projects" },
    { key: "volunteering", label: "Volunteering / Certs", description: "Extracurricular activities" },
    { key: "contact", label: "Contact", description: "Contact form and info" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <Eye className="w-5 h-5 text-slate-300 dark:text-slate-600" />
              </div>
              <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-1">{stat.value}</h3>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">{stat.name}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">{stat.detail}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 lg:p-8 transition-colors">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
            <LayoutPanelLeft className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Section Visibility</h2>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Toggle which sections are visible on the public portfolio. Changes are saved automatically.</p>
        
        <div className="space-y-4">
          {sectionsList.map(({ key, label, description }) => {
            const enabled = sectionsVisibility[key];
            return (
              <div key={key} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100/50 dark:hover:bg-slate-800 transition-colors">
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200">{label}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{description}</p>
                </div>
                <button
                  className={`${
                    enabled ? 'bg-blue-600 dark:bg-blue-500' : 'bg-slate-300 dark:bg-slate-600'
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900`}
                  onClick={() => setSectionVisibility(key, !enabled)}
                  aria-pressed={enabled}
                >
                  <span className="sr-only">Toggle {label}</span>
                  <span
                    className={`${
                      enabled ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm`}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
