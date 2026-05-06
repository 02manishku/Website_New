'use client';

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
    // Emit non-space chars as inline-block <span>, but leave actual
    // spaces as raw text nodes. Two reasons:
    //   1. Browsers can still break long headings at word boundaries
    //      (NBSP between every word forces unbreakable layout, which
    //      kills wrap behaviour for things like "Built in stone.
    //      Guaranteed for 25 years.").
    //   2. The animation targets .scroll-float-char elements; spaces
    //      don't need to wiggle, they sit between letters as plain text.
    const out: ReactNode[] = [];
    String(node)
      .split('')
      .forEach((ch, i) => {
        if (ch === ' ') {
          out.push(' ');
        } else {
          out.push(
            <span className="scroll-float-char" key={`${keyPrefix}-${i}`}>
              {ch}
            </span>
          );
        }
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
  ease = 'back.inOut(2)',
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
          scrub: true
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
