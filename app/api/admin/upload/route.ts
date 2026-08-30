import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import { getCurrentUser } from "@/lib/server/session";

export const runtime = "nodejs";

const types: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
};

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();

    // Vérification connexion
    if (!user) {
      return NextResponse.json(
        { error: "Session expirée ou utilisateur non connecté." },
        { status: 401 }
      );
    }

    // Vérification rôle
    if (!["ADMIN", "SUPER_ADMIN"].includes(user.role)) {
      return NextResponse.json(
        {
          error: "Vous n'avez pas les permissions administrateur.",
          role: user.role,
        },
        { status: 403 }
      );
    }

    const form = await req.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Aucune image reçue." },
        { status: 400 }
      );
    }

    if (!types[file.type]) {
      return NextResponse.json(
        { error: "Format accepté : PNG, JPG, WEBP ou GIF." },
        { status: 400 }
      );
    }

    if (file.size > 8 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image trop lourde (8 Mo maximum)." },
        { status: 400 }
      );
    }

    const dir =
      process.env.VERCEL === "1"
        ? path.join("/tmp", "dropzone-uploads")
        : path.join(process.cwd(), "public", "uploads");

    await fs.mkdir(dir, { recursive: true });

    const name = `${Date.now()}-${crypto
      .randomBytes(6)
      .toString("hex")}.${types[file.type]}`;

    const bytes = Buffer.from(await file.arrayBuffer());

    await fs.writeFile(path.join(dir, name), bytes);

    if (process.env.VERCEL === "1") {
      return NextResponse.json({
        url: `data:${file.type};base64,${bytes.toString("base64")}`,
        temporary: true,
        message: "Image stockée temporairement.",
      });
    }

    return NextResponse.json({
      url: `/uploads/${name}`,
    });
  } catch (error) {
    console.error("Erreur upload :", error);

    return NextResponse.json(
      {
        error: "Erreur interne pendant l'upload.",
      },
      { status: 500 }
    );
  }
}
