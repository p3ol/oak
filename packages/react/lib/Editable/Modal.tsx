import {
  type MutableRefObject,
  type ReactElement,
  cloneElement,
  forwardRef,
} from 'react';
import type {
  ComponentObject,
  ElementObject,
} from '@oakjs/core';
import {
  Modal,
  type SpecialComponentPropsWithoutRef,
} from '@junipero/react';
import { slideInLeftModal } from '@junipero/transitions';

import type { EditableRef } from '.';
import type { OakRef } from '../types';
import Form from './Form';
import { useBuilder } from '../hooks';

export interface ModalEditableProps extends SpecialComponentPropsWithoutRef {
  children: ReactElement;
  element: ElementObject;
  component: ComponentObject;
  modalRef?: MutableRefObject<any>;
}

export declare interface FloatingRef extends OakRef {
  open: () => void;
  close: () => void;
  innerRef: MutableRefObject<any>;
}

const ModalEditable = forwardRef<
  EditableRef,
  ModalEditableProps
>(({
  element,
  component,
  modalRef,
  children,
}, ref) => {
  const { floatingsRef } = useBuilder();

  const onClick = (e: any) => {
    e?.preventDefault();
    modalRef.current?.open();
  };

  return (
    <div>
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
          editableRef={ref as MutableRefObject<EditableRef>}
        />
      </Modal>
    </div>
  );
});

ModalEditable.displayName = 'ModalEditable';

export default ModalEditable;
