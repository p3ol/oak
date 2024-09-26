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
} from '@oakjs/core';
import {
  type ComponentPropsWithoutRef,
  useReducer,
  MutableRefObject,
  useCallback,
} from 'react';
import {
  type StateReducer,
  Button,
  Tabs,
  classNames,
  cloneDeep,
  mockState,
} from '@junipero/react';

import type { EditableRef } from './index';
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
  editableRef?: MutableRefObject<EditableRef>;
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

  const [state, dispatch] = useReducer<StateReducer<FormState>>(mockState, {
    element: deserialize(cloneDeep(element)),
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

  const onSave_ = () => {
    builder.setElement(element.id as string, state.element || {}, { element });
    onSave();
  };

  const onCancel_ = () => {
    dispatch({
      element: deserialize(cloneDeep(element)),
      seed: uuid(),
    });
    onCancel();
  };

  const tabs: Array<
    ComponentSettingsTabObject | ComponentSettingsFormObject
  > = builder.getAvailableSettings();

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
            .filter((tab: ComponentSettingsTabObject) => tab.type === 'tab' &&
              (!tab.condition ||
                tab.condition(state.element, { component, builder })))
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
