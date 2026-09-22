import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/db";
import { getAdminSession, logActivity } from "@/lib/admin-guard";
import { uploadToImageKit, deleteFromImageKit, buildFolderPath } from "@/lib/imagekit";

const MAX_BYTES = 100 * 1024 * 1024;

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ ok: false }, { status: 401 });
  const db = await getDb();
  const items = await db.mediaAsset.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
  return NextResponse.json({ ok: true, items });
}

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ ok: false }, { status: 401 });
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  const folderRaw = form?.get("folder");
  const altRaw = form?.get("alt");
  if (!(file instanceof File)) return NextResponse.json({ ok: false, error: "file" }, { status: 400 });
  if (file.size <= 0 || file.size > MAX_BYTES) {
    return NextResponse.json({ ok: false, error: "size" }, { status: 400 });
  }
  const folder =
    typeof folderRaw === "string" && folderRaw.startsWith("/dolphinpark/")
      ? folderRaw
      : buildFolderPath("general", "uploads");
  const buffer = Buffer.from(await file.arrayBuffer());
  const up = await uploadToImageKit(buffer, file.name, file.type || "application/octet-stream", folder);
  const db = await getDb();
  const item = await db.mediaAsset.create({
    data: {
      fileId: up.fileId,
      fileName: file.name,
      url: up.url,
      mimeType: up.mimeType,
      size: up.size,
      width: up.width,
      height: up.height,
      alt: typeof altRaw === "string" ? altRaw : null,
      folder,
    },
  });
  await logActivity(session.sub, "upload", "media", item.id, file.name);
  revalidatePath("/");
  revalidatePath("/gallery");
  return NextResponse.json({ ok: true, item });
}

export async function DELETE(req: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ ok: false }, { status: 401 });
  const body = (await req.json().catch(() => null)) as { id?: unknown } | null;
  const id = typeof body?.id === "string" ? body.id : "";
  if (!id) return NextResponse.json({ ok: false }, { status: 400 });
  const db = await getDb();
  const item = await db.mediaAsset.findUnique({ where: { id } });
  if (!item) return NextResponse.json({ ok: false }, { status: 404 });
  if (item.fileId) {
    try {
      await deleteFromImageKit(item.fileId);
    } catch {
      return NextResponse.json({ ok: false, error: "remote" }, { status: 502 });
    }
  }
  await db.mediaAsset.delete({ where: { id } });
  await logActivity(session.sub, "delete", "media", id, item.fileName);
  revalidatePath("/");
  revalidatePath("/gallery");
  return NextResponse.json({ ok: true });
}
