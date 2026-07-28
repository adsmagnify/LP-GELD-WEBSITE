import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // Skip CDN so Studio publishes show on the site right away
  useCdn: false,
});
