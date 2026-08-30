import { Product } from "@/types";
import { readJson, writeJson } from "./json";
import type { Repository } from "./base";

export class JsonProductRepository implements Repository<Product> {
  async getAll() { return readJson<Product[]>("products.json", []); }
  async getById(id: string) { return (await this.getAll()).find(x => x.id === id) ?? null; }
  async getBySlug(slug: string) { return (await this.getAll()).find(x => x.slug === slug) ?? null; }
  async create(data: Product) { const all = await this.getAll(); all.push(data); await writeJson("products.json", all); return data; }
  async update(id: string, data: Partial<Product>) { const all = await this.getAll(); const i = all.findIndex(x => x.id === id); if (i < 0) return null; all[i] = { ...all[i], ...data, updatedAt: new Date().toISOString() }; await writeJson("products.json", all); return all[i]; }
  async delete(id: string) { const all = await this.getAll(); const next = all.filter(x => x.id !== id); if (next.length === all.length) return false; await writeJson("products.json", next); return true; }
}