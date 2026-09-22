import { crudRoute } from "@/lib/crud";

const { GET, POST, PUT, DELETE } = crudRoute({
  entity: "testimonial",
  model: "testimonial",
  fields: ["name", "text", "rating", "status", "sortOrder"],
  searchIn: ["name", "text"],
  defaultOrder: { sortOrder: "asc" },
  paths: ["/"],
});

export { GET, POST, PUT, DELETE };
