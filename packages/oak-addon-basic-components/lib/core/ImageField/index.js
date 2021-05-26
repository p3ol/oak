import { useReducer } from 'react';
import { TouchableZone, classNames, mockState } from '@poool/junipero';
import { useOptions } from '@poool/oak';

export default ({
  className,
  value,
  fileName,
  onChange,
  accept = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml'],
}) => {
  const { events } = useOptions();
  const [state, dispatch] = useReducer(mockState, {
    value,
    name: fileName || '',
    loading: false,
  });

  const onOpenFileDialog = e => {
    e.preventDefault();

    if (state.loading) {
      return;
    }

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = accept.join(',');

    input.addEventListener('change', onFile, false);
    input.click();
  };

  const onFile = async e => {
    dispatch({ loading: true });

    if (events?.onImageUpload) {
      const result = await events.onImageUpload(event);
      onUrlReady(result);
    } else {
      const file = e.target.files[0];

      if (file) {
        const fr = new FileReader();
        fr.readAsDataURL(file);

        fr.onload = () => {
          onUrlReady({ url: fr.result, name: file.name });
        };
      } else {
        dispatch({ loading: false });
      }
    }
  };

  const onUrlReady = ({ url, name } = {}) => {
    dispatch({ value: url, name });
    onChange({ value: url, name });
    dispatch({ loading: false });
  };

  return (
    <div className={classNames('oak-image-field', className)}>
      <TouchableZone onClick={onOpenFileDialog}>
        <i className="oak-icons">add</i>
        <span>Add an image</span>
      </TouchableZone>
    </div>
  );
};
