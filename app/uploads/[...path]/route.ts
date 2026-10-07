import fs from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { isStaticPublicContent } from "@/lib/content/storage-mode";
import { getUploadDir } from "@/lib/db/paths";

const MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".pdf": "application/pdf",
  ".doc": "application/msword",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

export async function GET(
  _request: Request,
  context: { params: Promise<{ path: string[] }> }
) {
  if (isStaticPublicContent()) {
    return new NextResponse("Not found", { status: 404 });
  }

  const { path: parts } = await context.params;
  if (!parts?.length) {
    return new NextResponse("Not found", { status: 404 });
  }

  if (parts.some((p) => p.includes("..") || p.includes("\\") || p.includes("\0"))) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const root = path.resolve(getUploadDir());
  const absolute = path.resolve(root, ...parts);
  if (!absolute.startsWith(root + path.sep)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  if (!fs.existsSync(absolute) || !fs.statSync(absolute).isFile()) {
    return new NextResponse("Not found", { status: 404 });
  }

  const ext = path.extname(absolute).toLowerCase();
  const type = MIME[ext] || "application/octet-stream";
  const data = fs.readFileSync(absolute);

  return new NextResponse(data, {
    headers: {
      "Content-Type": type,
      "Cache-Control": "public, max-age=86400",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
