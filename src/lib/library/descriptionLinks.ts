import DOMPurify from 'isomorphic-dompurify';

export function descriptionLinkHref(value: string): string | null {
  try {
    const href = /^www\./i.test(value) ? `https://${value}` : value;
    const url = new URL(href);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}

/** Link text nodes only, leaving existing links and formatting intact. */
export function linkDescriptionUrls(html: string): string {
  const fragment = DOMPurify.sanitize(html, {
    RETURN_DOM_FRAGMENT: true,
    ADD_ATTR: ['target', 'rel'],
  });
  const doc = fragment.ownerDocument;
  function visit(node: Node) {
    if (node.nodeType === 1) {
      const element = node as Element;
      if (element.tagName === 'A') {
        const href = descriptionLinkHref(element.getAttribute('href') ?? '');
        if (href) {
          element.setAttribute('href', href);
          element.setAttribute('target', '_blank');
          element.setAttribute('rel', 'noopener noreferrer');
        } else {
          element.replaceWith(...Array.from(element.childNodes));
        }
        return;
      }
      if (['CODE', 'PRE'].includes(element.tagName)) return;
    }
    if (node.nodeType === 3) {
      const text = node.textContent ?? '';
      const replacement = doc.createDocumentFragment();
      let cursor = 0;
      for (const match of Array.from(
        text.matchAll(/\b(?:https?:\/\/|www\.)[^\s<>"']+/gi),
      )) {
        let label = match[0].replace(/[.,!?;:]+$/, '');
        while (/[)\]}]$/.test(label)) {
          const end = label.slice(-1);
          const start = { ')': '(', ']': '[', '}': '{' }[end];
          if (label.split(end).length <= label.split(start).length) break;
          label = label.slice(0, -1);
        }
        const href = descriptionLinkHref(label);
        if (!href) continue;
        replacement.append(text.slice(cursor, match.index));
        const anchor = doc.createElement('a');
        anchor.href = href;
        anchor.textContent = label;
        anchor.target = '_blank';
        anchor.rel = 'noopener noreferrer';
        replacement.append(anchor);
        cursor = match.index + label.length;
      }
      if (cursor) {
        replacement.append(text.slice(cursor));
        node.parentNode?.replaceChild(replacement, node);
      }
      return;
    }
    Array.from(node.childNodes).forEach(visit);
  }
  visit(fragment);
  const container = doc.createElement('div');
  container.append(fragment);
  return container.innerHTML;
}
