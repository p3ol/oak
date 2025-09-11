import type { EditorConfig, EventInfo } from 'ckeditor5';
import {
  type ComponentPropsWithoutRef,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
  type FieldContent,
  type ElementObject,
  classNames,
} from '@oakjs/react';

import type { ClassicEditor } from '../Editor';

export interface CKEditorFieldProps extends ComponentPropsWithoutRef<any> {
  editor?: ClassicEditor;
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
  const [defaultEditor, setDefaultEditor] = useState<{
    classicEditor: typeof ClassicEditor;
  }>();

  const loadEditor = useCallback(async () => {
    const Editor = (await import('../Editor')).default;

    setDefaultEditor({
      classicEditor: Editor,
    });
  }, []);

  useEffect(() => {
    if (!editor && !defaultEditor) {
      loadEditor();
    }
  }, [editor, defaultEditor, loadEditor]);

  const onChange_ = useCallback((_: EventInfo, ed: ClassicEditor) => {
    onChange?.({ value: ed.getData() });
  }, [onChange]);

  if (!editor && !defaultEditor) {
    return null;
  }

  return (
    <div className={classNames('ckeditor-field', className)}>
      <CKEditor
        // @ts-expect-error CK editor is weird anyway
        editor={editor || defaultEditor?.classicEditor}
        config={config}
        data={value}
        onChange={onChange_}
      />
    </div>
  );
};

CKEditorField.displayName = 'CKEditorField';

export default CKEditorField;
