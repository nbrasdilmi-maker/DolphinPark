import { crudRoute } from "@/lib/crud";

const { GET, POST, PUT, DELETE } = crudRoute({
  entity: "page",
  model: "page",
  paths: ["/"],
  fields: [
    "slug",
    "title",
    "description",
    "heroImageUrl",
    "content",
    "status",
    "seoTitle",
    "seoDescription",
  ],
  searchIn: ["slug", "title"],
  defaultOrder: { slug: "asc" },
});

export { GET, POST, PUT, DELETE };
