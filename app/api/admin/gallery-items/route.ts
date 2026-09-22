import { crudRoute } from "@/lib/crud";

const { GET, POST, PUT, DELETE } = crudRoute({
  entity: "gallery-item",
  model: "galleryItem",
  paths: ["/", "/gallery"],
  fields: ["albumId", "mediaUrl", "caption", "isVideo", "sortOrder"],
  defaultOrder: { sortOrder: "asc" },
});

export { GET, POST, PUT, DELETE };
