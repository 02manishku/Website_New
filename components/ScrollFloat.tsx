'use client';

// audited 2026-05-09 — H-01: tween.scrollTrigger?.kill() + tween.kill() in
// useEffect cleanup, prefers-reduced-motion bypass, ScrollTrigger
// auto-refreshes on resize. Animates only opacity + transform.

import {
  Children,
  Fragment,
  cloneElement,
  isValidElement,
  useEffect,
  useMemo,
  useRef,
  type ElementType,
  type ReactElement,
  type ReactNode,
  type RefObject
} from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

type ScrollFloatProps = {
  children: ReactNode;
  // Default to h2 (matches the original React Bits source) but every site
  // heading I'm wrapping is also h2 today, so the rendered tag is unchanged.
  // Pass `as="h3"` etc. only for headings that need a different level.
  as?: ElementType;
  containerClassName?: string;
  textClassName?: string;
  scrollContainerRef?: RefObject<HTMLElement>;
  animationDuration?: number;
  ease?: string;
  scrollStart?: string;
  scrollEnd?: string;
  stagger?: number;
};

// Recursively split text-bearing leaves of the children tree into one
// `<span>` per character, while preserving any structural elements
// (italic spans, line breaks, coloured words) in place. Means a heading
// like `Most Unexpected <em>Innovation.</em>` keeps the italic styling
// on the second word AND animates char-by-char.
function splitNodes(node: ReactNode, keyPrefix = 'r'): ReactNode {
  if (node === null || node === undefined || typeof node === 'boolean') {
    return node;
  }
  if (typeof node === 'string' || typeof node === 'number') {
    // Two-level wrap so headings break at WORD boundaries, not letter
    // boundaries. Each word becomes an inline-block .scroll-float-word
    // with white-space: nowrap, so its inner inline-block chars can't
    // get separated mid-word; spaces between words remain raw text
    // nodes, the only valid break points the browser finds.
    //
    // Without this, "kitchen" mid-line becomes "kitch | en" because
    // the browser sees seven inline-block boxes and breaks wherever
    // it likes. With it, "kitchen" is one box → either fits on the
    // current line or wraps to the next as a unit.
    const out: ReactNode[] = [];
    const segments = String(node).split(/(\s+)/);
    segments.forEach((seg, segIdx) => {
      if (seg === '') return;
      if (/^\s+$/.test(seg)) {
        // Whitespace run, emit raw so the line break can happen here.
        out.push(seg);
        return;
      }
      out.push(
        <span
          className="scroll-float-word"
          key={`${keyPrefix}-w${segIdx}`}
        >
          {seg.split('').map((ch, charIdx) => (
            <span
              className="scroll-float-char"
              key={`${keyPrefix}-w${segIdx}-c${charIdx}`}
            >
              {ch}
            </span>
          ))}
        </span>
      );
    });
    return out;
  }
  if (Array.isArray(node)) {
    return node.map((child, i) => (
      <Fragment key={`${keyPrefix}-${i}`}>
        {splitNodes(child, `${keyPrefix}-${i}`)}
      </Fragment>
    ));
  }
  if (isValidElement(node)) {
    const el = node as ReactElement<{ children?: ReactNode }>;
    const childChildren = el.props?.children;
    // Void elements like <br/> or <img/> have no children; leave them.
    if (childChildren === undefined) return el;
    return cloneElement(el, {
      children: splitNodes(childChildren, `${keyPrefix}-c`)
    });
  }
  return node;
}

export default function ScrollFloat({
  children,
  as: Tag = 'h2',
  containerClassName = '',
  textClassName = '',
  scrollContainerRef,
  animationDuration = 1,
  // Smoother default ease — power3.out is glassy where back.inOut
  // overshoots / bounces. Combined with the numeric scrub below it
  // gives the buttery feel where chars catch up to scroll without
  // jitter or visible "bounce" snap.
  ease = 'power3.out',
  scrollStart = 'center bottom+=50%',
  scrollEnd = 'bottom bottom-=40%',
  stagger = 0.03
}: ScrollFloatProps) {
  const containerRef = useRef<HTMLElement>(null);

  // useMemo, the split tree is expensive enough on long headings that we
  // don't want to redo it on every parent re-render.
  const splitContent = useMemo(() => splitNodes(children), [children]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const scroller = scrollContainerRef?.current ?? window;
    const charElements = el.querySelectorAll<HTMLElement>('.scroll-float-char');
    if (charElements.length === 0) return;

    // Honour `prefers-reduced-motion`. ScrollTrigger animations can feel
    // motion-sicky for sensitive users; in that case we leave the chars
    // in their final state with no scrub.
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReduced) {
      gsap.set(charElements, { opacity: 1, yPercent: 0, scaleX: 1, scaleY: 1 });
      return;
    }

    const tween = gsap.fromTo(
      charElements,
      {
        willChange: 'opacity, transform',
        opacity: 0,
        yPercent: 120,
        scaleY: 2.3,
        scaleX: 0.7,
        transformOrigin: '50% 0%'
      },
      {
        duration: animationDuration,
        ease,
        opacity: 1,
        yPercent: 0,
        scaleY: 1,
        scaleX: 1,
        stagger,
        scrollTrigger: {
          trigger: el,
          scroller,
          start: scrollStart,
          end: scrollEnd,
          // Numeric scrub gives the chars catch-up inertia. Tuning:
          //
          //   scrub: 1.5 (old) — chars lag 1.5s behind scroll. Looked
          //     buttery on slow scroll but felt "stuck" on direction
          //     reversal: a fast flick down + flick up left the chars
          //     mid-flight, replaying the half-finished forward
          //     animation in reverse over the same 1.5s window.
          //   scrub: 0.5 (now) — chars catch up within half a second.
          //     Still smooth at slow speed, but on a fast direction
          //     reverse the chars settle quickly into the new
          //     direction's state, eliminating the perceived freeze.
          //
          // fastScrollEnd: true tells ScrollTrigger to abort any
          // in-flight tween when the scroll velocity exceeds the
          // default threshold — so a flick past the trigger zone
          // jumps the animation straight to its end state instead
          // of dragging through every frame.
          //
          // preventOverlaps: 'scroll-float' lets every other
          // ScrollFloat on the page kill this one's tween if they
          // become active during a fast scroll. Prevents the
          // "five headings all half-animated at once" thrash when
          // someone flicks through five sections in one swipe.
          scrub: 0.5,
          fastScrollEnd: true,
          preventOverlaps: 'scroll-float'
        }
      }
    );

    return () => {
      // Tear down scroll-bound listeners on unmount / route change.
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [
    splitContent,
    scrollContainerRef,
    animationDuration,
    ease,
    scrollStart,
    scrollEnd,
    stagger
  ]);

  // The `as` prop drives the underlying tag. Ref typing is loose because
  // ElementType could be any tag; the real DOM node is always an HTMLElement.
  const Component = Tag as unknown as 'h2';

  return (
    <Component
      ref={containerRef as RefObject<HTMLHeadingElement> as never}
      className={`scroll-float ${containerClassName}`}
    >
      <span className={`scroll-float-text ${textClassName}`}>
        {splitContent}
      </span>
    </Component>
  );
}
