import { Order } from "@/types";
import { readJson, writeJson } from "./json";
import type { Repository } from "./base";

export class JsonOrderRepository implements Repository<Order> {
  async getAll() { return readJson<Order[]>("orders.json", []); }
  async getById(id: string) { return (await this.getAll()).find(x => x.id === id) ?? null; }
  async create(data: Order) { const all = await this.getAll(); all.push(data); await writeJson("orders.json", all); return data; }
  async update(id: string, data: Partial<Order>) { const all = await this.getAll(); const i = all.findIndex(x => x.id === id); if (i < 0) return null; all[i] = { ...all[i], ...data, updatedAt: new Date().toISOString() }; await writeJson("orders.json", all); return all[i]; }
  async delete(id: string) { const all = await this.getAll(); const next = all.filter(x => x.id !== id); if (next.length === all.length) return false; await writeJson("orders.json", next); return true; }
}