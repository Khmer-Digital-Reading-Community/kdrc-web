import { onMounted, onUnmounted, type Ref } from 'vue';

export function useScrollReveal(
  target: Ref<HTMLElement | null | undefined>,
  options?: { threshold?: number; rootMargin?: string },
) {
  let observer: IntersectionObserver | null = null;

  onMounted(() => {
    const el = target.value;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      el.classList.add('reveal-visible');
      return;
    }

    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          el.classList.add('reveal-visible');
          observer?.disconnect();
        }
      },
      {
        threshold: options?.threshold ?? 0.12,
        rootMargin: options?.rootMargin ?? '0px 0px -40px 0px',
      },
    );
    observer.observe(el);
  });

  onUnmounted(() => observer?.disconnect());
}
