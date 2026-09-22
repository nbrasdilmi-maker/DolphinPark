import { crudRoute } from "@/lib/crud";

const { GET, POST, PUT, DELETE } = crudRoute({
  entity: "nav",
  model: "navItem",
  paths: ["/"],
  fields: ["label", "href", "sortOrder", "visible", "location"],
  searchIn: ["label", "href"],
  defaultOrder: { sortOrder: "asc" },
});

export { GET, POST, PUT, DELETE };
