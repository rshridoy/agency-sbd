import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";
import { getIp } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().max(20).optional(),
  message: z.string().max(2000).optional(),
  _gotcha: z.string().max(0, "Bot detected"),
});

export async function POST(req: NextRequest) {
  const ip = getIp(req);
  if (!rateLimit(`community:${ip}`, 3, 60_000)) {
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

  const { name, email, phone, message } = parsed.data;

  const app = await prisma.communityApplication.create({
    data: { name, email, phone: phone || null, message: message || null },
  });

  sendEmail({
    to: process.env.ADMIN_EMAIL || "siren.infos@gmail.com",
    subject: "New community application",
    html: `<h2>New Community Application</h2><p><b>Name:</b> ${name}</p><p><b>Email:</b> ${email}</p>${phone ? `<p><b>Phone:</b> ${phone}</p>` : ""}${message ? `<p><b>Message:</b> ${message}</p>` : ""}`,
  }).catch((err) => console.error("[EMAIL ERROR]", err));

  return NextResponse.json({ success: true, id: app.id }, { status: 201 });
}
