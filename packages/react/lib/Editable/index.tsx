import type { RefObject } from 'react';
import type { ComponentObject, ElementObject } from '@oakjs/core';
import type { ModalRef } from '@junipero/react';
import type { Boundary, UseFloatingOptions } from '@floating-ui/react';

import type { OakRef, SpecialComponentPropsWithRef } from '../types';
import { useBuilder } from '../hooks';
import FloatingEditable from './Floating';
import ModalEditable from './Modal';

export interface EditableProps
  extends SpecialComponentPropsWithRef<any, EditableRef> {
  element: ElementObject;
  component: ComponentObject;
  modalRef?: RefObject<ModalRef>;
  floatingOptions?: UseFloatingOptions & {
    boundary?: Boundary;
  };
  opened?: boolean;
  setOpened?: (opened: boolean) => void;
  onToggle?: (state: { opened: boolean }) => void;
}

export declare interface EditableRef extends OakRef {
  open?: () => void;
  close?: () => void;
  toggle?: () => void;
  forceClose?: () => void;
  innerRef?: RefObject<OakRef | HTMLDivElement | null>;
}

const Editable = ({
  ref,
  children,
  floatingOptions,
  element,
  component,
  onToggle,
  modalRef,
  setOpened,
  opened,
}: EditableProps) => {
  const { editableType } = useBuilder();

  return editableType === 'modal' ? (
    <ModalEditable
      ref={ref}
      modalRef={modalRef}
      element={element}
      component={component}
    >
      { children }
    </ModalEditable>
  ) : (
    <FloatingEditable
      ref={ref}
      element={element}
      onToggle={onToggle}
      component={component}
      floatingOptions={floatingOptions}
      setOpened={setOpened}
      opened={opened}
    >
      { children }
    </FloatingEditable>
  );
};

Editable.displayName = 'Editable';

export default Editable;
