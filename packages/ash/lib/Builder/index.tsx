import {
  type ChangeEvent,
  type ComponentPropsWithoutRef,
  type ReactNode,
  type Ref,
  type RefObject,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import type {
  Builder as CoreBuilder,
  BuilderOptions,
  ComponentSettingsFieldObject,
  ElementObject,
} from '@oakjs/core';
import { classNames } from '@junipero/react';

import type {
  AshAddonObject,
  DragSource,
  DropIndicator,
  ImageUploadCallbackResult,
  PagePreset,
  PageSettingObject,
  PageValue,
  PreviewMode,
  Theme,
  Tool,
} from '../types';
import {
  type BuilderContextValue,
  type EditorContextValue,
  BuilderContext,
  EditorContext,
} from '../contexts';
import { useRootBuilder } from '../hooks';
import { useShortcuts } from '../useShortcuts';
import { buildTree } from '../tree';
import { defaultPreviewModes } from '../Canvas/previewModes';
import Canvas from '../Canvas';
import Layers from '../Layers';
import Insert from '../Insert';
import Properties from '../Properties';
import Sidebar from '../Sidebar';
import Text from '../Text';

export declare interface BuilderRef {
  isOak: boolean;
  /** Saves the content (see `onSave`) */
  save: () => void | Promise<void>;
  builder: CoreBuilder;
  content: ElementObject[];
  innerRef: RefObject<HTMLDivElement>;
  select: (id: string | null) => void;
}

export declare interface BuilderProps
  extends Omit<ComponentPropsWithoutRef<'div'>, 'onChange' | 'defaultValue'> {
  ref?: Ref<BuilderRef>;
  addons: AshAddonObject[];
  value?: ElementObject[];
  defaultValue?: ElementObject[];
  activeTextSheet?: string;
  options?: Partial<BuilderOptions>;
  /** Initial width of the page preview, in px */
  defaultPageWidth?: number;
  pagePresets?: PagePreset[];
  /**
   * Title of the page properties (displayed when nothing is selected),
   * e.g. "Appearance". Defaults to "Page".
   */
  pageTitle?: ReactNode;
  /**
   * Displayed under the page properties title. Defaults to the number of
   * elements, `null` hides it.
   */
  pageDescription?: ReactNode;
  /**
   * Settings displayed in the page properties (when nothing is selected),
   * merged with the addons' `pageSettings`
   */
  pageSettings?: PageSettingObject[];
  /** Page settings values (controlled) */
  pageValue?: PageValue;
  /** Initial page settings values (uncontrolled) */
  defaultPageValue?: PageValue;
  onPageChange?(value: PageValue): void;
  /**
   * Rendered at the top of the page inside the canvas, e.g. to inject custom
   * css or fonts from the page settings
   */
  renderPageHead?(value: PageValue): ReactNode;
  /**
   * Ways the content can be previewed in context (full page, inside an
   * article, as a modal, as a bottom drawer...)
   */
  previewModes?: PreviewMode[];
  defaultPreviewMode?: string;
  /**
   * Theme of the builder interface. `auto` (default) uses tailwind's dark
   * mode: a `dark` class (or `data-theme="dark"`) on an ancestor, or the
   * browser's preference.
   */
  theme?: Theme | 'auto';
  /**
   * Initial theme of the canvas (default: `light`), which can then be toggled
   * from the canvas. In dark mode, the content is displayed with its dark
   * styles.
   */
  defaultCanvasTheme?: Theme;
  leftSidebarWidth?: number;
  rightSidebarWidth?: number;
  shortcutsEnabled?: boolean;
  /**
   * Class name applied to the page rendered in the canvas, e.g. to apply the
   * fonts & styles of the website the content will be displayed on
   */
  pageClassName?: string;
  /**
   * Displayed at the top of the left sidebar, above the layers & insert
   * panels (e.g. a back button, the edited item's name...). It is rendered
   * inside the builder: it can use the `useBuilder` & `useEditor` hooks.
   */
  header?: ReactNode;
  /**
   * Replaces the default classes of the header container (padding & bottom
   * border)
   */
  headerClassName?: string;
  polyfills?: {
    DOMParser: typeof DOMParser;
    XMLSerializer: typeof XMLSerializer;
  };
  onChange?(content: ElementObject[]): void;
  /**
   * Called when the user saves (Cmd/Ctrl + S, or `save()` from `useBuilder()`
   * or the builder's ref), after pending property changes are committed
   */
  onSave?(
    content: ElementObject[],
    opts: { pageValue: PageValue },
  ): void | Promise<void>;
  onImageUpload?(event: ChangeEvent<HTMLInputElement>, opts: {
    element?: ElementObject;
    setting?: ComponentSettingsFieldObject;
  }): ImageUploadCallbackResult | Promise<ImageUploadCallbackResult>;
}

type LeftPanel = 'layers' | 'insert';

const Builder = ({
  ref,
  id,
  className,
  value,
  defaultValue,
  addons: addonsProp,
  activeTextSheet,
  options,
  defaultPageWidth = 1024,
  pagePresets,
  pageTitle,
  pageDescription,
  pageSettings: pageSettingsProp,
  pageValue: pageValueProp,
  defaultPageValue,
  onPageChange,
  renderPageHead,
  previewModes: previewModesProp,
  defaultPreviewMode,
  theme = 'auto',
  defaultCanvasTheme,
  leftSidebarWidth = 260,
  rightSidebarWidth = 300,
  shortcutsEnabled = true,
  header,
  headerClassName,
  pageClassName,
  polyfills,
  onChange,
  onSave,
  onImageUpload,
  ...rest
}: BuilderProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const floatingsRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const {
    builder,
    content,
    addons,
    canUndo,
    canRedo,
    version,
  } = useRootBuilder({
    content: value,
    defaultContent: defaultValue,
    addons: addonsProp as any[],
    options,
    activeTextSheet,
    onChange,
  });

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [tool, setTool] = useState<Tool>('move');
  const [temporaryPan, setTemporaryPan] = useState(false);
  const [pageWidth, setPageWidth] = useState(defaultPageWidth);
  const previewModes = useMemo(() => (
    previewModesProp?.length ? previewModesProp : defaultPreviewModes()
  ), [previewModesProp]);
  const [previewModeId, setPreviewMode] = useState<string>(
    defaultPreviewMode || previewModes[0].id
  );
  const previewMode = previewModes.find(m => m.id === previewModeId) ||
    previewModes[0];
  const [dragSource, setDragSource] = useState<DragSource | null>(null);
  const [dropIndicator, setDropIndicator] = useState<DropIndicator | null>(
    null
  );
  const [leftPanel, setLeftPanel] = useState<LeftPanel>('layers');
  const [pageValue, setPageValueState] = useState<PageValue>(
    () => pageValueProp ?? defaultPageValue ?? {}
  );

  // Allow to change the page value from outside
  useEffect(() => {
    if (pageValueProp !== undefined) {
      setPageValueState(pageValueProp);
    }
  }, [pageValueProp]);

  const onPageChangeRef = useRef(onPageChange);
  onPageChangeRef.current = onPageChange;

  const setPageValue = useCallback((value: PageValue) => {
    setPageValueState(value);
    onPageChangeRef.current?.(value);
  }, []);

  // Pending changes (debounced edits) to commit before saving
  const pendingChanges = useRef(new Set<() => void>());

  const registerPendingChanges = useCallback((flush: () => void) => {
    pendingChanges.current.add(flush);

    return () => {
      pendingChanges.current.delete(flush);
    };
  }, []);

  const onSaveRef = useRef(onSave);
  onSaveRef.current = onSave;
  const pageValueRef = useRef(pageValue);
  pageValueRef.current = pageValue;

  const hasOnSave = !!onSave;

  const save = useCallback(() => {
    pendingChanges.current.forEach(flush => flush());

    return onSaveRef.current?.(builder.getContent(), {
      pageValue: pageValueRef.current,
    });
  }, [builder]);

  const pageSettings = useMemo<PageSettingObject[]>(() => [
    ...(pageSettingsProp || []),
    ...((addons || []) as AshAddonObject[])
      .flatMap(addon => addon?.pageSettings || []),
  ], [pageSettingsProp, addons]);

  const [canvasTheme, setCanvasTheme] = useState<Theme>(
    defaultCanvasTheme || 'light'
  );

  const tree = useMemo(() => (
    buildTree(builder, content)
  // Content is mutated in place, version changes on every update
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ), [builder, content, version, addons]);

  // Clear selection/hover of elements that don't exist anymore (undo, ...)
  useEffect(() => {
    if (selectedId && !tree.nodes.has(selectedId)) {
      setSelectedId(null);
    }

    if (hoveredId && !tree.nodes.has(hoveredId)) {
      setHoveredId(null);
    }
  }, [tree, selectedId, hoveredId]);

  useImperativeHandle(ref, () => ({
    isOak: true,
    save,
    builder,
    content,
    innerRef: rootRef,
    select: setSelectedId,
  }));

  const builderContext = useMemo<BuilderContextValue>(() => ({
    builder,
    content,
    addons,
    canUndo,
    canRedo,
    rootRef,
    floatingsRef,
    polyfills,
    pageClassName,
    pageTitle,
    pageDescription,
    shortcutsEnabled,
    renderPageHead,
    onImageUpload,
    ...hasOnSave && { save },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [
    hasOnSave, save,
    builder, content, version, addons, canUndo, canRedo, polyfills,
    pageClassName, pageTitle, pageDescription, shortcutsEnabled,
    renderPageHead, onImageUpload,
  ]);

  const select = useCallback((id: string | null) => setSelectedId(id), []);
  const hover = useCallback((id: string | null) => {
    setHoveredId(h => h === id ? h : id);
  }, []);

  const activeTool: Tool = temporaryPan ? 'pan' : tool;

  const editorContext = useMemo<EditorContextValue>(() => ({
    tree,
    selectedId,
    hoveredId,
    tool,
    activeTool,
    pageWidth,
    previewModes,
    previewMode,
    pageSettings,
    pageValue,
    setPageValue,
    canvasTheme,
    dragSource,
    dropIndicator,
    frameRef,
    select,
    hover,
    setTool,
    setPageWidth,
    setPreviewMode,
    registerPendingChanges,
    setCanvasTheme,
    setDragSource,
    setDropIndicator,
  }), [
    tree, selectedId, hoveredId, tool, activeTool, pageWidth, previewModes,
    previewMode, pageSettings, pageValue, setPageValue, canvasTheme,
    registerPendingChanges,
    dragSource, dropIndicator, select, hover,
  ]);

  useShortcuts({
    rootRef,
    builder,
    editor: editorContext,
    setTemporaryPan,
    save: onSave ? save : undefined,
    enabled: shortcutsEnabled,
  });

  const panels: { id: LeftPanel; title: ReactNode }[] = [
    { id: 'layers', title: <Text name="ash.panels.layers">Layers</Text> },
    { id: 'insert', title: <Text name="ash.panels.insert">Insert</Text> },
  ];

  return (
    <BuilderContext value={builderContext}>
      <EditorContext value={editorContext}>
        <div
          { ...rest }
          id={id}
          ref={rootRef}
          className={classNames(
            'oak-ash oak:flex oak:w-full oak:h-full oak:min-h-0',
            'oak:overflow-hidden oak:bg-ash-muted oak:text-ash-text',
            // Forced themes, see the `dark` variant in index.css
            { dark: theme === 'dark', light: theme === 'light' },
            'oak:relative oak:isolate',
            className,
          )}
        >
          <Sidebar side="left" defaultWidth={leftSidebarWidth}>
            { header && (
              <div
                className={classNames(
                  'oak-ash-sidebar-header oak:flex-none',
                  headerClassName ??
                    'oak:px-3 oak:py-3 oak:border-b oak:border-ash-border',
                )}
              >
                { header }
              </div>
            ) }
            <div
              role="tablist"
              className={classNames(
                'oak:flex oak:items-center oak:gap-1 oak:px-2 oak:h-11',
                'oak:flex-none oak:border-b oak:border-ash-border',
              )}
            >
              { panels.map(panel => (
                <button
                  key={panel.id}
                  type="button"
                  role="tab"
                  aria-selected={leftPanel === panel.id}
                  onClick={() => setLeftPanel(panel.id)}
                  className={classNames(
                    'oak:px-2.5 oak:py-1 oak:rounded oak:border-0',
                    'oak:text-[13px] oak:font-medium oak:cursor-pointer',
                    leftPanel === panel.id
                      ? 'oak:bg-ash-muted oak:text-ash-text'
                      : 'oak:bg-transparent oak:text-ash-text-muted oak:hover:text-ash-text',
                  )}
                >
                  { panel.title }
                </button>
              )) }
            </div>
            <div className="oak:flex-auto oak:min-h-0 oak:overflow-auto">
              { leftPanel === 'layers' ? <Layers /> : <Insert /> }
            </div>
          </Sidebar>

          <main className="oak:relative oak:flex-auto oak:min-w-0 oak:h-full">
            <Canvas />
          </main>

          <Sidebar side="right" defaultWidth={rightSidebarWidth}>
            <Properties pagePresets={pagePresets} />
          </Sidebar>

          <div
            ref={floatingsRef}
            className="oak-ash-floatings oak:absolute oak:top-0 oak:left-0 oak:z-50"
          />
        </div>
      </EditorContext>
    </BuilderContext>
  );
};

Builder.displayName = 'Builder';

export default Builder;
