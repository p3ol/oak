import { useState } from 'react';
import { EditorState } from 'prosemirror-state';

export const useProseMirror = config =>
  useState(() => EditorState.create(config));
