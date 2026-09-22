import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/db";
import { getAdminSession, logActivity } from "@/lib/admin-guard";
import { uploadToImageKit, deleteFromImageKit } from "@/lib/imagekit";

const HERO_FOLDER = "/dolphinpark/hero";
const MAX_BYTES = 25 * 1024 * 1024;

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ ok: false }, { status: 401 });
  const db = await getDb();
  const items = await db.heroSlide.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json({ ok: true, items });
}

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ ok: false }, { status: 401 });
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return NextResponse.json({ ok: false, error: "file" }, { status: 400 });
  if (file.size <= 0 || file.size > MAX_BYTES) {
    return NextResponse.json({ ok: false, error: "size" }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ ok: false, error: "type" }, { status: 400 });
  }
  const captionRaw = form?.get("caption");
  const linkRaw = form?.get("link");
  const buffer = Buffer.from(await file.arrayBuffer());
  const up = await uploadToImageKit(buffer, file.name, file.type, HERO_FOLDER);
  const db = await getDb();
  const count = await db.heroSlide.count();
  const item = await db.heroSlide.create({
    data: {
      fileId: up.fileId,
      mediaUrl: up.url,
      caption: typeof captionRaw === "string" && captionRaw ? captionRaw : null,
      link: typeof linkRaw === "string" && linkRaw ? linkRaw : null,
      sortOrder: count,
      status: "published",
    },
  });
  await db.mediaAsset.create({
    data: {
      fileId: up.fileId,
      fileName: file.name,
      url: up.url,
      mimeType: up.mimeType,
      size: up.size,
      width: up.width,
      height: up.height,
      folder: HERO_FOLDER,
    },
  });
  await logActivity(session.sub, "upload", "hero", item.id, file.name);
  revalidatePath("/");
  return NextResponse.json({ ok: true, item });
}

export async function PUT(req: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ ok: false }, { status: 401 });
  const id = new URL(req.url).searchParams.get("id") ?? "";
  if (!id) return NextResponse.json({ ok: false }, { status: 400 });
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ ok: false }, { status: 400 });
  const data: Record<string, unknown> = {};
  if (typeof body.caption === "string") data.caption = body.caption || null;
  if (typeof body.link === "string") data.link = body.link || null;
  if (typeof body.sortOrder !== "undefined") data.sortOrder = Number(body.sortOrder) || 0;
  if (typeof body.status === "string") data.status = body.status;
  const db = await getDb();
  const item = await db.heroSlide.update({ where: { id }, data });
  await logActivity(session.sub, "update", "hero", id, "");
  revalidatePath("/");
  return NextResponse.json({ ok: true, item });
}

export async function DELETE(req: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ ok: false }, { status: 401 });
  const id = new URL(req.url).searchParams.get("id") ?? "";
  if (!id) return NextResponse.json({ ok: false }, { status: 400 });
  const db = await getDb();
  const item = await db.heroSlide.findUnique({ where: { id } });
  if (!item) return NextResponse.json({ ok: false }, { status: 404 });
  if (item.fileId) {
    try {
      await deleteFromImageKit(item.fileId);
    } catch {
      return NextResponse.json({ ok: false, error: "remote" }, { status: 502 });
    }
    await db.mediaAsset.deleteMany({ where: { fileId: item.fileId } });
  }
  await db.heroSlide.delete({ where: { id } });
  await logActivity(session.sub, "delete", "hero", id, "");
  revalidatePath("/");
  return NextResponse.json({ ok: true });
}
