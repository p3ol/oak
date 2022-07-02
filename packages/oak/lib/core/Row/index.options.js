import { useEffect, useRef, useState } from 'react';
import { classNames } from '@poool/junipero-utils';

import Option from '../Option';
import Draggable from '../Draggable';
import Text from '../Text';

const DragOption = {
  render: ({ element, elementInnerRef, className }) => {
    const optionRef = useRef();
    const [dragImage, setDragImage] = useState(null);

    useEffect(() => {
      setDragImage(elementInnerRef.current);
    }, [elementInnerRef.current]);

    const onDrag = () => {
      optionRef.current?.tooltipRef?.current?.close();
    };

    return (
      <Draggable
        ref={optionRef}
        onBeforeDrag={onDrag}
        dragImage={dragImage}
        data={element}
      >
        <Option
          onClick={e => e.preventDefault()}
          option={{ icon: 'drag_handle' }}
          className={classNames(className, 'oak-drag-handle')}
          name={<Text name="core.tooltips.move" default="Move" />}
        />
      </Draggable>
    );
  },
};

export default [DragOption];
