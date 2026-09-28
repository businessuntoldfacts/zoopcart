"use client";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Send, Loader2, Megaphone, Trash2, Edit3, X, Calendar } from "lucide-react";

export default function AnnouncementsPage() {
  const [loading, setLoading] = useState(false);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    link: "",
    type: "info",
    sendEmail: false
  });

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch("/api/admin/broadcast");
      if (response.ok) {
        const data = await response.json();
        setAnnouncements(data.announcements || []);
      }
    } catch (error) {
      console.error("Failed to fetch announcements:", error);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      alert("Title and Content are required");
      return;
    }

    setLoading(true);
    try {
      if (editingId) {
        // Update existing announcement
        const response = await fetch("/api/admin/broadcast", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingId,
            title: formData.title,
            content: formData.content,
            link: formData.link,
            type: formData.type
          })
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || "Failed to update announcement");
        }

        alert("Announcement updated successfully!");
      } else {
        // Create new broadcast
        const response = await fetch("/api/admin/broadcast", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: formData.title,
            content: formData.content,
            link: formData.link,
            type: formData.type,
            sendEmail: formData.sendEmail
          })
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || "Failed to broadcast announcement");
        }

        alert("Announcement published and broadcasted successfully!");
      }

      setFormData({ title: "", content: "", link: "", type: "info", sendEmail: false });
      setEditingId(null);
      fetchAnnouncements();
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Failed to process announcement");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (ann: any) => {
    setEditingId(ann.id);
    setFormData({
      title: ann.title || "",
      content: ann.content || "",
      link: ann.link || "",
      type: ann.type || "info",
      sendEmail: false // Can't re-send initial batch broadcast on update
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ title: "", content: "", link: "", type: "info", sendEmail: false });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this announcement? This will remove it from all seller dashboards.")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/broadcast?id=${id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to delete announcement");
      }

      alert("Announcement deleted successfully!");
      fetchAnnouncements();
      if (editingId === id) {
        handleCancelEdit();
      }
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Failed to delete announcement");
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#0F172A]">
            {editingId ? "Edit Announcement" : "Broadcast Announcement"}
          </h2>
          <p className="text-sm text-slate-500 mt-1">Send a message to all Zoopcart sellers via dashboard and email.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-8 rounded-3xl border-slate-200 shadow-sm bg-white">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Announcement Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g. New Feature: Advanced Analytics"
                    className="w-full h-12 px-4 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 bg-slate-50 outline-none focus:border-[#111111] transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full h-12 px-4 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 bg-slate-50 outline-none focus:border-[#111111] transition-all"
                  >
                    <option value="info">Information (Blue)</option>
                    <option value="success">Success (Green)</option>
                    <option value="warning">Warning (Orange)</option>
                    <option value="promotion">Promotion (Purple)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Message Content</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  placeholder="Describe the announcement in detail..."
                  className="w-full p-4 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 bg-slate-50 outline-none focus:border-[#111111] h-40 resize-none transition-all"
                ></textarea>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Action Link (Optional)</label>
                <input
                  type="url"
                  value={formData.link}
                  onChange={(e) => setFormData({...formData, link: e.target.value})}
                  placeholder="https://zoopcart.com/blog/new-feature"
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 bg-slate-50 outline-none focus:border-[#111111] transition-all"
                />
              </div>

              {!editingId && (
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <input
                    type="checkbox"
                    id="sendEmail"
                    checked={formData.sendEmail}
                    onChange={(e) => setFormData({...formData, sendEmail: e.target.checked})}
                    className="w-5 h-5 rounded border-slate-300 text-[#111111] focus:ring-[#111111]"
                  />
                  <label htmlFor="sendEmail" className="text-sm font-bold text-slate-700 cursor-pointer">
                    Send Email Notification to All Sellers
                  </label>
                </div>
              )}

              <div className="flex gap-4">
                {editingId && (
                  <Button
                    type="button"
                    onClick={handleCancelEdit}
                    className="w-1/3 h-14 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold rounded-2xl text-base transition-all flex items-center justify-center gap-2"
                  >
                    <X className="w-5 h-5" /> Cancel
                  </Button>
                )}
                <Button
                  type="submit"
                  disabled={loading}
                  className={`h-14 font-extrabold rounded-2xl text-lg shadow-lg transition-all flex items-center justify-center gap-2 ${
                    editingId ? "w-2/3 bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/10" : "w-full bg-[#111111] hover:bg-black text-white shadow-black/10"
                  }`}
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : editingId ? (
                    <>
                      <Edit3 className="w-5 h-5" /> Save Changes
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" /> Publish & Broadcast
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6 rounded-3xl border-slate-200 shadow-sm bg-white">
            <h3 className="font-bold text-[#0F172A] mb-4 flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-blue-500" /> Live Preview
            </h3>
            <div className="border border-slate-100 rounded-2xl p-5 bg-slate-50">
              <div className="flex items-center gap-2 mb-2">
                 <div className={`w-2.5 h-2.5 rounded-full ${
                   formData.type === 'warning' ? 'bg-orange-500' : formData.type === 'success' ? 'bg-green-500' : formData.type === 'promotion' ? 'bg-purple-500' : 'bg-blue-500'
                 }`}></div>
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{formData.type}</span>
              </div>
              <h4 className="font-bold text-slate-900 text-base leading-tight mb-2">{formData.title || "Announcement Title"}</h4>
              <p className="text-sm text-slate-600 font-medium whitespace-pre-wrap">{formData.content || "Message content will appear here..."}</p>
              {formData.link && (
                <div className="mt-4 text-xs font-bold text-blue-600 underline truncate">
                  Link: {formData.link}
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6 rounded-3xl border-slate-200 shadow-sm bg-white">
             <h3 className="font-bold text-[#0F172A] mb-4">Tips</h3>
             <ul className="text-xs text-slate-500 space-y-3 font-medium">
               <li>• Keep titles short and action-oriented.</li>
               <li>• Use the &apos;Warning&apos; type for urgent maintenance or policy updates.</li>
               <li>• Broadcast emails sparingly to avoid spam filters.</li>
               <li>• Double-check your links before publishing.</li>
             </ul>
          </Card>
        </div>
      </div>

      {/* History Section */}
      <div className="pt-4">
        <h3 className="text-xl font-extrabold text-[#0F172A] mb-4">Sent Announcements History</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {announcements.map((ann) => (
            <Card key={ann.id} className="p-6 rounded-3xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      ann.type === 'warning' ? 'bg-orange-500' : ann.type === 'success' ? 'bg-green-500' : ann.type === 'promotion' ? 'bg-purple-500' : 'bg-blue-500'
                    }`} />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{ann.type}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(ann.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                <h4 className="font-bold text-slate-900 text-base mb-1.5">{ann.title}</h4>
                <p className="text-sm text-slate-600 line-clamp-3 whitespace-pre-wrap mb-4">{ann.content}</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-2">
                {ann.link ? (
                  <a href={ann.link} target="_blank" rel="noreferrer" className="text-xs font-bold text-blue-600 hover:underline truncate max-w-[180px]">
                    Link Attached ↗
                  </a>
                ) : (
                  <span className="text-xs text-slate-400 font-medium">No Link</span>
                )}

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditClick(ann)}
                    className="p-2 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-blue-600 border border-slate-100 transition-colors"
                    title="Edit Announcement"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(ann.id)}
                    className="p-2 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-red-600 border border-slate-100 transition-colors"
                    title="Delete Announcement"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}

          {announcements.length === 0 && (
            <div className="md:col-span-2 p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-3xl text-sm font-medium text-slate-400">
              No announcements sent yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
