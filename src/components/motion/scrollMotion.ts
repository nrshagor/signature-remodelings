import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

/*
 * GSAP scroll motion, loaded on demand by MotionEngine (never in the first-load bundle).
 * Breakpoints and reduced motion via gsap.matchMedia(): when a condition changes, or the
 * page changes, everything here is reverted and the markup is exactly as rendered.
 */

/** Section headings: lines masked, words rise in when the heading enters (≥ 768px). */
function splitHeadings(root: HTMLElement): () => void {
  const splits: SplitText[] = [];
  const fold = window.innerHeight * 0.92;
  gsap.utils.toArray<HTMLElement>("[data-split]", root).forEach((el) => {
    // Already on screen (or scrolled past) when we start: leave it, never flicker.
    if (el.getBoundingClientRect().top < fold) return;
    const split = SplitText.create(el, {
      type: "lines,words",
      mask: "lines",
      autoSplit: true,
      onSplit: (self) =>
        gsap.from(self.words, {
          yPercent: 110,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.05,
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
          // Back to the plain heading once it is in place (no masks left to clip
          // descenders, nothing left to re-split on resize).
          onComplete: () => split.revert(),
        }),
    });
    splits.push(split);
  });
  return () => splits.forEach((split) => split.revert());
}

/** Hero photo moves at about 30% of the scroll speed (≥ 1024px). */
function parallax(root: HTMLElement) {
  gsap.utils.toArray<HTMLElement>("[data-parallax]", root).forEach((el) => {
    gsap.to(el, {
      yPercent: 30,
      ease: "none",
      scrollTrigger: {
        trigger: el.parentElement ?? el,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
  });
}

/** Project gallery: the row is pinned and scrolls sideways (≥ 1024px). */
function pinGalleries(root: HTMLElement): () => void {
  const wraps = gsap.utils.toArray<HTMLElement>("[data-pin-gallery]", root);
  wraps.forEach((wrap) => {
    const track = wrap.firstElementChild as HTMLElement | null;
    if (!track) return;
    // Switches the CSS from grid to a single row (ProjectGallery.module.css).
    wrap.setAttribute("data-pinned", "");
    const distance = () => Math.max(0, track.scrollWidth - wrap.clientWidth);
    if (distance() === 0) {
      wrap.removeAttribute("data-pinned");
      return;
    }
    gsap.to(track, {
      x: () => -distance(),
      ease: "none",
      scrollTrigger: {
        trigger: wrap,
        start: "center center",
        end: () => `+=${distance()}`,
        pin: true,
        scrub: 0.5,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });
  });
  return () => wraps.forEach((wrap) => wrap.removeAttribute("data-pinned"));
}

export function startScrollMotion(root: HTMLElement): () => void {
  const mm = gsap.matchMedia();
  mm.add(
    {
      split: "(min-width: 768px)",
      desktop: "(min-width: 1024px)",
      motion: "(prefers-reduced-motion: no-preference)",
    },
    (context) => {
      const { split, desktop, motion } = context.conditions ?? {};
      if (!motion) return;
      const cleanups: Array<() => void> = [];
      // Pin first: it changes the page height, which the heading triggers depend on.
      if (desktop) {
        cleanups.push(pinGalleries(root));
        parallax(root);
      }
      if (split) cleanups.push(splitHeadings(root));
      ScrollTrigger.refresh();
      return () => cleanups.forEach((cleanup) => cleanup());
    },
  );
  return () => mm.revert();
}
