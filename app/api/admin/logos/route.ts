import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1).max(100),
  imageUrl: z.string().min(1),
  websiteUrl: z.string().url().optional().or(z.literal("")),
  order: z.number().int().default(0),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const logos = await prisma.clientLogo.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(logos);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });

  const logo = await prisma.clientLogo.create({
    data: { ...parsed.data, websiteUrl: parsed.data.websiteUrl || null },
  });
  return NextResponse.json(logo, { status: 201 });
}
