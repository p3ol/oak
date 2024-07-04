import {
  type MutableRefObject,
  type ReactElement,
  type MouseEvent,
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
import { useBuilder } from '../hooks';
import Form from './Form';

export interface ModalEditableProps extends SpecialComponentPropsWithoutRef {
  children: ReactElement;
  element: ElementObject;
  component: ComponentObject;
  modalRef?: MutableRefObject<any>;
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

  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
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
