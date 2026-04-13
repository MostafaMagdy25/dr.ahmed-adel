import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Save, CheckCircle2, Loader2 } from "lucide-react";
import { useSite, EducationItem } from "../../context/SiteContext";
import { educationAPI } from "../../services/api";

export function AdminEducation() {
  const { educationList, refreshData } = useSite();
  const [list, setList] = useState<EducationItem[]>(educationList);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Sync list when context data loads/changes (e.g. after page refresh)
  useEffect(() => { setList(educationList); }, [educationList]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<EducationItem>>({});

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Determine which items are new vs existing (MongoDB _id)
      for (const item of list) {
        const isMongoId = item._id || (item.id && item.id.length === 24);
        if (isMongoId) {
          await educationAPI.update(item._id || item.id, item as unknown as Record<string, unknown>);
        } else {
          await educationAPI.create(item as unknown as Record<string, unknown>);
        }
      }

      // Delete items that were removed from the list
      const currentIds = new Set(list.map(i => i._id || i.id));
      for (const orig of educationList) {
        const origId = orig._id || orig.id;
        if (!currentIds.has(origId)) {
          await educationAPI.delete(origId);
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

  const handleEdit = (item: EducationItem) => {
    const itemId = item._id || item.id;
    setEditingId(itemId);
    setEditForm({ ...item, highlights: [...item.highlights] });
  };

  const handleUpdate = () => {
    if (!editingId) return;
    setList(prev => prev.map(item => {
      const itemId = item._id || item.id;
      return itemId === editingId ? { ...item, ...editForm } as EducationItem : item;
    }));
    setEditingId(null);
    setEditForm({});
  };

  const handleAdd = () => {
    const newItem: EducationItem = {
      id: Date.now().toString(),
      degree: "New Degree",
      institution: "Institution Name",
      date: "2024",
      description: "Description",
      highlights: ["Highlight 1"]
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
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Education</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your educational background.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add New
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

      <div className="p-6 lg:p-8 space-y-6">
        {list.map(item => {
          const itemId = item._id || item.id;
          return (
            <div key={itemId} className="border border-slate-200 dark:border-slate-700 rounded-xl p-5 hover:border-blue-200 dark:hover:border-blue-800 transition-colors">
              {editingId === itemId ? (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Degree</label>
                      <input 
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 outline-none bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200"
                        value={editForm.degree || ""}
                        onChange={e => setEditForm({...editForm, degree: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Institution</label>
                      <input 
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 outline-none bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200"
                        value={editForm.institution || ""}
                        onChange={e => setEditForm({...editForm, institution: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Date</label>
                      <input 
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 outline-none bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200"
                        value={editForm.date || ""}
                        onChange={e => setEditForm({...editForm, date: e.target.value})}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Description</label>
                      <textarea 
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 outline-none resize-none bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200"
                        rows={2}
                        value={editForm.description || ""}
                        onChange={e => setEditForm({...editForm, description: e.target.value})}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Highlights (one per line)</label>
                      <textarea 
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 outline-none resize-none bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200"
                        rows={3}
                        value={(editForm.highlights || []).join('\n')}
                        onChange={e => setEditForm({...editForm, highlights: e.target.value.split('\n')})}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => setEditingId(null)} className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700">Cancel</button>
                    <button onClick={handleUpdate} className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700">Update Item</button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-100">{item.degree}</h3>
                    <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-2">{item.institution} • {item.date}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{item.description}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => handleEdit(item)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(itemId)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {list.length === 0 && (
          <p className="text-center text-slate-500 dark:text-slate-400 py-8">No education items found.</p>
        )}
      </div>
    </div>
  );
}