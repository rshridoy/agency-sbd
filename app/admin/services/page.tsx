"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormField } from "@/components/shared/FormField";
import { Button } from "@/components/shared/Button";
import { Plus, Pencil, Trash2, X } from "lucide-react";

type Service = { id: string; title: string; description: string; icon: string; order: number };
const schema = z.object({
  title: z.string().min(1, "Title required"),
  description: z.string().min(1, "Description required"),
  icon: z.string().min(1, "Icon required"),
  order: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

export default function ServicesAdminPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [editing, setEditing] = useState<Service | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const fetchServices = async () => {
    const res = await fetch("/api/admin/services");
    setServices(await res.json());
  };

  useEffect(() => { fetchServices(); }, []);

  const openEdit = (s: Service) => {
    setEditing(s);
    setValue("title", s.title); setValue("description", s.description);
    setValue("icon", s.icon); setValue("order", String(s.order));
    setShowForm(true);
  };

  const closeForm = () => { setEditing(null); reset(); setShowForm(false); };

  const onSubmit = async (data: FormValues) => {
    const url = editing ? `/api/admin/services/${editing.id}` : "/api/admin/services";
    await fetch(url, {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, order: parseInt(data.order || "0") || 0 }),
    });
    closeForm(); fetchServices();
  };

  const deleteService = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    await fetch(`/api/admin/services/${id}`, { method: "DELETE" });
    fetchServices();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-black text-gray-900">Services</h1>
        <Button onClick={() => { reset(); setEditing(null); setShowForm(true); }} size="sm">
          <Plus size={16} /> Add Service
        </Button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">{editing ? "Edit Service" : "New Service"}</h2>
            <button onClick={closeForm}><X size={20} className="text-gray-400" /></button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField {...register("title")} label="Title" placeholder="Service title" error={errors.title?.message} />
            <div className="grid grid-cols-2 gap-4">
              <FormField {...register("icon")} label="Icon (lucide name)" placeholder="Megaphone" error={errors.icon?.message} />
              <FormField {...register("order")} type="number" label="Order" placeholder="0" />
            </div>
            <div className="sm:col-span-2">
              <FormField {...register("description")} multiline rows={3} label="Description" placeholder="Service description" error={errors.description?.message} />
            </div>
            <div className="sm:col-span-2 flex gap-3">
              <Button type="submit" loading={isSubmitting} size="sm">{editing ? "Update" : "Create"}</Button>
              <Button type="button" variant="outline" size="sm" onClick={closeForm}>Cancel</Button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              {["#", "Title", "Icon", "Description", "Actions"].map((h) => (
                <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {services.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="px-5 py-4 text-gray-400">{s.order}</td>
                <td className="px-5 py-4 font-medium text-gray-900">{s.title}</td>
                <td className="px-5 py-4 text-gray-500 font-mono text-xs">{s.icon}</td>
                <td className="px-5 py-4 text-gray-500 text-xs max-w-[300px] line-clamp-2">{s.description}</td>
                <td className="px-5 py-4 flex gap-2">
                  <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg text-gray-400 hover:text-brand-600 hover:bg-brand-50"><Pencil size={15} /></button>
                  <button onClick={() => deleteService(s.id, s.title)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50"><Trash2 size={15} /></button>
                </td>
              </tr>
            ))}
            {services.length === 0 && <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">No services yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
