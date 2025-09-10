import type { FieldContent } from '@oakjs/core';
import { ColorField } from '@oakjs/react';

import type { Editor } from '../Editor';

export interface FieldProps {
  editor: Editor;
}

const Field = ({ editor }: FieldProps) => {
  const value = editor.model.document.selection
    .getAttribute('fontColor') as string;

  const onChange = (field: FieldContent<string>) => {
    editor.execute('fontColor', { value: field.value });
  };

  return (
    <div className="ck-reset_all-excluded ck-oak-color-field">
      <ColorField
        autoFocus
        value={value}
        onChange={onChange}
        opened={true}
        trigger="manual"
      />
    </div>
  );
};

Field.displayName = 'Field';

export default Field;
