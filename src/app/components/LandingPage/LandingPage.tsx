"use client";

import { useEffect, useMemo, useState, type ComponentType, type FormEvent, type ReactNode } from "react";
import {
  ArrowRight,
  BarChart3,
  Briefcase,
  CalendarClock,
  CheckCircle2,
  LineChart,
  Menu,
  PiggyBank,
  Shield,
  Sparkles,
  Users,
  X,
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

const nav = [
  { label: "Webinar", href: "#about" },
  { label: "What you'll learn", href: "#learn" },
  { label: "Speaker", href: "#speaker" },
  { label: "Performance", href: "#performance" },
  { label: "FAQ", href: "#faq" },
];

function getHeaderOffset(): number {
  if (typeof document === "undefined") return 88;
  const bar = document.querySelector<HTMLElement>("[data-header-bar]");
  // Extra breathing room so section titles sit clearly below the sticky nav.
  return (bar?.offsetHeight ?? 64) + 32;
}

function scrollToHash(hash: string) {
  const id = hash.replace(/^#/, "");
  if (!id) return;
  const el = document.getElementById(id);
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.pageYOffset - getHeaderOffset();
  window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
}

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
      <Speaker speaker={data.speaker} />
      <Performance />
      <ForWho items={data.audienceItems} />
      <Testimonials />
      <FAQ />
      <FinalCTA countdown={countdown} registerUrl={data.registerUrl} />
      <Footer />
    </div>
  );
}

function Header({ registerUrl }: { registerUrl: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      data-site-header
      className="sticky top-0 z-50 backdrop-blur-md bg-background/95 border-b border-border/60"
    >
      <div
        data-header-bar
        className="container-x flex items-center justify-between gap-3 h-14 md:h-16"
      >
        <NavLink href="#top" className="geld-logo" onNavigate={() => setOpen(false)}>
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

        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm text-muted-foreground">
          {nav.map((n) => (
            <NavLink
              key={n.href}
              href={n.href}
              className="hover:text-foreground transition-colors whitespace-nowrap"
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href={registerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold text-xs sm:text-sm !py-2 !px-3 sm:!px-4"
          >
            Reserve
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </a>
          <button
            type="button"
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-border text-foreground"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div
          id="mobile-nav"
          className="lg:hidden border-t border-border/60 bg-background/95 backdrop-blur-md"
        >
          <nav className="container-x py-4 flex flex-col gap-1">
            {nav.map((n) => (
              <NavLink
                key={n.href}
                href={n.href}
                onNavigate={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
              >
                {n.label}
              </NavLink>
            ))}
            <a
              href={registerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold mt-3 w-full"
              onClick={() => setOpen(false)}
            >
              Reserve seat <ArrowRight className="w-4 h-4" />
            </a>
          </nav>
        </div>
      ) : null}
    </header>
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
      <div id="top" className="container-x pt-10 sm:pt-14 md:pt-20 pb-14 sm:pb-20 md:pb-24">
        <div className="mx-auto max-w-3xl text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs uppercase tracking-[0.16em] sm:tracking-[0.2em] text-muted-foreground border border-border rounded-full px-3 py-1.5 max-w-full text-balance">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold)] animate-pulse shrink-0" />
            <span className="truncate">{data.heroEyebrow}</span>
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
              <Shield className="w-4 h-4 text-[var(--gold)]" /> SEBI RIA
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[var(--gold)]" /> 100% free
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
            GELD Wealth is a SEBI-registered investment advisory helping self-directed
            investors and traders make sharper, calmer decisions. We track every shift,
            decode every opportunity, and make sure your wealth is working in the right
            direction — across every asset class, not just equities.
          </p>
          <ul className="mt-6 space-y-3">
            {[
              "SEBI Registered Investment Advisor",
              "20+ years of markets experience",
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
                  {topicCount} clear topics, no pitches
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
          kicker="Topics covered"
          title={
            <>
              What we&apos;ll <span className="gold-text">cover.</span>
            </>
          }
          sub={intro}
        />
        <div className="mt-10 sm:mt-14 grid md:grid-cols-2 gap-4 sm:gap-6">
          {topics.map((it, index) => {
            const n = String(index + 1).padStart(2, "0");
            const Icon = TOPIC_ICONS[it.icon ?? ""] ?? LineChart;
            return (
              <article
                key={`${n}-${it.title}`}
                className="surface-card p-5 sm:p-7 md:p-8 hover:-translate-y-1 transition-transform"
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
                  Topic {index + 1}
                </div>
                <h3 className="mt-2 text-xl md:text-2xl font-semibold leading-snug">{it.title}</h3>
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
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Speaker({ speaker }: { speaker: LandingWebinarContent["speaker"] }) {
  return (
    <section className="py-14 sm:py-24 md:py-32 border-t border-border/60">
      <div id="speaker" className="container-x grid lg:grid-cols-[1fr_1.2fr] gap-10 lg:gap-14 items-center scroll-mt-24 md:scroll-mt-28">
        <div className="relative max-w-md mx-auto lg:max-w-none lg:mx-0 w-full">
          <div
            className="absolute -inset-4 sm:-inset-6 rounded-3xl opacity-30 blur-3xl"
            style={{ background: "var(--gradient-gold)" }}
          />
          <div className="relative surface-card overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={speaker.imageUrl}
              alt={speaker.imageAlt}
              width={900}
              height={1100}
              loading="lazy"
              className="w-full h-auto"
            />
          </div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-[var(--gold)]">
            {speaker.role || "Featured speaker"}
          </div>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight">
            Meet <span className="gold-text">{speaker.name}</span>
          </h2>
          {speaker.bio ? (
            <p className="mt-5 text-base sm:text-lg text-muted-foreground">{speaker.bio}</p>
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
          sub="Our managed stock portfolios have outperformed the index across every rolling 3-year window since inception."
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
              working in the right direction — across every asset class, not just equities.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Investments across 20–25 large & multicap stocks",
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
      r: "Long-term investor, Delhi",
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
      a: "Yes. The 60-minute masterclass is completely free — no credit card, no strings attached.",
    },
    {
      q: "Will I get a recording?",
      a: "Registrants get access to a limited-time recording. Attending live is strongly recommended for the Q&A.",
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
      q: "Is GELD a SEBI Registered Advisor?",
      a: "Yes. GELD is a SEBI Registered Investment Advisor. This webinar is educational and does not constitute investment advice.",
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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<RegisterFieldErrors>({});
  const [formError, setFormError] = useState("");
  const [ok, setOk] = useState(false);
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

      setOk(true);
      window.open(registerUrl, "_blank", "noopener,noreferrer");
    } catch {
      setFormError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="py-14 sm:py-24 md:py-32">
      <div className="container-x">
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
                the Zoom link along with a pre-read.
              </p>
              <div className="mt-6 sm:mt-8">
                <Countdown {...countdown} />
              </div>
            </div>

            <form onSubmit={onSubmit} className="surface-card p-5 sm:p-6 md:p-8" noValidate>
              {ok ? (
                <div className="text-center py-8">
                  <div
                    className="mx-auto w-14 h-14 rounded-full grid place-items-center"
                    style={{ background: "var(--gradient-gold)" }}
                  >
                    <CheckCircle2 className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <h3 className="mt-5 font-display text-2xl">You&apos;re in.</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Complete Zoom registration in the new tab to finish.
                  </p>
                </div>
              ) : (
                <>
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
                    placeholder="10-digit mobile number"
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
                </>
              )}
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
            SEBI Registered Investment Advisor. This webinar is for educational purposes only.
            Views expressed do not constitute investment advice. Securities market investments
            are subject to market risks.
          </p>
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">Explore</div>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <NavLink href="#learn" className="hover:text-[var(--gold)]">
                What you&apos;ll learn
              </NavLink>
            </li>
            <li>
              <NavLink href="#speaker" className="hover:text-[var(--gold)]">
                Speaker
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
