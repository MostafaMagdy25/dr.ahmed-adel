import { useState, useRef, useEffect } from "react";
import { Save, Image as ImageIcon, CheckCircle2, Upload, Loader2 } from "lucide-react";
import { useSite } from "../../context/SiteContext";
import { uploadAPI, resolveFileUrl } from "../../services/api";

export function AdminHero() {
  const { heroInfo, setHeroInfo } = useSite();
  const [formData, setFormData] = useState(heroInfo);
  const [isSaved, setIsSaved] = useState(false);

  // Sync local form state when context data loads/changes (e.g. after page refresh)
  useEffect(() => {
    setFormData(heroInfo);
  }, [heroInfo]);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingCv, setIsUploadingCv] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cvInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setIsSaved(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const res = await uploadAPI.upload(file);
      const data = res.data as { url: string };
      setFormData((prev) => ({ ...prev, imageUrl: data.url }));
      setIsSaved(false);
    } catch (error: any) {
      console.error('Upload failed:', error);
      alert(`Image upload failed: ${error?.message || 'Unknown error'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingCv(true);
    try {
      const res = await uploadAPI.upload(file);
      const data = res.data as { url: string };
      setFormData((prev) => ({ ...prev, cvUrl: data.url }));
      setIsSaved(false);
    } catch (error: any) {
      console.error('Upload failed:', error);
      alert(`CV upload failed: ${error?.message || 'Unknown error'}`);
    } finally {
      setIsUploadingCv(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHeroInfo(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 lg:p-8 transition-colors">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Hero Content</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage the main introductory section of your portfolio.</p>
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
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Tagline / Badge</label>
              <input 
                type="text" 
                name="tagline"
                value={formData.tagline}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 outline-none transition-all text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Main Headline</label>
              <textarea 
                rows={2}
                name="headline"
                value={formData.headline}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 outline-none transition-all text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 resize-none font-bold text-lg"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Biography / Description</label>
              <textarea 
                rows={4}
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 outline-none transition-all text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Primary Button Text</label>
                <input 
                  type="text" 
                  name="primaryBtn"
                  value={formData.primaryBtn}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 outline-none transition-all text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900"
                />
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Secondary Button Text (Download CV)</label>
                  <input 
                    type="text" 
                    name="secondaryBtn"
                    value={formData.secondaryBtn}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 outline-none transition-all text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">CV File URL</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      name="cvUrl"
                      value={formData.cvUrl || ""}
                      onChange={handleChange}
                      placeholder="Paste CV URL or upload…"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 outline-none transition-all text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 text-sm"
                    />
                    <input
                      ref={cvInputRef}
                      type="file"
                      accept="application/pdf"
                      onChange={handleCvUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => cvInputRef.current?.click()}
                      disabled={isUploadingCv}
                      className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700 disabled:opacity-50 flex items-center shrink-0"
                    >
                      {isUploadingCv ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block mb-2">Profile Image</label>
            
            {/* Image Upload Button */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleImageUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full mb-3 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700 disabled:opacity-50"
            >
              {isUploading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Uploading…</>
              ) : (
                <><Upload className="w-4 h-4" /> Upload from Device</>
              )}
            </button>

            {/* Or paste URL */}
            <input 
              type="text" 
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="Or paste image URL…"
              className="w-full px-4 py-2.5 mb-4 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 outline-none transition-all text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 text-sm"
            />

            {formData.imageUrl ? (
              <img src={resolveFileUrl(formData.imageUrl)} alt="Preview" className="w-full h-48 object-cover rounded-2xl border-2 border-slate-200 dark:border-slate-700" />
            ) : (
              <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-4 flex flex-col items-center justify-center text-center h-48 bg-slate-50 dark:bg-slate-950">
                <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-sm mb-3">
                  <ImageIcon className="w-5 h-5 text-blue-500" />
                </div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">No image</p>
                <p className="text-xs text-slate-400">Upload or paste a URL above</p>
              </div>
            )}
            
            <div className="mt-6 space-y-4">
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Floating Badge Details</h4>
              <div className="space-y-2">
                <label className="text-xs text-slate-500 dark:text-slate-400 font-medium">Highlight Number</label>
                <input 
                  type="text" 
                  name="badgeNum"
                  value={formData.badgeNum}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 focus:border-blue-500 outline-none text-sm bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <label className="text-xs text-slate-500 dark:text-slate-400 font-medium">Top Text</label>
                  <input 
                    type="text" 
                    name="badgeText"
                    value={formData.badgeText}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 focus:border-blue-500 outline-none text-sm bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-slate-500 dark:text-slate-400 font-medium">Bottom Text</label>
                  <input 
                    type="text" 
                    name="badgeSubtext"
                    value={formData.badgeSubtext}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 focus:border-blue-500 outline-none text-sm bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
