import { useReducer, useEffect } from 'react';
import { TouchableZone, Spinner, classNames, mockState } from '@junipero/react';
import { Text, useOptions, useElement } from '@poool/oak';

export default ({
  className,
  value,
  onChange,
  accept = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml'],
}) => {
  const { events } = useOptions();
  const { element } = useElement();
  const [state, dispatch] = useReducer(mockState, {
    value: element?.url || '',
    name: element?.name || '',
    loading: false,
  });

  useEffect(() => {
    if (value) {
      dispatch({ value });
    }
  }, [value]);

  useEffect(() => {
    if (element.name) {
      dispatch({ name: element.name });
    }
  }, [element?.name]);

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

      if (result) {
        onUrlReady(result);
      } else {
        dispatch({ loading: false });
      }
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
    onChange?.({ value: url, name });
    dispatch({ loading: false });
  };

  const onReset = e => {
    e.preventDefault();
    dispatch({ value: null, name: null });
    onChange?.({ value: null, name: null });
  };

  const getName = () =>
    state.name ||
    (/data:/.test(state.value) ? 'Local image' : state.value) ||
    'No image';

  return (
    <div
      className={classNames(
        'oak-image-field',
        { 'oak-loading': state.loading },
        className
      )}
    >
      { state.value ? (
        <>
          <div
            className="oak-image-field-preview"
            style={{
              backgroundImage: `url(${state.value})`,
            }}
          />
          <div className="oak-image-field-info">
            <div className="oak-image-name">{ getName() }</div>
            <div className="oak-image-field-actions">
              <a href="#" className="oak-delete" onClick={onReset}>
                <Text
                  name="addons.basicComponents.fields.image.del"
                  default="Delete"
                />
              </a>
            </div>
          </div>
        </>
      ) : (
        <TouchableZone disabled={state.loading} onClick={onOpenFileDialog}>
          { state.loading ? (
            <Spinner />
          ) : (
            <>
              <i className="oak-icons">add</i>
              <span>
                <Text
                  name="addons.basicComponents.fields.image.add"
                  default="Add image"
                />
              </span>
            </>
          )}
        </TouchableZone>
      ) }
    </div>
  );
};
