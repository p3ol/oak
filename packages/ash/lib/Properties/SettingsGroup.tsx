import type { SettingOverride } from '@oakjs/core';
import { useEffect, useMemo, useRef, useState } from 'react';
import { classNames } from '@junipero/react';

import type { SettingProps } from './Setting';
import { useBuilder } from '../hooks';
import ChevronIcon from '../Icon/ChevronIcon';
import Text from '../Text';
import Tab, { type TabProps } from './Tab';

const SettingsGroup = ({
  setting,
  component,
  element,
  onSettingChange,
  onSettingCustomChange,
  onUpdate,
}: SettingProps & Pick<TabProps, 'onUpdate'>) => {
  const { builder } = useBuilder();
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      toggleRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [open]);

  const override = useMemo(() => (
    builder.getOverride('setting', element.type, { setting }) as SettingOverride
  ), [element, setting, builder]);

  const condition = override?.condition || setting.condition;

  if (
    condition &&
    !condition(element, { component, builder })
  ) {
    return null;
  }

  return (
    <div className="fields-group oak:flex oak:flex-col oak:gap-4">
      <div
        ref={toggleRef}
        className={classNames(
          'fields-group-toggle oak:flex oak:items-center oak:gap-2',
          'oak:cursor-pointer oak:py-2 oak:px-4 oak:select-none',
          'oak:bg-ash-surface oak:text-sm',
          'oak:font-medium oak:border-y oak:border-ash-border',
          { open }
        )}
        onClick={() => setOpen(!open)}
      >
        <ChevronIcon open={open} className="oak:text-ash-text-muted" />
        <Text>{ setting.label }</Text>
      </div>
      { open && (
        <Tab
          className="oak:max-h-none!"
          tab={setting}
          component={component}
          element={element}
          onSettingChange={onSettingChange}
          onSettingCustomChange={onSettingCustomChange}
          onUpdate={onUpdate}
        />
      ) }
    </div>
  );
};

export default SettingsGroup;
