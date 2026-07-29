import Link from "next/link";
import type { Metadata } from "next";
import { CheckCircle2, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Thank you",
  description: "Thanks for showing interest in the GELD Wealth webinar.",
  robots: {
    index: false,
    follow: false,
  },
};

const LOGO_MARK_SRC = "/new_geld_g_logo.png";
const LOGO_WORDMARK_SRC = "/new_geld_eld_logo.png";

type ThankYouPageProps = {
  searchParams: Promise<{ topic?: string }>;
};

export default async function ThankYouPage({ searchParams }: ThankYouPageProps) {
  const params = await searchParams;
  const topic = params.topic?.trim() || "";

  return (
    <main
      style={{ background: "var(--gradient-hero)" }}
      className="min-h-screen flex flex-col"
    >
      <header className="border-b border-border/60">
        <div className="container-x py-4 flex items-center justify-between">
          <Link href="/" className="geld-logo" aria-label="GELD Wealth">
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
          </Link>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center py-16 sm:py-24 px-4">
        <div className="w-full max-w-lg text-center">
          <div
            className="mx-auto w-16 h-16 rounded-full grid place-items-center"
            style={{ background: "var(--gradient-gold)" }}
          >
            <CheckCircle2 className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="mt-8 font-display text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight">
            Thank you for your <span className="gold-text">interest.</span>
          </h1>
          {topic ? (
            <p className="mt-5 text-base sm:text-lg text-muted-foreground">
              We received your interest in{" "}
              <span className="text-[var(--gold)] font-medium">{topic}</span>.
              Our team will get in touch shortly.
            </p>
          ) : (
            <p className="mt-5 text-base sm:text-lg text-muted-foreground">
              We received your details. Our team will get in touch shortly with
              next steps.
            </p>
          )}
          <div className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
            <Link href="/#learn" className="btn-gold w-full sm:w-auto">
              Explore more webinars <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/" className="btn-ghost w-full sm:w-auto">
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
