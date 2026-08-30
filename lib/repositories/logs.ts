import { LogEntry } from "@/types";
import { readJson, writeJson } from "./json";

export async function getLogs() { return readJson<LogEntry[]>("logs.json", []); }
export async function addLog(entry: LogEntry) {
  const logs = await getLogs();
  logs.unshift(entry);
  await writeJson("logs.json", logs.slice(0, 1000));
}