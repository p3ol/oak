import {
  type DOMConversion,
  type ElementNode,
  type HTMLConfig,
  type LexicalEditor,
  $createParagraphNode,
  $getRoot,
  $isDecoratorNode,
  $isElementNode,
  $isTextNode,
  TextNode,
} from 'lexical';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';

// Inline styles set by the toolbar (or by other editors, like CKEditor)
const KEPT_STYLES = ['color', 'background-color', 'font-size', 'font-family'];

/**
 * Lexical only keeps formats (bold, italic...) from styled spans: colors &
 * font sizes are kept as well
 */
export const htmlConfig: HTMLConfig = {
  import: {
    span: (span: HTMLElement): DOMConversion | null => {
      const original = TextNode.importDOM()?.span?.(span);

      if (!original) {
        return null;
      }

      return {
        priority: Math.min(4, (original.priority ?? 0) + 1) as
          DOMConversion['priority'],
        conversion: (element: HTMLElement) => {
          const output = original.conversion(element);
          const style = KEPT_STYLES
            .map(p => [p, element.style.getPropertyValue(p)])
            .filter(([, value]) => value)
            .map(([p, value]) => `${p}: ${value};`)
            .join(' ');

          if (!output || !style) {
            return output;
          }

          return {
            ...output,
            forChild: (child, parent) => {
              const result = output.forChild
                ? output.forChild(child, parent)
                : child;

              if ($isTextNode(result)) {
                result.setStyle([style, result.getStyle()]
                  .filter(Boolean).join(' '));
              }

              return result;
            },
          };
        },
      };
    },
  },
};

/**
 * Replaces the editor's content with an html string. Inline contents (e.g.
 * a plain text) are wrapped in paragraphs.
 */
export const $importHtml = (editor: LexicalEditor, html?: string) => {
  const dom = new DOMParser().parseFromString(html || '', 'text/html');
  const nodes = $generateNodesFromDOM(editor, dom);
  const root = $getRoot();
  root.clear();

  let paragraph: ElementNode | null = null;

  nodes.forEach(node => {
    const isBlock = ($isElementNode(node) || $isDecoratorNode(node)) &&
      !node.isInline();

    if (isBlock) {
      paragraph = null;
      root.append(node);

      return;
    }

    if (!paragraph) {
      paragraph = $createParagraphNode();
      root.append(paragraph);
    }

    paragraph.append(node);
  });

  if (!root.getChildrenSize()) {
    root.append($createParagraphNode());
  }
};

/**
 * Returns the editor's content as html, without the editor's own classes (an
 * empty editor returns an empty string)
 */
export const $exportHtml = (editor: LexicalEditor) => {
  const root = $getRoot();
  const first = root.getFirstChild();

  if (
    root.getChildrenSize() <= 1 &&
    (!first || ($isElementNode(first) && first.isEmpty()))
  ) {
    return '';
  }

  const container = document.createElement('div');
  container.innerHTML = $generateHtmlFromNodes(editor, null);

  container.querySelectorAll<HTMLElement>('*').forEach(element => {
    element.removeAttribute('class');

    // Editor-only attributes (e.g. `data-lexical-indent`)
    Array.from(element.attributes)
      .filter(a => a.name.startsWith('data-lexical-'))
      .forEach(a => element.removeAttribute(a.name));

    // Lexical keeps spaces with `white-space: pre-wrap`, which is useless
    // most of the time
    if (element.style.whiteSpace === 'pre-wrap') {
      element.style.removeProperty('white-space');
    }

    if (element.hasAttribute('style') && !element.getAttribute('style')) {
      element.removeAttribute('style');
    }
  });

  // Item numbers are given by the list itself
  container.querySelectorAll('li[value]').forEach(li => {
    li.removeAttribute('value');
  });

  // Spans without styles, and duplicated formats (`<b><strong>`)
  container.querySelectorAll('span, b, i').forEach(element => {
    const child = element.firstElementChild;
    const isDuplicate = element.childNodes.length === 1 && child &&
      !element.attributes.length && (
      (element.tagName === 'B' && child.tagName === 'STRONG') ||
      (element.tagName === 'I' && child.tagName === 'EM')
    );

    if (isDuplicate) {
      element.replaceWith(child);
    } else if (element.tagName === 'SPAN' && !element.attributes.length) {
      element.replaceWith(...Array.from(element.childNodes));
    }
  });

  return container.innerHTML;
};
