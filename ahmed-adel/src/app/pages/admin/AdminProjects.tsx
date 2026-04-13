import { useState, useRef, useEffect } from "react";
import { Plus, Edit2, Trash2, Save, CheckCircle2, Upload, Loader2 } from "lucide-react";
import { useSite, ProjectItem } from "../../context/SiteContext";
import { projectsAPI, uploadAPI, resolveFileUrl } from "../../services/api";

export function AdminProjects() {
  const { projectsList, setProjectsList, refreshData } = useSite();
  const [list, setList] = useState<ProjectItem[]>(projectsList);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<ProjectItem>>({});
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync list when projectsList changes from context (e.g. after page refresh)
  useEffect(() => { setList(projectsList); }, [projectsList]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Determine which items are new (client-generated id) vs existing (MongoDB _id)
      for (const item of list) {
        const isMongoId = item._id || (item.id && item.id.length === 24);
        if (isMongoId) {
          await projectsAPI.update(item._id || item.id, item as unknown as Record<string, unknown>);
        } else {
          await projectsAPI.create(item as unknown as Record<string, unknown>);
        }
      }

      // Delete items that were removed from the list
      const currentIds = new Set(list.map(i => i._id || i.id));
      for (const orig of projectsList) {
        const origId = orig._id || orig.id;
        if (!currentIds.has(origId)) {
          await projectsAPI.delete(origId);
        }
      }

      await refreshData();
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      console.error('Save failed:', error);
      alert('Failed to save. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (item: ProjectItem) => {
    setEditingId(item.id || item._id || '');
    setEditForm({ ...item, details: [...item.details], tags: [...item.tags] });
  };

  const handleUpdate = () => {
    if (!editingId) return;
    setList(prev => prev.map(item => {
      const itemId = item._id || item.id;
      return itemId === editingId ? { ...item, ...editForm } as ProjectItem : item;
    }));
    setEditingId(null);
    setEditForm({});
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const res = await uploadAPI.upload(file);
      const data = res.data as { url: string };
      setEditForm(prev => ({ ...prev, image: data.url }));
    } catch (error: any) {
      console.error('Upload failed:', error);
      alert(`Image upload failed: ${error?.message || 'Unknown error'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAdd = () => {
    const newItem: ProjectItem = {
      id: Date.now().toString(),
      title: "New Project",
      category: "Category",
      date: "Date",
      description: "Short description...",
      image: "",
      role: "Lead Researcher",
      location: "Mansoura University",
      details: ["Detail 1"],
      tags: ["Tag 1"]
    };
    setList([...list, newItem]);
    handleEdit(newItem);
  };

  const handleDelete = (id: string) => {
    setList(prev => prev.filter(item => (item._id || item.id) !== id));
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
      <div className="p-6 lg:p-8 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Projects & Activities</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your research, outreach, and volunteering portfolio.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add New Project
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200 dark:shadow-blue-900/30 disabled:opacity-50"
          >
            {isSaved ? <CheckCircle2 className="w-4 h-4" /> : isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isSaved ? "Saved!" : isSaving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Hidden file input for image upload */}
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />

      <div className="p-6 lg:p-8 space-y-6">
        {list.map(project => {
          const projectId = project._id || project.id;
          return (
            <div key={projectId} className="border border-slate-200 dark:border-slate-700 rounded-xl p-5 hover:border-blue-200 dark:hover:border-blue-800 transition-colors">
              {editingId === projectId ? (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Title</label>
                      <input 
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 outline-none bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200"
                        value={editForm.title || ""}
                        onChange={e => setEditForm({...editForm, title: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                      <input 
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 outline-none bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200"
                        value={editForm.category || ""}
                        onChange={e => setEditForm({...editForm, category: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Project Image</label>
                      <div className="flex gap-2">
                        <input 
                          className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 outline-none bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 text-sm"
                          placeholder="Paste URL or upload…"
                          value={editForm.image || ""}
                          onChange={e => setEditForm({...editForm, image: e.target.value})}
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploading}
                          className="px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-sm shrink-0"
                        >
                          {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Role</label>
                        <input 
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 outline-none bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200"
                          value={editForm.role || ""}
                          onChange={e => setEditForm({...editForm, role: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Location</label>
                        <input 
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 outline-none bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200"
                          value={editForm.location || ""}
                          onChange={e => setEditForm({...editForm, location: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Short Description</label>
                      <textarea 
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 outline-none resize-none bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200"
                        rows={2}
                        value={editForm.description || ""}
                        onChange={e => setEditForm({...editForm, description: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Details/Outcomes (one per line)</label>
                      <textarea 
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 outline-none resize-none bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200"
                        rows={4}
                        value={(editForm.details || []).join('\n')}
                        onChange={e => setEditForm({...editForm, details: e.target.value.split('\n')})}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Tags (one per line)</label>
                      <textarea 
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 outline-none resize-none bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200"
                        rows={4}
                        value={(editForm.tags || []).join('\n')}
                        onChange={e => setEditForm({...editForm, tags: e.target.value.split('\n')})}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end mt-4">
                    <button onClick={() => setEditingId(null)} className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700">Cancel</button>
                    <button onClick={handleUpdate} className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700">Update Item</button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-start gap-4">
                  <div className="flex items-start gap-4">
                    {project.image ? (
                      <img src={resolveFileUrl(project.image)} alt={project.title} className="w-16 h-16 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0" />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700">
                        <span className="text-xs text-slate-400">No img</span>
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-slate-800 dark:text-slate-100">{project.title}</h3>
                      <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">{project.category} • {project.date}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-1">{project.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => handleEdit(project)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(projectId)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {list.length === 0 && (
          <p className="text-center text-slate-500 dark:text-slate-400 py-8">No projects found. Click "Add New Project" to get started.</p>
        )}
      </div>
    </div>
  );
}
