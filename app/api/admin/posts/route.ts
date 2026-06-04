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
  coverImage: z.string().url().optional().or(z.literal("")),
  published: z.boolean().default(false),
  authorId: z.string().min(1),
  categoryId: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const posts = await prisma.post.findMany({
    include: { author: true, category: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });

  const { title, excerpt, body: postBody, coverImage, published, authorId, categoryId } = parsed.data;
  const slug = slugify(title);

  const post = await prisma.post.create({
    data: {
      title,
      slug,
      excerpt,
      body: postBody,
      coverImage: coverImage || null,
      published,
      publishedAt: published ? new Date() : null,
      authorId,
      categoryId: categoryId || null,
    },
    include: { author: true, category: true },
  });

  return NextResponse.json(post, { status: 201 });
}
