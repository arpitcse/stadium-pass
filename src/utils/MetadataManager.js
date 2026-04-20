/**
 * @file MetadataManager.js
 * @description Dynamic SEO & Social Metadata Handler.
 * Standards: WCAG AAA, OpenGraph, Twitter Cards.
 */

const DEFAULT_TITLE = "FlowPass | AI Stadium Navigation";
const DEFAULT_DESC = "Elevate your stadium experience with AI-powered crowd analysis and navigation.";

export const MetadataManager = {
  /**
   * Updates page-level metadata dynamically.
   */
  update: ({ title, description, image }) => {
    // 1. Update Document Title
    document.title = title ? `${title} | FlowPass` : DEFAULT_TITLE;

    // 2. Update Meta Tags
    const updateMeta = (selector, content) => {
      let element = document.querySelector(selector);
      if (element) {
        element.setAttribute('content', content || DEFAULT_DESC);
      }
    };

    updateMeta('meta[name="description"]', description);
    updateMeta('meta[property="og:title"]', title || DEFAULT_TITLE);
    updateMeta('meta[property="og:description"]', description);
    if (image) updateMeta('meta[property="og:image"]', image);
    
    // 3. Twitter Specifics
    updateMeta('meta[name="twitter:title"]', title || DEFAULT_TITLE);
    updateMeta('meta[name="twitter:description"]', description);
  }
};
