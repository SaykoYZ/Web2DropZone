import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { JsonUserRepository } from "@/lib/repositories/users";
import { registerSchema } from "@/lib/validation/auth";
import { setSession } from "@/lib/server/session";

export async function POST(req: Request) {
  const parsed = registerSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message || "Données invalides." }, { status: 400 });
  const repo = new JsonUserRepository();
  if (await repo.findByEmail(parsed.data.email)) return NextResponse.json({ error: "Cet email est déjà utilisé." }, { status: 409 });
  const user = await repo.create({ id: crypto.randomUUID(), email: parsed.data.email, passwordHash: await bcrypt.hash(parsed.data.password, 12), displayName: parsed.data.email.split("@")[0], role: "USER", active: true, mustChangePassword: false, createdAt: new Date().toISOString() });
  await setSession(user.id);
  return NextResponse.json({ ok: true });
}