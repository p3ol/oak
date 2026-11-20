import type { SettingOverride } from '@oakjs/core';
import { useEffect, useMemo, useRef, useState } from 'react';
import { classNames } from '@junipero/react';

import type { SettingProps } from './Setting';
import { useBuilder } from '../hooks';
import ChevronIcon from '../Icon/ChevronIcon';
import Text from '../Text';
import Tab, { type TabProps } from './Tab';

export declare interface SettingsGroupProps
  extends SettingProps, Pick<TabProps, 'onUpdate'> {
  /**
   * Whether the group's toggle is separated from the surrounding settings by
   * borders
   */
  bordered?: boolean;
  /**
   * Classes of the group's content (displayed when the group is open)
   */
  contentClassName?: string;
}

const SettingsGroup = ({
  bordered = true,
  contentClassName,
  setting,
  component,
  element,
  onSettingChange,
  onSettingCustomChange,
  onUpdate,
}: SettingsGroupProps) => {
  const { builder } = useBuilder();
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const toggle = toggleRef.current;

    if (!open || !toggle) {
      return;
    }

    // Main tabs titles stick to the top of the scrolling sidebar (see
    // index.css): scroll the toggle below them instead of under them
    const titles = toggle
      .closest('.oak-ash-tabs:not(.oak-ash-subtabs)')
      ?.querySelector<HTMLElement>(':scope > .titles');
    toggle.style.scrollMarginTop = `${titles?.offsetHeight || 0}px`;
    toggle.scrollIntoView({ behavior: 'smooth' });
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
          'oak:font-medium',
          { open, 'oak:border-y oak:border-ash-border': bordered }
        )}
        onClick={() => setOpen(!open)}
      >
        <ChevronIcon open={open} className="oak:text-ash-text-muted" />
        <Text>{ setting.label }</Text>
      </div>
      { open && (
        <Tab
          className={classNames('oak:max-h-none!', contentClassName)}
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
