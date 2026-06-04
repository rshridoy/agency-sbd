import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { PostForm } from "@/components/admin/PostForm";

export const metadata: Metadata = { title: "Edit Post" };

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) notFound();

  return (
    <div>
      <h1 className="text-3xl font-black text-gray-900 mb-8">Edit Post</h1>
      <PostForm
        postId={post.id}
        initialData={{
          title: post.title,
          excerpt: post.excerpt,
          body: post.body,
          coverImage: post.coverImage || "",
          published: post.published,
          authorId: post.authorId,
          categoryId: post.categoryId || "",
        }}
      />
    </div>
  );
}
