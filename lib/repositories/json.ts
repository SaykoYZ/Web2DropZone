import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

function resolve(file: string) {
  return path.join(process.cwd(), "data", file);
}

export async function readJson<T>(
  file: string,
  fallback: T
): Promise<T> {
  const full = resolve(file);

  try {
    const content = await fs.readFile(full, "utf8");
    return JSON.parse(content) as T;
  } catch {
    return fallback;
  }
}

export async function writeJson<T>(
  file: string,
  data: T
): Promise<void> {
  const full = resolve(file);

  await fs.mkdir(path.dirname(full), {
    recursive: true,
  });

  const temp = `${full}.${process.pid}.${crypto.randomUUID()}.tmp`;

  await fs.writeFile(
    temp,
    JSON.stringify(data, null, 2),
    "utf8"
  );

  await fs.rename(temp, full);
}
