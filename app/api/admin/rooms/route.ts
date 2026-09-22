import { crudRoute } from "@/lib/crud";

const { GET, POST, PUT, DELETE } = crudRoute({
  entity: "room",
  model: "room",
  paths: ["/", "/rooms"],
  fields: [
    "slug",
    "name",
    "number",
    "type",
    "shortDesc",
    "longDesc",
    "price",
    "currency",
    "capacity",
    "beds",
    "featuresJson",
    "coverUrl",
    "galleryJson",
    "status",
    "sortOrder",
    "seoTitle",
    "seoDescription",
  ],
  searchIn: ["name", "slug"],
  defaultOrder: { sortOrder: "asc" },
});

export { GET, POST, PUT, DELETE };
