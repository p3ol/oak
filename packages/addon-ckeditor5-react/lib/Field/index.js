import { useCallback } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { classNames } from '@oakjs/react';

const CKEditorField = ({ className, editor, config, value, onChange }) => {
  const onChange_ = useCallback((_, ed) => {
    onChange({ value: ed.getData() });
  }, []);

  return (
    <div className={classNames('ckeditor-field', className)}>
      <CKEditor
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
