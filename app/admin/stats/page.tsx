"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormField } from "@/components/shared/FormField";
import { Button } from "@/components/shared/Button";
import { Plus, Pencil, Trash2, X } from "lucide-react";

type Stat = { id: string; label: string; value: string; order: number };
const schema = z.object({
  label: z.string().min(1, "Label required"),
  value: z.string().min(1, "Value required"),
  order: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

export default function StatsPage() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [editing, setEditing] = useState<Stat | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const fetchStats = async () => {
    const res = await fetch("/api/admin/stats");
    setStats(await res.json());
  };

  useEffect(() => { fetchStats(); }, []);

  const openEdit = (s: Stat) => {
    setEditing(s); setValue("label", s.label); setValue("value", s.value); setValue("order", String(s.order)); setShowForm(true);
  };

  const closeForm = () => { setEditing(null); reset(); setShowForm(false); };

  const onSubmit = async (data: FormValues) => {
    const url = editing ? `/api/admin/stats/${editing.id}` : "/api/admin/stats";
    await fetch(url, {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, order: parseInt(data.order || "0") || 0 }),
    });
    closeForm(); fetchStats();
  };

  const deleteStat = async (id: string, label: string) => {
    if (!confirm(`Delete stat "${label}"?`)) return;
    await fetch(`/api/admin/stats/${id}`, { method: "DELETE" });
    fetchStats();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-black text-gray-900">Stats</h1>
        <Button onClick={() => { reset(); setEditing(null); setShowForm(true); }} size="sm">
          <Plus size={16} /> Add Stat
        </Button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 max-w-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">{editing ? "Edit Stat" : "New Stat"}</h2>
            <button onClick={closeForm}><X size={20} className="text-gray-400" /></button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormField {...register("value")} label="Value" placeholder="e.g. 20+" error={errors.value?.message} />
            <FormField {...register("label")} label="Label" placeholder="e.g. Satisfied Clients" error={errors.label?.message} />
            <FormField {...register("order")} type="number" label="Order" placeholder="0" />
            <div className="flex gap-3">
              <Button type="submit" loading={isSubmitting} size="sm">{editing ? "Update" : "Create"}</Button>
              <Button type="button" variant="outline" size="sm" onClick={closeForm}>Cancel</Button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.id} className="bg-white rounded-xl border border-gray-100 p-6 text-center">
            <div className="text-4xl font-black text-brand-600 mb-1">{s.value}</div>
            <div className="text-gray-600 font-medium text-sm">{s.label}</div>
            <div className="flex justify-center gap-2 mt-4">
              <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg text-gray-400 hover:text-brand-600 hover:bg-brand-50"><Pencil size={14} /></button>
              <button onClick={() => deleteStat(s.id, s.label)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
        {stats.length === 0 && (
          <div className="col-span-full bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-400">
            No stats yet.
          </div>
        )}
      </div>
    </div>
  );
}
