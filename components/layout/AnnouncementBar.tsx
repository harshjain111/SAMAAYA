"use client";

import { useEffect, useState } from "react";

const KEY = "samaaya-announcement-dismissed";

/**
 * Dismissible announcement bar (PRD §3.4). Remembers dismissal per message in
 * localStorage — a new announcement text re-shows the bar.
 */
export function AnnouncementBar({ text }: { text: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      setShow(localStorage.getItem(KEY) !== text);
    } catch {
      setShow(true);
    }
  }, [text]);

  if (!show) return null;

  function dismiss() {
    try {
      localStorage.setItem(KEY, text);
    } catch {
      /* ignore */
    }
    setShow(false);
  }

  return (
    <div className="relative bg-green-deep px-8 py-2 text-center text-xs font-medium text-cream">
      {text}
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss announcement"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-cream/70 hover:text-cream"
      >
        ×
      </button>
    </div>
  );
}
