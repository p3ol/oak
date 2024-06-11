import type { LinkAttributes } from 'remirror/extensions';
import { useCallback, useState } from 'react';
import {
  Dropdown,
  DropdownMenu,
  DropdownToggle,
  TextField,
  Toggle,
  Label,
  Text,
  FieldContent,
} from '@oakjs/react';
import { useAttrs, useChainedCommands, useCommands } from '@remirror/react';

import type { Extensions } from '../types';
import MenuButton, { type MenuButtonProps } from './MenuButton';

const LinkButton = (props: MenuButtonProps) => {
  const { updateLink } = useCommands();
  const chain = useChainedCommands();
  const { link } = useAttrs<Extensions>();
  const [href, setHref] = useState(link?.()?.href as string || '');
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
    <Dropdown className="link-field oak-items-center">
      <DropdownToggle>
        <span className="oak-inline-flex oak-items-center">
          <MenuButton
            enabled={() => !!updateLink}
            isActive={() => !!link()}
            className="link-button oak-inline-flex oak-items-center"
            tooltipText={(
              <Text name="addons.remirror.fields.editor.link">
                Link
              </Text>
            )}
            { ...props }
          />
        </span>
      </DropdownToggle>
      <DropdownMenu className="link-input">
        <div className="oak-flex oak-flex-col oak-gap-4">
          <div>
            <Label className="!oak-pt-0">
              <Text name="addons.remirror.fields.editor.link">
                Link
              </Text>
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
            <Text name="addons.remirror.fields.editor.blank">
              Open in a new tab
            </Text>
          </Toggle>
        </div>
      </DropdownMenu>
    </Dropdown>
  );
};

LinkButton.displayName = 'LinkButton';

export default LinkButton;
