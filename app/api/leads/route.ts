import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { sendEmail, leadNotificationHtml } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";
import { getIp } from "@/lib/utils";
import { LeadSource } from "@prisma/client";

const schema = z.object({
  name: z.string().min(2).max(100),
  phone: z.string().min(7).max(20),
  source: z.enum(["HOME_DISCOVERY", "HOME_CALLBACK", "INFLUENCER"]),
  _gotcha: z.string().max(0, "Bot detected"),
});

export async function POST(req: NextRequest) {
  const ip = getIp(req);
  if (!rateLimit(`leads:${ip}`, 5, 60_000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 });
  }

  const { name, phone, source } = parsed.data;

  const lead = await prisma.lead.create({
    data: { name, phone, source: source as LeadSource },
  });

  // Fire-and-forget email — never block the response
  sendEmail({
    to: process.env.ADMIN_EMAIL || "siren.infos@gmail.com",
    subject: `New lead from ${source.replace("_", " ")}`,
    html: leadNotificationHtml({ name, phone, source }),
  }).catch((err) => console.error("[EMAIL ERROR]", err));

  return NextResponse.json({ success: true, id: lead.id }, { status: 201 });
}
