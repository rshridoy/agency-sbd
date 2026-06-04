import type { Metadata } from "next";
import { PostForm } from "@/components/admin/PostForm";

export const metadata: Metadata = { title: "New Post" };

export default function NewPostPage() {
  return (
    <div>
      <h1 className="text-3xl font-black text-gray-900 mb-8">New Blog Post</h1>
      <PostForm />
    </div>
  );
}
