import { useState, useEffect } from "react";
import { Save, CheckCircle2 } from "lucide-react";
import { useSite } from "../../context/SiteContext";

export function AdminAbout() {
  const { aboutInfo, setAboutInfo } = useSite();
  const [formData, setFormData] = useState(aboutInfo);
  const [isSaved, setIsSaved] = useState(false);

  // Sync local form state when context data loads/changes (e.g. after page refresh)
  useEffect(() => {
    setFormData(aboutInfo);
  }, [aboutInfo]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setIsSaved(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAboutInfo(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 lg:p-8 max-w-3xl transition-colors">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">About Content</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your biography and journey.</p>
        </div>
        <button 
          onClick={handleSubmit}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200 dark:shadow-blue-900/30"
        >
          {isSaved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {isSaved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Introductary Paragraph</label>
          <textarea 
            rows={4}
            name="introText"
            value={formData.introText}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 outline-none transition-all text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 resize-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Journey - First Paragraph</label>
          <textarea 
            rows={4}
            name="journeyP1"
            value={formData.journeyP1}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 outline-none transition-all text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 resize-none"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Journey - Second Paragraph</label>
          <textarea 
            rows={4}
            name="journeyP2"
            value={formData.journeyP2}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 outline-none transition-all text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 resize-none"
          />
        </div>
      </form>
    </div>
  );
}
