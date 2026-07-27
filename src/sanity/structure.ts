import type { StructureResolver } from "sanity/structure";

const SINGLETONS = new Set(["landingWebinar"]);

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Landing Webinar")
        .id("landingWebinar")
        .child(
          S.document()
            .schemaType("landingWebinar")
            .documentId("landingWebinar")
            .title("Landing Webinar")
        ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => !SINGLETONS.has(item.getId() ?? "")
      ),
    ]);
