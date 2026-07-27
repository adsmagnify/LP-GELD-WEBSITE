import type { SanityImageSource } from "@sanity/image-url";

export type LandingTopic = {
  title: string;
  theme?: string;
  audience?: string;
  points: string[];
  icon?: string;
};

export type LandingSpeakerStat = {
  label: string;
  value: string;
};

export type LandingSpeaker = {
  name: string;
  role?: string;
  bio?: string;
  quote?: string;
  imageUrl: string;
  imageAlt: string;
  stats: LandingSpeakerStat[];
};

export type LandingWebinarContent = {
  heroEyebrow: string;
  heroHeadline: string;
  heroHighlight: string;
  heroSubtitle: string;
  posterUrl: string;
  posterAlt: string;
  eventDateTime: string;
  eventMeta: string;
  registerUrl: string;
  topicsIntro: string;
  topics: LandingTopic[];
  speaker: LandingSpeaker;
  marqueeItems: string[];
  audienceItems: string[];
};

/** Raw Sanity document shape before URL mapping */
export type LandingWebinarDoc = {
  heroEyebrow?: string | null;
  heroHeadline?: string | null;
  heroHighlight?: string | null;
  heroSubtitle?: string | null;
  poster?: (SanityImageSource & { alt?: string | null }) | null;
  eventDateTime?: string | null;
  eventMeta?: string | null;
  registerUrl?: string | null;
  topicsIntro?: string | null;
  topics?: Array<{
    title?: string | null;
    theme?: string | null;
    audience?: string | null;
    points?: string[] | null;
    icon?: string | null;
  }> | null;
  speaker?: {
    name?: string | null;
    role?: string | null;
    bio?: string | null;
    quote?: string | null;
    image?: (SanityImageSource & { alt?: string | null }) | null;
    stats?: Array<{ label?: string | null; value?: string | null }> | null;
  } | null;
  marqueeItems?: string[] | null;
  audienceItems?: string[] | null;
};
