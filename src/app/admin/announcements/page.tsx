"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Send, Loader2, Megaphone } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AnnouncementsPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    link: "",
    type: "info",
    sendEmail: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      alert("Title and Content are required");
      return;
    }

    setLoading(true);
    try {
      // 1. Save to Database
      const { error: dbError } = await supabase
        .from('announcements')
        .insert([{
          title: formData.title,
          content: formData.content,
          link: formData.link,
          type: formData.type,
          is_active: true
        }])
        .select()
        .single();

      if (dbError) throw dbError;

      // 2. Broadcast Email if requested
      if (formData.sendEmail) {
        const response = await fetch("/api/admin/broadcast", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: formData.title,
            content: formData.content,
            link: formData.link
          })
        });

        if (!response.ok) {
          console.warn("Announcement published, but email broadcast failed.");
        }
      }

      alert("Announcement published successfully!");
      setFormData({ title: "", content: "", link: "", type: "info", sendEmail: false });
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Failed to publish announcement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h2 className="text-2xl font-extrabold text-[#0F172A]">Broadcast Announcement</h2>
        <p className="text-sm text-slate-500 mt-1">Send a message to all Zoopcart sellers via dashboard and email.</p>
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

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-[#111111] hover:bg-black text-white font-extrabold rounded-2xl text-lg shadow-lg shadow-black/10 transition-all flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-5 h-5" /> Publish & Broadcast</>}
              </Button>
            </form>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6 rounded-3xl border-slate-200 shadow-sm bg-white">
            <h3 className="font-bold text-[#0F172A] mb-4 flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-blue-500" /> Preview
            </h3>
            <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50">
              <div className="flex items-center gap-2 mb-2">
                 <div className={`w-2 h-2 rounded-full ${formData.type === 'warning' ? 'bg-orange-500' : formData.type === 'success' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{formData.type}</span>
              </div>
              <h4 className="font-bold text-slate-900 leading-tight mb-1">{formData.title || "Your Announcement Title"}</h4>
              <p className="text-xs text-slate-500 line-clamp-3">{formData.content || "Message content will appear here..."}</p>
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
    </div>
  );
}
