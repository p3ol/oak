import React from 'react';
import styled from 'styled-components';
import { Icon } from '@strapi/design-system/Icon';
import { Flex } from '@strapi/design-system/Flex';

import OakIcon from './components/Icon';

const IconBox = styled(Flex)`
  background-color: #f0f0ff;
  border: 1px solid #d9d8ff;
  padding: 1px;
`;

export default {
  register (app) {
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
    });
  },
};
