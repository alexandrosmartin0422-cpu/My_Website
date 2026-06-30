"use client";

import { Fragment, useEffect, useRef, useState } from "react";

type TextRevealProps = {
  /** The text to reveal. Split into words, each rising in sequence. */
  text: string;
  /** Element to render (h1, h2, span...). Defaults to span. */
  as?: keyof JSX.IntrinsicElements;
  className?: string;
  /** ms between each word. */
  stagger?: number;
  /** ms before the whole reveal starts. */
  delay?: number;
};

// Reveals a heading word-by-word: each word rises up and fades in on a stagger.
// Triggers when scrolled into view (or immediately if already visible on load);
// honors prefers-reduced-motion. Each word forces `color: inherit` so it always
// takes the heading's text color and is never left invisible/transparent.
export default function TextReveal({
  text,
  as = "span",
  className = "",
  stagger = 90,
  delay = 0,
}: TextRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) {
      setReduced(true);
      setShown(true);
      return;
    }

    // Already in view on load (page-top headers) -> reveal next frame.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      const raf = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(raf);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShown(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -5% 0px" }
    );
    observer.observe(el);

    // Safety net: never leave the text invisible if the observer misfires.
    const fallback = setTimeout(() => setShown(true), 1200);

    return () => {
      observer.disconnect();
      clearTimeout(fallback);
    };
  }, []);

  const Tag = as as React.ElementType;
  const words = text.split(" ");

  return (
    <Tag ref={ref} className={className}>
      {words.map((word, i) => (
        <Fragment key={i}>
          {/* Outer span clips the rising word; inner span does the transform. */}
          <span
            className="inline-block overflow-hidden align-bottom"
            style={{ paddingBottom: "0.12em" }}
          >
            <span
              className="inline-block"
              style={{
                // Always inherit the heading's color so the word is never invisible.
                color: "inherit",
                WebkitTextFillColor: "currentColor",
                ...(reduced
                  ? {}
                  : {
                      transform: shown ? "translateY(0)" : "translateY(110%)",
                      opacity: shown ? 1 : 0,
                      transition:
                        "transform 700ms cubic-bezier(0.22,1,0.36,1), opacity 700ms ease-out",
                      transitionDelay: `${delay + i * stagger}ms`,
                      willChange: "transform, opacity",
                    }),
              }}
            >
              {word}
            </span>
          </span>
          {/* the space lives OUTSIDE the clip span so words keep their gaps */}
          {i < words.length - 1 ? " " : ""}
        </Fragment>
      ))}
    </Tag>
  );
}
