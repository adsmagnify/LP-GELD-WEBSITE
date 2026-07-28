export const LANDING_WEBINAR_QUERY = `coalesce(
  *[_id == "landingWebinar"][0],
  *[_id == "drafts.landingWebinar"][0],
  *[_type == "landingWebinar" && !(_id in path("drafts.**"))] | order(_updatedAt desc)[0]
){
  heroEyebrow,
  heroHeadline,
  heroHighlight,
  heroSubtitle,
  poster{
    asset->,
    alt,
    hotspot,
    crop
  },
  eventDateTime,
  eventMeta,
  registerUrl,
  topicsIntro,
  topics[]{
    title,
    theme,
    audience,
    speaker,
    points,
    icon
  },
  speakers[]{
    name,
    role,
    bio,
    quote,
    image{
      asset->,
      alt,
      hotspot,
      crop
    },
    stats[]{ label, value }
  },
  speaker{
    name,
    role,
    bio,
    quote,
    image{
      asset->,
      alt,
      hotspot,
      crop
    },
    stats[]{ label, value }
  },
  marqueeItems,
  audienceItems
}`;
