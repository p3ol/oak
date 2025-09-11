import type { TransitionProps } from '@junipero/react';
import type { ReactNode } from 'react';
import { vi } from 'vitest';

vi.mock('@junipero/transitions', async importActual => {
  const module = await importActual<typeof import('@junipero/transitions')>();

  return {
    ...module,
    slideInDownMenu: (menu: ReactNode, props: TransitionProps) =>
      props.opened ? menu : null,
  };
});
