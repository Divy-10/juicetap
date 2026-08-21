/* ================================================================
   JUICETAP — Internal Page Shell

   Every route EXCEPT Home renders inside this wrapper. It does three
   jobs:

   1. Provides the `.jt-page` scope. All of the upgraded visual and
      motion styling lives under that class, which is why none of it
      can ever reach the (approved, frozen) Home page.
   2. Supplies a per-page modifier (`.jt-page--about`, etc.) so each
      page can have its own storytelling accent while sharing one
      design system.
   3. Applies `MotionConfig reducedMotion="user"`, which makes every
      Framer Motion element inside — including one-off inline ones —
      honour `prefers-reduced-motion` automatically. Framer drops
      transform/layout animation but keeps opacity, so a reduced-motion
      visitor gets a calm fade rather than a blank page. Because this
      sits inside the shell and not at the app root, the Home page's
      existing motion behaviour is untouched.
   ================================================================ */

import { MotionConfig } from 'framer-motion';

export default function PageShell({ name, children, className = '' }) {
  return (
    <MotionConfig reducedMotion="user">
      <div className={`jt-page jt-page--${name} ${className}`.trim()}>{children}</div>
    </MotionConfig>
  );
}
