import { type FormEvent, useRef, useState } from 'react';
import {
  type BaseSelection,
  $createTextNode,
  $getSelection,
  $insertNodes,
  $isRangeSelection,
  $setSelection,
} from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $createLinkNode, $toggleLink } from '@lexical/link';
import { Button, TextField, Toggle } from '@junipero/react';

import type { ToolbarState } from './useToolbarState';
import { useLexicalField } from './context';
import ToolbarDropdown, { type ToolbarDropdownRef } from './ToolbarDropdown';
import Icon from './Icon';

const LinkDropdown = ({ state }: { state: ToolbarState }) => {
  const [editor] = useLexicalComposerContext();
  const { t } = useLexicalField();
  const dropdownRef = useRef<ToolbarDropdownRef>(null);
  // The form takes the focus: the selection is restored to apply the link
  const selection = useRef<BaseSelection | null>(null);
  const [url, setUrl] = useState('');
  const [blank, setBlank] = useState(false);

  const onToggle = (opened: boolean) => {
    if (!opened) {
      return;
    }

    selection.current = editor.read(() => $getSelection()?.clone() ?? null);
    setUrl(state.link?.url || '');
    setBlank(state.link?.target === '_blank');
  };

  const apply = (href: string | null) => {
    editor.update(() => {
      if (selection.current) {
        $setSelection(selection.current.clone());
      }

      const current = $getSelection();
      const attributes = blank
        ? { target: '_blank', rel: 'noopener noreferrer' }
        : { target: null, rel: null };

      // Link without selected text: the url is inserted
      if (
        href && $isRangeSelection(current) && current.isCollapsed() &&
        !state.link
      ) {
        const link = $createLinkNode(href, attributes);
        link.append($createTextNode(href));
        $insertNodes([link]);

        return;
      }

      $toggleLink(href ? { url: href, ...attributes } : null);
    });

    dropdownRef.current?.close();
    editor.focus();
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    apply(url.trim() || null);
  };

  return (
    <ToolbarDropdown
      ref={dropdownRef}
      label={t('addons.lexical.fields.editor.link', 'Link')}
      icon={<Icon name="link" />}
      active={!!state.link}
      menuClassName="oak-lexical-link-menu"
      onToggle={onToggle}
    >
      <form className="oak-lexical-link-form" onSubmit={onSubmit}>
        <TextField
          autoFocus
          value={url}
          placeholder={t(
            'addons.lexical.fields.editor.linkPlaceholder', 'https://'
          )}
          onChange={({ value }) => setUrl(String(value ?? ''))}
        />
        <Toggle checked={blank} onChange={({ checked }) => setBlank(checked)}>
          { t('addons.lexical.fields.editor.blank', 'Open in a new tab') }
        </Toggle>
        <div className="oak-lexical-link-actions">
          { state.link && (
            <Button
              type="button"
              className="subtle"
              onClick={() => apply(null)}
            >
              { t('addons.lexical.fields.editor.unlink', 'Remove link') }
            </Button>
          ) }
          <Button type="submit" className="primary" disabled={!url.trim()}>
            { t('addons.lexical.fields.editor.save', 'Save') }
          </Button>
        </div>
      </form>
    </ToolbarDropdown>
  );
};

LinkDropdown.displayName = 'LinkDropdown';

export default LinkDropdown;
