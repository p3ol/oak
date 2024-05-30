import {
  type ComponentPropsWithoutRef,
  type Key,
  useReducer,
} from 'react';
import type {
  ComponentObject,
  ComponentOverride,
  ComponentSettingsFieldObject,
  ComponentSettingsFormObject,
  ComponentSettingsTabObject,
  ElementObject, FieldContent,
  FieldObject,
} from '@oakjs/core';
import {
  Abstract,
  Button,
  FieldControl,
  Label,
  Tab,
  Tabs,
  Tooltip,
  classNames,
  cloneDeep,
  mockState,
} from '@junipero/react';

import Field from './Field';
import Icon from '../Icon';
import Text from '../Text';
import { useBuilder } from '../hooks';

interface FormProps extends ComponentPropsWithoutRef<any> {
  placement?: string;
  element: ElementObject;
  component: ComponentObject;
  className?: string;
  onSave: () => void;
  onCancel: () => void;
  editableRef?: any;
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

  const [state, dispatch] = useReducer(mockState, {
    element: deserialize(cloneDeep(element)),
  });

  const onUpdate_ = (elmt: ElementObject) => {
    dispatch({ element: elmt });
  };

  const onSettingChange_ = (name: string, field: FieldContent) => {
    builder.setElementSettings(state.element, name,
      field.checked ?? field.value);
    dispatch({ element: state.element });
  };

  const onSettingCustomChange_ = (
    name: string,
    renderer: any, // TODO FIX IT
    field: FieldContent
  ) => {
    const changes = renderer
      .onChange(name, field, state.element);
    dispatch({ element: Object.assign(state.element, changes) });
  };

  const onSave_ = () => {
    builder.setElement(element.id as string, state.element || {}, { element });
    onSave();
  };

  const onCancel_ = () => {
    dispatch({ element: deserialize(cloneDeep(element)) });
    onCancel();
  };

  const getFieldPriority = (field: ComponentSettingsFieldObject) => {
    const fieldOverride = {
      ...builder.getOverride('setting', element.type, { setting: field }),
      ...builder.getOverride('component', element.type, {
        output: 'field', setting: field,
      }),
    };

    return Number.isSafeInteger(fieldOverride?.priority)
      ? fieldOverride.priority
      : field.priority || 0;
  };

  const hasSubfields = (setting: ComponentSettingsFieldObject) =>
    Array.isArray(setting.fields) && setting.fields.length > 0;

  const tabs: Array<
    ComponentSettingsTabObject | ComponentSettingsFormObject
  > = builder.getAvailableSettings();

  return (
    <div
      className={classNames('form', className)}
      data-placement={placement}
      { ...rest }
    >
      <div className="form-title junipero oak-flex oak-py-2 oak-px-5">
        { component.settings?.title ? (
          <Text>{ component.settings?.title as string }</Text>
        ) : (
          <Text name="core.components.default.settings.title">
            Element options
          </Text>
        ) }
      </div>
      <Tabs>
        { tabs
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
          .map((tab: ComponentSettingsTabObject, t) => (
            <Tab
              key={tab.id || t}
              title={<Text>{ tab.title as string }</Text> as any}
              // TODO update junipero version
            >
              <div className="fields oak-flex oak-flex-col oak-gap-4">
                { (component.settings?.fields || [])
                  .filter((field: ComponentSettingsFieldObject) =>
                    (tab.id === 'general' && !field.tab) ||
                    field.tab === tab.id
                  )
                  .concat(tab.fields)
                  .sort((
                    a: ComponentSettingsFieldObject,
                    b: ComponentSettingsFieldObject
                  ) => getFieldPriority(b) - getFieldPriority(a))
                  .filter((f: ComponentSettingsFieldObject) =>
                    !f.condition ||
                    f.condition(state.element, { component, builder })
                  )
                  .map((setting: ComponentSettingsFieldObject, i: Key) => (
                    <div className="field" key={i}>
                      <FieldControl>
                        { setting.label && (
                          <Label
                            className="oak-flex oak-items-center oak-gap-2"
                          >
                            <Text>{ setting.label as string }</Text>
                            { setting.info && (
                              <Tooltip
                                text={
                                  <Text>{ setting.info as string }</Text>
                                }
                              >
                                <Icon className="!oak-text-[18px]">
                                  info_circle
                                </Icon>
                              </Tooltip>
                            ) }
                          </Label>
                        ) }
                        { hasSubfields(setting) ? (
                          <div
                            className={classNames(
                              'sub-fields oak-grid oak-grid-cols-4 oak-gap-2',
                            )}
                          >
                            { setting.fields.map((f, n) => (
                              <div className="field" key={n}>
                                <FieldControl>
                                  { f.label && (
                                    <Label
                                      className={classNames(
                                        'field-label oak-flex oak-items-center',
                                        'oak-gap-1'
                                      )}
                                    >
                                      <Text>{ f.label as string }</Text>
                                      { f.info && (
                                        <Tooltip
                                          text={
                                            <Text>{ f.info as string }</Text>
                                          }
                                        >
                                          <Icon className="!oak-text-[14px]">
                                            info_circle
                                          </Icon>
                                        </Tooltip>
                                      ) }
                                    </Label>
                                  ) }
                                  <Field
                                    setting={f}
                                    editableRef={editableRef}
                                    element={state.element}
                                    component={component}
                                    onChange={onSettingChange_}
                                    onCustomChange={onSettingCustomChange_}
                                  />
                                </FieldControl>
                              </div>
                            )) }
                          </div>
                        ) : (
                          <Field
                            setting={setting}
                            editableRef={editableRef}
                            element={state.element}
                            component={component}
                            onChange={onSettingChange_}
                            onCustomChange={onSettingCustomChange_}
                          />
                        ) }
                        { setting.description && (
                          <Abstract className="secondary">
                            <Text>{ setting.description as string }</Text>
                          </Abstract>
                        ) }
                      </FieldControl>
                    </div>
                  )) }
                { tab?.renderForm?.({
                  element: cloneDeep(state.element),
                  component,
                  overrides,
                  update: onUpdate_,
                }) }
              </div>
            </Tab>
          )) }
      </Tabs>
      <div
        className={classNames(
          'buttons oak-flex oak-items-center oak-justify-end oak-gap-2 oak-p-5',
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
  );
};

Form.displayName = 'Form';

export default Form;
