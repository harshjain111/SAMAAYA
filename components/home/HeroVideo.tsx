"use client";

import { useEffect, useRef } from "react";

/**
 * Hero background video with reliable mobile autoplay.
 * iOS/Android only autoplay when the video is muted + playsinline AND the muted
 * property is actually set on the element (React doesn't always reflect the
 * `muted` JSX attribute to the DOM), so we force it via a ref and call play()
 * on mount, on canplay, and when the tab becomes visible.
 */
export function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    v.defaultMuted = true;

    const tryPlay = () => {
      const p = v.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    };

    tryPlay();
    v.addEventListener("canplay", tryPlay, { once: true });
    v.addEventListener("loadeddata", tryPlay, { once: true });

    const onVisible = () => {
      if (!document.hidden) tryPlay();
    };
    document.addEventListener("visibilitychange", onVisible);
    // last-resort: kick playback on the first touch/scroll if the browser blocked it
    const onInteract = () => tryPlay();
    window.addEventListener("touchstart", onInteract, { once: true, passive: true });

    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("touchstart", onInteract);
    };
  }, []);

  return (
    <video
      ref={ref}
      className="absolute inset-0 -z-20 h-full w-full object-cover"
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      poster="/hero/hero.png"
      controls={false}
      disablePictureInPicture
      webkit-playsinline="true"
      x5-playsinline="true"
    >
      <source src="/hero/hero.mp4" type="video/mp4" />
    </video>
  );
}
