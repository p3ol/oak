import {
  type MutableRefObject,
  type ReactElement,
  forwardRef,
} from 'react';
import type {
  ComponentObject,
  ElementObject,
} from '@oakjs/core';
import {
  type ModalRef,
  type SpecialComponentPropsWithoutRef,
} from '@junipero/react';
import { type Boundary, UseFloatingOptions } from '@floating-ui/react';

import type { OakRef } from '../types';
import FloatingEditable from './Floating';
import ModalEditable from './Modal';

export interface EditableProps extends SpecialComponentPropsWithoutRef {
  children: ReactElement;
  element: ElementObject;
  component: ComponentObject;
  modalRef?: MutableRefObject<ModalRef>;
  floatingOptions?: UseFloatingOptions & {
    boundary?: Boundary;
  };
  onToggle?: (state: { opened: boolean }) => void;
  setOpened?: (opened: boolean) => void;
  opened?: boolean;
}

export declare interface FloatingRef extends OakRef {
  open?: () => void;
  close?: () => void;
  toggle?: () => void;
  opened?: boolean;
  innerRef?: MutableRefObject<any>;
  editableType?: 'floating' | 'modal';
}

export declare interface EditableRef extends OakRef {
  open?: () => void;
  close?: () => void;
  toggle?: () => void;
  forceClose?: () => void;
  innerRef?: MutableRefObject<FloatingRef | HTMLDivElement | null>;
  current?: FloatingRef | HTMLDivElement | null;
}

const Editable = forwardRef<EditableRef, EditableProps>(({
  children,
  floatingOptions,
  element,
  component,
  onToggle,
  modalRef,
  setOpened,
  opened,
  editableType,
}, ref) => (
  <>
    { editableType === 'modal' ? (
      <ModalEditable
        ref={ref}
        children={children}
        modalRef={modalRef}
        element={element}
        component={component}
      />
    ) : (
      <FloatingEditable
        ref={ref}
        children={children}
        element={element}
        onToggle={onToggle}
        component={component}
        floatingOptions={floatingOptions}
        setOpened={setOpened}
        opened={opened}
      />
    ) }
  </>
));

Editable.displayName = 'Editable';

export default Editable;
