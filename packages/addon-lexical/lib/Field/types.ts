/*
 * Collaboration types given by @oakjs/ash to fields (see its `FieldSelection`
 * & `FieldCollaborator` types)
 */

/** A selection inside a field (a caret when `anchor === head`) */
export declare interface FieldSelection {
  anchor: number;
  head: number;
}

/** Another user whose cursor is in the field */
export declare interface FieldCollaborator extends FieldSelection {
  id: string | number;
  name?: string;
  /** Css color */
  color: string;
}

export declare interface CollaborationFieldOptions {
  /** Other users whose cursor is in this field */
  collaborators?: FieldCollaborator[];
  /** Shares the local selection with the other users (`null` on blur) */
  onSelectionChange?(selection: FieldSelection | null): void;
}
