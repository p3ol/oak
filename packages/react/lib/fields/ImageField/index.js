import { useReducer } from 'react';
import { TouchableZone, Spinner, classNames, mockState } from '@junipero/react';

import { useBuilder } from '../../hooks';
import Text from '../../Text';
import Icon from '../../Icon';

const ImageField = ({
  className,
  value,
  onChange,
  iconOnly = false,
  accept = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml'],
}) => {
  const { onImageUpload } = useBuilder();
  const [state, dispatch] = useReducer(mockState, {
    value: {
      ...value,
      url: value?.url || '',
    },
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
    if (state.loading) {
      return;
    }

    dispatch({ loading: true });

    if (onImageUpload) {
      const result = await onImageUpload(e);

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
          onUrlReady({ name: file.name, url: fr.result });
        };
      } else {
        dispatch({ loading: false });
      }
    }
  };

  const onUrlReady = ({ url, name, ...rest } = {}) => {
    const val = { url, name, ...rest };
    dispatch({ value: val });
    onChange?.({ value: val });
    dispatch({ loading: false });
  };

  const onReset = e => {
    e.preventDefault();
    dispatch({ value: null });
    onChange?.({ value: null });
  };

  const getName = () =>
    state.value.name ||
    (/data:/.test(state.value.url) ? 'Local image' : state.value.url) ||
    'No image';

  return (
    <div
      className={classNames(
        'image-field oak-flex oak-items-center oak-gap-4',
        {
          loading: state.loading,
          'icon-only': iconOnly,
        },
        className
      )}
    >
      { state.value?.url && !iconOnly ? (
        <>
          <div
            className="preview"
            style={{ backgroundImage: `url(${state.value.url})` }}
          />
          <div className="info">
            <div className="name oak-truncate">{ getName() }</div>
            <div className="actions">
              <a
                href="#"
                className="delete oak-text-error-color"
                draggable={false}
                onClick={onReset}
              >
                <Text name="core.fields.image.del">
                  Delete
                </Text>
              </a>
            </div>
          </div>
        </>
      ) : (
        <TouchableZone
          disabled={state.loading}
          onClick={iconOnly && state.value?.url ? onReset : onOpenFileDialog}
          { ...(iconOnly && {
            style: {
              backgroundImage: state.value?.url && `url(${state.value?.url})`,
            },
          }) }
          className={classNames(
            {
              '!oak-w-full': !iconOnly,
            },
          )}
        >
          { state.loading ? (
            <Spinner />
          ) : !state.value?.url ? (
            <>
              <Icon
                className={classNames(
                  { '!oak-text-alternate-text-color': !iconOnly }
                )}
              >
                add
              </Icon>
              { !iconOnly && (
                <span>
                  <Text name="core.fields.image.add">
                    Add image
                  </Text>
                </span>
              ) }
            </>
          ) : iconOnly && (
            <span
              className="remove oak-flex oak-items-center oak-justify-center"
            >
              <Icon className="!oak-text-2xl">close</Icon>
            </span>
          ) }
        </TouchableZone>
      ) }
    </div>
  );
};

ImageField.displayName = 'ImageField';

export default ImageField;
