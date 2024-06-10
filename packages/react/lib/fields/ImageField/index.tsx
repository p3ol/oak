import {
  type ComponentPropsWithRef,
  type MouseEvent,
  useEffect,
  useReducer,
} from 'react';
import type {
  ComponentSettingsField,
  ComponentSettingsFieldObject,
  ElementObject,
} from '@oakjs/core';
import {
  TouchableZone,
  Spinner,
  classNames,
  mockState,
} from '@junipero/react';

import { useBuilder } from '../../hooks';
import Icon from '../../Icon';
import Text from '../../Text';

export declare interface ImageFieldValue {
  name: string;
  url: string | ArrayBuffer;
}

export declare interface ImageFieldContent {
  value?: ImageFieldValue;
}

export interface ImageFieldProps extends ComponentPropsWithRef<any> {
  value?: ImageFieldValue;
  element?: ElementObject;
  setting?: ComponentSettingsFieldObject | ComponentSettingsField;
  onOpenDialog?: () => void;
  onChange?: (value: ImageFieldContent) => void;
  iconOnly?: boolean;
  accept?: string[];
}

const ImageField = ({
  className,
  value,
  element,
  setting,
  onOpenDialog,
  onChange,
  iconOnly = false,
  accept = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml'],
}: ImageFieldProps) => {
  const { onImageUpload } = useBuilder();
  const [state, dispatch] = useReducer(mockState, {
    value: {
      ...value,
      url: value?.url || '',
    },
    loading: false,
  });

  useEffect(() => {
    if (value) {
      dispatch({ value });
    }
  }, [value]);

  const onOpenFileDialog = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    if (state.loading) {
      return;
    }

    if (onOpenDialog) {
      return onOpenDialog();
    }

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = accept.join(',');

    input.addEventListener('change', onFile, false);
    input.click();
  };

  const onFile = async (e: Event) => {
    if (state.loading) {
      return;
    }

    dispatch({ loading: true });

    if (onImageUpload) {
      const result = await onImageUpload(e as any, { element, setting });
      //TODO record this @maxime

      if (result) {
        onUrlReady(result);
      } else {
        dispatch({ loading: false });
      }
    } else {
      const file = (e.target as HTMLInputElement).files[0];

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

  const onUrlReady = ({
    url,
    name,
    ...rest
  }: { url?: string | ArrayBuffer, name?: string } = {}) => {
    const val: ImageFieldValue = { url, name, ...rest };
    dispatch({ value: val });
    onChange?.({ value: val });
    dispatch({ loading: false });
  };

  const onReset = (e: MouseEvent<HTMLAnchorElement>) => {
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
        'image-field oak-flex oak-flex-none oak-items-center oak-gap-4',
        {
          loading: state.loading,
          'icon-only oak-w-[80px] oak-h-[80px]': iconOnly,
        },
        className
      )}
    >
      { state.value?.url && !iconOnly ? (
        <>
          <div
            className={classNames(
              'preview oak-w-[80px] oak-h-[80px] oak-bg-cover oak-bg-center'
            )}
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
          className={classNames({ '!oak-w-full': !iconOnly })}
          { ...(iconOnly && {
            style: {
              backgroundImage: state.value?.url && `url(${state.value?.url})`,
            },
          }) }
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
