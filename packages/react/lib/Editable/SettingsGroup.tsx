import type { SettingOverride } from '@oakjs/core';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowDown, ArrowRight, classNames } from '@junipero/react';

import type { SettingProps } from './Setting';
import { useBuilder } from '../hooks';
import Text from '../Text';
import Tab, { type TabProps } from './Tab';

const SettingsGroup = ({
  setting,
  component,
  element,
  editableRef,
  onSettingChange,
  onSettingCustomChange,
  onUpdate,
}: SettingProps & Pick<TabProps, 'onUpdate'>) => {
  const { editableType, builder } = useBuilder();
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLDivElement>();

  useEffect(() => {
    if (open) {
      toggleRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [open]);

  const override = useMemo(() => (
    builder.getOverride('setting', element.type, { setting }) as SettingOverride
  ), [element, setting]);

  const condition = override?.condition || setting.condition;

  if (
    condition &&
    !condition(element, { component, builder })
  ) {
    return null;
  }

  return (
    <div className="fields-group oak-flex oak-flex-col oak-gap-4">
      <div
        ref={toggleRef}
        className={classNames(
          'fields-group-toggle oak-flex oak-items-center oak-gap-2',
          'oak-justify-between oak-cursor-pointer oak-py-2 oak-px-[20px]',
          'oak-sticky oak-z-10',
          editableType === 'modal' ? 'oak-top-0' : '-oak-top-2',
          {
            open,
          }
        )}
        onClick={() => setOpen(!open)}
      >
        <Text>{ setting.label }</Text>
        { open ? <ArrowDown /> : <ArrowRight /> }
      </div>
      { open && (
        <Tab
          className="!oak-max-h-none"
          tab={setting}
          component={component}
          element={element}
          editableRef={editableRef}
          onSettingChange={onSettingChange}
          onSettingCustomChange={onSettingCustomChange}
          onUpdate={onUpdate}
        />
      ) }
    </div>
  );
};

export default SettingsGroup;
