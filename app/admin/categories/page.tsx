"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormField } from "@/components/shared/FormField";
import { Button } from "@/components/shared/Button";
import { Plus, Pencil, Trash2, X } from "lucide-react";

type Category = { id: string; name: string; slug: string };
const schema = z.object({ name: z.string().min(1, "Name required") });
type FormValues = z.infer<typeof schema>;

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editing, setEditing] = useState<Category | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const fetchCategories = async () => {
    const res = await fetch("/api/admin/categories");
    setCategories(await res.json());
  };

  useEffect(() => { fetchCategories(); }, []);

  const openEdit = (cat: Category) => {
    setEditing(cat); setValue("name", cat.name); setShowForm(true);
  };

  const closeForm = () => { setEditing(null); reset(); setShowForm(false); };

  const onSubmit = async (data: FormValues) => {
    const url = editing ? `/api/admin/categories/${editing.id}` : "/api/admin/categories";
    await fetch(url, { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    closeForm(); fetchCategories();
  };

  const deleteCategory = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return;
    await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    fetchCategories();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-black text-gray-900">Categories</h1>
        <Button onClick={() => { reset(); setEditing(null); setShowForm(true); }} size="sm">
          <Plus size={16} /> Add Category
        </Button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 max-w-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">{editing ? "Edit Category" : "New Category"}</h2>
            <button onClick={closeForm}><X size={20} className="text-gray-400" /></button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormField {...register("name")} label="Category Name" placeholder="e.g. Digital Marketing" error={errors.name?.message} />
            <div className="flex gap-3">
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
              {["Name", "Slug", "Actions"].map((h) => (
                <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {categories.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="px-5 py-4 font-medium text-gray-900">{c.name}</td>
                <td className="px-5 py-4 text-gray-500 font-mono text-xs">{c.slug}</td>
                <td className="px-5 py-4 flex gap-2">
                  <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg text-gray-400 hover:text-brand-600 hover:bg-brand-50"><Pencil size={15} /></button>
                  <button onClick={() => deleteCategory(c.id, c.name)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50"><Trash2 size={15} /></button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && <tr><td colSpan={3} className="px-6 py-8 text-center text-gray-400">No categories yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
