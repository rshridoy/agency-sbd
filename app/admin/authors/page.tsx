"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormField } from "@/components/shared/FormField";
import { Button } from "@/components/shared/Button";
import { Plus, Pencil, Trash2, X } from "lucide-react";

type Author = { id: string; name: string; bio?: string | null; avatar?: string | null };
const schema = z.object({
  name: z.string().min(1, "Name required"),
  bio: z.string().optional(),
  avatar: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

export default function AuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [editing, setEditing] = useState<Author | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const fetchAuthors = async () => {
    const res = await fetch("/api/admin/authors");
    setAuthors(await res.json());
  };

  useEffect(() => { fetchAuthors(); }, []);

  const openEdit = (author: Author) => {
    setEditing(author);
    setValue("name", author.name);
    setValue("bio", author.bio || "");
    setValue("avatar", author.avatar || "");
    setShowForm(true);
  };

  const closeForm = () => { setEditing(null); reset(); setShowForm(false); };

  const onSubmit = async (data: FormValues) => {
    const url = editing ? `/api/admin/authors/${editing.id}` : "/api/admin/authors";
    const method = editing ? "PUT" : "POST";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    closeForm();
    fetchAuthors();
  };

  const deleteAuthor = async (id: string, name: string) => {
    if (!confirm(`Delete author "${name}"?`)) return;
    await fetch(`/api/admin/authors/${id}`, { method: "DELETE" });
    fetchAuthors();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-black text-gray-900">Authors</h1>
        <Button onClick={() => { reset(); setEditing(null); setShowForm(true); }} size="sm">
          <Plus size={16} /> Add Author
        </Button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">{editing ? "Edit Author" : "New Author"}</h2>
            <button onClick={closeForm}><X size={20} className="text-gray-400" /></button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField {...register("name")} label="Name" placeholder="Author name" error={errors.name?.message} />
            <FormField {...register("avatar")} label="Avatar URL" placeholder="https://..." />
            <div className="sm:col-span-2">
              <FormField {...register("bio")} multiline rows={2} label="Bio" placeholder="Short bio..." />
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
              {["Name", "Bio", "Actions"].map((h) => (
                <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {authors.map((a) => (
              <tr key={a.id} className="hover:bg-gray-50">
                <td className="px-5 py-4 font-medium text-gray-900">{a.name}</td>
                <td className="px-5 py-4 text-gray-500 text-xs max-w-[300px] line-clamp-2">{a.bio || "—"}</td>
                <td className="px-5 py-4 flex gap-2">
                  <button onClick={() => openEdit(a)} className="p-1.5 rounded-lg text-gray-400 hover:text-brand-600 hover:bg-brand-50"><Pencil size={15} /></button>
                  <button onClick={() => deleteAuthor(a.id, a.name)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50"><Trash2 size={15} /></button>
                </td>
              </tr>
            ))}
            {authors.length === 0 && <tr><td colSpan={3} className="px-6 py-8 text-center text-gray-400">No authors yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
