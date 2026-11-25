import {
  type ChangeEvent,
  type ReactNode,
  type RefObject,
  createContext,
} from 'react';
import type {
  AddonObject,
  Builder,
  ComponentSettingsFieldObject,
  ElementObject,
} from '@oakjs/core';
import type { ResolveURLCallback } from '@oakjs/react-renderer';

import type {
  DragSource,
  DropIndicator,
  Collaborator,
  FieldCursor,
  ImageUploadCallbackResult,
  PageSettingObject,
  PageValue,
  PreviewMode,
  PreviewSettingObject,
  PreviewValue,
  Tool,
} from './types';
import type { ContentTree } from './tree';
import type { Theme } from './types';

export declare interface BuilderContextValue {
  builder?: Builder;
  content?: ElementObject[];
  addons?: AddonObject[];
  canUndo?: boolean;
  canRedo?: boolean;
  /** Undo/redo, using the external history controller if given */
  undo?(): void;
  redo?(): void;
  rootRef?: RefObject<HTMLDivElement>;
  shortcutsEnabled?: boolean;
  /**
   * Saves the content (calls the builder's `onSave`), after committing the
   * pending property changes. Undefined if `onSave` isn't set.
   */
  save?(): void | Promise<void>;
  /** Rendered at the top of the page in the canvas (styles, fonts...) */
  renderPageHead?(value: PageValue): ReactNode;
  /** Title of the page properties (defaults to "Page") */
  pageTitle?: ReactNode;
  /**
   * Displayed under the page properties title (defaults to the number of
   * elements, `null` hides it)
   */
  pageDescription?: ReactNode;
  /** Class name applied to the page root inside the canvas */
  pageClassName?: string;
  /** Displayed in the canvas when the page is empty, below the hint */
  emptyPageContent?: ReactNode;
  floatingsRef?: RefObject<HTMLDivElement>;
  polyfills?: {
    DOMParser: typeof DOMParser;
    XMLSerializer: typeof XMLSerializer;
  };
  onImageUpload?(event: ChangeEvent<HTMLInputElement>, opts?: {
    element?: ElementObject;
    setting?: ComponentSettingsFieldObject;
  }): ImageUploadCallbackResult | Promise<ImageUploadCallbackResult>;
  /** Resolves the urls of resources (e.g. images) before rendering them */
  resolveURL?: ResolveURLCallback;
}

export const BuilderContext = createContext<BuilderContextValue>({});

export declare interface CenterOnOptions {
  /** Duration of the transition, in ms (defaults to 200) */
  duration?: number;
}

/** Moves the canvas, registered by the canvas (see `centerOn`) */
export declare interface CanvasController {
  centerOn(id: string, opts?: CenterOnOptions): boolean;
}

export declare interface EditorContextValue {
  tree: ContentTree;
  /** Selected element (the last one selected when several are) */
  selectedId: string | null;
  /** Selected elements, in the order they were selected */
  selectedIds: string[];
  hoveredId: string | null;
  tool: Tool;
  /** Tool currently in use (e.g. `pan` while holding space) */
  activeTool: Tool;
  pageWidth: number;
  previewModes: PreviewMode[];
  previewMode: PreviewMode;
  /** Other users editing the content */
  collaborators: Collaborator[];
  /** Shares the local cursor (in a field) with the other users */
  setCursor(cursor: FieldCursor | null): void;
  /** Page settings (from props & addons) */
  pageSettings: PageSettingObject[];
  /** Settings of the preview section (from props & addons) */
  previewSettings: PreviewSettingObject[];
  /** Values of the preview settings (never saved) */
  previewValue: PreviewValue;
  setPreviewValue(value: PreviewValue): void;
  /**
   * Whether an element is displayed in the canvas, given the preview
   * settings
   */
  isElementDisplayed(element: ElementObject): boolean;
  /**
   * Called when an element of the canvas emits an event (e.g. a clickable),
   * to update the previewed state (see `PreviewSettingObject.onElementEvent`)
   */
  onPreviewEvent(eventName: string | undefined, element: ElementObject): void;
  pageValue: PageValue;
  setPageValue(value: PageValue): void;
  /** Theme used to display the content inside the canvas */
  canvasTheme: Theme;
  dragSource: DragSource | null;
  dropIndicator: DropIndicator | null;
  frameRef: RefObject<HTMLDivElement>;
  /**
   * Selects an element (or none). With `toggle`, adds it to the selection
   * (or removes it if already selected) instead of replacing it.
   */
  select(id: string | null, opts?: { toggle?: boolean }): void;
  selectMany(ids: string[]): void;
  hover(id: string | null): void;
  setTool(tool: Tool): void;
  setPageWidth(width: number): void;
  setPreviewMode(id: string): void;
  /**
   * Registers a function committing pending changes (e.g. debounced property
   * edits), called before saving. Returns an unregister function.
   */
  registerPendingChanges(flush: () => void): () => void;
  /**
   * Moves the canvas so that an element is at its center (keeping the zoom,
   * or showing its top if it's taller than the canvas). Returns false if the
   * element isn't displayed in the canvas.
   */
  centerOn(id: string, opts?: CenterOnOptions): boolean;
  /**
   * Used by the canvas to handle `centerOn`. Returns an unregister function.
   */
  registerCanvas(controller: CanvasController): () => void;
  setCanvasTheme(theme: Theme): void;
  setDragSource(source: DragSource | null): void;
  setDropIndicator(indicator: DropIndicator | null): void;
}

export const EditorContext = createContext<EditorContextValue>(null);
