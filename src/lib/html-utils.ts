/**
 * Decodes HTML entities in text
 * @param text Text that may contain HTML entities
 * @returns Decoded text
 */
export function decodeHtmlEntities(text: string): string {
  if (typeof document !== 'undefined') {
    // Client-side: use DOM API
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
  } else {
    // Server-side: manual replacement for common entities
    const entityMap: Record<string, string> = {
      '&#8230;': '…',     // horizontal ellipsis
      '&#8217;': '\u2019', // right single quotation mark
      '&#8216;': '\u2018', // left single quotation mark
      '&#8220;': '\u201C', // left double quotation mark
      '&#8221;': '\u201D', // right double quotation mark
      '&#8211;': '\u2013', // en dash
      '&#8212;': '\u2014', // em dash
      '&#8482;': '\u2122', // trademark
      '&#8594;': '\u2192', // rightwards arrow
      '&#8592;': '\u2190', // leftwards arrow
      '&#8593;': '\u2191', // upwards arrow
      '&#8595;': '\u2193', // downwards arrow
      '&quot;': '"',      // quotation mark
      '&apos;': "'",      // apostrophe
      '&lt;': '<',        // less than
      '&gt;': '>',        // greater than
      '&amp;': '&',       // ampersand (must be last)
    };

    let decoded = text;
    for (const [entity, replacement] of Object.entries(entityMap)) {
      decoded = decoded.replace(new RegExp(entity, 'g'), replacement);
    }

    return decoded;
  }
}