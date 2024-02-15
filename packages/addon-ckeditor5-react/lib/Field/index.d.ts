import { ComponentPropsWithoutRef, ReactNode } from 'react';
import { EditorConfig } from '@ckeditor/ckeditor5-core/src/editor/editorconfig';
import { Editor } from '@ckeditor/ckeditor5-core';
import { EventInfo } from 'ckeditor5/src/utils';

export declare interface CKEditorFieldProps
  extends ComponentPropsWithoutRef<any> {
  className?: string,
  editor?: Editor,
  config?: EditorConfig,
  value?: string,
  onChange: (event: EventInfo, editor: Editor) => void;
}

declare function CKEditorField(
  props: CKEditorFieldProps
): ReactNode | JSX.Element;

export default CKEditorField;
