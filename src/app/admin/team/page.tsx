"use client";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Shield, Phone, Mail, CheckCircle2, Trash2, Edit2, ShieldAlert, Star } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  whatsapp_number: string;
  is_primary_contact: boolean;
  status: string;
}

export default function TeamManagementPage() {
  const [team, setTeam] = useState<TeamMember[]>([
    {
      id: "1",
      name: "Aisha Sharma",
      role: "Secretary",
      email: "aisha@zoopcart.com",
      whatsapp_number: "9876543210",
      is_primary_contact: true,
      status: "Active"
    },
    {
      id: "2",
      name: "Rohan Verma",
      role: "Support Staff",
      email: "rohan@zoopcart.com",
      whatsapp_number: "9876543211",
      is_primary_contact: false,
      status: "Active"
    }
  ]);

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  // Form State
  const [form, setForm] = useState({
    name: "",
    role: "Secretary" as "Secretary" | "Admin" | "Support Staff",
    email: "",
    whatsapp_number: "",
    is_primary_contact: false,
    status: "Active" as "Active" | "Inactive"
  });

  useEffect(() => {
    const savedTeam = localStorage.getItem("zoopcart_admin_team");
    if (savedTeam) {
      try {
        setTeam(JSON.parse(savedTeam));
      } catch (e) {
        console.error("Failed to load team from localStorage", e);
      }
    }
  }, []);

  const saveToLocalStorage = (updatedTeam: TeamMember[]) => {
    localStorage.setItem("zoopcart_admin_team", JSON.stringify(updatedTeam));
    setTeam(updatedTeam);
  };

  const handleOpenAddModal = () => {
    setEditingMember(null);
    setForm({
      name: "",
      role: "Secretary",
      email: "",
      whatsapp_number: "",
      is_primary_contact: false,
      status: "Active"
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (member: TeamMember) => {
    setEditingMember(member);
    setForm({
      name: member.name,
      role: member.role,
      email: member.email,
      whatsapp_number: member.whatsapp_number,
      is_primary_contact: member.is_primary_contact,
      status: member.status
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.whatsapp_number) {
      alert("Please fill in all required fields.");
      return;
    }

    let updatedTeam = [...team];

    if (form.is_primary_contact) {
      // Unset previous primary contact
      updatedTeam = updatedTeam.map(m => ({ ...m, is_primary_contact: false }));
    }

    if (editingMember) {
      updatedTeam = updatedTeam.map(m =>
        m.id === editingMember.id
          ? { ...m, ...form }
          : m
      );
      setSuccessMsg("Team member updated successfully!");
    } else {
      const newMember: TeamMember = {
        id: Date.now().toString(),
        ...form
      };
      updatedTeam.push(newMember);
      setSuccessMsg("New Secretary/Team member added successfully!");
    }

    saveToLocalStorage(updatedTeam);
    setIsModalOpen(false);
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to remove this team member?")) {
      const updatedTeam = team.filter(m => m.id !== id);
      saveToLocalStorage(updatedTeam);
      setSuccessMsg("Member removed successfully.");
      setTimeout(() => setSuccessMsg(""), 4000);
    }
  };

  const handleToggleStatus = (member: TeamMember) => {
    const updatedTeam = team.map(m =>
      m.id === member.id
        ? { ...m, status: m.status === "Active" ? "Inactive" : "Active" as const }
        : m
    );
    saveToLocalStorage(updatedTeam);
    setSuccessMsg(`Status updated for ${member.name}`);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#0F172A]">Secretary & Team Management</h2>
          <p className="text-sm text-slate-500 mt-1">
            Manage administrative Secretary roles, support personnel, and live escalation contacts.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {successMsg && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {successMsg}
            </div>
          )}
          <Button onClick={handleOpenAddModal} className="bg-slate-900 text-white font-bold rounded-xl h-12 hover:bg-slate-800 flex items-center gap-2">
            <UserPlus className="w-4 h-4" /> Add Secretary / Staff
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="bg-white border-slate-200 shadow-sm rounded-2xl border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="p-4 pl-6">Name / Role</th>
                    <th className="p-4">Contact Info</th>
                    <th className="p-4">Primary Control</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right pr-6">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {team.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-500">
                        No team members registered. Click &quot;Add Secretary&quot; to begin.
                      </td>
                    </tr>
                  ) : (
                    team.map((member) => (
                      <tr key={member.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 pl-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center font-bold text-white text-sm">
                              {member.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-extrabold text-[#0F172A] text-base flex items-center gap-1.5">
                                {member.name}
                                {member.role === "Secretary" && (
                                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md text-[9px] font-black uppercase tracking-wider border border-blue-100">
                                    Secretary
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-slate-400 font-bold">{member.role}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col space-y-0.5 text-xs font-semibold text-slate-700">
                            <div className="flex items-center gap-1">
                              <Mail className="w-3 h-3 text-slate-400" /> {member.email}
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="w-3 h-3 text-emerald-500" /> +91 {member.whatsapp_number}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          {member.is_primary_contact ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-800 rounded-full text-xs font-bold border border-amber-200">
                              <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> Primary Contact
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400 font-medium">Backup Staff</span>
                          )}
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => handleToggleStatus(member)}
                            className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${
                              member.status === "Active"
                                ? "bg-green-100 text-green-700 hover:bg-green-200"
                                : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                            }`}
                          >
                            {member.status}
                          </button>
                        </td>
                        <td className="p-4 pr-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEditModal(member)}
                              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit Member Details"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(member.id)}
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete Member"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <div className="md:col-span-1 space-y-6">
          <Card className="p-6 rounded-3xl border-slate-200 shadow-sm bg-white border">
            <div className="flex items-center gap-3 mb-4 border-b border-slate-100 pb-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Shield className="w-4 h-4" />
              </div>
              <h3 className="font-extrabold text-base text-[#0F172A]">Role Escalation Hierarchy</h3>
            </div>
            <p className="text-xs font-medium text-slate-500 leading-relaxed">
              The assigned <strong>Secretary</strong> or <strong>Primary Contact</strong> receives administrative system webhooks, support ticketing alerts, and real-time merchant notification copies.
            </p>
            <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <div className="text-[11px] font-semibold text-slate-600 leading-normal">
                Only one user can be designated as the Primary Contact control operator at any given time.
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md border border-slate-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-extrabold text-lg text-[#0F172A]">
                {editingMember ? "Edit Team Member" : "Add Secretary / Team Member"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">Full Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Aisha Sharma"
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 bg-slate-50 outline-none focus:border-[#111111]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">Role Category</label>
                <select
                  value={form.role}
                  onChange={e => setForm({ ...form, role: e.target.value })}
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 bg-slate-50 outline-none focus:border-[#111111]"
                >
                  <option value="Secretary">Secretary</option>
                  <option value="Support Staff">Support Staff</option>
                  <option value="Admin">Admin Assistant</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">Email Address</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="name@zoopcart.com"
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm font-medium text-slate-900 bg-slate-50 outline-none focus:border-[#111111]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block">WhatsApp Number (10 digits)</label>
                <input
                  type="text"
                  required
                  pattern="[0-9]{10}"
                  value={form.whatsapp_number}
                  onChange={e => setForm({ ...form, whatsapp_number: e.target.value })}
                  placeholder="9876543210"
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 bg-slate-50 outline-none focus:border-[#111111]"
                />
              </div>

              <div className="flex items-center gap-2 py-2">
                <input
                  type="checkbox"
                  id="is_primary_contact"
                  checked={form.is_primary_contact}
                  onChange={e => setForm({ ...form, is_primary_contact: e.target.checked })}
                  className="rounded text-[#111111] w-4 h-4 cursor-pointer"
                />
                <label htmlFor="is_primary_contact" className="text-sm font-bold text-slate-700 cursor-pointer">
                  Designate as Primary Escalation Contact
                </label>
              </div>

              <div className="flex gap-2 justify-end pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 h-11 border rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 h-11 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800"
                >
                  {editingMember ? "Save Changes" : "Create Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
