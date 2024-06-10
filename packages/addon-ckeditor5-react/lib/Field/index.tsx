import type { EditorConfig } from '@ckeditor/ckeditor5-core';
import type { EventInfo } from '@ckeditor/ckeditor5-utils';
import type { Editor } from '@oakjs/ckeditor5-build-custom';
import { type ComponentPropsWithoutRef, useCallback } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
  type FieldContent,
  type ElementObject,
  classNames,
} from '@oakjs/react';

export interface CKEditorFieldProps extends ComponentPropsWithoutRef<any> {
  editor?: Editor;
  config?: EditorConfig;
  value?: string;
  onChange?(field: FieldContent<string>, element?: ElementObject): void;
}

const CKEditorField = ({
  className,
  editor,
  config,
  value,
  onChange,
}: CKEditorFieldProps) => {
  const onChange_ = useCallback((_: EventInfo, ed: Editor) => {
    onChange?.({ value: ed.getData() });
  }, []);

  return (
    <div className={classNames('ckeditor-field', className)}>
      <CKEditor
        // @ts-ignore CK editor is weird anyway
        editor={editor}
        config={config}
        data={value}
        onChange={onChange_}
      />
    </div>
  );
};

CKEditorField.displayName = 'CKEditorField';

export default CKEditorField;
