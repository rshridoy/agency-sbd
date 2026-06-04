"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormField } from "@/components/shared/FormField";
import { Button } from "@/components/shared/Button";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle } from "lucide-react";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  excerpt: z.string().min(1, "Excerpt is required").max(500),
  body: z.string().min(1, "Body is required"),
  coverImage: z.string().optional(),
  published: z.boolean(),
  authorId: z.string().min(1, "Author is required"),
  categoryId: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

interface PostFormProps {
  postId?: string;
  initialData?: Partial<FormValues>;
}

type Author = { id: string; name: string };
type Category = { id: string; name: string };

export function PostForm({ postId, initialData }: PostFormProps) {
  const router = useRouter();
  const [authors, setAuthors] = useState<Author[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      published: false,
      ...initialData,
    },
  });

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/authors").then((r) => r.json()),
      fetch("/api/admin/categories").then((r) => r.json()),
    ]).then(([a, c]) => { setAuthors(a); setCategories(c); });
  }, []);

  const onSubmit = async (data: FormValues) => {
    setError(null);
    const url = postId ? `/api/admin/posts/${postId}` : "/api/admin/posts";
    const method = postId ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json();
      setError(err.error?.message || "Something went wrong.");
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push("/admin/posts"), 1000);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-3xl">
      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          <AlertCircle size={16} /> {error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm">
          <CheckCircle size={16} /> Saved successfully! Redirecting…
        </div>
      )}

      <FormField {...register("title")} label="Title" placeholder="Post title" error={errors.title?.message} />
      <FormField {...register("excerpt")} multiline rows={2} label="Excerpt" placeholder="Short description (max 500 chars)" error={errors.excerpt?.message} />
      <FormField {...register("coverImage")} label="Cover Image URL" placeholder="https://..." error={errors.coverImage?.message} />
      {/* TODO: Replace URL input with Cloudinary/S3 upload */}

      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1">Body</label>
        <textarea
          {...register("body")}
          rows={14}
          placeholder="Write your post content here... (plain text or markdown)"
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 font-mono"
        />
        {errors.body && <p className="text-xs text-red-500 mt-1">{errors.body.message}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Author</label>
          <select
            {...register("authorId")}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-100"
          >
            <option value="">Select author…</option>
            {authors.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
          {errors.authorId && <p className="text-xs text-red-500 mt-1">{errors.authorId.message}</p>}
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Category</label>
          <select
            {...register("categoryId")}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-100"
          >
            <option value="">No category</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <input {...register("published")} type="checkbox" className="w-4 h-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
        <span className="text-sm font-medium text-gray-700">Published (visible on site)</span>
      </label>

      <div className="flex gap-3 pt-2">
        <Button type="submit" loading={isSubmitting}>{postId ? "Update Post" : "Create Post"}</Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
      </div>
    </form>
  );
}
