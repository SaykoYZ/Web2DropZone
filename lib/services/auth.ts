import bcrypt from "bcryptjs";
import crypto from "crypto";
import { JsonUserRepository } from "@/lib/repositories/users";
import { setSession } from "@/lib/server/session";
import { addLog } from "@/lib/repositories/logs";
import { ensureInitialAdmin } from "@/lib/server/bootstrap";

export async function login(email: string, password: string) {
  await ensureInitialAdmin();
  const repo = new JsonUserRepository();
  const user = await repo.findByEmail(email);
  if (!user || !user.active) return { ok: false, error: "Identifiants invalides." };
  if (!(await bcrypt.compare(password, user.passwordHash))) return { ok: false, error: "Identifiants invalides." };

  await repo.update(user.id, { lastLoginAt: new Date().toISOString() });
  await setSession(user.id);
  await addLog({ id: crypto.randomUUID(), type: "LOGIN", userId: user.id, description: "Connexion réussie", createdAt: new Date().toISOString() });
  return { ok: true, user };
}