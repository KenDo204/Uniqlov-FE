/**
 * Helper utilities for standardizing URLs across the application.
 */

/**
 * Generates a clean URL slug from a string (e.g. "Áo Thun Basic" -> "ao-thun-basic")
 */
export const generateSlug = (text: string): string => {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD') // Normalize diacritics
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric characters with hyphens
    .replace(/(^-|-$)+/g, ''); // Remove leading and trailing hyphens
};

/**
 * Builds the URL for filtering by Category.
 * Format: /products?categoryCode={categoryCode}
 */
export const buildCategoryUrl = (categoryCode: string): string => {
  return `/products?categoryCode=${encodeURIComponent(categoryCode)}`;
};

/**
 * Builds the URL for searching products.
 * Format: /products?q={query}
 */
export const buildSearchUrl = (query: string): string => {
  const trimmed = query.trim();
  if (!trimmed) return '/products';
  return `/products?q=${encodeURIComponent(trimmed)}`;
};

/**
 * Builds the URL for filtering by Collection.
 * Format: /products?collection={collectionCode}
 */
export const buildCollectionUrl = (collectionCode: string): string => {
  return `/products?collection=${encodeURIComponent(collectionCode)}`;
};

/**
 * Builds the URL for mega menu navigation.
 * Handles targetGender mapping for specific parent categories.
 */
export const buildMegaMenuUrl = (parent: any, child: any): string => {
  let url = `/products`;
  if (!parent) return url;

  const pName = parent.categoryName?.toLowerCase() || '';

  if (pName.includes('nữ') || pName.includes('women')) {
    url += `?targetGender=0`;
  } else if (pName.includes('nam') || pName.includes('men')) {
    url += `?targetGender=1`;
  } else {
    url += `?`;
  }

  if (child && child.categoryCode) {
    url += url.includes('?') && !url.endsWith('?') 
      ? `&categoryCode=${child.categoryCode}` 
      : `categoryCode=${child.categoryCode}`;
  }

  return url.endsWith('?') ? url.slice(0, -1) : url;
};
