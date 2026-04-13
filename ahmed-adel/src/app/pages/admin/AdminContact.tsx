import { useState, useEffect } from "react";
import { Save, AlertCircle, CheckCircle2 } from "lucide-react";
import { useSite } from "../../context/SiteContext";

export function AdminContact() {
  const { contactInfo, setContactInfo } = useSite();
  const [formData, setFormData] = useState(contactInfo);
  const [isSaved, setIsSaved] = useState(false);

  // Sync local form state when context data loads/changes (e.g. after page refresh)
  useEffect(() => {
    setFormData(contactInfo);
  }, [contactInfo]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setIsSaved(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactInfo(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Contact Information</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your social links and contact details shown on the website.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 lg:p-8 transition-colors">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="ahmed@example.com"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="+20 123 456 7890"
              />
            </div>
            <div>
              <label htmlFor="linkedin" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                LinkedIn URL
              </label>
              <input
                type="url"
                id="linkedin"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="https://linkedin.com/in/..."
              />
            </div>
            <div>
              <label htmlFor="github" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                GitHub URL
              </label>
              <input
                type="url"
                id="github"
                name="github"
                value={formData.github}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="https://github.com/..."
              />
            </div>
            <div>
              <label htmlFor="twitter" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Twitter/X URL
              </label>
              <input
                type="url"
                id="twitter"
                name="twitter"
                value={formData.twitter}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="https://twitter.com/..."
              />
            </div>
            <div>
              <label htmlFor="facebook" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Facebook URL
              </label>
              <input
                type="url"
                id="facebook"
                name="facebook"
                value={formData.facebook || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="https://facebook.com/..."
              />
            </div>
            <div>
              <label htmlFor="whatsapp" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                WhatsApp Link/Number
              </label>
              <input
                type="text"
                id="whatsapp"
                name="whatsapp"
                value={formData.whatsapp || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="https://wa.me/201234567890"
              />
            </div>
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Address / Location
            </label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={2}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              placeholder="Mansoura, Egypt"
            />
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-4 flex gap-3 items-start border border-blue-100 dark:border-blue-900/50">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <p className="text-sm text-blue-800 dark:text-blue-300">
              These details will be displayed publicly in the Contact section of your portfolio.
              Leave a field blank if you do not wish to display it.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Changes are saved to the database.
          </p>
          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200 dark:shadow-blue-900/30 flex items-center gap-2"
          >
            {isSaved ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Saved!
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
