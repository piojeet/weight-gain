"use client";

import { useEffect } from "react";

const relatedSlugs: Record<string, string> = {
  "Top 10 High Protein Foods You Should Eat Daily": "top-10-high-protein-foods-you-should-eat-daily",
  "5 Simple Habits for a Healthier Lifestyle": "5-simple-habits-for-a-healthier-lifestyle",
  "The Importance of Sleep for Muscle Growth": "importance-of-sleep-for-muscle-growth",
};

export default function RelatedArticleRouter() {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const link = target.closest<HTMLAnchorElement>('a[href="/blog"]');
      if (!link) return;
      const title = Object.keys(relatedSlugs).find((item) => link.textContent?.includes(item));
      if (!title) return;
      event.preventDefault();
      window.location.assign(`/blog/${relatedSlugs[title]}`);
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}
