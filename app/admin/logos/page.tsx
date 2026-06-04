"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormField } from "@/components/shared/FormField";
import { Button } from "@/components/shared/Button";
import { Plus, Pencil, Trash2, X } from "lucide-react";

type Logo = { id: string; name: string; imageUrl: string; websiteUrl?: string | null; order: number };
const schema = z.object({
  name: z.string().min(1, "Name required"),
  imageUrl: z.string().min(1, "Image URL required"),
  websiteUrl: z.string().optional(),
  order: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

export default function LogosPage() {
  const [logos, setLogos] = useState<Logo[]>([]);
  const [editing, setEditing] = useState<Logo | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const fetchLogos = async () => {
    const res = await fetch("/api/admin/logos");
    setLogos(await res.json());
  };

  useEffect(() => { fetchLogos(); }, []);

  const openEdit = (l: Logo) => {
    setEditing(l);
    setValue("name", l.name); setValue("imageUrl", l.imageUrl);
    setValue("websiteUrl", l.websiteUrl || ""); setValue("order", String(l.order));
    setShowForm(true);
  };

  const closeForm = () => { setEditing(null); reset(); setShowForm(false); };

  const onSubmit = async (data: FormValues) => {
    const url = editing ? `/api/admin/logos/${editing.id}` : "/api/admin/logos";
    await fetch(url, {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, order: parseInt(data.order || "0") || 0 }),
    });
    closeForm(); fetchLogos();
  };

  const deleteLogo = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    await fetch(`/api/admin/logos/${id}`, { method: "DELETE" });
    fetchLogos();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-black text-gray-900">Client Logos</h1>
        <Button onClick={() => { reset(); setEditing(null); setShowForm(true); }} size="sm">
          <Plus size={16} /> Add Logo
        </Button>
      </div>
      {/* TODO: Replace imageUrl input with Cloudinary/S3 file upload */}

      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">{editing ? "Edit Logo" : "New Logo"}</h2>
            <button onClick={closeForm}><X size={20} className="text-gray-400" /></button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField {...register("name")} label="Company Name" placeholder="ACME Corp" error={errors.name?.message} />
            <FormField {...register("order")} type="number" label="Order" placeholder="0" />
            <FormField {...register("imageUrl")} label="Logo Image URL" placeholder="https://..." error={errors.imageUrl?.message} />
            <FormField {...register("websiteUrl")} label="Website URL (optional)" placeholder="https://..." />
            <div className="sm:col-span-2 flex gap-3">
              <Button type="submit" loading={isSubmitting} size="sm">{editing ? "Update" : "Create"}</Button>
              <Button type="button" variant="outline" size="sm" onClick={closeForm}>Cancel</Button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {logos.map((l) => (
          <div key={l.id} className="bg-white rounded-xl border border-gray-100 p-4 text-center">
            <div className="h-16 flex items-center justify-center mb-3">
              <img src={l.imageUrl} alt={l.name} className="max-h-full max-w-full object-contain" />
            </div>
            <p className="text-sm font-medium text-gray-900 mb-2">{l.name}</p>
            <div className="flex justify-center gap-2">
              <button onClick={() => openEdit(l)} className="p-1.5 rounded-lg text-gray-400 hover:text-brand-600 hover:bg-brand-50"><Pencil size={14} /></button>
              <button onClick={() => deleteLogo(l.id, l.name)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
        {logos.length === 0 && (
          <div className="col-span-full bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-400">
            No logos yet.
          </div>
        )}
      </div>
    </div>
  );
}
