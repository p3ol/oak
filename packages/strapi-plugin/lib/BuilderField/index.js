import React, { useLayoutEffect, useMemo, useState } from 'react';
import { useStrapiApp } from '@strapi/helper-plugin';
import { Loader } from '@strapi/design-system';
import { Builder, baseAddon, classNames, useTimeout } from '@oakjs/react';
import { remirrorFieldAddon } from '@oakjs/addon-remirror';
import { ckeditorFieldAddon } from '@oakjs/addon-ckeditor5-react';
import styled from 'styled-components';
import styles from '@oakjs/theme/dist/oak.min.css';
import remirrorStyles from '@oakjs/addon-remirror/dist/oak-addon-remirror.min.css';
import ckeditorStyles from '@oakjs/addon-ckeditor5-react/dist/oak-addon-ckeditor.min.css';

import { addStyles } from '../utils';
import ImageField from '../ImageField';

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const BuilderField = ({ attribute, name, value, onChange }) => {
  const { runHookSeries } = useStrapiApp();
  const { options } = attribute;
  const addon = baseAddon();
  const [loading, setLoading] = useState(true);
  const theme = globalThis.localStorage?.getItem?.('STRAPI_THEME') || 'light';
  const customAddons = useMemo(() => (
    runHookSeries('oak:addons:add') || []
  ), [runHookSeries]);

  // Delay rendering to avoid content issues when locale changes due to
  // non-controlled builder (for performance reasons)
  useTimeout(() => {
    setLoading(false);
  }, 500, []);

  useLayoutEffect(() => {
    addStyles(styles, { id: 'oak-theme' });

    switch (options.editor) {
      case 'remirror':
        addStyles(remirrorStyles, { id: 'oak-remirror' });
        break;
      case 'ckeditor':
        addStyles(ckeditorStyles, { id: 'oak-ckeditor' });
        break;
    }
  }, [options.editor]);

  if (loading) {
    return <LoaderContainer><Loader /></LoaderContainer>;
  }

  return (
    <div className={classNames('oak-strapi', theme)}>
      <Builder
        options={{ debug: options.debug }}
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
