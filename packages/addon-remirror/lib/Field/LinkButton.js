import { useCallback, useState } from 'react';
import {
  Dropdown,
  DropdownMenu,
  DropdownToggle,
  TextField,
  Toggle,
  Label,
  Text,
  /*Icon, */
} from '@oakjs/react';
import { useAttrs, useChainedCommands, useCommands } from '@remirror/react';

import MenuButton from './MenuButton';

const LinkButton = ({ children }) => {
  const { updateLink } = useCommands();
  const chain = useChainedCommands();
  const { link } = useAttrs();
  const [href, setHref] = useState(link?.()?.href || '');
  const [target, setTarget] = useState(link?.()?.target || null);

  const onUrlChange = useCallback(field => {
    setHref(field.value);

    if (!field.value) {
      chain.removeLink().run();
    } else {
      chain.updateLink({ href: field.value, target }).run();
    }
  }, [chain, target]);

  const onTargetChange = useCallback(field => {
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
            isActive={() => link()}
            className="link-button oak-inline-flex oak-items-center"
            tooltipText={(
              <Text name="addons.remirror.fields.editor.link">
                Link
              </Text>
            )}
          >
            { children }
          </MenuButton>
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
