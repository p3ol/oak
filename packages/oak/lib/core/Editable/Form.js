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
  mockState,
  cloneDeep,
  get,
  set,
  mergeDeep,
  omit,
} from '@poool/junipero';

import { useBuilder, useOptions, usePostMountEffect } from '../../hooks';
import {
  DEFAULT_SETTINGS,
  DEFAULT_STYLES_SETTINGS,
  DEFAULT_RESPONSIVE_SETTINGS,
} from '../../defaults';
import Text from '../Text';
import Field from './Field';

export default forwardRef(({
  element,
  component,
  styles,
  attributes,
  popper,
  onSave,
  onCancel,
}, ref) => {
  const {
    setElement,
    overrides,
    getOverrides,
    _settingsHolderRef,
  } = useBuilder();
  const options = useOptions();
  const tabs = useMemo(() => [
    mergeDeep(
      {},
      component.settings?.defaults?.settings !== false
        ? cloneDeep(DEFAULT_SETTINGS) : {},
      omit(component.settings || {}, ['defaults', 'styling', 'responsive']),
      { title: t => t('core.settings.title', 'Settings') },
      omit(options.settings || {}, ['defaults', 'styling', 'responsive'])
    ),
    mergeDeep(
      {},
      component.settings?.defaults?.styling !== false
        ? cloneDeep(DEFAULT_STYLES_SETTINGS) : {},
      component.settings?.styling || {},
      options.settings?.styling || {},
    ),
    mergeDeep(
      {},
      component.settings?.defaults?.responsive !== false
        ? cloneDeep(DEFAULT_RESPONSIVE_SETTINGS) : {},
      component.settings?.responsive || {},
      options.settings?.responsive || {},
    ),
  ], [overrides]);

  const [state, dispatch] = useReducer(mockState, {
    element: {},
  });

  useEffect(() => {
    dispatch({ element: deserialize(cloneDeep(element)) });
  }, [element]);

  usePostMountEffect(() => {
    dispatch({ element: deserialize(state.element) });
  }, [overrides]);

  const getFields = useCallback(tab => (
    (tab ? tab?.fields : tabs.map(t => t.fields).flat())
      ?.sort((a, b) => (b.priority || 0) - (a.priority || 0))
  ), [tabs, overrides]);

  const getFieldKeyTypes = useCallback(() => (
    getFields().map(f => [f.key, f.type]).filter(f => f[0])
  ), [getFields]);

  const normalizeElement = (elmt, method) =>
    getFieldKeyTypes().reduce((e, [key, type]) => {
      const field = getOverrides('component', element.type, {
        output: 'field', field: { key, type },
      });
      const value = get(e, key);

      if (typeof field[method] === 'function' && value) {
        set(e, key, field[method](value));
      }

      return e;
    }, cloneDeep(elmt));

  const deserialize = elmt =>
    normalizeElement(elmt, 'deserialize');

  const serialize = elmt =>
    normalizeElement(elmt, 'serialize');

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
    setElement(element, serialize(state.element));
    onSave();
  };

  const onCancel_ = e => {
    e.preventDefault();
    dispatch({ element: deserialize(cloneDeep(element)) });
    onCancel();
  };

  return (
    <div
      ref={ref}
      style={styles.popper}
      {...attributes.popper}
      className="oak-editable"
    >
      <div className="oak-title">
        { component.settings?.title ? (
          <Text>{ component.settings?.title }</Text>
        ) : (
          <Text
            name="core.components.default.settings.title"
            default="Element options"
          />
        ) }
      </div>
      <div className="oak-form">
        <Tabs>
          { tabs.map((tab, t) => (
            <Tab key={t} title={<Text>{ tab.title }</Text>}>
              { getFields(tab)
                ?.filter(f => !f.condition || f.condition(state.element))
                ?.map((field, i) => (
                  <div className="oak-field" key={i}>
                    { field.label && (
                      <label><Text>{ field.label }</Text></label>
                    ) }
                    { field.fields ? (
                      <div className="oak-fields">
                        { field.fields.map((f, n) => (
                          <div className="oak-field" key={n}>
                            { f.label && (
                              <label className="oak-field-label">
                                <Text>{ f.label }</Text>
                              </label>
                            ) }
                            <Field
                              field={f}
                              editableRef={popper}
                              element={state.element}
                              onChange={onSettingChange_}
                              onCustomChange={onSettingCustomChange_}
                            />
                          </div>
                        )) }
                      </div>
                    ) : (
                      <Field
                        field={field}
                        editableRef={popper}
                        element={state.element}
                        onChange={onSettingChange_}
                        onCustomChange={onSettingCustomChange_}
                      />
                    ) }
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
          <a href="#" onClick={onCancel_}>
            <Text default="Cancel" name="core.settings.cancel" />
          </a>
          <Button className="primary" onClick={onSave_}>
            <Text default="Save" name="core.settings.save" />
          </Button>
        </div>
      </div>
    </div>
  );
});
