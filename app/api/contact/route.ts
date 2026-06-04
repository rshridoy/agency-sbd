import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { sendEmail, leadNotificationHtml } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";
import { getIp } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(2).max(100),
  phone: z.string().min(7).max(20),
  email: z.string().email().optional().or(z.literal("")),
  message: z.string().max(2000).optional(),
  _gotcha: z.string().max(0, "Bot detected"),
});

export async function POST(req: NextRequest) {
  const ip = getIp(req);
  if (!rateLimit(`contact:${ip}`, 3, 60_000)) {
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

  const { name, phone, email, message } = parsed.data;

  const lead = await prisma.lead.create({
    data: {
      name,
      phone,
      email: email || null,
      message: message || null,
      source: "CONTACT",
    },
  });

  sendEmail({
    to: process.env.ADMIN_EMAIL || "siren.infos@gmail.com",
    subject: "New contact form submission",
    html: leadNotificationHtml({ name, phone, email, message, source: "CONTACT" }),
  }).catch((err) => console.error("[EMAIL ERROR]", err));

  return NextResponse.json({ success: true, id: lead.id }, { status: 201 });
}
