import { ColorField } from '@oakjs/react';

const Field = ({ editor }) => {
  const value = editor.model.document.selection.getAttribute('fontColor');

  const onChange = ({ value: val }) => {
    editor.execute('fontColor', { value: val });
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
