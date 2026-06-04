import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { slugify } from "@/lib/utils";

const schema = z.object({
  title: z.string().min(1).max(200),
  excerpt: z.string().min(1).max(500),
  body: z.string().min(1),
  coverImage: z.string().optional().or(z.literal("")),
  published: z.boolean(),
  authorId: z.string().min(1),
  categoryId: z.string().optional(),
});

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const post = await prisma.post.findUnique({
    where: { id },
    include: { author: true, category: true },
  });

  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(post);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });

  const { title, excerpt, body: postBody, coverImage, published, authorId, categoryId } = parsed.data;
  const existing = await prisma.post.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const slug = existing.title === title ? existing.slug : slugify(title);

  const post = await prisma.post.update({
    where: { id },
    data: {
      title,
      slug,
      excerpt,
      body: postBody,
      coverImage: coverImage || null,
      published,
      publishedAt: published && !existing.publishedAt ? new Date() : existing.publishedAt,
      authorId,
      categoryId: categoryId || null,
    },
    include: { author: true, category: true },
  });

  return NextResponse.json(post);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.post.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
