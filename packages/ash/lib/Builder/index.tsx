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
  Collaborator,
  FieldCursor,
  DragSource,
  DropIndicator,
  HistoryController,
  ImageUploadCallbackResult,
  PagePreset,
  PageSettingObject,
  PageValue,
  PreviewMode,
  PreviewSettingObject,
  PreviewValue,
  Theme,
  Tool,
} from '../types';
import {
  type BuilderContextValue,
  type CanvasController,
  type CenterOnOptions,
  type EditorContextValue,
  BuilderContext,
  EditorContext,
} from '../contexts';
import { useRootBuilder } from '../hooks';
import { useInteractionTracking, useShortcuts } from '../useShortcuts';
import { buildTree } from '../tree';
import { defaultPreviewModes } from '../Canvas/previewModes';
import {
  getPreviewEventValue,
  getPreviewFilters,
  getPreviewSettings,
  isDisplayedWith,
} from '../previewSettings';
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
  /** Selects an element, several elements, or none */
  select: (id: string | string[] | null) => void;
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
   * Displayed in the canvas when the page is empty, below the drop hint (e.g.
   * a button to start from a template)
   */
  emptyPageContent?: ReactNode;
  /**
   * Ways the content can be previewed in context (full page, inside an
   * article, as a modal, as a bottom drawer...)
   */
  previewModes?: PreviewMode[];
  defaultPreviewMode?: string;
  /**
   * Settings displayed in the page properties' preview section, previewing
   * states of the content in the canvas (e.g. a submitted form), merged with
   * the addons' `previewSettings`
   */
  previewSettings?: PreviewSettingObject[];
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
   * Undo/redo handled outside of the builder (e.g. by Yjs's UndoManager).
   * The builder's own history is disabled when given.
   */
  history?: HistoryController;
  /**
   * Called when the selection changes, with the selected element (the last
   * one selected when several are) & every selected element
   */
  onSelectionChange?(
    id: string | null,
    element: ElementObject | null,
    selection: { ids: string[]; elements: ElementObject[] },
  ): void;
  /**
   * Other users editing the same content: their selections are displayed in
   * the canvas & the layers panel
   */
  collaborators?: Collaborator[];
  /**
   * Called when the user's cursor moves inside a field (`null` when it leaves
   * it), to display it to the other users (see `Collaborator.cursor`)
   */
  onCursorChange?(cursor: FieldCursor | null): void;
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
  emptyPageContent,
  previewModes: previewModesProp,
  defaultPreviewMode,
  previewSettings: previewSettingsProp,
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
  history,
  onSelectionChange,
  collaborators,
  onCursorChange,
  onSave,
  onImageUpload,
  ...rest
}: BuilderProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  // The builder's own history is useless when undo/redo are handled outside
  const hasHistory = !!history;
  const builderOptions = useMemo(() => (
    hasHistory ? { ...options, history: false } : options
  ), [options, hasHistory]);
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
    options: builderOptions,
    activeTextSheet,
    onChange,
  });

  // External history controller (e.g. Yjs's UndoManager)
  const historyRef = useRef(history);
  historyRef.current = history;

  const undo = useCallback(() => {
    if (historyRef.current) {
      historyRef.current.undo();
    } else {
      builder.undo();
    }
  }, [builder]);

  const redo = useCallback(() => {
    if (historyRef.current) {
      historyRef.current.redo();
    } else {
      builder.redo();
    }
  }, [builder]);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const selectedId = selectedIds.at(-1) ?? null;
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

  // Canvas displaying the content (none in the preview)
  const canvasController = useRef<CanvasController | null>(null);

  const registerCanvas = useCallback((controller: CanvasController) => {
    canvasController.current = controller;

    return () => {
      if (canvasController.current === controller) {
        canvasController.current = null;
      }
    };
  }, []);

  const centerOn = useCallback((id: string, opts?: CenterOnOptions) => (
    canvasController.current?.centerOn(id, opts) ?? false
  ), []);

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

  const previewSettings = useMemo<PreviewSettingObject[]>(() => (
    getPreviewSettings(addons as AshAddonObject[], previewSettingsProp)
  ), [previewSettingsProp, addons]);

  // Never saved: only used to preview the content
  const [previewValue, setPreviewValue] = useState<PreviewValue>({});

  const previewFilters = useMemo(() => (
    getPreviewFilters(builder, previewSettings, previewValue)
  // Conditions can depend on the content: mutated in place, version changes
  // on every update
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ), [previewSettings, previewValue, builder, content, version]);

  const isElementDisplayed = useCallback((element: ElementObject) => (
    isDisplayedWith(previewFilters, element, previewValue)
  ), [previewFilters, previewValue]);

  // Interactions with the canvas content update the previewed state
  const onPreviewEvent = useCallback((
    eventName: string | undefined,
    element: ElementObject,
  ) => {
    const next = getPreviewEventValue(
      builder, previewFilters, previewValue, element, eventName,
    );

    if (next) {
      setPreviewValue(next);
    }
  }, [builder, previewFilters, previewValue]);

  const tree = useMemo(() => (
    buildTree(builder, content)
  // Content is mutated in place, version changes on every update
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ), [builder, content, version, addons]);

  // Notify selection changes (e.g. to share them with collaborators)
  const onSelectionChangeRef = useRef(onSelectionChange);
  onSelectionChangeRef.current = onSelectionChange;

  useEffect(() => {
    onSelectionChangeRef.current?.(
      selectedId,
      selectedId ? tree.nodes.get(selectedId)?.element ?? null : null,
      {
        ids: selectedIds,
        elements: selectedIds
          .map(id => tree.nodes.get(id)?.element)
          .filter(Boolean),
      },
    );
  // Only when the selection changes, not when the content does
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIds]);

  const collaboratorsList = useMemo(() => collaborators || [], [collaborators]);

  const onCursorChangeRef = useRef(onCursorChange);
  onCursorChangeRef.current = onCursorChange;

  const setCursor = useCallback((cursor: FieldCursor | null) => {
    onCursorChangeRef.current?.(cursor);
  }, []);

  // Clear selection/hover of elements that don't exist anymore (undo, ...)
  useEffect(() => {
    if (selectedIds.some(id => !tree.nodes.has(id))) {
      setSelectedIds(ids => ids.filter(id => tree.nodes.has(id)));
    }

    if (hoveredId && !tree.nodes.has(hoveredId)) {
      setHoveredId(null);
    }
  }, [tree, selectedIds, hoveredId]);

  useImperativeHandle(ref, () => ({
    isOak: true,
    save,
    builder,
    content,
    innerRef: rootRef,
    select: (id: string | string[] | null) => setSelectedIds(
      Array.isArray(id) ? id : id ? [id] : []
    ),
  }));

  const builderContext = useMemo<BuilderContextValue>(() => ({
    builder,
    content,
    addons,
    canUndo: history ? history.canUndo : canUndo,
    canRedo: history ? history.canRedo : canRedo,
    undo,
    redo,
    rootRef,
    floatingsRef,
    polyfills,
    pageClassName,
    pageTitle,
    pageDescription,
    shortcutsEnabled,
    renderPageHead,
    emptyPageContent,
    onImageUpload,
    ...hasOnSave && { save },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [
    hasOnSave, save,
    builder, content, version, addons, canUndo, canRedo, polyfills,
    history?.canUndo, history?.canRedo, undo, redo,
    pageClassName, pageTitle, pageDescription, shortcutsEnabled,
    renderPageHead, emptyPageContent, onImageUpload,
  ]);

  const select = useCallback((
    id: string | null,
    { toggle = false }: { toggle?: boolean } = {},
  ) => {
    setSelectedIds(ids => {
      if (!id) {
        return toggle ? ids : (ids.length ? [] : ids);
      }

      if (toggle) {
        return ids.includes(id)
          ? ids.filter(i => i !== id)
          : [...ids, id];
      }

      return ids.length === 1 && ids[0] === id ? ids : [id];
    });
  }, []);

  const selectMany = useCallback((ids: string[]) => {
    setSelectedIds(Array.from(new Set(ids)));
  }, []);
  const hover = useCallback((id: string | null) => {
    setHoveredId(h => h === id ? h : id);
  }, []);

  const activeTool: Tool = temporaryPan ? 'pan' : tool;

  const editorContext = useMemo<EditorContextValue>(() => ({
    tree,
    selectedId,
    selectedIds,
    hoveredId,
    tool,
    activeTool,
    pageWidth,
    previewModes,
    previewMode,
    collaborators: collaboratorsList,
    setCursor,
    pageSettings,
    previewSettings,
    previewValue,
    setPreviewValue,
    isElementDisplayed,
    onPreviewEvent,
    pageValue,
    setPageValue,
    canvasTheme,
    dragSource,
    dropIndicator,
    frameRef,
    select,
    selectMany,
    hover,
    setTool,
    setPageWidth,
    setPreviewMode,
    registerPendingChanges,
    centerOn,
    registerCanvas,
    setCanvasTheme,
    setDragSource,
    setDropIndicator,
  }), [
    tree, selectedId, selectedIds, hoveredId, tool, activeTool, pageWidth,
    previewModes, selectMany,
    previewMode, collaboratorsList, setCursor, pageSettings, pageValue,
    previewSettings, previewValue, isElementDisplayed, onPreviewEvent,
    setPageValue,
    canvasTheme,
    registerPendingChanges, centerOn, registerCanvas,
    dragSource, dropIndicator, select, hover,
  ]);

  useInteractionTracking(rootRef);
  useShortcuts({
    rootRef,
    builder,
    editor: editorContext,
    setTemporaryPan,
    undo,
    redo,
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
