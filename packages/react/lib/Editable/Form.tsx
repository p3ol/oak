import {
  type ComponentPropsWithoutRef,
  type RefObject,
  useReducer,
  useCallback,
} from 'react';
import { v4 as uuid } from 'uuid';
import type {
  ComponentObject,
  ComponentOverride,
  ComponentSettingsFormObject,
  ComponentSettingsTabObject,
  ElementObject,
  FieldContent,
  FieldObject,
  FieldOverride,
  FieldOverrideObject,
  SettingOverrideObject,
} from '@oakjs/core';
import {
  Button,
  Tabs,
  classNames,
  cloneDeep,
  get,
  mockState,
  set,
} from '@junipero/react';

import type { EditableRef } from './index';
import type { SerializeMethod } from '../types';
import { EditableFormContext } from '../contexts';
import { useBuilder } from '../hooks';
import Text from '../Text';
import Tab from './Tab';

export declare interface FormProps extends ComponentPropsWithoutRef<'div'> {
  placement?: string;
  element: ElementObject;
  component: ComponentObject;
  onSave: () => void;
  onCancel: () => void;
  editableRef?: RefObject<EditableRef>;
}

export declare interface FormState {
  element: ElementObject;
  seed: string | number;
}

const Form = ({
  placement,
  element,
  component,
  className,
  onSave,
  onCancel,
  editableRef,
  ...rest
}: FormProps) => {
  const { builder } = useBuilder();
  const overrides = builder.getOverride('component', element.type);
  const deserialize = (overrides as ComponentOverride)?.deserialize ||
    component?.deserialize ||
    ((e: ElementObject) => e);

  const getSerializers = useCallback((
    elmt: ElementObject,
    serializeType: 'serialize' | 'deserialize'
  ) => {
    const serializedFields: string[] = [];
    const serializeMethods: SerializeMethod[] = [];
    const overrides: SettingOverrideObject[] = (builder.getAllOverrides(
      'setting',
      elmt.type
    ) as SettingOverrideObject[])
      .filter(o => !!o[serializeType]) as SettingOverrideObject[];

    overrides.forEach(override_ => {
      const keys = [].concat(override_.key);
      keys.forEach(key => {
        if (!get(elmt, key) && serializedFields.includes(key)) {
          return;
        }

        const override = builder.getOverride(
          'setting',
          elmt.type,
          { setting: override_}
        ) as SettingOverrideObject;

        serializedFields.push(key);
        serializeMethods.push({key, method: override?.[serializeType]});
      });
    });

    return serializeMethods;
  },[builder]);

  const fieldDeserialize = useCallback((elmt: ElementObject) => {
    getSerializers(elmt, 'deserialize').forEach(serializer => {
      if(typeof serializer.method === 'function') {
        set(elmt, serializer.key, serializer.method(get(elmt, serializer.key)));
      }
    });

    return elmt;
  }, [getSerializers]);

  const [state, dispatch] = useReducer(mockState<FormState>, {
    element: fieldDeserialize(deserialize(cloneDeep(element))),
    seed: uuid(),
  });

  const onUpdate_ = (elmt: ElementObject) => {
    dispatch({ element: elmt });
  };

  const onSettingChange_ = (name: string, field: FieldContent) => {
    builder.setElementSettings(state.element, name,
      field.checked ?? field.value);
    dispatch({ element: state.element, seed: uuid() });
  };

  const onSettingCustomChange_ = (
    name: string,
    renderer: FieldOverride | FieldObject | FieldOverrideObject,
    field: FieldContent
  ) => {
    const changes = renderer
      .onChange(name, field, state.element);
    dispatch({
      element: Object.assign(state.element, changes),
      seed: uuid(),
    });
  };

  const onSave_ = useCallback(() => {
    getSerializers(state.element, 'serialize').forEach(serializer => {
      if (typeof serializer.method === 'function') {
        set(
          state.element,
          serializer.key,
          serializer.method(get(state.element, serializer.key))
        );
      }
    });
    dispatch({ element: state.element });
    builder.setElement(element.id as string, state.element || {}, { element });
    onSave();
  }, [builder, element, onSave, getSerializers, state.element]);

  const onCancel_ = () => {
    dispatch({
      element: fieldDeserialize(deserialize(cloneDeep(element))),
      seed: uuid(),
    });
    onCancel();
  };

  const tabs: (
    ComponentSettingsTabObject |
    ComponentSettingsFormObject
  )[] = builder.getAvailableSettings();

  const getContext = useCallback(() => ({
    element: state.element,
    seed: state.seed,
    setSeed: (seed: string | number) => dispatch({ seed }),
  }), [state.element, state.seed]);

  return (
    <EditableFormContext.Provider value={getContext()}>
      <div
        className={classNames('form', className)}
        data-placement={placement}
        { ...rest }
      >
        <div
          className={classNames(
            'form-title junipero oak-flex oak-py-2 oak-px-5 oak-sticky',
            'oak-top-0 oak-z-10',
          )}
        >
          { component.settings?.title ? (
            <Text>{ component.settings?.title }</Text>
          ) : (
            <Text name="core.components.default.settings.title">
              Element options
            </Text>
          ) }
        </div>
        <Tabs
          tabs={tabs
            .concat(
              (component.settings?.fields || [])
                .filter((f: FieldObject) => f.type === 'tab')
            )
            .sort((
              a: ComponentSettingsTabObject,
              b: ComponentSettingsTabObject,
            ) => (b.priority || 0) - (a.priority || 0))
            .filter((tab: ComponentSettingsTabObject) => {
              const override = builder.getOverride(
                'setting', element.type, { setting: { key: tab.id } }
              ) as SettingOverrideObject;

              const condition = override?.condition ||
                tab.condition;

              return tab.type === 'tab' && (
                !condition || condition(state.element, {
                  component, builder,
                })
              );
            })
            .map((tab: ComponentSettingsTabObject, t) => ({
              title: <Text>{ tab.title }</Text>,
              content: (
                <Tab
                  key={tab.id || t}
                  tab={tab}
                  component={component}
                  element={state.element}
                  overrides={overrides}
                  editableRef={editableRef}
                  onUpdate={onUpdate_}
                  onSettingChange={onSettingChange_}
                  onSettingCustomChange={onSettingCustomChange_}
                />
              ),
            }))
          }
        />
        <div
          className={classNames(
            'buttons oak-flex oak-items-center oak-justify-end oak-gap-2',
            'oak-p-5 oak-z-20',
          )}
        >
          <Button type="button" className="subtle" onClick={onCancel_}>
            <Text name="core.settings.cancel">Cancel</Text>
          </Button>
          <Button type="button" className="primary" onClick={onSave_}>
            <Text name="core.settings.save">Save</Text>
          </Button>
        </div>
      </div>
    </EditableFormContext.Provider>
  );
};

Form.displayName = 'Form';

export default Form;
