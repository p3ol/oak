import { MutableRefObject } from 'react';

import { Component } from './component';
import { useElement, useBuilder, useOptions } from './hooks';

interface OverrideField {
  key: string;
  type: string;
}

interface OverrideComponent {
  /**type of object you want to overrides, currently,
   * just component is available
   * */
  type: 'component';
  /** Array of component type you want to override*/
  components: Array<string>;
  /** Component's fields you want to override */
  fields: Array<OverrideField>;
  /** construct function overrides, takes the element,
   * and should return new Object
   * */
  construct?: (element: Object) => Object;
  /** duplicate function overrides, takes the element,
   * and should return new Object
  */
  duplicate?: (element: Object) => Object;
}
interface AddonComponent {
  id: String;
  name: String | Function;
  type: 'component';
  render: Function;
  construct: Function;
  icon?: String | Function;
  options?: Object;
  settings?: Object;
  editable?: Boolean;
  duplicate?: Function;
}

interface AddonFieldType {
  type: String;
  render: Function;
  default?: any;
  serialize?: Function;
  deserialize?: Function;
}
interface TextKey {
  [key: string]: string | TextKey;
}

interface Addon {
  components: Array<AddonComponent>;
  fieldTypes: Array<AddonFieldType>;
}
interface Options {
  /**Whether we display debug output */
  debug?: boolean;
  /**Texts you want to display
   * { key: {subkey: 'value'} }
   * Most of the core components & available official addons are already
   * translated in english (default language) & french.
   * If you need to override all the texts with your own language,
   * it is mostly the same principle as for the settings.

    For example, if you need to override the settings panel buttons texts:
    ```
    import { render } from '@poool/oak';

    render(element, {
      texts: {
        core: {
          settings: {
            cancel: 'Annuler',
            save: 'Sauvegarder',
          },
        },
      },
    });
    ```
    A full example text object is available inside the core/languages/fr
    js folder of every package of this repository,
    including the core library itself.

    To use these translations, every label, title of name property
    inside components, fieldTypes, overrides & settings can either be a string
    (not translated), or a function, for which the first argument is a function
    called the translate function. This function is passed to each of these
    property for you to be able to provide the text key & the default
    value in your current language.

    For example, if you need to add a translated label to
    one of your custom components' fields:
    ```
    {
      label: t => t('custom.myComponent.myField.label', 'My field'),
    }
    ```
   */
  texts?: TextKey;
  /**overrides: Allows to override the various
   * fields of one or multiple existing component*/
  overrides?: Array<OverrideComponent>;
  /** addons: Adds a list of addons to add to the page builder. */
  addons?: Array<Addon>;
  /**Add events to oak
   * onChange
    Arguments: ({ value: Array }: Object)
    Example:

    import { render } from '@poool/oak';

    render(element, {
      events: {
        onChange: ({ value }) => console.log(value),
      },
    });
    Called everytime the builder's content changes.

    onImageUpload
    Arguments: (event: Event)
    Called when an image is uploaded using the image field type.
    The event argument is the native file input event.

    Example:

    import { render } from '@poool/oak';

    render(element, {
      events: {
        onImageUpload: event => {
          const reader = new FileReader();
          const image = e.target.files[0];

          return { url: reader.readAsDataURL(image), name: image.name };
        },
      },
    });
   */
  events?: {
    onChange: (props: { value: Array<Component> }) => void;
    onImageUpload: (props: { value: Array<Component> }) => {
      url: string;
      name?: string;
    };
  };
  /**
   * You may also be able to override the various
   * settings tabs for any component.
   * Note: The settings are merged together and not replaced.
   * For example, if you want to add an xxs option
   * to the Responsive settings tab:
      ```
      import { render } from '@poool/oak';

      render(element, {
        settings: {
          responsive: {
            fields: [{
              key: 'responsive.xxs',
              type: 'select',
              label: 'Extra-extra-small screens (your granny\'s phone)',
              default: 'show',
              options: [{
                title: 'Visible',
                value: 'show',
              }, {
                title: 'Hidden',
                value: 'hide',
              }],
            }],
          },
        },
      });
      })
      ```
   */
  settings?: {
    title?: String | Function;
    fields: [
      {
        key: String;
        type: String;
        default: any;
        displayable?: Boolean;
        label?: String | Function;
        condition?: Function;
        options?: [
          {
            title: String | Function;
            value: any;
          }
        ];
      }
    ];
  };
  /**Enable/disable undo/redo buttons. */
  historyButtonEnabled?: Boolean;
  /**Whether to display the Other components
   * tab inside the builder's catalogue dropdown. */
  otherTabEnabled?: Boolean;
  /**Element in which to render the components' settings panel. */
  settingsContainer?: any;
}
declare interface Oak {
  setRef: (ref: MutableRefObject<any>) => Oak;
  setReady: () => Oak;
  addGroup:
    (props: {id?: String, name?: String, components?: Array<Object>}) => Oak;
  removeGroup: (id: number) => Oak;
  setContent: (content: Array<Component>) => Oak;
  addElement: () => Oak;
  removeElement: () => Oak;
  setElement: () => Oak;
  undo: () => Oak;
  redo: () => Oak;
  isUndoPossible: () => Oak;
  isRedoPossible: () => Oak;
  setTexts: () => Oak;
  getText: () => Oak;
  setOverrides: () => Oak;
  setOptions: () => Oak;
  destroy: () => Oak;
}

declare function render(elmt: Node | String, options: Options): Oak;

export {
  useOptions,
  useBuilder,
  useElement,
  render,
};
