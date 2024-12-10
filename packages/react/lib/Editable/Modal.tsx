import type {
  ComponentObject,
  ElementObject,
} from '@oakjs/core';
import {
  type RefObject,
  type ReactElement,
  type MouseEvent,
  type ComponentPropsWithoutRef,
  cloneElement,
} from 'react';
import {
  type ModalRef,
  type SpecialComponentPropsWithoutRef,
  Modal,
} from '@junipero/react';
import { slideInLeftModal } from '@junipero/transitions';

import type { EditableRef } from '.';
import { useBuilder } from '../hooks';
import Form from './Form';

export interface ModalEditableProps extends SpecialComponentPropsWithoutRef {
  ref?: RefObject<EditableRef>;
  children: ReactElement<ComponentPropsWithoutRef<any>>;
  element: ElementObject;
  component: ComponentObject;
  modalRef?: RefObject<ModalRef>;
}

const ModalEditable = ({
  ref,
  element,
  component,
  modalRef,
  children,
}: ModalEditableProps) => {
  const { floatingsRef } = useBuilder();

  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e?.preventDefault();
    modalRef.current?.open();
  };

  return (
    <>
      { cloneElement(children, { onClick }) }
      <Modal
        ref={modalRef}
        animate={slideInLeftModal}
        className="panel editable"
        closable={false}
        container={floatingsRef.current}
      >
        <Form
          element={element}
          component={component}
          onSave={() => modalRef.current?.close()}
          onCancel={() => modalRef.current?.close()}
          editableRef={ref}
        />
      </Modal>
    </>
  );
};

ModalEditable.displayName = 'ModalEditable';

export default ModalEditable;
