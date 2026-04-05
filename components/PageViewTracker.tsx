"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { pageview } from "@/lib/gtag";

export default function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined" || !pathname) {
      return;
    }

    const query = window.location.search;
    const url = `${window.location.origin}${pathname}${query}`;
    pageview(url);
  }, [pathname]);

  return null;
}
