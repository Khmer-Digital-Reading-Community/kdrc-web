/**
 * Lightweight TipTap JSON ↔ HTML / plain-text helpers.
 *
 * TipTap stores content as a JSON object shaped like:
 *   { type: 'doc', content: [ { type: 'paragraph', content: [...] }, ... ] }
 *
 * We serialise that to a JSON string before persisting.
 * These helpers render it back to HTML for display, or extract plain text
 * for card descriptions and search excerpts.
 */

// ── Internal recursive renderers ─────────────────────────────────────────────

function applyMarks(text: string, marks: any[] = []): string {
  return marks.reduce((acc, mark) => {
    switch (mark.type) {
      case 'bold':      return `<strong>${acc}</strong>`;
      case 'italic':    return `<em>${acc}</em>`;
      case 'strike':    return `<s>${acc}</s>`;
      case 'code':      return `<code>${acc}</code>`;
      case 'link':      return `<a href="${mark.attrs?.href ?? ''}" target="_blank" rel="noopener">${acc}</a>`;
      case 'textStyle': {
        const color = mark.attrs?.color;
        return color ? `<span style="color:${color}">${acc}</span>` : acc;
      }
      case 'highlight': {
        const bg = mark.attrs?.color;
        return `<mark${bg ? ` style="background:${bg}"` : ''}>${acc}</mark>`;
      }
      default: return acc;
    }
  }, text);
}

function nodeToHtml(node: any): string {
  if (!node) return '';
  const children = () => (node.content ?? []).map(nodeToHtml).join('');

  switch (node.type) {
    case 'doc':         return children();
    case 'paragraph': {
      const align = node.attrs?.textAlign;
      const style = align && align !== 'left' ? ` style="text-align:${align}"` : '';
      return `<p${style}>${children() || '<br>'}</p>`;
    }
    case 'heading': {
      const l = node.attrs?.level ?? 1;
      return `<h${l}>${children()}</h${l}>`;
    }
    case 'bulletList':  return `<ul>${children()}</ul>`;
    case 'orderedList': return `<ol>${children()}</ol>`;
    case 'listItem':    return `<li>${children()}</li>`;
    case 'blockquote':  return `<blockquote>${children()}</blockquote>`;
    case 'codeBlock':   return `<pre><code>${children()}</code></pre>`;
    case 'table':       return `<div class="table-wrapper"><table><tbody>${children()}</tbody></table></div>`;
    case 'tableRow':    return `<tr>${children()}</tr>`;
    case 'tableCell':   return `<td>${children()}</td>`;
    case 'tableHeader': return `<th>${children()}</th>`;
    case 'hardBreak':   return '<br>';
    case 'horizontalRule': return '<hr>';
    case 'text':        return applyMarks(
      (node.text ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'),
      node.marks
    );
    default:            return children();
  }
}

function nodeToText(node: any): string {
  if (!node) return '';
  if (node.type === 'text') return node.text ?? '';
  if (node.type === 'hardBreak') return ' ';
  return (node.content ?? []).map(nodeToText).join('');
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Parse a raw stored value (TipTap JSON string OR legacy HTML string) and
 * return safe HTML suitable for `v-html`.
 */
export function renderContent(raw: string | null | undefined): string {
  if (!raw) return '';
  try {
    const json = JSON.parse(raw);
    if (json?.type === 'doc') return nodeToHtml(json);
  } catch {
    // Not JSON — treat as HTML (legacy content)
  }
  return raw; // legacy HTML pass-through
}

/**
 * Extract clean plain text from TipTap JSON or strip HTML tags.
 * Useful for card descriptions and search excerpts.
 */
export function extractText(
  raw: string | null | undefined,
  maxLength = 180,
): string {
  if (!raw) return '';
  let text = '';
  try {
    const json = JSON.parse(raw);
    if (json?.type === 'doc') {
      text = nodeToText(json).replace(/\s+/g, ' ').trim();
    }
  } catch {
    // Strip HTML tags
    text = raw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  }
  if (!maxLength || text.length <= maxLength) return text;
  return text.slice(0, maxLength).replace(/\s+\S*$/, '') + '…';
}
