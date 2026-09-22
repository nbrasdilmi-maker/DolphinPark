import "server-only";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getDb } from "./db";
import { getAdminSession, logActivity } from "./admin-guard";

type Delegate = {
  findMany: (args: Record<string, unknown>) => Promise<Record<string, unknown>[]>;
  count: (args: Record<string, unknown>) => Promise<number>;
  create: (args: Record<string, unknown>) => Promise<Record<string, unknown>>;
  update: (args: Record<string, unknown>) => Promise<Record<string, unknown>>;
  delete: (args: Record<string, unknown>) => Promise<Record<string, unknown>>;
  findUnique?: (args: Record<string, unknown>) => Promise<Record<string, unknown> | null>;
};

export type CrudConfig = {
  entity: string;
  model: string;
  fields: string[];
  searchIn?: string[];
  defaultOrder?: Record<string, unknown>;
  paths?: string[];
};

function refresh(config: CrudConfig): void {
  for (const p of config.paths ?? ["/"]) {
    revalidatePath(p);
  }
}

function delegate(db: unknown, model: string): Delegate {
  return (db as unknown as Record<string, Delegate>)[model];
}

function pick(body: Record<string, unknown>, fields: string[]): Record<string, unknown> {
  const data: Record<string, unknown> = {};
  for (const f of fields) {
    if (body[f] !== undefined) data[f] = body[f] as unknown;
  }
  return data;
}

function idFrom(req: Request): string {
  return new URL(req.url).searchParams.get("id") ?? "";
}

export function crudRoute(config: CrudConfig) {
  async function GET(req: Request) {
    const session = await getAdminSession();
    if (!session) return NextResponse.json({ ok: false }, { status: 401 });
    const db = await getDb();
    const d = delegate(db, config.model);
    const sp = new URL(req.url).searchParams;
    const id = sp.get("id");
    if (id && d.findUnique) {
      const item = await d.findUnique({ where: { id } });
      return NextResponse.json({ ok: true, item });
    }
    const where: Record<string, unknown> = {};
    const status = sp.get("status");
    if (status) where.status = status;
    sp.forEach((value, key) => {
      if (key.startsWith("f_") && value) where[key.slice(2)] = value;
    });
    const q = sp.get("q");
    if (q && config.searchIn?.length) {
      where.OR = config.searchIn.map((f) => ({ [f]: { contains: q, mode: "insensitive" } }));
    }
    const take = Math.min(Number(sp.get("take") ?? "100") || 100, 500);
    const [items, total] = await Promise.all([
      d.findMany({ where, orderBy: config.defaultOrder ?? { createdAt: "desc" }, take }),
      d.count({ where }),
    ]);
    return NextResponse.json({ ok: true, items, total });
  }

  async function POST(req: Request) {
    const session = await getAdminSession();
    if (!session) return NextResponse.json({ ok: false }, { status: 401 });
    const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
    if (!body) return NextResponse.json({ ok: false }, { status: 400 });
    const db = await getDb();
    const item = await delegate(db, config.model).create({ data: pick(body, config.fields) });
    await logActivity(session.sub, "create", config.entity, String(item.id ?? ""), "");
    refresh(config);
    return NextResponse.json({ ok: true, item });
  }

  async function PUT(req: Request) {
    const session = await getAdminSession();
    if (!session) return NextResponse.json({ ok: false }, { status: 401 });
    const id = idFrom(req);
    if (!id) return NextResponse.json({ ok: false }, { status: 400 });
    const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
    if (!body) return NextResponse.json({ ok: false }, { status: 400 });
    const db = await getDb();
    const item = await delegate(db, config.model).update({
      where: { id },
      data: pick(body, config.fields),
    });
    await logActivity(session.sub, "update", config.entity, id, "");
    refresh(config);
    return NextResponse.json({ ok: true, item });
  }

  async function DELETE(req: Request) {
    const session = await getAdminSession();
    if (!session) return NextResponse.json({ ok: false }, { status: 401 });
    const id = idFrom(req);
    if (!id) return NextResponse.json({ ok: false }, { status: 400 });
    const db = await getDb();
    await delegate(db, config.model).delete({ where: { id } });
    await logActivity(session.sub, "delete", config.entity, id, "");
    refresh(config);
    return NextResponse.json({ ok: true });
  }

  return { GET, POST, PUT, DELETE };
}
