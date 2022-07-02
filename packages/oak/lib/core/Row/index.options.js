import { useEffect, useRef, useState } from 'react';
import { classNames } from '@poool/junipero-utils';

import Option from '../Option';
import Draggable from '../Draggable';

const DragOption = {
  render: ({ element, elementInnerRef, className }) => {
    const optionRef = useRef();
    const [dragImage, setDragImage] = useState(null);

    useEffect(() => {
      setDragImage(elementInnerRef.current);
    }, [elementInnerRef.current]);

    return (
      <Draggable
        ref={optionRef}
        dragImage={dragImage}
        data={element}
      >
        <Option
          onClick={e => e.preventDefault()}
          option={{ icon: 'drag_handle' }}
          className={classNames(className, 'oak-drag-handle')}
        />
      </Draggable>
    );
  },
};

export default [DragOption];
