import { crudRoute } from "@/lib/crud";

const { GET, POST, PUT, DELETE } = crudRoute({
  entity: "facility",
  model: "facility",
  paths: ["/", "/about"],
  fields: ["title", "text", "iconKey", "imageUrl", "status", "sortOrder"],
  searchIn: ["title"],
  defaultOrder: { sortOrder: "asc" },
});

export { GET, POST, PUT, DELETE };
