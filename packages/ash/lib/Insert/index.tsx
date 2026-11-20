import type { ComponentObject } from '@oakjs/core';
import { classNames } from '@junipero/react';

import { useCatalogue } from '../useCatalogue';
import Icon from '../Icon';
import Text from '../Text';
import ComponentButton from './ComponentButton';

export declare interface InsertProps {
  compact?: boolean;
  className?: string;
  onInsert?: (component: ComponentObject) => void;
}

const Insert = ({ compact, className, onInsert }: InsertProps) => {
  const { groups, insert, paste } = useCatalogue();

  const onClick = (component: ComponentObject) => {
    insert(component);
    onInsert?.(component);
  };

  return (
    <div className={classNames('oak:flex oak:flex-col oak:gap-4 oak:p-3', className)}>
      { groups.map(group => (
        <section key={group.id} className="oak:flex oak:flex-col oak:gap-2">
          <h4
            className={classNames(
              'oak:m-0 oak:text-[11px] oak:uppercase oak:tracking-wide',
              'oak:text-ash-text-muted oak:font-medium',
            )}
          >
            <Text>{ group.name }</Text>
          </h4>
          <div className="oak:grid oak:grid-cols-2 oak:gap-2">
            { group.components.map((component: ComponentObject) => (
              <ComponentButton
                key={component.id}
                component={component}
                compact={compact}
                onClick={onClick}
              />
            )) }
          </div>
        </section>
      )) }

      <button
        type="button"
        onClick={async () => {
          await paste();
          onInsert?.(null);
        }}
        className={classNames(
          'oak:flex oak:items-center oak:justify-center oak:gap-2 oak:h-9',
          'oak:rounded-md oak:border oak:border-dashed oak:border-ash-border',
          'oak:bg-transparent oak:text-ash-text-muted oak:text-xs oak:cursor-pointer',
          'oak:hover:text-ash-text oak:hover:border-ash-text-muted',
        )}
      >
        <Icon className="oak:text-base!">appearences</Icon>
        <Text name="core.pasteFromClipboard">Paste from clipboard</Text>
      </button>
    </div>
  );
};

Insert.displayName = 'Insert';

export default Insert;
