import { crudRoute } from "@/lib/crud";

const { GET, POST, PUT, DELETE } = crudRoute({
  entity: "seo",
  model: "seoPage",
  paths: ["/"],
  fields: [
    "pageSlug",
    "metaTitle",
    "metaDescription",
    "keywords",
    "ogImageUrl",
    "canonical",
    "noIndex",
  ],
  searchIn: ["pageSlug", "metaTitle"],
  defaultOrder: { pageSlug: "asc" },
});

export { GET, POST, PUT, DELETE };
