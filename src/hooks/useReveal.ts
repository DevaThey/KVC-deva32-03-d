import { useEffect, useState, useRef } from 'react';

const REVEAL_SELECTOR = '.reveal:not(.is-visible)';

function makeRevealObserver(): IntersectionObserver {
  return new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          const delay = el.dataset.revealDelay;
          if (delay) el.style.transitionDelay = `${delay}ms`;
          el.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
  );
}

/**
 * Adds `is-visible` to any element with the `reveal` class when it enters
 * the viewport. Uses a MutationObserver to detect elements added after
 * async data loads — this is what makes the Student Portal render correctly,
 * since its sections fetch data from Supabase and mount their `.reveal`
 * elements after the parent has already rendered.
 */
export function useReveal() {
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR).forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const io = makeRevealObserver();

    const scan = () => {
      const els = document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR);
      els.forEach((el) => {
        if (!el.classList.contains('is-visible')) io.observe(el);
      });
    };

    scan();

    // Watch for elements added after async data loads.
    const mo = new MutationObserver(() => scan());
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);
}

/** Tracks whether the page has been scrolled past `threshold` pixels (rAF-throttled). */
export function useScrolled(threshold = 16) {
  const [scrolled, setScrolled] = useState(false);
  const ticking = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > threshold);
        ticking.current = false;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return scrolled;
}

/** Smooth-scrolls to a selector. */
export function scrollTo(href: string) {
  const el = document.querySelector(href);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
