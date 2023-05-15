import React from 'react';
import styled from 'styled-components';
import { Icon } from '@strapi/design-system/Icon';
import { Flex } from '@strapi/design-system/Flex';

import OakIcon from './lib/Icon';

const IconBox = styled(Flex)`
  background-color: #f0f0ff;
  border: 1px solid #d9d8ff;
  padding: 1px;
`;

export default {
  register (app) {
    app.createHook('oak:addons:add');

    app.customFields.register({
      name: 'oak',
      pluginId: 'oak',
      type: 'text',
      icon: () => (
        <IconBox
          justifyContent="center"
          alignItems="center"
          width={7}
          height={6}
          hasRadius
        >
          <Icon as={OakIcon} />
        </IconBox>
      ),
      intlLabel: {
        id: 'oak.field.builder.label',
        defaultMessage: 'Oak content',
      },
      intlDescription: {
        id: 'oak.field.builder.description',
        defaultMessage: 'A field to build content with Oak',
      },
      components: {
        Input: () => import('./lib/BuilderField'),
      },
      options: {
        base: [{
          intlLabel: {
            id: 'oak.options.editor.label',
            defaultMessage: 'Choose editor',
          },
          description: {
            id: 'oak.options.editor.description',
            defaultMessage: 'Select a text editor',
          },
          name: 'options.editor',
          type: 'select',
          options: [{
            key: 'ckeditor',
            value: 'ckeditor',
            metadatas: {
              intlLabel: {
                id: 'oak.options.editor.ckeditor.label',
                defaultMessage: 'CKEditor 5',
              },
            },
          }, {
            key: 'remirror',
            value: 'remirror',
            metadatas: {
              intlLabel: {
                id: 'oak.options.editor.remirror.label',
                defaultMessage: 'Remirror',
              },
            },
          }],
        }],
        advanced: [{
          intlLabel: {
            id: 'oak.options.debug.label',
            defaultMessage: 'Debug mode',
          },
          description: {
            id: 'oak.options.debug.description',
            defaultMessage: 'Enable debug mode',
          },
          name: 'options.debug',
          type: 'checkbox',
        }],
      },
    });
  },
};
