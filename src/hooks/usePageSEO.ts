import { useEffect } from 'react';

// Previously every page shared the exact same <title> and meta description
// (only set once in index.html), so Google saw identical titles for Home,
// Services, Portfolio, Contact, etc. — a real SEO penalty, since search
// engines rank pages partly on how distinct and relevant their title/description
// are to what's actually on that page. This hook sets a distinct one per page
// without adding a new dependency (react-helmet-async) for a single-purpose need.
export function usePageSEO(title: string, description: string) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;

    const descTag = document.querySelector('meta[name="description"]');
    const previousDescription = descTag?.getAttribute('content') || '';
    if (descTag) descTag.setAttribute('content', description);

    const ogTitleTag = document.querySelector('meta[property="og:title"]');
    const previousOgTitle = ogTitleTag?.getAttribute('content') || '';
    if (ogTitleTag) ogTitleTag.setAttribute('content', title);

    const ogDescTag = document.querySelector('meta[property="og:description"]');
    const previousOgDesc = ogDescTag?.getAttribute('content') || '';
    if (ogDescTag) ogDescTag.setAttribute('content', description);

    return () => {
      // Restore on unmount so a fast route change never leaves a stale title
      // flashing before the next page's usePageSEO call runs.
      document.title = previousTitle;
      if (descTag) descTag.setAttribute('content', previousDescription);
      if (ogTitleTag) ogTitleTag.setAttribute('content', previousOgTitle);
      if (ogDescTag) ogDescTag.setAttribute('content', previousOgDesc);
    };
  }, [title, description]);
}
