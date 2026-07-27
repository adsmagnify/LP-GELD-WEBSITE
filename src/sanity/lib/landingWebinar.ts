import { client } from "./client";
import { urlFor } from "./image";
import { LANDING_WEBINAR_QUERY } from "./queries";
import type { LandingWebinarContent, LandingWebinarDoc } from "./types";

export const DEFAULT_LANDING_WEBINAR: LandingWebinarContent = {
  heroEyebrow: "Live weekly webinar · SEBI Registered",
  heroHeadline: "Weekly Wealth",
  heroHighlight: "Masterclass.",
  heroSubtitle:
    "A live session covering derivatives & trading, portfolio review, asset allocation, and retirement planning, practical frameworks, no product pitches.",
  posterUrl: "/webinar_poster_2.png",
  posterAlt: "GELD Wealth webinar poster, Ask The Expert, Trade Smarter",
  eventDateTime: "",
  eventMeta: "7:00 PM IST · Live on Zoom",
  registerUrl:
    "https://us06web.zoom.us/meeting/register/c_aXknaCTjKhfQDFje_WhQ#/registration",
  topicsIntro:
    "Four focused topics in one educational webinar, practical frameworks, no complicated jargon, no product pitches.",
  topics: [
    {
      title: "Derivatives & Trading Masterclass",
      theme: "How professional traders think, not stock tips.",
      audience:
        "Traders with 6+ months experience who aren't consistently profitable.",
      points: [
        "How professional traders think",
        "Position sizing",
        "Current option strategies that are working",
        "Trading psychology & decision making",
        "Real market insights",
      ],
      icon: "lineChart",
    },
    {
      title: "Portfolio Review & Wealth Creation",
      theme: "Managing scattered investments and building a proper portfolio.",
      audience:
        "People with multiple mutual funds, random stocks, or no clear strategy.",
      points: [
        "How many mutual funds you actually need",
        "How to identify performing funds",
        "How to pick growth oriented stocks",
        "Portfolio stability in current markets",
        "Creating a proper investment plan",
      ],
      icon: "barChart",
    },
    {
      title: "Wealth Creation & Asset Allocation",
      theme: "Making your money work as hard as you do.",
      audience:
        "Doctors, lawyers, business owners, senior executives & high income professionals.",
      points: [
        "Asset allocation based on goals",
        "Portfolio gaps professionals often miss",
        "Framework to optimize investments",
        "Reviewing your own portfolio",
        "Right risk vs just buying products",
      ],
      icon: "briefcase",
    },
    {
      title: "Retirement Planning",
      theme: "Building a retirement plan with confidence, not guesswork.",
      audience: "Professionals, business owners, and anyone planning for retirement.",
      points: [
        "How much retirement corpus is enough",
        "Where your money should be invested",
        "Safe monthly withdrawal strategy",
        "Managing inflation over 20 to 30 years",
        "Creating financial freedom",
      ],
      icon: "piggyBank",
    },
  ],
  speaker: {
    name: "Chandan Taparia",
    role: "Featured speaker",
    bio: "India's leading derivatives expert, frequently seen on major news channels. In the derivatives & trading topic, he covers how professional traders think, position sizing, working option strategies, and trading psychology, not stock tips.",
    quote: "Markets never stand still. Neither should your process.",
    imageUrl: "/speaker-chandan.jpg",
    imageAlt: "Chandan Taparia, lead speaker",
    stats: [
      { label: "Years in markets", value: "20+" },
      { label: "Traders mentored", value: "30k+" },
      { label: "Webinars hosted", value: "200+" },
    ],
  },
  marqueeItems: [
    "Derivatives & Trading",
    "Portfolio Review",
    "Wealth Creation",
    "Asset Allocation",
    "Retirement Planning",
    "Educational only",
  ],
  audienceItems: [
    "Traders (6+ months) who aren't consistently profitable",
    "Investors with scattered MFs, stocks, or overlapping funds",
    "Doctors, lawyers, business owners & senior executives",
    "Anyone building a confident retirement plan",
  ],
};

function stripDashes(value: string): string {
  return value
    .replace(/\u2014/g, ",") // em dash —
    .replace(/\u2013/g, " to ") // en dash –
    .replace(/\s+,/g, ",")
    .replace(/,\s*,/g, ",")
    .replace(/\s{2,}/g, " ")
    .trim();
}

  const d = new Date();
  const day = d.getDay();
  const daysToSat = (6 - day + 7) % 7 || 7;
  d.setDate(d.getDate() + daysToSat);
  d.setHours(19, 0, 0, 0);
  return d.toISOString();
}

function mapDoc(doc: LandingWebinarDoc | null): LandingWebinarContent {
  const base = DEFAULT_LANDING_WEBINAR;
  if (!doc) {
    return {
      ...base,
      eventDateTime: base.eventDateTime || nextSaturdayAt1900IST(),
    };
  }

  const posterSource =
    doc.poster && typeof doc.poster === "object" && "asset" in doc.poster && doc.poster.asset
      ? { asset: doc.poster.asset }
      : doc.poster;

  const posterUrl = posterSource
    ? urlFor(posterSource).width(2400).fit("max").quality(90).auto("format").url()
    : base.posterUrl;

  const speakerImageUrl = doc.speaker?.image
    ? urlFor(doc.speaker.image).width(900).height(1100).fit("max").auto("format").url()
    : base.speaker.imageUrl;

  const topics =
    doc.topics
      ?.filter((t) => t?.title)
      .map((t) => ({
        title: t.title!,
        theme: t.theme ?? undefined,
        audience: t.audience ?? undefined,
        points: (t.points ?? []).filter(Boolean) as string[],
        icon: t.icon ?? undefined,
      })) ?? base.topics;

  const stats =
    doc.speaker?.stats
      ?.filter((s) => s?.label && s?.value)
      .map((s) => ({ label: s.label!, value: s.value! })) ?? base.speaker.stats;

  return {
    heroEyebrow: doc.heroEyebrow?.trim() || base.heroEyebrow,
    heroHeadline: doc.heroHeadline?.trim() || base.heroHeadline,
    heroHighlight: doc.heroHighlight?.trim() || base.heroHighlight,
    heroSubtitle: doc.heroSubtitle?.trim() || base.heroSubtitle,
    posterUrl,
    posterAlt: doc.poster?.alt?.trim() || base.posterAlt,
    eventDateTime: doc.eventDateTime || nextSaturdayAt1900IST(),
    eventMeta: doc.eventMeta?.trim() || base.eventMeta,
    registerUrl: doc.registerUrl?.trim() || base.registerUrl,
    topicsIntro: doc.topicsIntro?.trim() || base.topicsIntro,
    topics: topics.length ? topics : base.topics,
    speaker: {
      name: doc.speaker?.name?.trim() || base.speaker.name,
      role: doc.speaker?.role?.trim() || base.speaker.role,
      bio: doc.speaker?.bio?.trim() || base.speaker.bio,
      quote: doc.speaker?.quote?.trim() || base.speaker.quote,
      imageUrl: speakerImageUrl,
      imageAlt: doc.speaker?.image?.alt?.trim() || base.speaker.imageAlt,
      stats: stats.length ? stats : base.speaker.stats,
    },
    marqueeItems:
      doc.marqueeItems?.filter(Boolean).length
        ? (doc.marqueeItems.filter(Boolean) as string[])
        : base.marqueeItems,
    audienceItems:
      doc.audienceItems?.filter(Boolean).length
        ? (doc.audienceItems.filter(Boolean) as string[])
        : base.audienceItems,
  };
}

export async function getLandingWebinar(): Promise<LandingWebinarContent> {
  try {
    const doc = await client.fetch<LandingWebinarDoc | null>(
      LANDING_WEBINAR_QUERY,
      {},
      { next: { revalidate: 60 } }
    );
    return mapDoc(doc);
  } catch {
    return {
      ...DEFAULT_LANDING_WEBINAR,
      eventDateTime: nextSaturdayAt1900IST(),
    };
  }
}
