import { crudRoute } from "@/lib/crud";

const { GET, POST, PUT, DELETE } = crudRoute({
  entity: "home-section",
  model: "homeSection",
  paths: ["/"],
  fields: ["key", "eyebrow", "title", "text", "sortOrder", "visible", "configJson"],
  searchIn: ["key", "title"],
  defaultOrder: { sortOrder: "asc" },
});

export { GET, POST, PUT, DELETE };
