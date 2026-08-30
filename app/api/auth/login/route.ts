import { NextResponse } from "next/server";
import { login } from "@/lib/services/auth";
import { loginSchema } from "@/lib/validation/auth";

export async function POST(req: Request) {
  const parsed = loginSchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Données invalides." }, { status: 400 });
  const result = await login(parsed.data.email, parsed.data.password);
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 401 });
  return NextResponse.json({ role: result.user!.role, mustChangePassword: result.user!.mustChangePassword });
}