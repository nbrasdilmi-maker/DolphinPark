import { crudRoute } from "@/lib/crud";

const { GET, POST, PUT, DELETE } = crudRoute({
  entity: "offer",
  model: "offer",
  paths: ["/", "/offers"],
  fields: [
    "slug",
    "name",
    "title",
    "desc",
    "price",
    "prevPrice",
    "coverUrl",
    "startDate",
    "endDate",
    "details",
    "ctaLabel",
    "ctaHref",
    "badge",
    "iconKey",
    "status",
    "sortOrder",
  ],
  searchIn: ["name", "title", "slug"],
  defaultOrder: { sortOrder: "asc" },
});

export { GET, POST, PUT, DELETE };
