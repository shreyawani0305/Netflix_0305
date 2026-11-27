import React, { useEffect, useRef } from 'react';
import './WalkthroughPointer.css';

const ARROW_PATHS = {
  down: 'M18 5v25m-9-9 9 9 9-9',
  left: 'M30 18H6m9-9-9 9 9 9',
  right: 'M6 18h24m-9-9 9 9-9 9',
  up: 'M18 31V6m-9 9 9-9 9 9',
};

export default function WalkthroughPointer({ step }) {
  const pointerRef = useRef(null);

  useEffect(() => {
    if (!step || step.hidden || !step.target) return undefined;

    let animationFrame = 0;
    let hasScrolled = false;
    let targetObserver;
    let resizeObserver;

    const positionPointer = () => {
      const target = document.querySelector(step.target);
      const pointer = pointerRef.current;
      if (!target || !pointer) return false;

      if (!hasScrolled) {
        const scrollTarget = step.scrollTarget ? document.querySelector(step.scrollTarget) || target : target;
        scrollTarget.scrollIntoView({ behavior: 'smooth', block: step.scrollBlock || 'center' });
        hasScrolled = true;
      }

      const targetRect = target.getBoundingClientRect();
      const pointerSize = 36;
      const gap = 10;
      const viewportPadding = 12;
      const appRoot = document.querySelector('.netflix-app-root');
      const navHeight = Number.parseFloat(appRoot ? getComputedStyle(appRoot).getPropertyValue('--nav-height') : '') || 0;
      const topInset = Math.max(viewportPadding, navHeight + 12);
      let direction;
      let left;
      let top;

      if (targetRect.top - pointerSize - gap >= topInset) {
        direction = 'down';
        left = targetRect.left + targetRect.width / 2 - pointerSize / 2;
        top = targetRect.top - pointerSize - gap;
      } else if (targetRect.left >= pointerSize + gap + viewportPadding) {
        direction = 'right';
        left = targetRect.left - pointerSize - gap;
        top = targetRect.top + targetRect.height / 2 - pointerSize / 2;
      } else if (window.innerWidth - targetRect.right >= pointerSize + gap + viewportPadding) {
        direction = 'left';
        left = targetRect.right + gap;
        top = targetRect.top + targetRect.height / 2 - pointerSize / 2;
      } else {
        direction = 'up';
        left = targetRect.left + targetRect.width / 2 - pointerSize / 2;
        top = targetRect.bottom + gap;
      }

      left = Math.max(viewportPadding, Math.min(left, window.innerWidth - pointerSize - viewportPadding));
      top = Math.max(topInset, Math.min(top, window.innerHeight - pointerSize - viewportPadding));
      pointer.style.left = `${Math.round(left)}px`;
      pointer.style.top = `${Math.round(top)}px`;
      pointer.dataset.direction = direction;
      pointer.querySelector('.pointer-arrow-shadow')?.setAttribute('d', ARROW_PATHS[direction]);
      pointer.querySelector('.pointer-arrow-line')?.setAttribute('d', ARROW_PATHS[direction]);
      pointer.style.opacity = '1';
      resizeObserver.observe(target);
      return true;
    };

    const schedulePosition = () => {
      if (animationFrame) return;
      animationFrame = requestAnimationFrame(() => {
        animationFrame = 0;
        positionPointer();
      });
    };
    const findTarget = () => {
      if (!document.querySelector(step.target)) return;
      targetObserver.disconnect();
      positionPointer();
    };

    resizeObserver = new ResizeObserver(schedulePosition);
    targetObserver = new MutationObserver(findTarget);
    targetObserver.observe(document.body, { childList: true, subtree: true });
    if (pointerRef.current) resizeObserver.observe(pointerRef.current);
    findTarget();
    window.addEventListener('resize', schedulePosition);
    window.addEventListener('scroll', schedulePosition, true);

    return () => {
      cancelAnimationFrame(animationFrame);
      targetObserver.disconnect();
      window.removeEventListener('resize', schedulePosition);
      window.removeEventListener('scroll', schedulePosition, true);
      resizeObserver.disconnect();
    };
  }, [step]);

  useEffect(() => {
    if (!step || step.hidden || !step.action || !step.actionTarget) return undefined;

    const handleAction = (event) => {
      if (!event.isTrusted || event.type !== step.action) return;
      const eventTarget = event.target instanceof Element ? event.target.closest(step.actionTarget) : null;
      if (!eventTarget || !document.querySelector(step.target)?.contains(eventTarget)) return;

      window.parent.postMessage({
        type: 'netflix-walkthrough-action',
        stepId: step.id,
      }, window.location.origin);
    };

    document.addEventListener('change', handleAction, true);
    document.addEventListener('click', handleAction, true);
    return () => {
      document.removeEventListener('change', handleAction, true);
      document.removeEventListener('click', handleAction, true);
    };
  }, [step]);

  if (!step || step.hidden || !step.target) return null;

  return (
    <div
      key={step.id}
      ref={pointerRef}
      className="walkthrough-pointer"
      data-direction="down"
      aria-hidden="true"
      style={{ left: '0px', top: '0px', opacity: 0 }}
    >
      <svg viewBox="0 0 36 36">
        <path className="pointer-arrow-shadow" d={ARROW_PATHS.down} />
        <path className="pointer-arrow-line" d={ARROW_PATHS.down} />
      </svg>
    </div>
  );
}
