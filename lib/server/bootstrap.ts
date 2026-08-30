import bcrypt from "bcryptjs";
import crypto from "crypto";
import { JsonUserRepository } from "@/lib/repositories/users";

export async function ensureInitialAdmin() {
  const repo = new JsonUserRepository();
  const existing = await repo.findByEmail("dropzone@dc.ru");
  if (existing) return existing;

  return repo.create({
    id: crypto.randomUUID(),
    email: "dropzone@dc.ru",
    passwordHash: await bcrypt.hash("123", 12),
    displayName: "DropZone Admin",
    role: "SUPER_ADMIN",
    active: true,
    mustChangePassword: true,
    createdAt: new Date().toISOString()
  });
}