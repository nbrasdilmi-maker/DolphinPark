import "server-only";
import ImageKit, { toFile } from "@imagekit/nodejs";

const globalForIk = globalThis as unknown as { __ik?: ImageKit };

export function getImageKit(): ImageKit {
  if (globalForIk.__ik) return globalForIk.__ik;
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  if (!privateKey) throw new Error("IMAGEKIT_PRIVATE_KEY is not set");
  const client = new ImageKit({ privateKey });
  globalForIk.__ik = client;
  return client;
}

export function endpoint(): string {
  const ep =
    process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT ?? process.env.IMAGEKIT_URL_ENDPOINT ?? "";
  if (!ep) throw new Error("IMAGEKIT_URL_ENDPOINT is not set");
  return ep.replace(/\/$/, "");
}

export function buildFolderPath(section: string, entityName: string): string {
  const clean = (s: string) =>
    s
      .trim()
      .replace(/[\/\\]+/g, "-")
      .replace(/[\u0000-\u001F?%#&*|"<>]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "item";
  return `/dolphinpark/${clean(section)}/${clean(entityName)}`;
}

export type UploadResult = {
  fileId: string;
  url: string;
  filePath: string;
  name: string;
  size: number;
  mimeType: string;
  width?: number;
  height?: number;
};

export async function uploadToImageKit(
  data: Buffer,
  fileName: string,
  mimeType: string,
  folder: string
): Promise<UploadResult> {
  const client = getImageKit();
  const file = await toFile(data, fileName, { type: mimeType });
  const res = (await client.files.upload({
    file,
    fileName,
    folder,
    useUniqueFileName: true,
  })) as unknown as Record<string, unknown>;
  const filePath = typeof res.filePath === "string" ? res.filePath : "";
  const url =
    typeof res.url === "string" && res.url.length > 0
      ? res.url
      : `${endpoint()}${filePath.startsWith("/") ? "" : "/"}${filePath}`;
  if (typeof res.fileId !== "string" || !url) throw new Error("ImageKit upload failed");
  return {
    fileId: res.fileId,
    url,
    filePath,
    name: typeof res.name === "string" ? res.name : fileName,
    size: typeof res.size === "number" ? res.size : data.length,
    mimeType,
    width: typeof res.width === "number" ? res.width : undefined,
    height: typeof res.height === "number" ? res.height : undefined,
  };
}

export async function deleteFromImageKit(fileId: string): Promise<void> {
  const client = getImageKit();
  await client.files.delete(fileId);
}
