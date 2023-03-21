import { useEffect, useRef, useState } from 'react';
import { Draggable, classNames } from '@junipero/react';

import Option from './Option';
import Text from './Text';

export const DRAG_OPTION = {
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
        onBeforeDragStart={onDrag}
        dragImage={dragImage}
        data={element}
      >
        <Option
          onClick={e => e.preventDefault()}
          option={{ icon: 'pause' }}
          className={classNames(className, 'oak-drag-handle')}
          name={<Text name="core.tooltips.move" default="Move" />}
        />
      </Draggable>
    );
  },
};
