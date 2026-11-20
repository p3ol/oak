import type { ReactNode, RefObject } from 'react';
import type {
  AddonObject,
  BaseSettingsOptions,
  ComponentObject,
  ComponentOverrideObject,
  ComponentSettingsFieldObject,
  ComponentTabOject,
  ElementObject,
  FieldContent,
  FieldObject,
  FieldOverrideObject,
  GetTextCallback,
  SettingOverrideObject,
} from '@oakjs/core';
import type { RendererComponent } from '@oakjs/react-renderer';

export declare type Tool = 'move' | 'pan';

export declare type Theme = 'light' | 'dark';

export declare interface ImageUploadCallbackResult {
  url: string;
  name: string;
  [key: string]: any;
}

export declare interface CommonFieldProps {
  fieldOptions?: {
    onChange?: (name: string, field: FieldContent) => void;
    setting?: ComponentSettingsFieldObject;
    floatingsRef?: RefObject<HTMLDivElement>;
    element?: ElementObject;
    field?: FieldObject;
    overrides?: any;
    t?: GetTextCallback;
    /**
     * Other users whose cursor is in this field, to display their carets &
     * selections (see `FieldCursors`)
     */
    collaborators?: FieldCollaborator[];
    /**
     * Shares the local selection in this field with the other users (`null`
     * when the field loses focus). Positions are defined by the field (e.g.
     * text offsets) and must be understood by the same field of other users.
     */
    onSelectionChange?(selection: FieldSelection | null): void;
  };
}

export declare interface AshFieldObject extends FieldObject {
  render?(props: Record<string, any> & CommonFieldProps): ReactNode;
}

/**
 * A component definition for ash. Its `render` method is a page renderer:
 * the component is rendered inside the builder canvas exactly like it will be
 * rendered on the final page.
 */
export declare interface AshComponentObject
  extends Omit<ComponentObject, 'render'> {
  render?: RendererComponent;
}

export declare interface AshComponentOverrideObject
  extends Omit<ComponentOverrideObject, 'render'> {
  render?: RendererComponent;
}

export declare interface AshFieldOverrideObject extends FieldOverrideObject {
  render?(props: Record<string, any> & CommonFieldProps): ReactNode;
}

/**
 * A page setting is defined like a component setting field (`type`, `key`,
 * `label`, `condition`...), and is displayed in the page properties.
 */
export declare type PageSettingObject = ComponentSettingsFieldObject;

export declare type PageValue = Record<string, any>;

export declare interface AshAddonObject extends Omit<
  AddonObject, 'components' | 'fields' | 'overrides'
> {
  /** Settings displayed in the page properties */
  pageSettings?: PageSettingObject[];
  components?: (AshComponentObject | ComponentTabOject | any)[];
  fields?: AshFieldObject[];
  overrides?: (
    AshComponentOverrideObject |
    AshFieldOverrideObject |
    SettingOverrideObject
  )[];
}

export declare interface BaseAddonOptions extends BaseSettingsOptions {}

export declare interface PagePreset {
  id: string;
  name: string | ((t: GetTextCallback) => string);
  width: number;
}

export declare interface PreviewModeRenderProps {
  /** The editable page (it must be rendered once) */
  children: ReactNode;
  /** Width of the previewed screen, in px */
  width: number;
}

/**
 * Describes how the content is displayed on the final website (e.g. inside
 * an article, as a modal...), to preview it in context inside the canvas.
 */
export declare interface PreviewMode {
  id: string;
  name: string | ((t: GetTextCallback) => string);
  icon?: ReactNode;
  /** Classes added to the editable page */
  frameClassName?: string;
  /** Renders the surroundings of the page. Defaults to the page alone */
  render?(props: PreviewModeRenderProps): ReactNode;
}

/**
 * Where something dragged can be dropped: at `index` of the `container`
 * array, which belongs to `owner` (null for the root container).
 */
export declare interface DropTarget {
  container: ElementObject[];
  owner: ElementObject | null;
  containerKey: string;
  index: number;
}

export declare type DragSource =
  | { type: 'element'; id: string }
  | { type: 'component'; componentId: string };

export declare interface DropIndicator {
  x: number;
  y: number;
  width: number;
  height: number;
  kind: 'line' | 'box';
}

/**
 * Undo/redo handled outside of the builder (e.g. by Yjs's UndoManager). The
 * builder's own history is disabled when one is given.
 */
export declare interface HistoryController {
  canUndo: boolean;
  canRedo: boolean;
  undo(): void;
  redo(): void;
}

/**
 * Another user editing the same content, displayed in the canvas & layers
 */
export declare interface Collaborator {
  /** Unique id of the collaborator (e.g. Yjs's awareness client id) */
  id: string | number;
  name?: string;
  /** Any css color. Defaults to a color derived from the id */
  color?: string;
  /** Id of the element selected by the collaborator */
  selectedId?: string | null;
  /** Position of the collaborator's cursor in a field */
  cursor?: FieldCursor | null;
}

/** A selection inside a field (a caret when `anchor === head`) */
export declare interface FieldSelection {
  anchor: number;
  head: number;
}

export declare interface FieldCursor extends FieldSelection {
  /** Id of the edited element (`null` for page settings) */
  elementId: string | null;
  /** Key of the edited setting (e.g. `content`) */
  key: string;
}

/** A collaborator whose cursor is in a field */
export declare interface FieldCollaborator extends FieldSelection {
  id: string | number;
  name?: string;
  /** Css color */
  color: string;
}
