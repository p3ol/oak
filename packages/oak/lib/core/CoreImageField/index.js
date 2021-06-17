import { useReducer, useEffect } from 'react';
import { TouchableZone, Loader, classNames, mockState } from '@poool/junipero';

import { useOptions } from '../../hooks';

export default ({
  className,
  value,
  onChange,
  accept = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml'],
}) => {
  const { events } = useOptions();
  const [state, dispatch] = useReducer(mockState, {
    value: value || '',
    loading: false,
  });

  useEffect(() => {
    if (value) {
      dispatch({ value });
    }
  }, [value]);

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
    if (state.loading) {
      return;
    }

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
          onUrlReady({ url: fr.result });
        };
      } else {
        dispatch({ loading: false });
      }
    }
  };

  const onUrlReady = ({ url } = {}) => {
    dispatch({ value: url });
    onChange?.({ value: url });
    dispatch({ loading: false });
  };

  const onReset = e => {
    e.preventDefault();
    dispatch({ value: null });
    onChange?.({ value: null });
  };

  return (
    <TouchableZone
      className={classNames('oak-core-image-field', className)}
      disabled={state.loading}
      onClick={state.value ? onReset : onOpenFileDialog}
      style={{
        backgroundImage: state.value && `url(${state.value})`,
      }}
    >
      { state.loading ? (
        <Loader />
      ) : !state.value ? (
        <i className="oak-icons">add</i>
      ) : (
        <div className="oak-remove">
          <i className="oak-icons">close</i>
        </div>
      ) }
    </TouchableZone>
  );
};
