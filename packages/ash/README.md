# @oakjs/ash

A canvas-based visual page builder for oak.

- The page is rendered inside an infinite canvas, using the components' page
  renderers (see [`@oakjs/react-renderer`](../react-renderer)): what you see
  is what will be displayed on your website.
- The left sidebar shows the content hierarchy (layers), which can be
  reordered by drag & drop, and the components catalogue.
- The right sidebar shows the selected element's properties (or the page
  properties when nothing is selected).
- Insert, move & hand tools, zoom controls, and figma-like keyboard shortcuts.

```tsx
import { Builder, baseAddon } from '@oakjs/ash';
import '@oakjs/ash/styles.css';

export const Editor = () => (
  <div style={{ height: '100vh' }}>
    <Builder addons={[baseAddon()]} onChange={content => save(content)} />
  </div>
);
```

The builder fills its parent: make sure the parent has a height.

Coming from `@oakjs/react`? See
[Migrating from @oakjs/react](#migrating-from-oakjsreact).

## Builder props

| Prop | Type | Description |
| --- | --- | --- |
| `addons` | `AshAddonObject[]` | Addons declaring components, fields, settings, overrides & texts. You'll almost always want `baseAddon()`. Must be stable (see below) |
| `value` | `ElementObject[]` | Content (controlled) |
| `defaultValue` | `ElementObject[]` | Initial content (uncontrolled) |
| `onChange` | `(content) => void` | Called on every content change |
| `history` | `{ canUndo, canRedo, undo(), redo() }` | Undo/redo handled outside of the builder (e.g. by Yjs's `UndoManager`), used by the toolbar & shortcuts. The builder's own history is disabled when given (see [Collaboration](#collaboration)) |
| `onSelectionChange` | `(id, element) => void` | Called when the selected element changes |
| `collaborators` | `Collaborator[]` | Other users editing the content, whose selections are displayed in the canvas & layers, and cursors in fields (see [Collaboration](#collaboration)) |
| `onCursorChange` | `(cursor \| null) => void` | Called when the user's cursor moves inside a field (`null` when it leaves it), to share it with the other users |
| `onSave` | `(content, { pageValue }) => void \| Promise<void>` | Called when the user saves with `⌘/Ctrl + S` (or with `save()`, see below). Pending property changes are committed first. `⌘/Ctrl + S` keeps its default browser behavior when not set |
| `options` | `Partial<BuilderOptions>` | Core builder options (`debug`, `historyLimit`, `generateId`...) |
| `activeTextSheet` | `string` | Id of the texts sheet to use (see [Texts](#texts)) |
| `defaultPageWidth` | `number` | Initial width of the previewed screen (default: `1024`) |
| `pagePresets` | `PagePreset[]` | Screen sizes displayed in the page properties |
| `pageTitle` | `ReactNode` | Title of the page properties, displayed when nothing is selected (default: "Page") |
| `pageDescription` | `ReactNode` | Displayed under the page properties title (default: the number of elements, `null` hides it) |
| `pageSettings` | `PageSettingObject[]` | Fields displayed in the page properties (see [Page settings](#page-settings)) |
| `pageValue` | `Record<string, any>` | Page settings values (controlled) |
| `defaultPageValue` | `Record<string, any>` | Initial page settings values (uncontrolled) |
| `onPageChange` | `(value) => void` | Called when a page setting changes |
| `renderPageHead` | `(value) => ReactNode` | Rendered at the top of the page in the canvas (custom css, fonts...) |
| `previewModes` | `PreviewMode[]` | Ways the content can be previewed in context (see [Preview modes](#preview-modes)) |
| `previewSettings` | `PreviewSettingObject[]` | Settings previewing states of the content in the canvas, e.g. a submitted form (see [Preview settings](#preview-settings)) |
| `defaultPreviewMode` | `string` | Id of the preview mode used by default (default: the first one) |
| `theme` | `'auto' \| 'light' \| 'dark'` | Theme of the builder interface (default: `auto`, see [Dark mode](#dark-mode)) |
| `defaultCanvasTheme` | `'light' \| 'dark'` | Initial theme of the canvas (default: `light`) |
| `pageClassName` | `string` | Class applied to the page inside the canvas, e.g. to load your website's fonts & styles |
| `leftSidebarWidth`, `rightSidebarWidth` | `number` | Initial sidebars widths |
| `header` | `ReactNode` | Displayed at the top of the left sidebar, above the layers & insert panels (see [Sidebar header](#sidebar-header)) |
| `headerClassName` | `string` | Replaces the default classes of the header container (padding & bottom border) |
| `shortcutsEnabled` | `boolean` | Enables keyboard shortcuts (default: `true`) |
| `onImageUpload` | `(event, { element, setting }) => Promise<{ url, name }>` | Uploads images picked in image fields. Images are inlined as data urls if not set |
| `polyfills` | `{ DOMParser, XMLSerializer }` | Used to sanitize html content outside of browsers |

> **Keep `addons` stable**: define them outside of your component (or
> memoize them). A new `addons` array makes the builder re-register every
> component & field, which re-mounts fields (and makes them lose focus) when
> your component re-renders, e.g. with a controlled `value` or `pageValue`.
>
> ```tsx
> const addons = [baseAddon(), myAddon()];
>
> export const Editor = () => <Builder addons={addons} />;
> ```

The builder's ref exposes `builder` (the `@oakjs/core` builder instance),
`content`, `innerRef`, `select(id)` and `save()`. `save()` is also available
from `useBuilder()` inside custom components (like the sidebar header).

## Sidebar header

Use `header` to display your own content above the layers & insert panels,
like a back button or the name of the edited item. It is rendered inside the
builder, so it can use the builder hooks:

```tsx
import { Builder, useBuilder } from '@oakjs/ash';

const Header = () => {
  // Same as Cmd/Ctrl + S: commits pending changes & calls `onSave`
  const { save } = useBuilder();

  return (
    <div className="header">
      <button onClick={() => history.back()}>Back</button>
      <button onClick={() => save()}>Save</button>
    </div>
  );
};

<Builder
  addons={addons}
  header={<Header />}
  onSave={content => api.saveContent(content)}
/>
```

The container has the `oak-ash-sidebar-header` class, some padding and a
bottom border: pass `headerClassName` to replace them.

## Page settings

Content-independent settings (custom css, tracking ids, metadata...) can be
displayed in the page properties, shown when nothing is selected. They are
declared like component settings (any field type, `condition`, `priority`,
`type: 'group'`...), through the `pageSettings` prop or addons'
`pageSettings`, and their values are stored apart from the content:

```tsx
const customCssAddon = {
  fields: [monacoField()], // your own field type
  pageSettings: [{
    type: 'monaco',
    key: 'customCss',
    label: 'Custom CSS',
  }],
};

const addons = [baseAddon(), customCssAddon];

export const Editor = () => {
  const [page, setPage] = useState({ customCss: '' });

  return (
    <Builder
      addons={addons}
      pageValue={page}
      onPageChange={setPage}
      // Preview the custom css in the canvas
      renderPageHead={value => <style>{ value.customCss }</style>}
    />
  );
};
```

Page settings follow the same rules as elements settings, as if they were
the settings of a `page` component: they are sorted by `priority`, setting
overrides (`type: 'setting'`) can change them and component overrides
(`type: 'component'`) can add fields, with `targets: ['page']`. Conditions
receive the page value. Their changes are not part of the undo history.

Settings of `type: 'tab'` (with a `title`, `fields` and an optional
`condition`) are displayed in their own tab, next to a "Settings" tab holding
every other setting:

```tsx
pageSettings: [
  { type: 'text', key: 'slug', label: 'Address' },
  { type: 'group', key: 'seo', label: 'SEO', fields: [/* ... */] },
  {
    type: 'tab',
    key: 'css',
    title: 'Custom CSS',
    fields: [{ type: 'monaco', key: 'customCss' }],
  },
],
```

## Preview modes

The page properties (displayed when nothing is selected) let you choose how
the content is previewed in the canvas:

| Mode | Id | Description |
| --- | --- | --- |
| Full page | `page` | The content takes the whole screen width |
| Inside an article | `article` | Inline, right after the first paragraphs of an article (which fade out) |
| Modal | `modal` | Centered in a 560px modal above a dimmed article |
| Bottom drawer | `drawer` | In a drawer sticking to the bottom of the screen |

The screen size is the width of the whole previewed screen: each mode
decides how wide the content is inside it, and responsive settings apply to
the content's own width (e.g. inside a 560px modal on a desktop screen).
The content stays fully editable in every mode.

Use `previewModes` to pick, reorder or add modes. A mode receives the
editable page as `children` (to render exactly once) and the screen `width`:

```tsx
import {
  Builder,
  baseAddon,
  articlePreviewMode,
  modalPreviewMode,
  type PreviewMode,
} from '@oakjs/ash';

const sidebarMode: PreviewMode = {
  id: 'sidebar',
  name: 'Sidebar widget',
  frameClassName: 'my-widget',
  render: ({ children }) => (
    <div style={{ display: 'flex', gap: 24, padding: 24, background: '#fff' }}>
      <article style={{ flex: 1 }}>…</article>
      <aside style={{ width: 300 }}>{ children }</aside>
    </div>
  ),
};

<Builder
  addons={[baseAddon()]}
  previewModes={[articlePreviewMode(), modalPreviewMode(), sidebarMode]}
  defaultPreviewMode="article"
/>
```

`SiteHeader` and `ArticleSkeleton` (the mock website used by default modes)
are exported to build your own.

## Preview settings

Some content is displayed differently depending on its state on the final
website: blocks displayed once a form has been submitted, once a user is
logged in... Preview settings allow to preview them in the canvas. They are
displayed in the page properties' preview section and support the same
settings as [page settings](#page-settings) (toggles, selects, groups,
conditions, overrides...), but their values are only used to preview the
content: nothing is saved.

Declare them through the `previewSettings` prop or addons' `previewSettings`,
and use `isElementDisplayed(element, value, previewValue)` to hide the
elements that wouldn't be displayed:

```tsx
const formAddon: AshAddonObject = {
  previewSettings: [{
    type: 'toggle',
    key: 'form.submitted',
    label: t => t('form.preview.title', 'Form'),
    checkedLabel: t => t('form.preview.submitted', 'Submitted'),
    uncheckedLabel: t => t('form.preview.notSubmitted', 'Not submitted'),
    default: false,
    // Only when the content contains a form
    condition: (_, { builder }) => hasFields(builder.getContent()),
    isElementDisplayed: (element, submitted) => submitted
      ? element.settings?.showAfterSubmit ?? !isField(element)
      : element.settings?.showBeforeSubmit ?? true,
  }, {
    type: 'select',
    key: 'visitor',
    label: 'Visitor',
    default: 'anonymous',
    options: [
      { title: 'Anonymous', value: 'anonymous' },
      { title: 'Logged in', value: 'logged-in' },
    ],
    isElementDisplayed: (element, visitor) =>
      !element.settings?.visitors || element.settings.visitors.includes(visitor),
  }],
};
```

They are displayed below the native preview settings (display mode, screen
size...) by default, or above them with a `priority` greater than `0` (the
native settings' priority), sorted by priority like other settings.

Settings hidden by their `condition` don't hide anything. Elements hidden in
the canvas are still listed in the layers (dimmed, with an icon), so that they
can be selected and edited.

Renderers can also read the preview values with `usePreviewValue()` (e.g. to
render a confirmation message once a form is submitted). It returns an empty
object outside of the builder, so the same renderers can render the final
content (values left to their default are not included):

```tsx
const FormMessage = ({ element, attributes }: RendererComponentProps) => {
  const { form } = usePreviewValue();

  return (
    <div { ...attributes }>
      { form?.submitted ? element.successMessage : element.content }
    </div>
  );
};
```

## Collaboration

Ash provides what's needed to plug a real-time collaboration tool (like
[Yjs](https://yjs.dev)), the synchronization itself staying on your side:

- **Content**: pass remote content through `value` (applying it doesn't call
  `onChange`, so there's no echo), and send local changes from `onChange`.
- **Undo/redo**: give a `history` controller so that users only undo their own
  changes. The builder's own history is disabled (`options.history: false`
  in `@oakjs/core`).
- **Presence**: share the local selection with `onSelectionChange` and the
  cursor in fields with `onCursorChange`, and display the others' with
  `collaborators` (outlines in the canvas & layers, carets & selected text
  in fields, with the user's name when their cursor moves).
- **Concurrent edits**: the properties panel only commits the values that
  were changed, so that changes made meanwhile by others to the same element
  are kept. When someone else changes a text you are typing in, both changes
  are merged (unless they overlap, in which case yours wins).
- **Fields**: the default text fields, as well as the CKEditor
  (`@oakjs/addon-ckeditor5-react`), Remirror (`@oakjs/addon-remirror`) and
  Lexical (`@oakjs/addon-lexical`) fields, apply changes made by others while you type without moving your
  caret (it moves along with the text inserted or removed before it).

```tsx
<Builder
  addons={addons}
  value={content}
  onChange={sendContent}
  history={{
    canUndo: undoManager.canUndo(),
    canRedo: undoManager.canRedo(),
    undo: () => undoManager.undo(),
    redo: () => undoManager.redo(),
  }}
  onSelectionChange={id => awareness.setLocalStateField('selectedId', id)}
  onCursorChange={cursor => awareness.setLocalStateField('cursor', cursor)}
  collaborators={[{
    id: 12,
    name: 'Alice',
    // Optional: defaults to a color derived from the id
    color: '#EE7674',
    selectedId: 'e1',
    // Alice selected characters 4 to 9 of `e1`'s content
    cursor: { elementId: 'e1', key: 'content', anchor: 4, head: 9 },
  }]}
/>
```

`@oakjs/core` also allows to apply content without recording it in its own
history: `builder.setContent(content, { commit: false })`.

### Yjs

`@oakjs/ash/yjs` does all of the above with [Yjs](https://yjs.dev). It
requires the `yjs` peer dependency (and `y-protocols` for presence), and is
only loaded when imported.

```sh
yarn add yjs y-protocols y-websocket
```

```tsx
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { Builder } from '@oakjs/ash';
import { useYjs } from '@oakjs/ash/yjs';

const doc = new Y.Doc();
const provider = new WebsocketProvider('wss://your-server', 'page-12', doc);

export const Editor = () => {
  const collaboration = useYjs({
    doc,
    awareness: provider.awareness,
    user: { name: 'Alice', color: '#EE7674' },
  });

  return <Builder addons={addons} { ...collaboration } />;
};
```

`useYjs` returns the builder props listed above (`value`, `onChange`,
`pageValue`, `onPageChange`, `history`, `onSelectionChange`,
`onCursorChange`, `collaborators`):

- The content is stored as shared types (elements as `Y.Map`, containers as
  `Y.Array`, texts as `Y.Text`) in `doc.getArray('oak:content')`, and the
  page settings in `doc.getMap('oak:page')` (see the `contentKey` & `pageKey`
  options). Only changed values are written, and only changed characters for
  texts: concurrent changes to different values of the same element are
  merged, and so is concurrent typing in the same text. Moved elements are
  re-created at their new position (Yjs has no move operation).
- Undo/redo uses a `Y.UndoManager`: each user only undoes their own changes.
- Selections & cursors are shared through the awareness (`selectedId` &
  `cursor` fields), along with `user`.

Initialize the document once, e.g. on your server, with `setYjsContent(doc,
content)`. `useYjs`'s `defaultValue` option initializes it when it's empty,
but initializing it from several clients at the same time would duplicate the
content.

Rich texts (CKEditor, Remirror, Lexical) are stored as HTML strings in `Y.Text`s:
typing at different places is merged, but two users formatting overlapping
parts of a text at the same time may produce unexpected markup. Plugging the
editors' own Yjs bindings (`y-prosemirror`, `@lexical/yjs`, CKEditor's
real-time collaboration) would require storing their documents outside of the content,
which isn't supported.

See the `Ash/Collaboration` stories for two editors synchronized in memory
(with the default fields, CKEditor, Remirror and Lexical).

## Dark mode

The interface (sidebars, toolbar, panels) and the canvas have separate
themes.

**Interface**: uses tailwind's dark mode, through a `dark` custom variant
that is enabled by:

- a `dark` class, `data-theme="dark"` or `data-bs-theme="dark"` on an
  ancestor (tailwind, shadcn, daisyUI, bootstrap, storybook's themes addon...),
- otherwise the browser's preference (`prefers-color-scheme`), unless an
  ancestor declares `light` the same way.

Pass `theme="light"` or `theme="dark"` to force it (it adds the matching class
to the builder root). Interface colors are css variables (`--ash-surface`,
`--ash-text`, `--ash-border`...) defined on `.oak-ash`, that you can override.

**Canvas**: has its own theme, independent from the interface (light by
default, see `defaultCanvasTheme`). The button next to the zoom controls
switches it between light and dark. In dark mode, the page is displayed with the elements' dark
styles (`styles.dark.*`, `settings.dark.className`), and preview modes use a
dark website. Use `baseAddon({ darkMode: true })` to let users edit dark
styles.

## Colors

The interface only uses [junipero](https://junipero.design)'s color
variables (`--junipero-velvet`, `--junipero-onyx`...), so the primary color
can be changed with a single variable, its shades being derived from it:

```css
/* Junipero declares its colors on every element, hence the `*` */
.oak-ash, .oak-ash * {
  --junipero-velvet: #E11D48;
}
```

Other interface colors are exposed as tokens defined on `.oak-ash`
(`--ash-surface`, `--ash-muted`, `--ash-border`, `--ash-text`,
`--ash-text-muted`, `--ash-accent-soft`...) and on `.oak-ash-canvas` for the
canvas (`--ash-canvas-bg`, `--ash-page-bg`, `--ash-page-text`...).

## Keyboard shortcuts

| Shortcut | Action |
| --- | --- |
| `V` | Move tool |
| `H` / hold `Space` | Hand tool (pan) |
| `⌘/Ctrl + scroll`, pinch | Zoom |
| `⌘/Ctrl + +`, `⌘/Ctrl + -` | Zoom in, zoom out |
| `⌘/Ctrl + 0` | Zoom to 100% |
| `⇧ + 1` | Fit page width |
| `Backspace` / `Delete` | Remove selected element |
| `⌘/Ctrl + C`, `⌘/Ctrl + X`, `⌘/Ctrl + V` | Copy, cut & paste elements (pasted after or inside the selection) |
| `⌘/Ctrl + S` | Save (calls `onSave`), even while typing in a field |
| `⌘/Ctrl + D` | Duplicate selected element |
| `⌘/Ctrl + Z`, `⇧ + ⌘/Ctrl + Z` | Undo, redo |
| `Escape` | Select parent element |

Shortcuts are handled when the focus is inside the builder, or when nothing is
focused and the builder was the last thing clicked (so that several builders
can be displayed on the same page).

## Creating addons

An addon is a plain object. Every key is optional:

```ts
import type { AshAddonObject } from '@oakjs/ash';

const myAddon: AshAddonObject = {
  components: [], // components, or groups of components
  fields: [],     // field types, used by settings
  settings: [],   // settings shared by every component (or setting tabs)
  overrides: [],  // changes to existing components, fields & settings
  texts: [],      // translations
};

<Builder addons={[baseAddon(), myAddon]} />
```

Addons are merged in order, so put yours after `baseAddon()`.

> Ash addons use the same format as `@oakjs/react` addons, **except for
> component renderers**: in ash, a component's `render` renders the final
> page markup (see [Renderers](#renderers)), not an editor preview. Fields
> keep the same API.

### Components

```tsx
import type { AshComponentObject, GetTextCallback } from '@oakjs/ash';

const quoteComponent = (): AshComponentObject => ({
  id: 'quote',
  name: (t: GetTextCallback) => t('myAddon.components.quote.name', 'Quote'),
  type: 'component',
  // The catalogue group to display the component in (defaults to "Other")
  group: 'core',
  // A junipero icon name, or a function returning a react node
  icon: 'multiline',
  editable: true,
  duplicable: true,
  copyable: true,
  // Default element created when the component is inserted
  construct: () => ({
    type: 'quote',
    content: 'To be or not to be',
    author: '',
  }),
  // Page renderer, see "Renderers" below
  render: Quote,
  // Fields displayed in the properties sidebar
  settings: {
    title: (t: GetTextCallback) =>
      t('myAddon.components.quote.settings.title', 'Quote options'),
    fields: [{
      type: 'textarea',
      key: 'content',
      label: 'Quote',
    }, {
      type: 'text',
      key: 'author',
      label: 'Author',
      // Only display the field when...
      condition: element => !!element.content,
    }],
  },
});
```

The main component options:

| Option | Description |
| --- | --- |
| `id` | Unique id, stored as `element.type` |
| `name`, `icon` | Displayed in the catalogue, layers & properties |
| `group` | Id of the catalogue group the component belongs to |
| `construct({ builder })` | Returns the element created when inserting the component |
| `render` | Page renderer (see [Renderers](#renderers)) |
| `settings.fields` | Fields displayed in the properties sidebar. A field with a `tab` key is displayed in that tab (`general` by default, or `styling`, `responsive`, `accessibility`...) |
| `getContainers(element)` | Returns the arrays of child elements, if the element has more than one container or if it doesn't use `element.content` |
| `disallow` | Component ids that cannot be dropped inside this component |
| `usable` | `false` hides the component from the catalogue (see [Structural components](#structural-components)) |
| `editable`, `removable`, `duplicable`, `copyable` | Enable/disable properties edition, deletion, duplication & copy |
| `serialize`, `deserialize`, `sanitize`, `duplicate` | Hooks to transform the element when it is saved, edited, loaded or duplicated |

Each setting field has a `type` (one of the available fields: `text`,
`textarea`, `select`, `tags`, `color`, `image`, `date`, `toggle`, or your
own), a `key` (path of the value inside the element, e.g.
`settings.author.name`) and optionally a `label`, `placeholder`, `info`,
`description`, `default`, `options` (for selects), `priority` (higher is
displayed first) and `condition(element, { component, builder })`.

A field of type `group` with a `fields` array displays a collapsible group of
fields (like "Hover styles").

### Groups of components

Components can be declared inside groups, which are displayed as sections of
the catalogue:

```ts
components: [{
  type: 'group',
  id: 'marketing',
  name: t => t('myAddon.groups.marketing', 'Marketing'),
  components: [quoteComponent(), testimonialComponent()],
}]
```

### Container components

Elements can contain other elements. By default, children are stored in
`element.content`:

```ts
const boxComponent = (): AshComponentObject => ({
  id: 'box',
  name: 'Box',
  type: 'component',
  icon: 'appearences',
  construct: () => ({ type: 'box', content: [] }),
  render: Box,
});
```

Use `getContainers` when an element has several containers, or stores its
children elsewhere. Each container must be an array stored at the root of
the element, and its key must match the one given to `renderContainer()` and
`containerAttributes()` in the renderer:

```ts
const cardComponent = (): AshComponentObject => ({
  id: 'card',
  name: 'Card',
  type: 'component',
  icon: 'card',
  construct: () => ({ type: 'card', header: [], content: [] }),
  getContainers: element => [element.header, element.content],
  render: Card,
});
```

Every container is a drop zone in the canvas. In the layers panel, an element
with several containers displays one labelled section per container (labelled
with the container's key).

### Structural components

A component with `usable: false` cannot be inserted from the catalogue, and
its elements can only be reordered inside their own container. Containers
holding such elements don't accept anything else.

This is how rows work: `element.cols` only holds columns, columns can only
be moved inside their row, and the canvas displays buttons on both sides of
a row to add columns. Reuse the same pattern for tabs, slides, steps...

```ts
const tabsComponent = (): AshComponentObject => ({
  id: 'tabs',
  type: 'component',
  name: 'Tabs',
  construct: ({ builder }) => ({
    type: 'tabs',
    tabs: [builder.createElement('tab')],
  }),
  getContainers: element => [element.tabs],
  render: Tabs,
});

const tabComponent = (): AshComponentObject => ({
  id: 'tab',
  type: 'component',
  name: 'Tab',
  usable: false,
  construct: () => ({ type: 'tab', title: 'New tab', content: [] }),
  render: Tab,
});
```

### Fields

Fields are the inputs used by settings. A field declares a `type` and a
`render` function:

```tsx
import type { AshFieldObject } from '@oakjs/ash';

const rangeField = (): AshFieldObject => ({
  type: 'range',
  render: ({ value, onChange, fieldOptions }) => (
    <input
      type="range"
      min={fieldOptions.setting?.props?.min ?? 0}
      max={fieldOptions.setting?.props?.max ?? 100}
      value={value ?? 0}
      onChange={e => onChange({ value: Number(e.target.value) })}
    />
  ),
});

// Then, in a component's settings:
{ type: 'range', key: 'settings.opacity', label: 'Opacity', props: { max: 1 } }
```

`render` receives the field's `value`, `onChange({ value })` (or
`onChange({ checked })` for checkboxes), `disabled`, the setting's `props`,
and `fieldOptions`:

| `fieldOptions` | Description |
| --- | --- |
| `setting` | The setting being edited |
| `element` | A draft copy of the edited element |
| `t(key, default)` | Returns a translated text |
| `floatingsRef` | Container to render dropdowns & popovers into (so they're not clipped by the sidebar) |
| `collaborators` | Other users whose cursor is in this field: `{ id, name, color, anchor, head }[]` |
| `onSelectionChange(selection)` | Shares the local selection (`{ anchor, head }`, or `null` on blur) with the other users |

Changes are applied to the page live, and saved to the undo history after a
short delay.

The `value` given to a field can change while it is focused (when someone
else edits the same element, see [Collaboration](#collaboration)): apply it
without resetting the caret if possible. Ash's `textField` & `textareaField`
do (with the `SyncedTextField` component).

To display other users' cursors in a custom field, report the local selection
with `fieldOptions.onSelectionChange` (positions are up to the field, e.g.
text offsets: they're only read by the same field of other users), and render
`fieldOptions.collaborators` with the `FieldCursors` component, from the rects
you measured (`measureTextSelection` does it for inputs & textareas):

```tsx
import { FieldCursors, measureTextSelection } from '@oakjs/ash';

const MyField = ({ value, onChange, fieldOptions }) => {
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const [cursors, setCursors] = useState([]);

  // Measured once the input displays the value
  useLayoutEffect(() => {
    setCursors((fieldOptions.collaborators || []).map(c => ({
      ...c,
      ...measureTextSelection(inputRef.current, containerRef.current, c),
    })));
  }, [fieldOptions.collaborators, value]);

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <input ref={inputRef} value={value} onChange={...} />
      <FieldCursors cursors={cursors} />
    </div>
  );
};
```

Report selections outside of the field's event handlers (e.g. on the next
frame): updating the builder while a controlled input handles an event makes
React restore its previous value.

### Settings

Settings declared at the addon level are available to every component. Use
`condition` to restrict them to some components, and `type: 'tab'` to add a
new tab to the properties sidebar:

```ts
settings: [{
  type: 'tab',
  id: 'analytics',
  title: 'Analytics',
  fields: [{
    type: 'text',
    key: 'settings.trackingId',
    label: 'Tracking id',
  }],
  condition: element => ['button', 'clickable'].includes(element.type),
}]
```

### Overrides

Overrides change existing components, settings or fields without redefining
them. `targets` lists the component ids they apply to (`'*'` for every
component):

```ts
overrides: [{
  // Change a component
  type: 'component',
  targets: ['clickable'],
  disallow: ['button', 'clickable'],
  // Add or replace fields (matched by key)
  fields: [{
    key: 'thirdPartyService',
    type: 'text',
    label: 'Third party service ID',
    condition: element => element.action === 'third-party',
  }],
}, {
  // Change a setting
  type: 'setting',
  targets: ['*'],
  key: 'styles.backgroundColor',
  label: 'Background',
  fieldType: 'color',
}]
```

Component overrides accept most component options (`render`, `construct`,
`usable`, `editable`, `removable`, `duplicable`, `copyable`, `droppable`,
`disallow`...). An overridden `render` is a page renderer as well.
`droppable: false` prevents elements from being dropped inside the targeted
components.

### Texts

Every text displayed by the builder goes through a translation key. Provide
texts sheets and select one with the `activeTextSheet` prop:

```tsx
const frenchAddon = {
  texts: [{
    id: 'fr',
    texts: {
      core: { components: { title: { name: 'Titre' } } },
      ash: { panels: { layers: 'Calques', insert: 'Insérer' } },
      myAddon: { components: { quote: { name: 'Citation' } } },
    },
  }],
};

<Builder addons={[baseAddon(), frenchAddon]} activeTextSheet="fr" />
```

## Renderers

A renderer is the react component that renders an element **as it will
appear on the final page**. Ash renders it as-is inside the canvas: there's
no editor-specific preview anymore. The same renderers can be used to render
the content on your website (see
[`@oakjs/react-renderer`](../react-renderer)).

```tsx
import {
  type RendererComponentProps,
  mergeAttributes,
} from '@oakjs/ash';

const Quote = ({ element, attributes }: RendererComponentProps) => (
  <blockquote
    { ...mergeAttributes(attributes, {
      className: 'quote',
      style: { fontStyle: 'italic', paddingLeft: 16 },
    }) }
  >
    <p>{ element.content }</p>
    { element.author && <cite>{ element.author }</cite> }
  </blockquote>
);
```

### Props

| Prop | Description |
| --- | --- |
| `element` | The element to render |
| `attributes` | Attributes to spread on the root DOM node: `data-oak-id`, `data-oak-type`, `className` (custom class & responsive visibility), `style` (styling settings), `dir` & `role` |
| `renderContainer(key)` | Renders the children stored in `element[key]` |
| `depth` | Nesting depth of the element |
| `editing` | `true` when rendered inside the builder |
| `dark` | `true` when the content is displayed in dark mode. Dark styles are already merged into `attributes`, use it to adapt default colors |
| `sanitizeHTML(html)` | Sanitizes raw html content. Inside ash, it removes scripts & disables links |
| `onEvent(event, element)` | To be called when an element with an `event` action is clicked |

### Rules

1. **Spread `attributes` on the root DOM node**, using `mergeAttributes()` to
   add your own classes/styles. Ash uses `data-oak-id` to select elements and
   to draw outlines, and the styling settings (padding, borders,
   background...) are applied through `attributes.style`.
2. **Render a single root node, without wrappers around children**: ash
   displays the real page, so an extra wrapper would change the layout (think
   of columns inside a flex row).
3. **Mark containers with `containerAttributes(key)`** on the DOM node that
   directly wraps the children rendered by `renderContainer(key)`. Ash uses it
   to find where elements can be dropped, and computes the drop position from
   that node's direct children.

   ```tsx
   const Card = ({ attributes, renderContainer }: RendererComponentProps) => (
     <div { ...mergeAttributes(attributes, { className: 'card' }) }>
       <header { ...containerAttributes('header') }>
         { renderContainer('header') }
       </header>
       <div { ...containerAttributes('content') }>
         { renderContainer('content') }
       </div>
     </div>
   );
   ```

   When an element's only container is the root node itself (like columns),
   put `containerAttributes()` on the root node.
4. **Stay interactive, use `editing` sparingly**: renderers behave in the
   canvas like on the final page (a foldable can be opened & closed). Only use
   `editing` to make things editable (e.g. a placeholder for an empty image).
   Empty containers already display a drop zone in editing mode, there's no
   need to handle them.
5. **Reveal hidden children**: when a component hides some of its children
   (collapsed sections, inactive tabs...), keep them in the DOM (e.g. with the
   `hidden` attribute) and listen to `REVEAL_EVENT` (`oak:reveal`) on its root
   node. Ash dispatches it from a hidden element when it gets selected (e.g.
   from the layers panel): display the section containing `event.target`.

   ```tsx
   useEffect(() => {
     const el = ref.current;
     const onReveal = (e: Event) => setActiveTab(getTabOf(e.target));
     el?.addEventListener(REVEAL_EVENT, onReveal);

     return () => el?.removeEventListener(REVEAL_EVENT, onReveal);
   }, []);
   ```
6. **Render raw html with `HTMLContent`** (or call `sanitizeHTML`) so that
   html content can't run scripts or navigate away from the builder.
7. **Keep renderers pure**: no access to the builder or to ash's contexts, so
   they can be used to render the final page (including server-side).

Hover & active styles (`styles.hover`, `styles.active`) are generated by
ash, and responsive visibility classes are part of `attributes.className`.
Set `oakHandlesResponsive = true` on a renderer that computes its own
responsive classes (like columns, which change size per breakpoint).

### Styling

Responsive settings use container queries: content adapts to the page width
selected in the builder, not to the window size. Renderers can use tailwind
classes prefixed with `oak:` (the classes used by base renderers are always
available). Classes that are not used by base renderers need to be part of
your own tailwind build, both in the builder and on your website.

### Reusing base renderers

Base renderers are exported as `renderers` to build on them:

```tsx
import {
  type RendererComponentProps,
  buttonComponent,
  mergeAttributes,
  renderers,
} from '@oakjs/ash';

const BrandButton = (props: RendererComponentProps) => (
  <renderers.Button
    { ...props }
    attributes={mergeAttributes(props.attributes, { className: 'btn-brand' })}
  />
);

const brandAddon = {
  overrides: [{
    type: 'component',
    targets: ['button'],
    render: BrandButton,
  }],
};

// or: buttonComponent({ render: BrandButton })
```

## Migrating from @oakjs/react

Ash uses the same core (`@oakjs/core`) as `@oakjs/react`: **the content
format doesn't change** and existing content can be loaded as is. Most of the
migration is about components renderers (ash renders the final page instead
of editor previews), and a few builder props tied to the old interface.

### Checklist

1. Replace `@oakjs/react` & `@oakjs/theme` with `@oakjs/ash`
2. Import `@oakjs/ash/styles.css` and give the builder's parent a height
3. Remove the props that no longer exist (see [Builder](#builder))
4. Turn your components' `render` into page renderers (see
   [Components](#components-1))
5. Replace `fieldOptions.editableRef` with `fieldOptions.floatingsRef` in your
   fields (see [Fields](#fields-1))
6. Make sure your `addons` array is stable

### Installation & styles

```diff
- yarn add @oakjs/react @oakjs/theme
+ yarn add @oakjs/ash
```

```diff
- import { Builder, baseAddon } from '@oakjs/react';
- import '@oakjs/theme/dist/oak.min.css';
+ import { Builder, baseAddon } from '@oakjs/ash';
+ import '@oakjs/ash/styles.css';

+ const addons = [baseAddon()];

  export const Editor = () => (
-   <Builder addons={[baseAddon()]} value={content} onChange={setContent} />
+   <div style={{ height: '100vh' }}>
+     <Builder addons={addons} value={content} onChange={setContent} />
+   </div>
  );
```

`@oakjs/theme` (and its `--oak-*` css variables) is not used by ash: see
[Colors](#colors) to customize the interface, and [Dark mode](#dark-mode).

### Builder

| `@oakjs/react` | `@oakjs/ash` |
| --- | --- |
| `addons`, `value`, `defaultValue`, `onChange`, `options`, `activeTextSheet`, `polyfills`, `onImageUpload`, `id`, `className` | Unchanged |
| `editableType` (`floating` / `modal`) | Removed: element properties are always displayed in the right sidebar |
| `historyEnabled`, `topHistoryButtonsEnabled`, `bottomHistoryButtonsEnabled`, `topHistoryButtonsContainer`, `bottomHistoryButtonsContainer` | Removed: undo & redo are part of the canvas toolbar, and have keyboard shortcuts. To display your own buttons, use `header` and `useBuilder()` (`builder.undo()`, `canUndo`...) |
| `rootBoundary` | Removed: there are no floating panels anymore |
| `catalogueEnabled` | No equivalent: components can always be inserted (hide some of them with overrides & `usable: false`) |

New props are listed in [Builder props](#builder-props) (`theme`,
`pageSettings`, `previewModes`, `header`...).

The builder's ref still exposes `builder`, `content` & `innerRef`.
`catalogueRef` & `close` were removed, and `select(id)` selects an element.

### Components

Components keep the same definition (`id`, `name`, `icon`, `construct`,
`settings`, `getContainers`, `disallow`...), **except `render`**: in
`@oakjs/react` it rendered a preview inside the element's card, in ash it
renders the element as it will be displayed on the page (see
[Renderers](#renderers)).

```diff
  const quoteComponent = () => ({
    id: 'quote',
    construct: () => ({ type: 'quote', content: '', author: '' }),
-   render: ({ element }) => (
-     <div className="preview">{ element.author }</div>
-   ),
+   render: ({ element, attributes, sanitizeHTML }) => (
+     <figure { ...attributes }>
+       <HTMLContent tag="blockquote" html={element.content} sanitizeHTML={sanitizeHTML} />
+       <figcaption>{ element.author }</figcaption>
+     </figure>
+   ),
  });
```

Container components used `@oakjs/react`'s `Container` to display their
children: use `renderContainer(key)` and `containerAttributes(key)` instead.

```diff
- render: ({ element, component }) => (
-   <Container element={element} component={component} content={element.content} />
- ),
+ render: ({ attributes, renderContainer }) => (
+   <div { ...attributes } { ...containerAttributes('content') }>
+     { renderContainer('content') }
+   </div>
+ ),
```

Some options were specific to the old interface and are ignored by ash:

| Option | In ash |
| --- | --- |
| `options` (`dragOption`, `collapseOption`, `backgroundColorOption`, custom options) | Ignored: elements are moved from the canvas or the layers panel, and duplicate/copy/remove actions are in the properties header |
| `hasCustomInnerContent`, `settings.floatingSettings` | Ignored |
| `displayable` (on settings) | Ignored: the canvas displays the real rendering |
| `draggable: false`, `droppable: false` (on components) | Ignored, like for core components in `@oakjs/react`. On a component override, `draggable: false` prevents moving the element, `droppable: false` prevents dropping inside it |

Base components & fields factories have the same names (`baseAddon`,
`rowComponent`, `textField`...) and are exported by `@oakjs/ash`. Pass your
own renderer to reuse them: `buttonComponent({ render: MyButton })`.

### Fields

Fields keep the same API (`type`, `render`, `value`, `onChange`,
`fieldOptions`...), with one difference: `fieldOptions.editableRef` doesn't
exist anymore. Use `fieldOptions.floatingsRef` as the container of floating
elements (dropdowns, color pickers...):

```diff
  render: ({ fieldOptions, ...props }) => (
    <SelectField
      { ...props }
-     container={fieldOptions.editableRef?.current?.innerRef.current}
+     container={fieldOptions.floatingsRef?.current}
    />
  ),
```

Fields must not use `@oakjs/react` components or hooks reading its builder
context (`useBuilder`, `Text`, `Field`): use the ones exported by
`@oakjs/ash` instead.

### Overrides & settings

Overrides & settings don't change. Only an overridden `render` has to be a
page renderer, like components.

### Exports

| `@oakjs/react` | `@oakjs/ash` |
| --- | --- |
| `Builder`, `Text`, `Icon`, `Field`, `useBuilder`, `baseAddon` and components/fields factories | Same names |
| `Container` | `renderContainer(key)` & `containerAttributes(key)` |
| `Catalogue` | The insert panel & the toolbar's insert button |
| `DisplayableSettings`, `Option`, `dragOption`, `collapseOption`, `backgroundColorOption` | No equivalent |
| Junipero components re-exported (`TextField`, `SelectField`, `Dropdown`, `classNames`...) | Not re-exported: import them from `@junipero/react` |

### Addon packages

The rich text addons only declare a field and work with ash as is (don't
forget their stylesheets). Inside ash, they follow the builder's colors
(light & dark), with or without `@oakjs/theme`:

- `@oakjs/addon-ckeditor5-react`
- `@oakjs/addon-remirror`
- `@oakjs/addon-lexical` (new: same toolbar as the CKEditor field, built on
  the MIT-licensed Lexical instead of CKEditor 5's GPL/commercial license)

See the `Ash/Addons` stories for examples.

### Rendering on your website

The renderers used by the canvas come from
[`@oakjs/react-renderer`](../react-renderer): use them to render your content
on your website exactly like in the builder.

