"use client";

import { useEffect, useMemo, useState, type ComponentType, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BarChart3,
  Briefcase,
  CalendarClock,
  CheckCircle2,
  LineChart,
  PiggyBank,
  Shield,
  Sparkles,
  Users,
} from "lucide-react";
import type { LandingTopic, LandingWebinarContent } from "@/sanity/lib/types";
import {
  REGISTER_LIMITS,
  firstRegisterError,
  getPhoneDigits,
  validateRegisterField,
  validateRegisterFields,
  type RegisterFieldErrors,
  type RegisterFieldKey,
} from "@/app/lib/registerValidation";
import Header, { scrollToHash } from "@/app/components/Header/Header";

const LOGO_MARK_SRC = "/new_geld_g_logo.png";
const LOGO_WORDMARK_SRC = "/new_geld_eld_logo.png";

const TOPIC_ICONS: Record<string, ComponentType<{ className?: string }>> = {
  lineChart: LineChart,
  barChart: BarChart3,
  briefcase: Briefcase,
  piggyBank: PiggyBank,
  shield: Shield,
  users: Users,
};

function NavLink({
  href,
  children,
  className,
  onNavigate,
  "aria-label": ariaLabel,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  onNavigate?: () => void;
  "aria-label"?: string;
}) {
  return (
    <a
      href={href}
      className={className}
      aria-label={ariaLabel}
      onClick={(e) => {
        if (!href.startsWith("#")) return;
        e.preventDefault();
        onNavigate?.();
        window.setTimeout(() => {
          scrollToHash(href);
          history.replaceState(null, "", href);
        }, 50);
      }}
    >
      {children}
    </a>
  );
}

function useCountdown(target: Date) {
  const [now, setNow] = useState(0);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = now ? Math.max(0, target.getTime() - now) : 0;
  const d = Math.floor(diff / 86_400_000);
  const h = Math.floor((diff / 3_600_000) % 24);
  const m = Math.floor((diff / 60_000) % 60);
  const s = Math.floor((diff / 1000) % 60);
  return { d, h, m, s };
}

export default function LandingPage({ data }: { data: LandingWebinarContent }) {
  const target = useMemo(() => new Date(data.eventDateTime), [data.eventDateTime]);
  const { d, h, m, s } = useCountdown(target);
  const countdown = { d, h, m, s };

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    const t = window.setTimeout(() => scrollToHash(hash), 80);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div style={{ background: "var(--gradient-hero)" }} className="min-h-screen">
      <Header registerUrl={data.registerUrl} />
      <Hero data={data} countdown={countdown} target={target} />
      <AboutGeld registerUrl={data.registerUrl} topicCount={data.topics.length} />
      <Marquee items={data.marqueeItems} />
      <Learn topics={data.topics} intro={data.topicsIntro} />
      <Speaker speakers={data.speakers} />
      <Performance />
      <ForWho items={data.audienceItems} />
      <Testimonials />
      <FAQ />
      <FinalCTA countdown={countdown} registerUrl={data.registerUrl} />
      <Footer />
    </div>
  );
}

function Countdown({ d, h, m, s }: { d: number; h: number; m: number; s: number }) {
  const cells = [
    { v: d, l: "Days" },
    { v: h, l: "Hours" },
    { v: m, l: "Mins" },
    { v: s, l: "Secs" },
  ];
  return (
    <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
      {cells.map((c) => (
        <div
          key={c.l}
          className="surface-card px-3 py-2.5 sm:px-4 sm:py-3 min-w-[64px] sm:min-w-[72px] text-center"
        >
          <div className="font-display text-xl sm:text-2xl md:text-3xl font-semibold gold-text tabular-nums">
            {String(c.v).padStart(2, "0")}
          </div>
          <div className="text-[9px] sm:text-[10px] uppercase tracking-widest text-muted-foreground mt-1">
            {c.l}
          </div>
        </div>
      ))}
    </div>
  );
}

function Hero({
  data,
  countdown,
  target,
}: {
  data: LandingWebinarContent;
  countdown: { d: number; h: number; m: number; s: number };
  target: Date;
}) {
  return (
    <section className="relative overflow-hidden">
      <div id="top" className="container-x pt-28 sm:pt-32 md:pt-36 pb-14 sm:pb-20 md:pb-24">
        <div className="mx-auto max-w-3xl text-center flex flex-col items-center">
          <div className="flex flex-col items-center gap-2.5 max-w-full px-2">
            {(() => {
              const parts = data.heroEyebrow
                .split(/\s*[·•|]\s*/)
                .map((p) => p.trim())
                .filter(Boolean);
              const primary = parts[0] || "Live weekly webinars";
              const secondary = parts[1] || "37+ years market experience";
              return (
                <>
                  <p className="text-[11px] sm:text-xs uppercase tracking-[0.28em] text-[var(--gold)] font-medium">
                    {primary}
                  </p>
                  <div className="flex items-center gap-3 w-full max-w-sm">
                    <span
                      className="flex-1 h-px"
                      style={{
                        background:
                          "linear-gradient(90deg, transparent, color-mix(in srgb, var(--gold) 45%, transparent))",
                      }}
                    />
                    <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-muted-foreground whitespace-nowrap">
                      {secondary}
                    </span>
                    <span
                      className="flex-1 h-px"
                      style={{
                        background:
                          "linear-gradient(270deg, transparent, color-mix(in srgb, var(--gold) 45%, transparent))",
                      }}
                    />
                  </div>
                </>
              );
            })()}
          </div>

          <h1 className="mt-5 sm:mt-6 font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] font-semibold px-1">
            {data.heroHeadline} <br />
            <span className="gold-text">{data.heroHighlight}</span>
          </h1>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg text-muted-foreground max-w-xl px-1">
            {data.heroSubtitle}
          </p>

          <div className="relative mt-8 sm:mt-10 mx-auto w-fit max-w-[min(100%,360px)] sm:max-w-[460px] md:max-w-[560px]">
            <div
              className="absolute -inset-3 sm:-inset-4 rounded-3xl opacity-40 blur-3xl"
              style={{ background: "var(--gradient-gold)" }}
            />
            <div className="relative rounded-2xl border border-border overflow-hidden bg-black shadow-[var(--shadow-panel)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={data.posterUrl}
                alt={data.posterAlt}
                width={800}
                height={1200}
                className="block h-[320px] sm:h-[440px] md:h-[560px] w-auto max-w-full"
              />
            </div>
          </div>

          <div className="mt-6 sm:mt-8 text-xs sm:text-sm text-muted-foreground px-2">
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <CalendarClock className="w-4 h-4 text-[var(--gold)] shrink-0" />
              <span>
                {target.toLocaleDateString("en-IN", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </span>
              <span className="opacity-50">·</span>
              <span>{data.eventMeta}</span>
            </div>
          </div>

          <div className="mt-6 sm:mt-8 w-full flex justify-center">
            <Countdown {...countdown} />
          </div>

          <div
            id="register"
            className="mt-8 sm:mt-10 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center gap-3 sm:gap-4 w-full max-w-md sm:max-w-none"
          >
            <a
              href={data.registerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold w-full sm:w-auto"
            >
              Reserve your seat <ArrowRight className="w-4 h-4" />
            </a>
            <NavLink href="#about" className="btn-ghost w-full sm:w-auto">
              About GELD
            </NavLink>
          </div>

          <div className="mt-8 sm:mt-10 flex items-center justify-center gap-4 sm:gap-6 text-[10px] sm:text-xs uppercase tracking-widest text-muted-foreground flex-wrap px-2">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[var(--gold)]" /> 12,400+ attendees
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[var(--gold)]" /> 37+ years experience
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[var(--gold)]" /> 100% free
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutGeld({
  registerUrl,
  topicCount,
}: {
  registerUrl: string;
  topicCount: number;
}) {
  return (
    <section className="py-14 sm:py-20 md:py-28 border-t border-border/60">
      <div id="about" className="container-x grid lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-14 items-center scroll-mt-24 md:scroll-mt-28">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-[var(--gold)]">About GELD Wealth</div>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight">
            Steady advice. <span className="gold-text">Every market.</span>
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">
            GELD Wealth helps self directed investors and traders make sharper, calmer
            decisions, with 37+ years of market experience behind every session. We track
            every shift, decode every opportunity, and make sure your wealth is working in
            the right direction, across every asset class, not just equities.
          </p>
          <ul className="mt-6 space-y-3">
            {[
              "37+ years of market experience",
              "Educational webinars with actionable frameworks",
              "Managed portfolios, F&O strategies & SIPs",
            ].map((t) => (
              <li key={t} className="flex gap-3 text-sm">
                <CheckCircle2 className="w-5 h-5 text-[var(--gold)] shrink-0" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>

        <div id="webinar" className="surface-card p-5 sm:p-8 scroll-mt-24 md:scroll-mt-28">
          <div className="text-xs uppercase tracking-[0.2em] text-[var(--gold)]">Webinar details</div>
          <h3 className="mt-3 font-display text-2xl sm:text-3xl font-semibold">What to expect on the call</h3>
          <div className="mt-6 grid sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start gap-3">
              <CalendarClock className="w-5 h-5 text-[var(--gold)] mt-0.5" />
              <div>
                <div className="font-semibold">Every Saturday</div>
                <div className="text-muted-foreground">7:00 PM IST · 60 minutes</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-[var(--gold)] mt-0.5" />
              <div>
                <div className="font-semibold">Live on Zoom</div>
                <div className="text-muted-foreground">Interactive Q&A with Chandan</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-[var(--gold)] mt-0.5" />
              <div>
                <div className="font-semibold">Zero cost</div>
                <div className="text-muted-foreground">No upsells, no fluff</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-[var(--gold)] mt-0.5" />
              <div>
                <div className="font-semibold">Actionable</div>
                <div className="text-muted-foreground">
                  {topicCount} clear webinars, no pitches
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 hairline" />
          <div className="mt-6 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <div className="font-display text-2xl font-semibold gold-text">3Y CAGR 34.88%</div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">
                Managed portfolios
              </div>
            </div>
            <a
              href={registerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold text-sm !py-2 !px-4"
            >
              Reserve seat <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-display text-lg sm:text-2xl font-semibold gold-text">{value}</div>
      <div className="text-[9px] sm:text-xs uppercase tracking-widest text-muted-foreground mt-1 leading-snug">
        {label}
      </div>
    </div>
  );
}

function Marquee({ items }: { items: string[] }) {
  return (
    <section aria-hidden className="border-y border-border/60 py-5 overflow-hidden">
      <div className="flex gap-12 whitespace-nowrap animate-[marquee_30s_linear_infinite]">
        {[...items, ...items, ...items].map((t, i) => (
          <div key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
            <Sparkles className="w-4 h-4 text-[var(--gold)]" />
            <span>{t}</span>
          </div>
        ))}
      </div>
      <style>{`@keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-33.33%) } }`}</style>
    </section>
  );
}

function Learn({ topics, intro }: { topics: LandingTopic[]; intro: string }) {
  return (
    <section className="py-14 sm:py-24 md:py-32">
      <div id="learn" className="container-x scroll-mt-24 md:scroll-mt-28">
        <SectionHead
          kicker="Our webinars"
          title={
            <>
              Choose your <span className="gold-text">webinar.</span>
            </>
          }
          sub={intro}
        />
        <div className="mt-10 sm:mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 items-stretch">
          {topics.map((it, index) => {
            const n = String(index + 1).padStart(2, "0");
            const Icon = TOPIC_ICONS[it.icon ?? ""] ?? LineChart;
            return (
              <article
                key={`${n}-${it.title}`}
                className="surface-card p-5 sm:p-7 md:p-8 flex flex-col h-full relative overflow-hidden"
              >
                <div className="flex items-start justify-between gap-4">
                  <div
                    className="w-11 h-11 rounded-xl grid place-items-center border border-border shrink-0"
                    style={{ background: "color-mix(in srgb, var(--gold) 10%, transparent)" }}
                  >
                    <Icon className="w-5 h-5 text-[var(--gold)]" />
                  </div>
                  <span className="font-display text-3xl font-semibold gold-text leading-none">
                    {n}
                  </span>
                </div>
                <div className="mt-5 text-xs uppercase tracking-[0.2em] text-[var(--gold)]">
                  Webinar {index + 1}
                </div>
                <h3 className="mt-2 text-xl md:text-2xl font-semibold leading-snug">{it.title}</h3>
                <p className="mt-3 text-sm">
                  <span className="text-muted-foreground">Speaker: </span>
                  <span className="text-[var(--gold)] font-medium">
                    {it.speaker ||
                      (/derivatives/i.test(it.title) ? "Chandan Taparia" : "Anil Jha")}
                  </span>
                </p>
                {it.theme ? (
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{it.theme}</p>
                ) : null}
                {it.audience ? (
                  <p className="mt-4 text-sm">
                    <span className="text-[var(--gold)] font-medium">For: </span>
                    <span className="text-muted-foreground">{it.audience}</span>
                  </p>
                ) : null}
                {it.points.length > 0 ? (
                  <ul className="mt-5 space-y-2.5">
                    {it.points.map((p) => (
                      <li key={p} className="flex gap-2.5 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-[var(--gold)] shrink-0 mt-0.5" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
                <div className="mt-auto pt-6">
                  <TopicInterestForm topic={it.title} formId={`topic-${n}`} />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function TopicInterestForm({ topic, formId }: { topic: string; formId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<RegisterFieldErrors>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const inputClass =
    "mt-1.5 w-full bg-transparent border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--gold)]";
  const errorInputClass = `${inputClass} border-red-500/70 focus:border-red-400`;

  function setField(
    field: RegisterFieldKey,
    value: string,
    setter: (v: string) => void
  ) {
    setter(value);
    setFormError("");
    const msg = validateRegisterField(field, value);
    setErrors((prev) => {
      const next = { ...prev };
      if (msg) next[field] = msg;
      else delete next[field];
      return next;
    });
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError("");
    const fieldErrors = validateRegisterFields({ name, email, phone });
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) {
      setFormError(firstRegisterError(fieldErrors));
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          interestedTopic: topic,
        }),
      });
      const data = (await res.json().catch(() => null)) as {
        error?: string;
        fieldErrors?: RegisterFieldErrors;
      } | null;

      if (!res.ok) {
        if (data?.fieldErrors) setErrors(data.fieldErrors);
        setFormError(data?.error || "Failed to send. Please try again.");
        return;
      }

      router.push(`/thank-you?topic=${encodeURIComponent(topic)}`);
    } catch {
      setFormError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="btn-gold w-full text-sm !py-2.5"
      >
        I&apos;m interested <ArrowRight className="w-4 h-4" />
      </button>
    );
  }

  return (
    <>
      <button type="button" className="btn-gold w-full text-sm !py-2.5 invisible" tabIndex={-1} aria-hidden>
        I&apos;m interested <ArrowRight className="w-4 h-4" />
      </button>
      <form
        onSubmit={onSubmit}
        className="absolute inset-0 z-20 flex flex-col justify-center gap-3 p-5 sm:p-7 overflow-y-auto"
        style={{
          background: "linear-gradient(180deg, var(--surface-elevated), var(--surface))",
        }}
        noValidate
      >
        <p className="text-xs text-muted-foreground">
          Show interest in <span className="text-[var(--gold)] font-medium">{topic}</span>
        </p>

        <div>
          <label
            htmlFor={`${formId}-name`}
            className="block text-[10px] uppercase tracking-widest text-muted-foreground"
          >
            Full name
          </label>
          <input
            id={`${formId}-name`}
            name="name"
            autoComplete="name"
            value={name}
            onChange={(e) => setField("name", e.target.value, setName)}
            maxLength={REGISTER_LIMITS.MAX_NAME}
            className={errors.name ? errorInputClass : inputClass}
            placeholder="Your name"
            aria-invalid={Boolean(errors.name)}
          />
          {errors.name ? <p className="mt-1 text-xs text-red-400">{errors.name}</p> : null}
        </div>

        <div>
          <label
            htmlFor={`${formId}-email`}
            className="block text-[10px] uppercase tracking-widest text-muted-foreground"
          >
            Email
          </label>
          <input
            id={`${formId}-email`}
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setField("email", e.target.value, setEmail)}
            maxLength={REGISTER_LIMITS.MAX_EMAIL}
            className={errors.email ? errorInputClass : inputClass}
            placeholder="you@example.com"
            aria-invalid={Boolean(errors.email)}
          />
          {errors.email ? <p className="mt-1 text-xs text-red-400">{errors.email}</p> : null}
        </div>

        <div>
          <label
            htmlFor={`${formId}-phone`}
            className="block text-[10px] uppercase tracking-widest text-muted-foreground"
          >
            Contact number
          </label>
          <input
            id={`${formId}-phone`}
            name="phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            value={phone}
            onChange={(e) => {
              const digits = getPhoneDigits(e.target.value).slice(
                0,
                REGISTER_LIMITS.MAX_PHONE_DIGITS
              );
              setField("phone", digits, setPhone);
            }}
            maxLength={REGISTER_LIMITS.MAX_PHONE_DIGITS}
            className={errors.phone ? errorInputClass : inputClass}
            placeholder="10 digit mobile number"
            aria-invalid={Boolean(errors.phone)}
          />
          {errors.phone ? <p className="mt-1 text-xs text-red-400">{errors.phone}</p> : null}
        </div>

        {formError ? <p className="text-xs text-red-400 text-center">{formError}</p> : null}

        <button
          type="submit"
          disabled={submitting}
          className="btn-gold w-full text-sm !py-2.5 disabled:opacity-60 disabled:pointer-events-none"
        >
          {submitting ? "Sending…" : "Submit interest"}{" "}
          {!submitting ? <ArrowRight className="w-4 h-4" /> : null}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="w-full text-xs text-muted-foreground hover:text-[var(--gold)] py-1"
        >
          Cancel
        </button>
      </form>
    </>
  );
}

function Speaker({ speakers }: { speakers: LandingWebinarContent["speakers"] }) {
  const list = speakers.length ? speakers : [];
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = list.length;

  useEffect(() => {
    if (count <= 1 || paused) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % count);
    }, 3500);
    return () => window.clearInterval(id);
  }, [count, paused]);

  if (!count) return null;

  const current = list[active] ?? list[0];

  function initials(name: string) {
    return name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? "")
      .join("");
  }

  return (
    <section className="py-14 sm:py-24 md:py-32 border-t border-border/60">
      <div
        id="speaker"
        className="container-x scroll-mt-24 md:scroll-mt-28"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="text-xs uppercase tracking-[0.2em] text-[var(--gold)]">
            Featured speakers
          </div>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight">
            Learn from <span className="gold-text">practitioners.</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-10 lg:gap-14 items-center">
          <div className="relative max-w-md mx-auto lg:max-w-none lg:mx-0 w-full">
            <div
              className="absolute -inset-4 sm:-inset-6 rounded-3xl opacity-30 blur-3xl"
              style={{ background: "var(--gradient-gold)" }}
            />
            <div className="relative surface-card overflow-hidden aspect-[4/5]">
              {list.map((speaker, index) => {
                const isActive = index === active;
                return (
                  <div
                    key={`photo-${speaker.name}-${index}`}
                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                      isActive ? "opacity-100" : "opacity-0"
                    }`}
                    aria-hidden={!isActive}
                  >
                    {speaker.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={speaker.imageUrl}
                        alt={speaker.imageAlt}
                        width={900}
                        height={1100}
                        loading={index === 0 ? "eager" : "lazy"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className="w-full h-full grid place-items-center"
                        style={{
                          background:
                            "linear-gradient(160deg, color-mix(in srgb, var(--gold) 25%, #111), #0a0a0a)",
                        }}
                      >
                        <span className="font-display text-6xl sm:text-7xl gold-text font-semibold">
                          {initials(speaker.name)}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative min-h-[280px] sm:min-h-[320px]">
            {list.map((speaker, index) => {
              const isActive = index === active;
              return (
                <div
                  key={`copy-${speaker.name}-${index}`}
                  className={`transition-opacity duration-700 ease-in-out ${
                    isActive
                      ? "opacity-100 relative"
                      : "opacity-0 absolute inset-0 pointer-events-none"
                  }`}
                  aria-hidden={!isActive}
                >
                  <div className="text-xs uppercase tracking-[0.2em] text-[var(--gold)]">
                    {speaker.role || "Featured speaker"}
                  </div>
                  <h3 className="mt-3 font-display text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight">
                    Meet <span className="gold-text">{speaker.name}</span>
                  </h3>
                  {speaker.bio ? (
                    <p className="mt-5 text-base sm:text-lg text-muted-foreground">
                      {speaker.bio}
                    </p>
                  ) : null}
                  {speaker.stats.length > 0 ? (
                    <div className="mt-8 grid grid-cols-3 gap-3 sm:gap-6">
                      {speaker.stats.map((s) => (
                        <Stat key={s.label} label={s.label} value={s.value} />
                      ))}
                    </div>
                  ) : null}
                  {speaker.quote ? (
                    <>
                      <div className="mt-8 hairline" />
                      <blockquote className="mt-8 font-display text-2xl leading-snug">
                        &ldquo;{speaker.quote}&rdquo;
                      </blockquote>
                    </>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>

        {count > 1 ? (
          <div className="mt-10 flex items-center justify-center gap-3">
            {list.map((speaker, index) => (
              <button
                key={`dot-${speaker.name}-${index}`}
                type="button"
                aria-label={`Show ${speaker.name}`}
                aria-current={index === active}
                onClick={() => setActive(index)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  index === active
                    ? "w-8 bg-[var(--gold)]"
                    : "w-2.5 bg-border hover:bg-[var(--gold)]/50"
                }`}
              />
            ))}
          </div>
        ) : null}

        <p className="sr-only" aria-live="polite">
          {current.name}
        </p>
      </div>
    </section>
  );
}

function Performance() {
  const rows = [
    { label: "3 Year CAGR", value: "34.88%" },
    { label: "Since inception", value: "+325.63%" },
    { label: "Benchmark: Nifty 50", value: "+82.4%" },
    { label: "Alpha vs Index", value: "+243%" },
  ];
  return (
    <section className="py-14 sm:py-24 md:py-32 border-t border-border/60">
      <div id="performance" className="container-x scroll-mt-24 md:scroll-mt-28">
        <SectionHead
          kicker="Performance"
          title={
            <>
              Numbers that <span className="gold-text">compound.</span>
            </>
          }
          sub="Our managed stock portfolios have outperformed the index across every rolling 3 year window since inception."
        />
        <div className="mt-10 sm:mt-14 grid md:grid-cols-2 gap-6 sm:gap-8 items-center">
          <div className="surface-card divide-y divide-border">
            {rows.map((r) => (
              <div
                key={r.label}
                className="flex items-center justify-between gap-4 px-4 sm:px-6 py-4 sm:py-5"
              >
                <span className="text-sm sm:text-base text-muted-foreground">{r.label}</span>
                <span className="font-display text-xl sm:text-2xl font-semibold gold-text shrink-0">
                  {r.value}
                </span>
              </div>
            ))}
          </div>
          <div>
            <p className="text-lg text-muted-foreground">
              We track every shift, decode every opportunity, and make sure your wealth is
              working in the right direction, across every asset class, not just equities.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Investments across 20 to 25 large & multicap stocks",
                "Managed by Pankaj Murarka, Dipen Sheth, Sunil Singhania",
                "Portfolio tiers from ₹500/month SIPs to ₹1 Crore AIF",
              ].map((t) => (
                <li key={t} className="flex gap-3 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-[var(--gold)] shrink-0" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function ForWho({ items }: { items: string[] }) {
  return (
    <section className="py-14 sm:py-24 md:py-32 border-t border-border/60">
      <div className="container-x grid md:grid-cols-2 gap-8 md:gap-14 items-center">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-[var(--gold)]">Who it's for</div>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight">
            Built for real <span className="gold-text">money decisions.</span>
          </h2>
        </div>
        <ul className="space-y-3 sm:space-y-4">
          {items.map((t) => (
            <li key={t} className="flex gap-3 surface-card px-4 sm:px-5 py-3.5 sm:py-4">
              <CheckCircle2 className="w-5 h-5 text-[var(--gold)] shrink-0 mt-0.5" />
              <span className="text-sm sm:text-base">{t}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Testimonials() {
  const quotes = [
    {
      q: "Finally a webinar with no upselling. Pure signal.",
      n: "Rohit S.",
      r: "Retail trader, Bengaluru",
    },
    {
      q: "Chandan's F&O framework paid for itself in a week.",
      n: "Ananya K.",
      r: "Options trader, Mumbai",
    },
    {
      q: "The risk rules alone changed how I sleep at night.",
      n: "Vikram P.",
      r: "Long term investor, Delhi",
    },
  ];
  return (
    <section className="py-14 sm:py-24 md:py-32 border-t border-border/60">
      <div className="container-x">
        <SectionHead
          kicker="What attendees say"
          title={
            <>
              Real traders. <span className="gold-text">Real outcomes.</span>
            </>
          }
        />
        <div className="mt-10 sm:mt-14 grid md:grid-cols-3 gap-4 sm:gap-5">
          {quotes.map((q) => (
            <figure key={q.n} className="surface-card p-5 sm:p-7">
              <div className="text-[var(--gold)] text-3xl font-display leading-none">&ldquo;</div>
              <blockquote className="mt-2 text-base sm:text-lg leading-snug">{q.q}</blockquote>
              <figcaption className="mt-6 text-sm">
                <div className="font-semibold">{q.n}</div>
                <div className="text-muted-foreground">{q.r}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const faqs = [
    {
      q: "Is the webinar really free?",
      a: "Yes. The 60 minute masterclass is completely free, no credit card, no strings attached.",
    },
    {
      q: "Will I get a recording?",
      a: "Registrants get access to a limited time recording. Attending live is strongly recommended for the Q&A.",
    },
    {
      q: "Do I need trading experience?",
      a: "No. The session is structured so beginners get the foundation and experienced traders sharpen their edge.",
    },
    {
      q: "How do I join?",
      a: "You'll get a Zoom link on email and WhatsApp after you register. Join five minutes early to get settled.",
    },
    {
      q: "Is this investment advice?",
      a: "No. This webinar is educational only and does not constitute investment advice. Markets involve risk; always do your own due diligence.",
    },
  ];
  return (
    <section className="py-14 sm:py-24 md:py-32 border-t border-border/60">
      <div id="faq" className="container-x grid md:grid-cols-[1fr_1.4fr] gap-8 md:gap-14 scroll-mt-24 md:scroll-mt-28">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-[var(--gold)]">FAQ</div>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight">
            Questions, <span className="gold-text">answered.</span>
          </h2>
          <p className="mt-5 text-muted-foreground">
            Still stuck? Email{" "}
            <a
              className="text-[var(--gold)] underline underline-offset-4"
              href="mailto:Support@geldwealth.com"
            >
              Support@geldwealth.com
            </a>
            .
          </p>
        </div>
        <div className="divide-y divide-border">
          {faqs.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex items-start sm:items-center justify-between gap-3 cursor-pointer list-none">
                <span className="font-semibold text-base sm:text-lg pr-2">{f.q}</span>
                <span className="w-8 h-8 rounded-full border border-border grid place-items-center text-[var(--gold)] transition-transform group-open:rotate-45 shrink-0">
                  +
                </span>
              </summary>
              <p className="mt-3 text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA({
  countdown,
  registerUrl,
}: {
  countdown: { d: number; h: number; m: number; s: number };
  registerUrl: string;
}) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<RegisterFieldErrors>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const inputClass =
    "mt-2 w-full bg-transparent border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-[var(--gold)]";
  const errorInputClass = `${inputClass} border-red-500/70 focus:border-red-400`;

  function setField(
    field: RegisterFieldKey,
    value: string,
    setter: (v: string) => void
  ) {
    setter(value);
    setFormError("");
    const msg = validateRegisterField(field, value);
    setErrors((prev) => {
      const next = { ...prev };
      if (msg) next[field] = msg;
      else delete next[field];
      return next;
    });
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError("");
    const fieldErrors = validateRegisterFields({ name, email, phone });
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) {
      setFormError(firstRegisterError(fieldErrors));
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone }),
      });
      const data = (await res.json().catch(() => null)) as {
        error?: string;
        fieldErrors?: RegisterFieldErrors;
      } | null;

      if (!res.ok) {
        if (data?.fieldErrors) setErrors(data.fieldErrors);
        setFormError(data?.error || "Failed to send registration. Please try again.");
        return;
      }

      if (registerUrl) {
        window.open(registerUrl, "_blank", "noopener,noreferrer");
      }
      router.push("/thank-you");
    } catch {
      setFormError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="py-14 sm:py-24 md:py-32">
      <div id="register-form" className="container-x scroll-mt-24 md:scroll-mt-28">
        <div
          className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-border p-6 sm:p-10 md:p-16"
          style={{
            background: "linear-gradient(180deg, var(--surface-elevated), var(--surface))",
          }}
        >
          <div
            className="absolute -top-24 -right-24 w-[280px] sm:w-[380px] h-[280px] sm:h-[380px] rounded-full blur-3xl opacity-40"
            style={{ background: "var(--gradient-gold)" }}
          />
          <div className="relative grid lg:grid-cols-[1.2fr_1fr] gap-8 sm:gap-12 items-center">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-[var(--gold)]">
                Reserve your seat
              </div>
              <h2 className="mt-3 font-display text-3xl sm:text-4xl md:text-6xl font-semibold leading-[1.05]">
                One hour that could <br />
                <span className="gold-text">change your process.</span>
              </h2>
              <p className="mt-4 sm:mt-5 text-base sm:text-lg text-muted-foreground max-w-lg">
                Seats are limited to keep the Q&A useful. Drop your details and we&apos;ll send
                the Zoom link along with a pre read.
              </p>
              <div className="mt-6 sm:mt-8">
                <Countdown {...countdown} />
              </div>
            </div>

            <form onSubmit={onSubmit} className="surface-card p-5 sm:p-6 md:p-8" noValidate>
              <label
                htmlFor="register-name"
                className="block text-xs uppercase tracking-widest text-muted-foreground"
              >
                Full name
              </label>
              <input
                id="register-name"
                name="name"
                autoComplete="name"
                value={name}
                onChange={(e) => setField("name", e.target.value, setName)}
                onBlur={() =>
                  setErrors((prev) => ({
                    ...prev,
                    name: validateRegisterField("name", name, { requireFilled: true }),
                  }))
                }
                maxLength={REGISTER_LIMITS.MAX_NAME}
                className={errors.name ? errorInputClass : inputClass}
                placeholder="Your name"
                aria-invalid={Boolean(errors.name)}
              />
              {errors.name ? (
                <p className="mt-1.5 text-xs text-red-400">{errors.name}</p>
              ) : null}

              <label
                htmlFor="register-email"
                className="block text-xs uppercase tracking-widest text-muted-foreground mt-4"
              >
                Email
              </label>
              <input
                id="register-email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setField("email", e.target.value, setEmail)}
                onBlur={() =>
                  setErrors((prev) => ({
                    ...prev,
                    email: validateRegisterField("email", email, {
                      requireFilled: true,
                    }),
                  }))
                }
                maxLength={REGISTER_LIMITS.MAX_EMAIL}
                className={errors.email ? errorInputClass : inputClass}
                placeholder="you@example.com"
                aria-invalid={Boolean(errors.email)}
              />
              {errors.email ? (
                <p className="mt-1.5 text-xs text-red-400">{errors.email}</p>
              ) : null}

              <label
                htmlFor="register-phone"
                className="block text-xs uppercase tracking-widest text-muted-foreground mt-4"
              >
                Contact number
              </label>
              <input
                id="register-phone"
                name="phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                value={phone}
                onChange={(e) => {
                  const digits = getPhoneDigits(e.target.value).slice(
                    0,
                    REGISTER_LIMITS.MAX_PHONE_DIGITS
                  );
                  setField("phone", digits, setPhone);
                }}
                onBlur={() =>
                  setErrors((prev) => ({
                    ...prev,
                    phone: validateRegisterField("phone", phone, {
                      requireFilled: true,
                    }),
                  }))
                }
                maxLength={REGISTER_LIMITS.MAX_PHONE_DIGITS}
                className={errors.phone ? errorInputClass : inputClass}
                placeholder="10 digit mobile number"
                aria-invalid={Boolean(errors.phone)}
              />
              {errors.phone ? (
                <p className="mt-1.5 text-xs text-red-400">{errors.phone}</p>
              ) : null}

              {formError ? (
                <p className="mt-4 text-sm text-red-400 text-center">{formError}</p>
              ) : null}

              <button
                type="submit"
                disabled={submitting}
                className="btn-gold w-full mt-6 disabled:opacity-60 disabled:pointer-events-none"
              >
                {submitting ? "Submitting…" : "Reserve my seat"}{" "}
                {!submitting ? <ArrowRight className="w-4 h-4" /> : null}
              </button>
              <p className="mt-3 text-[11px] text-muted-foreground text-center">
                By registering you agree to receive session updates from GELD Wealth.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/60 py-10 sm:py-12">
      <div className="container-x grid sm:grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr] gap-8 md:gap-10">
        <div className="sm:col-span-2 md:col-span-1">
          <NavLink href="#top" className="geld-logo" aria-label="GELD Wealth">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={LOGO_MARK_SRC}
              alt=""
              width={45}
              height={45}
              className="geld-logo-g"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={LOGO_WORDMARK_SRC}
              alt="GELD Wealth"
              width={140}
              height={38}
              className="geld-logo-text"
            />
          </NavLink>
          <p className="mt-4 text-sm text-muted-foreground max-w-md">
            37+ years of market experience. This webinar is for educational purposes only.
            Views expressed do not constitute investment advice. Securities market investments
            are subject to market risks.
          </p>
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Explore</div>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <NavLink href="#learn" className="hover:text-[var(--gold)]">
                Webinars
              </NavLink>
            </li>
            <li>
              <NavLink href="#speaker" className="hover:text-[var(--gold)]">
                Speakers
              </NavLink>
            </li>
            <li>
              <NavLink href="#performance" className="hover:text-[var(--gold)]">
                Performance
              </NavLink>
            </li>
            <li>
              <NavLink href="#faq" className="hover:text-[var(--gold)]">
                FAQ
              </NavLink>
            </li>
          </ul>
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Contact</div>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a className="hover:text-[var(--gold)] break-all" href="mailto:Support@geldwealth.com">
                Support@geldwealth.com
              </a>
            </li>
            <li>
              <a
                className="hover:text-[var(--gold)]"
                href="https://geldwealth.com"
                target="_blank"
                rel="noreferrer"
              >
                geldwealth.com
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="container-x mt-8 sm:mt-10 text-xs text-muted-foreground flex flex-col sm:flex-row flex-wrap justify-between gap-2 sm:gap-3">
        <span>© {new Date().getFullYear()} GELD Wealth. All rights reserved.</span>
        <span>Made for steady advice, every market.</span>
      </div>
    </footer>
  );
}

function SectionHead({
  kicker,
  title,
  sub,
}: {
  kicker: string;
  title: ReactNode;
  sub?: string;
}) {
  return (
    <div className="max-w-2xl">
      <div className="text-xs uppercase tracking-[0.2em] text-[var(--gold)]">{kicker}</div>
      <h2 className="mt-3 font-display text-3xl sm:text-4xl md:text-5xl font-semibold leading-[1.05]">
        {title}
      </h2>
      {sub && <p className="mt-4 sm:mt-5 text-base sm:text-lg text-muted-foreground">{sub}</p>}
    </div>
  );
}
