import { useCallback } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { classNames } from '@oakjs/react';

const CKEditorField = ({ className, value, onChange }) => {
  const onChange_ = useCallback((_, editor) => {
    onChange({ value: editor.getData() });
  }, []);

  return (
    <div className={classNames('ckeditor-field', className)}>
      <CKEditor
        editor={ClassicEditor}
        data={value}
        onChange={onChange_}
      />
    </div>
  );
};

CKEditorField.displayName = 'CKEditorField';

export default CKEditorField;
