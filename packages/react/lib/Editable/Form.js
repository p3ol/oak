import {
  useReducer,
  useMemo,
  useCallback,
} from 'react';
import {
  Button,
  Tabs,
  Tab,
  Label,
  FieldControl,
  mockState,
  cloneDeep,
  // get,
  set,
  mergeDeep,
  omit,
  classNames,
} from '@junipero/react';
import { ComponentSetting } from '@oakjs/core';

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
  // const options = useOptions();
  const overrides = builder.getOverride('component', element.type);
  const deserialize = overrides?.deserialize || component?.deserialize ||
    (e => e);

  const tabs = useMemo(() => [
    mergeDeep(
      {},
      component.settings?.defaults?.settings !== false
        ? cloneDeep(ComponentSetting.DEFAULT_SETTINGS) : {},
      omit(component.settings || {}, ['defaults', 'styling', 'responsive']),
      { title: t => t('core.settings.title', 'Settings') },
      // omit(options.settings || {}, ['defaults', 'styling', 'responsive'])
    ),
    mergeDeep(
      {},
      component.settings?.defaults?.styling !== false
        ? cloneDeep(ComponentSetting.DEFAULT_STYLES_SETTINGS) : {},
      component.settings?.styling || {},
      // options.settings?.styling || {},
    ),
    mergeDeep(
      {},
      component.settings?.defaults?.responsive !== false
        ? cloneDeep(ComponentSetting.DEFAULT_RESPONSIVE_SETTINGS) : {},
      component.settings?.responsive || {},
      // options.settings?.responsive || {},
    ),
  ], [/*overrides*/]);

  const [state, dispatch] = useReducer(mockState, {
    element: deserialize(cloneDeep(element)),
  });

  // useEffect(() => {
  //   dispatch({ element: deserialize(cloneDeep(element)) });
  // }, [element]);

  // usePostMountEffect(() => {
  //   dispatch({ element: deserialize(state.element) });
  // }, [overrides]);

  const getFields = useCallback(tab => (
    (tab ? tab?.fields : tabs.map(t => t.fields).flat())
      ?.sort((a, b) => (b.priority || 0) - (a.priority || 0))
  ), [tabs/*, overrides*/]);

  // const getFieldKeyTypes = useCallback(() => (
  //   getFields().map(f => [f.key, f.type]).filter(f => f[0])
  // ), [getFields]);

  // const normalizeElement = (elmt, method) =>
  //   getFieldKeyTypes().reduce((e, [key, type]) => {
  //     const field = builder.getOverride('component', element.type, {
  //       output: 'field', field: { key, type },
  //     });
  //     const value = get(e, key);

  //     if (typeof field[method] === 'function' && value) {
  //       set(e, key, field[method](value));
  //     }

  //     return e;
  //   }, cloneDeep(elmt));

  const serialize = element => {
    const s = overrides?.serialize || component.serialize;

    return s ? s(element) : element;
  };

  const onUpdate_ = elmt => {
    dispatch({ element: elmt });
  };

  const onSettingChange_ = (name, field) => {
    set(state.element, name, field.checked ?? field.value);
    dispatch({ element: state.element });
  };

  const onSettingCustomChange_ = (name, renderer, field) => {
    const changes = renderer
      .onChange(name, field, state.element);
    dispatch({ element: Object.assign(state.element, changes) });
  };

  const onSave_ = () => {
    builder.setElement(element, serialize(state.element));
    onSave();
  };

  const onCancel_ = () => {
    dispatch({ element: deserialize(cloneDeep(element)) });
    onCancel();
  };

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
        { tabs.map((tab, t) => (
          <Tab key={t} title={<Text>{ tab.title }</Text>}>
            <div className="fields oak-flex oak-flex-col oak-gap-4">
              { getFields(tab)
                ?.filter(f => !f.condition || f.condition(state.element))
                ?.map((field, i) => (
                  <div className="field" key={i}>
                    <FieldControl>
                      { field.label && (
                        <Label><Text>{ field.label }</Text></Label>
                      ) }
                      { field.fields ? (
                        <div
                          className={classNames(
                            'sub-fields oak-grid oak-grid-cols-4 oak-gap-2',
                          )}
                        >
                          { field.fields.map((f, n) => (
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
                                  onChange={onSettingChange_}
                                  onCustomChange={onSettingCustomChange_}
                                />
                              </FieldControl>
                            </div>
                          )) }
                        </div>
                      ) : (
                        <Field
                          setting={field}
                          editableRef={editableRef}
                          element={state.element}
                          onChange={onSettingChange_}
                          onCustomChange={onSettingCustomChange_}
                        />
                      ) }
                    </FieldControl>
                  </div>
                )) }
              { tab?.renderForm?.({
                element: cloneDeep(state.element),
                component,
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
