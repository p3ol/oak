import React, { useLayoutEffect, useMemo } from 'react';
import { useStrapiApp } from '@strapi/helper-plugin';
import { Builder, baseAddon, classNames } from '@oakjs/react';
import { remirrorFieldAddon } from '@oakjs/addon-remirror';
import { ckeditorFieldAddon } from '@oakjs/addon-ckeditor5-react';
import styles from '@oakjs/theme/dist/oak.min.css';
import remirrorStyles from '@oakjs/addon-remirror/dist/oak-addon-remirror.min.css';

import { addStyles } from '../utils';
import ImageField from '../ImageField';

const BuilderField = ({ attribute, name, value, onChange }) => {
  const { runHookSeries } = useStrapiApp();
  const { options } = attribute;
  const addon = baseAddon();
  const theme = globalThis.localStorage?.getItem?.('STRAPI_THEME') || 'light';
  const customAddons = useMemo(() => (
    runHookSeries('oak:addons:add') || []
  ), []);

  useLayoutEffect(() => {
    addStyles(styles, { id: 'oak-theme' });
    addStyles(remirrorStyles, { id: 'oak-remirror' });
  }, []);

  return (
    <div className={classNames('oak-strapi', theme)}>
      <Builder
        rootBoundary={document.body}
        addons={[{
          ...addon,
          fields: addon.fields.map(f => f.type === 'image' ? {
            ...f,
            render: ({ value, onChange }) => (
              <ImageField onChange={onChange} value={value} />
            ),
          } : f),
        }, remirrorFieldAddon(), ckeditorFieldAddon(), {
          overrides: [{
            type: 'component',
            targets: ['title', 'text', 'button'],
            fields: [{
              key: 'content',
              type: options.editor || 'ckeditor',
            }],
          }],
        }, ...customAddons]}
        defaultValue={JSON.parse(value || '[]')}
        onChange={val =>
          onChange({ target: { name, value: JSON.stringify(val) } })
        }
      />
    </div>
  );
};

export default BuilderField;
