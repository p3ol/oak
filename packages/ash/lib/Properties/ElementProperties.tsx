import { type Key, useMemo } from 'react';
import type {
  ComponentObject,
  ComponentOverride,
  ComponentSettingsFieldObject,
  ComponentSettingsFormObject,
  ComponentSettingsTabObject,
  ElementObject,
  FieldObject,
  SettingOverrideObject,
} from '@oakjs/core';
import { Tabs, Tooltip, classNames, exists } from '@junipero/react';

import { useBuilder, useEditor } from '../hooks';
import { copyToClipboard } from '../utils';
import { getAncestors } from '../tree';
import { useElementDraft } from './useElementDraft';
import Icon from '../Icon';
import Text from '../Text';
import Tab from './Tab';

export declare interface ElementPropertiesProps {
  element: ElementObject;
}

export const ActionButton = ({
  icon,
  title,
  onClick,
  danger,
}: {
  icon: string;
  title: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
}) => {
  const { floatingsRef } = useBuilder();

  return (
    <Tooltip text={title} container={floatingsRef?.current} placement="bottom">
      <button
        type="button"
        onClick={onClick}
        className={classNames(
          'oak:flex oak:items-center oak:justify-center oak:w-7 oak:h-7',
          'oak:rounded oak:border-0 oak:bg-transparent oak:cursor-pointer',
          'oak:text-ash-text-muted oak:hover:bg-ash-muted',
          danger ? 'oak:hover:text-grapefruit' : 'oak:hover:text-ash-text',
        )}
      >
        <Icon className="oak:text-lg!">{ icon }</Icon>
      </button>
    </Tooltip>
  );
};

const ElementProperties = ({ element }: ElementPropertiesProps) => {
  const { builder, addons } = useBuilder();
  const { tree, select } = useEditor();
  const node = tree.nodes.get(String(element.id));

  const component = useMemo(() => (
    builder.getComponent(element.type) as ComponentObject
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ), [builder, element.type, addons]);
  const override = useMemo(() => (
    builder.getOverride('component', element.type) as ComponentOverride
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ), [builder, element.type, addons]);

  const {
    draft,
    onSettingChange,
    onSettingCustomChange,
    onUpdate,
  } = useElementDraft(builder, element, component);

  const editable = (override?.editable ?? component?.editable) !== false;
  const removable = (override?.removable ?? component?.removable) !== false;
  const duplicable = override?.duplicable ?? component?.duplicable;
  const copyable = override?.copyable ?? component?.copyable;

  const onRemove = () => {
    select(node?.parent ? String(node.parent.id) : null);
    builder.removeElement(element.id, { parent: node?.container });
  };

  const onDuplicate = () => {
    const duplicated = builder.duplicateElement(element, {
      parent: node?.container,
    });

    if (duplicated) {
      select(String(duplicated.id));
    }
  };

  const onCopy = () => {
    copyToClipboard(JSON.stringify(element));
  };

  const tabs = useMemo(() => {
    if (!component || !draft) {
      return [];
    }

    const available: (ComponentSettingsTabObject | ComponentSettingsFormObject)[] =
      builder.getAvailableSettings();

    return available
      .concat(
        (component.settings?.fields || [])
          .filter((f: FieldObject) => f.type === 'tab' && !exists(f.tab)) as
          ComponentSettingsTabObject[]
      )
      .sort((
        a: ComponentSettingsTabObject,
        b: ComponentSettingsTabObject,
      ) => (b.priority || 0) - (a.priority || 0))
      .filter((tab: ComponentSettingsTabObject) => {
        const tabOverride = builder.getOverride(
          'setting', element.type, { setting: { key: tab.id } }
        ) as SettingOverrideObject;
        const condition = tabOverride?.condition || tab.condition;

        return tab.type === 'tab' && !exists(tab.tab) && (
          !condition || condition(draft, { component, builder })
        );
      })
      .map((tab: ComponentSettingsTabObject, t: number) => {
        const subtabs = (
          builder.getAvailableSettings() as ComponentSettingsTabObject[]
        ).filter(s => s.type === 'tab' && s.tab === tab.id);

        return {
          title: <Text>{ tab.title }</Text>,
          content: (
            <Tab
              key={(tab.id || t) as Key}
              tab={tab as ComponentSettingsTabObject | ComponentSettingsFieldObject}
              component={component}
              element={draft}
              overrides={override}
              subtabs={subtabs.length > 0 ? subtabs : undefined}
              onUpdate={onUpdate}
              onSettingChange={onSettingChange}
              onSettingCustomChange={onSettingCustomChange}
            />
          ),
        };
      });
  // Draft is mutated in place, we need to recompute tabs on every render
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [builder, component, override, draft, JSON.stringify(draft)]);

  const ancestors = useMemo(() => (
    getAncestors(tree, String(element.id))
  ), [tree, element.id]);

  return (
    <div className="oak:flex oak:flex-col oak:min-h-0 oak:flex-auto">
      <div
        className={classNames(
          'oak:flex oak:flex-col oak:gap-1 oak:px-4 oak:py-3',
          'oak:border-b oak:border-ash-border',
        )}
      >
        { ancestors.length > 0 && (
          <div
            className={classNames(
              'oak:flex oak:items-center oak:flex-wrap oak:gap-1',
              'oak:text-xs oak:text-ash-text-muted',
            )}
          >
            { ancestors.map(a => (
              <span key={a.id} className="oak:flex oak:items-center oak:gap-1">
                <button
                  type="button"
                  onClick={() => select(a.id)}
                  className={classNames(
                    'oak:border-0 oak:bg-transparent oak:p-0 oak:text-xs',
                    'oak:text-ash-text-muted oak:cursor-pointer oak:hover:text-velvet',
                  )}
                >
                  <Text>
                    { builder.getComponent(a.element.type)?.name || a.element.type }
                  </Text>
                </button>
                <span>/</span>
              </span>
            )) }
          </div>
        ) }
        <div className="oak:flex oak:items-center oak:gap-2">
          <Icon className="oak:text-xl! oak:text-velvet">
            { typeof component?.icon === 'function'
              ? (component.icon as any).bind(null, component)
              : component?.icon || 'help_circle' }
          </Icon>
          <h3
            className={classNames(
              'oak:m-0 oak:flex-auto oak:text-sm oak:font-semibold',
              'oak:truncate oak:text-ash-text',
            )}
          >
            { component?.settings?.title ? (
              <Text>{ component.settings.title }</Text>
            ) : component ? (
              <Text>{ component.name }</Text>
            ) : (
              <Text name="core.components.unknown">Unknown</Text>
            ) }
          </h3>
          <div className="oak:flex oak:items-center">
            { copyable && (
              <ActionButton
                icon="copy_file"
                onClick={onCopy}
                title={<Text name="core.tooltips.copy">Copy</Text>}
              />
            ) }
            { duplicable && (
              <ActionButton
                icon="copy"
                onClick={onDuplicate}
                title={<Text name="core.tooltips.duplicate">Duplicate</Text>}
              />
            ) }
            { removable && (
              <ActionButton
                danger
                icon="close"
                onClick={onRemove}
                title={<Text name="core.tooltips.remove">Remove</Text>}
              />
            ) }
          </div>
        </div>
      </div>

      <div className="oak:flex-auto oak:overflow-y-auto oak:min-h-0">
        { editable && tabs.length > 0 ? (
          <Tabs
            key={String(element.id)}
            className="oak-ash-tabs"
            tabs={tabs}
          />
        ) : (
          <p className="oak:px-4 oak:py-6 oak:m-0 oak:text-sm oak:text-ash-text-muted">
            <Text name="ash.properties.notEditable">
              This element has no editable properties.
            </Text>
          </p>
        ) }
      </div>
    </div>
  );
};

ElementProperties.displayName = 'ElementProperties';

export default ElementProperties;
