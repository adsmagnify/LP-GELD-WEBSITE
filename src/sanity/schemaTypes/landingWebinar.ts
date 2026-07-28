import { defineField, defineType } from "sanity";

const speakerFields = [
  defineField({
    name: "name",
    title: "Name",
    type: "string",
    validation: (rule) => rule.required(),
  }),
  defineField({
    name: "role",
    title: "Role / label",
    type: "string",
    description: 'e.g. "Featured speaker" or "Portfolio specialist"',
  }),
  defineField({
    name: "bio",
    title: "Bio / intro",
    type: "text",
    rows: 4,
  }),
  defineField({
    name: "quote",
    title: "Quote",
    type: "string",
  }),
  defineField({
    name: "image",
    title: "Photo",
    type: "image",
    options: { hotspot: true },
    fields: [
      defineField({
        name: "alt",
        title: "Alternative text",
        type: "string",
      }),
    ],
  }),
  defineField({
    name: "stats",
    title: "Stats",
    type: "array",
    of: [
      {
        type: "object",
        name: "stat",
        fields: [
          defineField({ name: "label", title: "Label", type: "string" }),
          defineField({ name: "value", title: "Value", type: "string" }),
        ],
        preview: {
          select: { title: "value", subtitle: "label" },
        },
      },
    ],
  }),
];

/**
 * Landing-page webinar content for lp.geldwealth.com.
 * Separate from the main site `webinar` singleton (poster only).
 * Document id is forced to `landingWebinar` via studio structure.
 */
export const landingWebinar = defineType({
  name: "landingWebinar",
  title: "Landing Webinar",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      initialValue: "Landing Webinar",
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: "heroEyebrow",
      title: "Hero eyebrow",
      type: "string",
      description: 'e.g. "Live weekly webinar · 37+ years market experience"',
    }),
    defineField({
      name: "heroHeadline",
      title: "Hero headline",
      type: "string",
      description: 'e.g. "Weekly Wealth"',
    }),
    defineField({
      name: "heroHighlight",
      title: "Hero highlight (gold line)",
      type: "string",
      description: 'e.g. "Masterclass."',
    }),
    defineField({
      name: "heroSubtitle",
      title: "Hero subtitle",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "poster",
      title: "Webinar poster",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alternative text",
          type: "string",
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "eventDateTime",
      title: "Event date & time",
      type: "datetime",
      description: "Used for the countdown and date display.",
      validation: (rule) => rule.required(),
      options: {
        timeStep: 15,
      },
    }),
    defineField({
      name: "eventMeta",
      title: "Event meta line",
      type: "string",
      description: 'Shown after the date, e.g. "7:00 PM IST · Live on Zoom"',
    }),
    defineField({
      name: "registerUrl",
      title: "Register / Zoom URL",
      type: "url",
      validation: (rule) => rule.required().uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "topicsIntro",
      title: "Webinars section intro",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "topics",
      title: "Webinars",
      type: "array",
      of: [
        {
          type: "object",
          name: "topic",
          title: "Webinar",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "theme",
              title: "Theme / summary",
              type: "text",
              rows: 2,
            }),
            defineField({
              name: "audience",
              title: "Who it's for",
              type: "string",
            }),
            defineField({
              name: "speaker",
              title: "Speaker",
              type: "string",
              description: 'e.g. "Chandan Taparia"',
            }),
            defineField({
              name: "points",
              title: "Bullet points",
              type: "array",
              of: [{ type: "string" }],
            }),
            defineField({
              name: "icon",
              title: "Icon",
              type: "string",
              options: {
                list: [
                  { title: "Line chart", value: "lineChart" },
                  { title: "Bar chart", value: "barChart" },
                  { title: "Briefcase", value: "briefcase" },
                  { title: "Piggy bank", value: "piggyBank" },
                  { title: "Shield", value: "shield" },
                  { title: "Users", value: "users" },
                ],
                layout: "dropdown",
              },
            }),
          ],
          preview: {
            select: { title: "title", subtitle: "theme" },
          },
        },
      ],
      validation: (rule) => rule.min(1).max(3),
    }),
    defineField({
      name: "speakers",
      title: "Featured speakers",
      description:
        "Add one or more speakers. The site shows them in a fade carousel.",
      type: "array",
      of: [
        {
          type: "object",
          name: "speakerItem",
          title: "Speaker",
          fields: speakerFields,
          preview: {
            select: { title: "name", subtitle: "role", media: "image" },
          },
        },
      ],
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: "speaker",
      title: "Legacy featured speaker",
      description: "Deprecated. Use Featured speakers above. Kept for old content.",
      type: "object",
      hidden: true,
      fields: speakerFields,
    }),
    defineField({
      name: "marqueeItems",
      title: "Marquee items",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "audienceItems",
      title: "Who it's for",
      type: "array",
      of: [{ type: "string" }],
    }),
  ],
  preview: {
    select: {
      media: "poster",
      date: "eventDateTime",
    },
    prepare({ media, date }) {
      return {
        title: "Landing Webinar",
        subtitle: date ? new Date(date).toLocaleString("en-IN") : "No date set",
        media,
      };
    },
  },
});
