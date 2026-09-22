import { crudRoute } from "@/lib/crud";

const { GET, POST, PUT, DELETE } = crudRoute({
  entity: "album",
  model: "galleryAlbum",
  paths: ["/", "/gallery"],
  fields: ["slug", "name", "desc", "coverUrl", "status", "sortOrder"],
  searchIn: ["name", "slug"],
  defaultOrder: { sortOrder: "asc" },
});

export { GET, POST, PUT, DELETE };
