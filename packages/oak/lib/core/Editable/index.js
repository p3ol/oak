import { createPortal } from 'react-dom';
import {
  Children,
  cloneElement,
  forwardRef,
  useReducer,
  useState,
  useImperativeHandle,
  useEffect,
} from 'react';
import {
  Button,
  Tabs,
  Tab,
  mockState,
  cloneDeep,
  classNames,
  set,
  mergeDeep,
  omit,
} from '@poool/junipero';
import { usePopper } from 'react-popper';

import { useBuilder, useOptions } from '../../hooks';
import {
  DEFAULT_SETTINGS,
  DEFAULT_STYLES_SETTINGS,
  DEFAULT_RESPONSIVE_SETTINGS,
} from '../../defaults';
import Field from './Field';

export default forwardRef(({
  children,
  element,
  component,
}, ref) => {
  const { setElement, _settingsHolderRef } = useBuilder();
  const options = useOptions();
  const [popper, setPopper] = useState();
  const [reference, setReference] = useState();
  const [state, dispatch] = useReducer(mockState, {
    opened: false,
    element: cloneDeep(element),
  });

  useEffect(() => {
    dispatch({ element: cloneDeep(element) });
  }, [element]);

  const { styles: popperStyles, attributes } = usePopper(reference, popper, {
    ...((typeof component?.settings?.popperSettings === 'function'
      ? component?.settings?.popperSettings({ optionButtonElement: reference })
      : component?.settings?.popperSettings
    ) || {
      modifiers: [{
        name: 'preventOverflow',
        options: {
          boundary: true,
        },
      }, {
        name: 'offset',
        options: {
          offset: [0, 5],
        },
      }],
    }),
  });

  useImperativeHandle(ref, () => ({
    open,
    close,
    toggle,
  }));

  const open = () => {
    dispatch({ opened: true });
  };

  const close = () => {
    dispatch({ opened: false });
  };

  const toggle = () =>
    state.opened ? close() : open();

  const onUpdate_ = elmt => {
    setElement(element, elmt);
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

  const onSave = () => {
    setElement(element, state.element);
    close();
  };

  const onCancel = e => {
    e.preventDefault();
    close();
  };

  const tabs = [
    mergeDeep(
      {},
      component.settings?.defaults?.settings !== false
        ? cloneDeep(DEFAULT_SETTINGS) : {},
      omit(component.settings || {}, ['defaults', 'styling', 'responsive']),
      { title: 'Settings' },
    ),
    mergeDeep(
      {},
      component.settings?.defaults?.styling !== false
        ? cloneDeep(DEFAULT_STYLES_SETTINGS) : {},
      component.settings?.styling || {}
    ),
    mergeDeep(
      {},
      component.settings?.defaults?.responsive !== false
        ? cloneDeep(DEFAULT_RESPONSIVE_SETTINGS) : {},
      component.settings?.responsive || {}
    ),
  ];

  const settingsForm = (
    <div
      ref={setPopper}
      style={popperStyles.popper}
      {...attributes.popper}
      className="oak-editable"
    >
      <div className="oak-title">
        { component.settings?.title || 'Element options' }
      </div>
      <div className="oak-form">
        <Tabs>
          { tabs.map((tab, t) => (
            <Tab key={t} title={tab.title}>
              { tab?.fields?.map((field, i) =>
                (!field.condition || field.condition(state.element)) && (
                  <div className="oak-field" key={i}>
                    { field.label && (
                      <label>{ field.label }</label>
                    ) }
                    { field.fields ? (
                      <div className="oak-fields">
                        { field.fields.map((f, n) => (
                          <div className="oak-field" key={n}>
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
                )
              ) }
              { tab?.renderForm?.({
                element: cloneDeep(element),
                component,
                update: onUpdate_,
              }) }
            </Tab>
          )) }
        </Tabs>
        <div className="oak-editable-buttons">
          <a href="#" onClick={onCancel}>Cancel</a>
          <Button className="primary" onClick={onSave}>Save</Button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      { children && cloneElement(Children.only(children), {
        ref: setReference,
        className: classNames(
          Children.only(children).props.className,
          { 'oak-opened': state.opened }
        ),
      }) }
      { state.opened
        ? options.settingsContainer || _settingsHolderRef
          ? createPortal(
            settingsForm,
            options.settingsContainer || _settingsHolderRef
          )
          : settingsForm
        : null }
    </>
  );
});
