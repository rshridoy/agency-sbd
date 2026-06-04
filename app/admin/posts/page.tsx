"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";

type Post = {
  id: string; title: string; slug: string; published: boolean;
  publishedAt: string | null; author: { name: string }; category: { name: string } | null;
  createdAt: string;
};

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    const res = await fetch("/api/admin/posts");
    const data = await res.json();
    setPosts(data);
    setLoading(false);
  };

  useEffect(() => { fetchPosts(); }, []);

  const deletePost = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
    fetchPosts();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Blog Posts</h1>
          <p className="text-gray-500 mt-1">{posts.length} posts</p>
        </div>
        <Link href="/admin/posts/new" className="inline-flex items-center gap-2 bg-brand-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-brand-700 transition-colors text-sm">
          <Plus size={17} /> New Post
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {["Title", "Author", "Category", "Status", "Published", "Actions"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4">
                    <p className="font-medium text-gray-900 line-clamp-1">{post.title}</p>
                    <p className="text-gray-400 text-xs mt-0.5">/{post.slug}</p>
                  </td>
                  <td className="px-5 py-4 text-gray-600">{post.author.name}</td>
                  <td className="px-5 py-4 text-gray-500">{post.category?.name || "—"}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      post.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                    }`}>
                      {post.published ? <Eye size={11} /> : <EyeOff size={11} />}
                      {post.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-500 text-xs">
                    {post.publishedAt ? formatDate(post.publishedAt) : "—"}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/posts/${post.id}`} className="p-1.5 rounded-lg text-gray-400 hover:text-brand-600 hover:bg-brand-50 transition-colors">
                        <Pencil size={15} />
                      </Link>
                      <button onClick={() => deletePost(post.id, post.title)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                        <Trash2 size={15} />
                      </button>
                      {post.published && (
                        <Link href={`/blog/${post.slug}`} target="_blank" className="p-1.5 rounded-lg text-gray-400 hover:text-brand-600 hover:bg-brand-50 transition-colors">
                          <Eye size={15} />
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {posts.length === 0 && !loading && (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-400">No posts yet. <Link href="/admin/posts/new" className="text-brand-600 font-medium">Create one</Link>.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
