import { User } from "@/types";
import { readJson, writeJson } from "./json";
import type { Repository } from "./base";

const seed: User[] = [];

export class JsonUserRepository implements Repository<User> {
  async getAll() { return readJson<User[]>("users.json", seed); }
  async getById(id: string) { return (await this.getAll()).find(x => x.id === id) ?? null; }
  async findByEmail(email: string) { return (await this.getAll()).find(x => x.email.toLowerCase() === email.toLowerCase()) ?? null; }
  async create(data: User) { const all = await this.getAll(); all.push(data); await writeJson("users.json", all); return data; }
  async update(id: string, data: Partial<User>) { const all = await this.getAll(); const i = all.findIndex(x => x.id === id); if (i < 0) return null; all[i] = { ...all[i], ...data }; await writeJson("users.json", all); return all[i]; }
  async delete(id: string) { const all = await this.getAll(); const next = all.filter(x => x.id !== id); if (next.length === all.length) return false; await writeJson("users.json", next); return true; }
}