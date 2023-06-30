import { useReducer } from 'react';
import {
  Button,
  Tabs,
  Tab,
  Label,
  Abstract,
  FieldControl,
  mockState,
  cloneDeep,
  classNames,
} from '@junipero/react';

import { useBuilder } from '../hooks';
import Text from '../Text';
import Field from './Field';

const Form = ({
  placement,
  element,
  component,
  className,
  onSave,
  onCancel,
  editableRef,
  ...rest
}) => {
  const { builder } = useBuilder();
  const overrides = builder.getOverride('component', element.type);
  const deserialize = overrides?.deserialize || component?.deserialize ||
    (e => e);

  const [state, dispatch] = useReducer(mockState, {
    element: deserialize(cloneDeep(element)),
  });

  const onUpdate_ = elmt => {
    dispatch({ element: elmt });
  };

  const onSettingChange_ = (name, field) => {
    builder.setElementSettings(state.element, name,
      field.checked ?? field.value);
    dispatch({ element: state.element });
  };

  const onSettingCustomChange_ = (name, renderer, field) => {
    const changes = renderer
      .onChange(name, field, state.element);
    dispatch({ element: Object.assign(state.element, changes) });
  };

  const onSave_ = () => {
    builder.setElement(element.id, state.element || {}, { element });
    onSave();
  };

  const onCancel_ = () => {
    dispatch({ element: deserialize(cloneDeep(element)) });
    onCancel();
  };

  const hasSubfields = setting =>
    Array.isArray(setting.fields) && setting.fields.length > 0;

  const tabs = builder.getAvailableSettings();

  return (
    <div
      className={classNames('form', className)}
      data-placement={placement}
      { ...rest }
    >
      <div className="form-title junipero oak-flex oak-py-2 oak-px-5">
        { component.settings?.title ? (
          <Text>{ component.settings?.title }</Text>
        ) : (
          <Text name="core.components.default.settings.title">
            Element options
          </Text>
        ) }
      </div>
      <Tabs>
        { tabs
          .concat(
            (component.settings?.fields || []).filter(f => f.type === 'tab')
          )
          .sort((a, b) => (b.priority || 0) - (a.priority || 0))
          .filter(tab => tab.type === 'tab' &&
            (!tab.condition || tab.condition(state.element, { component })))
          .map((tab, t) => (
            <Tab key={tab.id || t} title={<Text>{ tab.title }</Text>}>
              <div className="fields oak-flex oak-flex-col oak-gap-4">
                { tab
                  .fields
                  .concat(
                    (component.settings?.fields || [])
                      .filter(field => (tab.id === 'general' && !field.tab) ||
                        field.tab === tab.id)
                  )
                  .sort((a, b) => (b.priority || 0) - (a.priority || 0))
                  .filter(f =>
                    !f.condition || f.condition(state.element, { component })
                  )
                  .map((setting, i) => (
                    <div className="field" key={i}>
                      <FieldControl>
                        { setting.label && (
                          <Label><Text>{ setting.label }</Text></Label>
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
                                    <Label className="field-label">
                                      <Text>{ f.label }</Text>
                                    </Label>
                                  ) }
                                  <Field
                                    setting={f}
                                    editableRef={editableRef}
                                    element={state.element}
                                    component={component}
                                    overrides={overrides}
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
                            overrides={overrides}
                            onChange={onSettingChange_}
                            onCustomChange={onSettingCustomChange_}
                          />
                        ) }
                        { setting.description && (
                          <Abstract className="secondary">
                            <Text>{ setting.description }</Text>
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
