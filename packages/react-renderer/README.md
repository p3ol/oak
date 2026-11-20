# @oakjs/react-renderer

React renderers for oak's base components (row, col, title, text, image,
button, empty space, foldable, clickable).

Renderers output the final page markup: they are used by
[`@oakjs/ash`](../ash) to display content inside the builder canvas exactly
like it will be displayed on the page, and can be used to render the content
on your website.

This package only contains the component renderers (and the helpers they
rely on). Walking the content tree is up to you:

```tsx
import {
  type RendererComponentProps,
  baseComponents,
  getElementAttributes,
} from '@oakjs/react-renderer';
import '@oakjs/react-renderer/styles.css';

const components = baseComponents();

const Element = ({ element }) => {
  const Component = components[element.type];

  if (!Component) {
    return null;
  }

  return (
    <Component
      element={element}
      attributes={getElementAttributes(element, Component)}
      renderContainer={key => (element[key] || []).map(child => (
        <Element key={child.id} element={child} />
      ))}
    />
  );
};

export const Page = ({ content }) => (
  // Responsive settings use container queries
  <div className="oak:@container">
    { content.map(e => <Element key={e.id} element={e} />) }
  </div>
);
```

## Component props

| Prop | Description |
| --- | --- |
| `element` | The element to render |
| `attributes` | Attributes to spread on the root DOM node (className, style, data attributes...) |
| `renderContainer(key)` | Renders the children stored in `element[key]` |
| `editing` | `true` when rendered inside a builder |
| `dark` | `true` when the content is displayed in dark mode |
| `sanitizeHTML(html)` | Optional sanitizer for raw html content |
| `onEvent(event, element)` | Called when an element with an `event` action is clicked |

## Hidden children

Components hiding some of their children (like the foldable, collapsed by
default) keep them in the DOM with the `hidden` attribute, and display them
when a `REVEAL_EVENT` (`oak:reveal`) DOM event bubbles from one of them.
Builders use it to show hidden elements when they're selected.

## Dark mode

Elements can declare dark styles (`styles.dark.*`, `settings.dark.className`
and `styles.dark.hover`/`active`). Your website knows when it displays dark
mode: pass `{ dark: true }` to the helpers and the `dark` prop to the
components:

```tsx
<Component
  element={element}
  attributes={getElementAttributes(element, Component, { dark })}
  dark={dark}
  renderContainer={...}
/>
```

`getElementStatesCSS(element, { dark })` returns the hover & active css
rules, including dark ones.

## Styles

Renderers use tailwind classes prefixed with `oak:`. Either import the
precompiled `@oakjs/react-renderer/styles.css`, or add
`@oakjs/react-renderer/tailwind.css` to your own tailwind (v4) build.
