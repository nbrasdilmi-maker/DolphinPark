import { crudRoute } from "@/lib/crud";

const { GET, POST, PUT, DELETE } = crudRoute({
  entity: "service",
  model: "service",
  paths: ["/", "/services"],
  fields: [
    "slug",
    "name",
    "shortName",
    "desc",
    "longDesc",
    "category",
    "iconKey",
    "coverUrl",
    "galleryJson",
    "price",
    "hours",
    "featuresJson",
    "status",
    "sortOrder",
    "seoTitle",
    "seoDescription",
  ],
  searchIn: ["name", "slug"],
  defaultOrder: { sortOrder: "asc" },
});

export { GET, POST, PUT, DELETE };
