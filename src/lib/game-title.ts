const ENTITIES: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

/** Escapes text for use inside an HTML element. */
function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (c) => ENTITIES[c] ?? c);
}

const TITLE = /<title\b[^>]*>[\s\S]*?<\/title\s*>/i;
const HEAD = /<head\b[^>]*>/i;

/**
 * Sets a game document's <title>. The sample games draw their title screen from document.title,
 * so a community game built from a template shows its own name instead of the template's.
 * Replaces the first <title> element, or adds one at the start of <head> (or of the document).
 * The title is HTML-escaped; an empty title leaves the document unchanged.
 */
export function withDocumentTitle(html: string, title: string): string {
  const clean = title.trim();
  if (!clean) return html;
  const tag = `<title>${escapeHtml(clean)}</title>`;
  // Function replacers, so "$" in a title is never read as a replacement pattern.
  if (TITLE.test(html)) return html.replace(TITLE, () => tag);
  if (HEAD.test(html)) return html.replace(HEAD, (head) => `${head}${tag}`);
  return `${tag}${html}`;
}
