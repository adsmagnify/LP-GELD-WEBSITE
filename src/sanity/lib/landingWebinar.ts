import { client } from "./client";
import { urlFor } from "./image";
import { LANDING_WEBINAR_QUERY } from "./queries";
import type {
  LandingSpeaker,
  LandingSpeakerDoc,
  LandingWebinarContent,
  LandingWebinarDoc,
} from "./types";

export const DEFAULT_LANDING_WEBINAR: LandingWebinarContent = {
  heroEyebrow: "Live weekly webinars · 37+ years market experience",
  heroHeadline: "Weekly Wealth",
  heroHighlight: "Masterclass.",
  heroSubtitle:
    "Live webinars on derivatives & trading, portfolio review, and retirement planning, practical frameworks, no product pitches.",
  posterUrl: "/webinar_poster_2.png",
  posterAlt: "GELD Wealth webinar poster, Ask The Expert, Trade Smarter",
  eventDateTime: "",
  eventMeta: "7:00 PM IST · Live on Zoom",
  registerUrl:
    "https://us06web.zoom.us/meeting/register/c_aXknaCTjKhfQDFje_WhQ#/registration",
  topicsIntro:
    "Three focused webinars, practical frameworks, no complicated jargon, no product pitches.",
  topics: [
    {
      title: "Derivatives & Trading Masterclass",
      theme: "How professional traders think, not stock tips.",
      audience:
        "Traders with 6+ months experience who aren't consistently profitable.",
      speaker: "Chandan Taparia",
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
      speaker: "Anil Jha",
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
      title: "Retirement Planning",
      theme: "Building a retirement plan with confidence, not guesswork.",
      audience: "Professionals, business owners, and anyone planning for retirement.",
      speaker: "Anil Jha",
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
  speakers: [
    {
      name: "Chandan Taparia",
      role: "Derivatives & Trading",
      bio: "India's leading derivatives expert, frequently seen on major news channels. In the Derivatives & Trading Masterclass, he covers how professional traders think, position sizing, working option strategies, and trading psychology, not stock tips.",
      quote: "Markets never stand still. Neither should your process.",
      imageUrl: "/speaker-chandan.jpg",
      imageAlt: "Chandan Taparia, lead speaker",
      stats: [
        { label: "Years in markets", value: "20+" },
        { label: "Traders mentored", value: "30k+" },
        { label: "Webinars hosted", value: "200+" },
      ],
    },
    {
      name: "Anil Jha",
      role: "Portfolio & Retirement",
      bio: "Guides investors through portfolio review, wealth creation, and retirement planning with clear frameworks you can act on, without product pitches or jargon.",
      quote: "Clarity beats complexity when building lasting wealth.",
      imageUrl: "",
      imageAlt: "Anil Jha, featured speaker",
      stats: [
        { label: "Focus areas", value: "3" },
        { label: "Approach", value: "Practical" },
        { label: "Sessions", value: "Live" },
      ],
    },
  ],
  marqueeItems: [
    "Derivatives & Trading",
    "Portfolio Review",
    "Retirement Planning",
    "Chandan Taparia",
    "Anil Jha",
    "Educational only",
  ],
  audienceItems: [
    "Traders (6+ months) who aren't consistently profitable",
    "Investors with scattered MFs, stocks, or overlapping funds",
    "Anyone building a confident retirement plan",
  ],
};

function stripDashes(value: string): string {
  return value
    .replace(/\u2014/g, ",") // em dash
    .replace(/\u2013/g, " to ") // en dash
    .replace(/\s+,/g, ",")
    .replace(/,\s*,/g, ",")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function cleanHeroEyebrow(value: string): string {
  const cleaned = stripDashes(value)
    .replace(/\bSEBI\s*registered\b/gi, "37+ years market experience")
    .replace(/\bSEBI\s*RIA\b/gi, "37+ years market experience")
    .replace(/\bSEBI\b/gi, "")
    .replace(/\s*[·•|]\s*[·•|]\s*/g, " · ")
    .replace(/\s{2,}/g, " ")
    .trim();
  return cleaned || "Live weekly webinars · 37+ years market experience";
}

function nextSaturdayAt1900IST(): string {
  const d = new Date();
  const day = d.getDay();
  const daysToSat = (6 - day + 7) % 7 || 7;
  d.setDate(d.getDate() + daysToSat);
  d.setHours(19, 0, 0, 0);
  return d.toISOString();
}

function mapSpeaker(
  raw: LandingSpeakerDoc,
  fallback?: LandingSpeaker
): LandingSpeaker | null {
  const name = raw.name?.trim();
  if (!name) return null;

  const imageUrl = raw.image
    ? urlFor(raw.image).width(900).height(1100).fit("max").auto("format").url()
    : fallback?.imageUrl || "";

  const stats =
    raw.stats
      ?.filter((s) => s?.label && s?.value)
      .map((s) => ({
        label: stripDashes(s.label!),
        value: stripDashes(s.value!),
      })) ?? fallback?.stats ?? [];

  return {
    name: stripDashes(name),
    role: stripDashes(raw.role?.trim() || fallback?.role || ""),
    bio: stripDashes(raw.bio?.trim() || fallback?.bio || ""),
    quote: stripDashes(raw.quote?.trim() || fallback?.quote || ""),
    imageUrl,
    imageAlt: stripDashes(raw.image?.alt?.trim() || fallback?.imageAlt || name),
    stats,
  };
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

  const topics =
    doc.topics
      ?.filter((t) => t?.title && !/asset allocation/i.test(t.title))
      .slice(0, 3)
      .map((t) => {
        const title = stripDashes(t.title!);
        const isDerivatives = /derivatives/i.test(title);
        return {
          title,
          theme: t.theme ? stripDashes(t.theme) : undefined,
          audience: t.audience ? stripDashes(t.audience) : undefined,
          speaker: t.speaker
            ? stripDashes(t.speaker)
            : isDerivatives
              ? "Chandan Taparia"
              : "Anil Jha",
          points: ((t.points ?? []).filter(Boolean) as string[]).map(stripDashes),
          icon: t.icon ?? undefined,
        };
      }) ?? base.topics;

  const fromArray =
    doc.speakers
      ?.map((s, i) => mapSpeaker(s, base.speakers[i]))
      .filter((s): s is LandingSpeaker => Boolean(s)) ?? [];

  const fromLegacy = doc.speaker?.name
    ? [mapSpeaker(doc.speaker, base.speakers[0])].filter(
        (s): s is LandingSpeaker => Boolean(s)
      )
    : [];

  const speakers = fromArray.length
    ? fromArray
    : fromLegacy.length
      ? fromLegacy
      : base.speakers;

  return {
    heroEyebrow: cleanHeroEyebrow(doc.heroEyebrow?.trim() || base.heroEyebrow),
    heroHeadline: stripDashes(doc.heroHeadline?.trim() || base.heroHeadline),
    heroHighlight: stripDashes(doc.heroHighlight?.trim() || base.heroHighlight),
    heroSubtitle: stripDashes(doc.heroSubtitle?.trim() || base.heroSubtitle),
    posterUrl,
    posterAlt: stripDashes(doc.poster?.alt?.trim() || base.posterAlt),
    eventDateTime: doc.eventDateTime || nextSaturdayAt1900IST(),
    eventMeta: stripDashes(doc.eventMeta?.trim() || base.eventMeta),
    registerUrl: doc.registerUrl?.trim() || base.registerUrl,
    topicsIntro: stripDashes(doc.topicsIntro?.trim() || base.topicsIntro),
    topics: topics.length ? topics : base.topics,
    speakers,
    marqueeItems:
      doc.marqueeItems?.filter(Boolean).length
        ? (doc.marqueeItems.filter(Boolean) as string[]).map(stripDashes)
        : base.marqueeItems,
    audienceItems:
      doc.audienceItems?.filter(Boolean).length
        ? (doc.audienceItems.filter(Boolean) as string[]).map(stripDashes)
        : base.audienceItems,
  };
}

export async function getLandingWebinar(): Promise<LandingWebinarContent> {
  try {
    const doc = await client.fetch<LandingWebinarDoc | null>(
      LANDING_WEBINAR_QUERY,
      {},
      { next: { revalidate: 0 } }
    );
    return mapDoc(doc);
  } catch (error) {
    console.error("Failed to fetch landing webinar from Sanity:", error);
    return {
      ...DEFAULT_LANDING_WEBINAR,
      eventDateTime: nextSaturdayAt1900IST(),
    };
  }
}
