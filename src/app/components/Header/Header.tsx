"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Header.module.css";

const LOGO_MARK_SRC = "/new_geld_g_logo.png";
const LOGO_WORDMARK_SRC = "/new_geld_eld_logo.png";

const NAV = [
  { label: "About", href: "#about", id: "about" },
  { label: "Webinars", href: "#learn", id: "learn" },
  { label: "Speakers", href: "#speaker", id: "speaker" },
  { label: "Performance", href: "#performance", id: "performance" },
  { label: "FAQ", href: "#faq", id: "faq" },
] as const;

function getHeaderOffset(): number {
  if (typeof document === "undefined") return 104;
  const bar = document.querySelector<HTMLElement>("[data-header-bar]");
  return (bar?.offsetHeight ?? 72) + 40;
}

function scrollToHash(hash: string) {
  const id = hash.replace(/^#/, "");
  if (!id) return;
  const el = document.getElementById(id);
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.pageYOffset - getHeaderOffset();
  window.scrollTo({ top: Math.max(0, y), behavior: "smooth" });
}

export default function Header({ registerUrl }: { registerUrl: string }) {
  const [showHeader, setShowHeader] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("about");
  const lastScrollY = useRef(0);

  useEffect(() => {
    lastScrollY.current = window.scrollY;
    setShowHeader(window.scrollY < 50);

    const handleScroll = () => {
      const current = window.scrollY;
      if (current < 50) {
        setShowHeader(true);
      } else if (current > lastScrollY.current) {
        if (!isMobileMenuOpen) setShowHeader(false);
      } else if (current < lastScrollY.current - 5) {
        setShowHeader(true);
      }
      lastScrollY.current = current;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1240) setIsMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const ids = NAV.map((n) => n.id);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-35% 0px -45% 0px", threshold: 0.1 }
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  function goTo(hash: string) {
    setIsMobileMenuOpen(false);
    window.setTimeout(() => {
      scrollToHash(hash);
      history.replaceState(null, "", hash);
    }, 50);
  }

  return (
    <div className={styles.headerShell}>
      <header
        data-site-header
        data-header-bar
        className={`${styles.header} ${showHeader ? "" : styles.headerHidden}`}
      >
        <a
          href="#top"
          className={styles.logoLink}
          aria-label="GELD Wealth"
          onClick={(e) => {
            e.preventDefault();
            setIsMobileMenuOpen(false);
            window.scrollTo({ top: 0, behavior: "smooth" });
            history.replaceState(null, "", "#top");
          }}
        >
          <div className={styles.logoWrapper}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={LOGO_MARK_SRC}
              alt=""
              width={45}
              height={45}
              className={styles.logoG}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={LOGO_WORDMARK_SRC}
              alt="GELD Wealth"
              width={140}
              height={38}
              className={styles.logoText}
            />
          </div>
        </a>

        <nav className={styles.nav} aria-label="Primary">
          {NAV.map((item) => (
            <button
              key={item.href}
              type="button"
              className={`${styles.navLink} ${
                activeSection === item.id ? styles.activeNavLink : ""
              }`}
              onClick={() => goTo(item.href)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className={styles.headerActions}>
          <a
            href={registerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.contactBtn}
          >
            Reserve your seat
          </a>

          <button
            type="button"
            className={`${styles.hamburgerBtn} ${
              isMobileMenuOpen ? styles.hamburgerActive : ""
            }`}
            onClick={() => setIsMobileMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            <span className={styles.hamburgerLine} />
            <span className={styles.hamburgerLine} />
            <span className={styles.hamburgerLine} />
          </button>
        </div>

        <div
          className={`${styles.mobileMenu} ${
            isMobileMenuOpen ? styles.mobileMenuOpen : ""
          }`}
        >
          <nav className={styles.mobileNavLinks} aria-label="Mobile">
            {NAV.map((item) => (
              <button
                key={item.href}
                type="button"
                className={`${styles.mobileNavLink} ${
                  activeSection === item.id ? styles.activeNavLink : ""
                }`}
                onClick={() => goTo(item.href)}
              >
                {item.label}
              </button>
            ))}
            <a
              href={registerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.mobileNavLink} ${styles.mobileContactLink}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Reserve your seat
            </a>
          </nav>
        </div>
      </header>
    </div>
  );
}

export { getHeaderOffset, scrollToHash };
