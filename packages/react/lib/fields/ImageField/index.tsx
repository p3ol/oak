import {
  type ComponentPropsWithRef,
  type MouseEvent,
  type ChangeEvent,
  useEffect,
  useReducer,
  useCallback,
} from 'react';
import type {
  ComponentSettingsField,
  ComponentSettingsFieldObject,
  ElementObject,
} from '@oakjs/core';
import {
  type FieldContent,
  classNames,
  mockState,
  TextField,
  Tooltip,
  FieldGroup,
  FieldAddon,
  set,
  Spinner,
} from '@junipero/react';

import { useBuilder } from '../../hooks';
import Icon from '../../Icon';
import Text from '../../Text';

export declare interface ImageFieldValue {
  name: string;
  url: string | ArrayBuffer;
}

export declare interface ImageFieldState {
  value: ImageFieldValue;
  loading: boolean;
}

export interface ImageFieldProps extends Omit<
  ComponentPropsWithRef<'div'>, 'onChange'
> {
  value?: ImageFieldValue;
  element?: ElementObject;
  setting?: ComponentSettingsFieldObject | ComponentSettingsField;
  disabled?: boolean;
  accept?: string[];
  onOpenDialog?: () => void;
  onChange?: (field: FieldContent<ImageFieldValue>) => void;
}

const ImageField = ({
  className,
  value,
  element,
  setting,
  disabled,
  accept = ['image/jpeg', 'image/jpg', 'image/gif', 'image/png',
    'image/svg+xml'],
  onOpenDialog,
  onChange,
}: ImageFieldProps) => {
  const { onImageUpload, floatingsRef } = useBuilder();
  const [state, dispatch] = useReducer(mockState<ImageFieldState>, {
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

    input.addEventListener('change', onFile.bind(null), false);
    input.click();
  };

  const onFile = async (e: ChangeEvent<HTMLInputElement>) => {
    if (state.loading) {
      return;
    }

    dispatch({ loading: true });

    if (onImageUpload) {
      const result = await onImageUpload(e, { element, setting });

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

  const onManualChange = useCallback((e: FieldContent) => {
    set(state.value, 'url', e.value);
    onChange?.({ value: state.value });
  }, [onChange, state.value]);

  return (
    <div
      className={classNames(
        'image-field oak-flex oak-flex-none oak-items-center oak-gap-4',
        {
          'loading': state.loading,
        },
        className
      )}
    >
      <FieldGroup className="!oak-w-full">
        <TextField
          value={state.value?.url?.toString() || ''}
          placeholder="https://example.com/image.png"
          onChange={onManualChange}
          disabled={disabled || state.loading}
        />
        <Tooltip
          text={(
            <Text name="core.tooltips.uploadImage">
              Upload image
            </Text>
          )}
          container={floatingsRef.current}
          disabled={disabled || state.loading}
        >
          <FieldAddon
            onClick={onOpenFileDialog}
            className={classNames(
              'oak-cursor-pointer',
              {
                'oak-pointer-events-none oak-opacity-50':
                  disabled || state.loading,
              }
            )}
          >
            { state.loading ? (
              <Spinner />
            ) : (
              <Icon>file</Icon>
            ) }
          </FieldAddon>
        </Tooltip>
      </FieldGroup>
    </div>
  );
};

ImageField.displayName = 'ImageField';

export default ImageField;
