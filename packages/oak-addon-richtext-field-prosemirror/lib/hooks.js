import { EditorState } from 'prosemirror-state';
import { useState } from 'react';

export const useProseMirror = config =>
  useState(() => EditorState.create(config));
