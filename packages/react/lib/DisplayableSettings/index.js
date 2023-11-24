import { Fragment, useMemo } from 'react';
import { classNames } from '@junipero/react';

import { useBuilder } from '../hooks';
import Text from '../Text';
import Property from './Property';

const DisplayableSettings = ({ className, element, component, override }) => {
  const { builder } = useBuilder();

  const getSettingPriority = setting => {
    const fieldOverride = {
      ...builder.getOverride('setting', element.type, { setting }),
      ...builder.getOverride('component', element.type, {
        output: 'field', setting,
      }),
    };

    return Number.isSafeInteger(fieldOverride?.priority)
      ? fieldOverride.priority
      : setting.priority || 0;
  };

  const displayableSettings = useMemo(() => (
    builder
      .getComponentDisplayableSettings(element, { component })
      .filter(s => !s.condition || s.condition(element))
      .sort((a, b) => getSettingPriority(b) - getSettingPriority(a))
  ), [element, component]);

  if (displayableSettings.length <= 0) {
    return null;
  }

  return (
    <div
      className={classNames(
        'displayable-settings junipero extra !oak-text-alternate-text-color',
        className,
      )}
    >
      { displayableSettings.map((setting, i) => (
        <Fragment key={setting.key || i}>
          <Property field={setting} element={element} override={override} />
          { i < displayableSettings.length - 1 && (
            <Text name="core.propertySeparator" default=", " />
          ) }
        </Fragment>
      )) }
    </div>
  );
};

export default DisplayableSettings;
