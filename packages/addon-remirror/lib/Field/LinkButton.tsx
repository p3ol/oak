import type { LinkAttributes } from 'remirror/extensions';
import { useCallback, useState } from 'react';
import {
  type FieldContent,
  Dropdown,
  DropdownMenu,
  DropdownToggle,
  TextField,
  Toggle,
  Label,
} from '@junipero/react';
import { useAttrs, useChainedCommands, useCommands } from '@remirror/react';

import type { Extensions } from '../types';
import { useRemirrorField } from './context';
import MenuButton, { type MenuButtonProps } from './MenuButton';

const LinkButton = (props: MenuButtonProps) => {
  const { t, container } = useRemirrorField();
  const { updateLink } = useCommands();
  const chain = useChainedCommands();
  const { link } = useAttrs<Extensions>();
  const [href, setHref] = useState(() => link?.()?.href as string || '');
  const [target, setTarget] = useState<
    LinkAttributes['target']
  >(link()?.target as LinkAttributes['target']);

  const onUrlChange = useCallback((field: FieldContent<string>) => {
    setHref(field.value);

    if (!field.value) {
      chain.removeLink().run();
    } else {
      chain.updateLink({ href: field.value, target }).run();
    }
  }, [chain, target]);

  const onTargetChange = useCallback((field: FieldContent<string>) => {
    const t = field.value ? '_blank' : null;
    setTarget(t);

    if (!href) {
      chain.removeLink().run();
    } else {
      chain.updateLink({ href, target: t }).run();
    }
  }, [chain, href]);

  return (
    <Dropdown className="link-field" container={container}>
      <DropdownToggle>
        <span className="menu-button-wrapper">
          <MenuButton
            enabled={() => !!updateLink}
            isActive={() => !!link()}
            className="link-button"
            tooltipText={t('addons.remirror.fields.editor.link', 'Link')}
            { ...props }
          />
        </span>
      </DropdownToggle>
      <DropdownMenu className="link-input">
        <div className="link-form">
          <div>
            <Label>
              { t('addons.remirror.fields.editor.link', 'Link') }
            </Label>
            <TextField
              value={href}
              onChange={onUrlChange}
              className="link-url"
            />
          </div>
          <Toggle
            checked={target === '_blank'}
            onChange={onTargetChange}
          >
            { t('addons.remirror.fields.editor.blank', 'Open in a new tab') }
          </Toggle>
        </div>
      </DropdownMenu>
    </Dropdown>
  );
};

LinkButton.displayName = 'LinkButton';

export default LinkButton;
