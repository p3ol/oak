import {
  forwardRef,
  useReducer,
  useEffect,
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

const Form = forwardRef(({
  placement,
  element,
  component,
  className,
  onSave,
  onCancel,
  ...rest
}, ref) => {
  const { builder } = useBuilder();
  // const options = useOptions();
  const overrides = builder.getOverride('component', element.type);
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
    element: {},
  });

  useEffect(() => {
    dispatch({ element: deserialize(cloneDeep(element)) });
  }, [element]);

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

  const deserialize = element => {
    const d = overrides?.deserialize || component.deserialize;

    return d ? d(element) : element;
  };

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
      ref={ref}
      className={classNames('editable', className)}
      data-placement={placement}
      {...rest}
    >
      <div className="title">
        { component.settings?.title ? (
          <Text>{ component.settings?.title }</Text>
        ) : (
          <Text
            name="core.components.default.settings.title"
          />
        ) }
      </div>
      <div className="form">
        <Tabs>
          { tabs.map((tab, t) => (
            <Tab key={t} title={<Text>{ tab.title }</Text>}>
              { getFields(tab)
                ?.filter(f => !f.condition || f.condition(state.element))
                ?.map((field, i) => (
                  <div className="oak-field" key={i}>
                    <FieldControl>
                      { field.label && (
                        <Label><Text>{ field.label }</Text></Label>
                      ) }
                      { field.fields ? (
                        <div className="oak-fields">
                          { field.fields.map((f, n) => (
                            <div className="oak-field" key={n}>
                              <FieldControl>
                                { f.label && (
                                  <Label className="oak-field-label">
                                    <Text>{ f.label }</Text>
                                  </Label>
                                ) }
                                <Field
                                  field={f}
                                  editableRef={ref}
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
                          field={field}
                          editableRef={ref}
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
            </Tab>
          )) }
        </Tabs>
        <div className="oak-editable-buttons">
          <Button type="button" className="subtle" onClick={onCancel_}>
            <Text default="Cancel" name="core.settings.cancel" />
          </Button>
          <Button type="button" className="primary" onClick={onSave_}>
            <Text default="Save" name="core.settings.save" />
          </Button>
        </div>
      </div>
    </div>
  );
});

Form.displayName = 'Form';

export default Form;
