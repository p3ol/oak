import { Tooltip, Button } from '@junipero/react';

import { useBuilder } from '../hooks';
import Text from '../Text';
import Icon from '../Icon';

const HistoryButtons = ({ canUndo, canRedo }) => {
  const { builder, rootRef, floatingsRef, rootBoundary } = useBuilder();

  return (
    <div className="oak-flex oak-gap-2">
      <Tooltip
        disabled={!canUndo}
        container={floatingsRef.current}
        floatingOptions={{
          boundary: rootBoundary?.current || rootRef?.current,
          rootBoundary: rootBoundary?.current || rootRef?.current,
        }}
        text={<Text name="core.tooltips.undo">Undo</Text>}
      >
        <Button
          type="button"
          onClick={builder.undo.bind(builder)}
          disabled={!canUndo}
        >
          <Icon>undo</Icon>
        </Button>
      </Tooltip>
      <Tooltip
        disabled={!canRedo}
        container={floatingsRef.current}
        floatingOptions={{
          boundary: rootBoundary?.current || rootRef?.current,
          rootBoundary: rootBoundary?.current || rootRef?.current,
        }}
        text={<Text name="core.tooltips.redo">Redo</Text>}
      >
        <Button
          type="button"
          onClick={builder.redo.bind(builder)}
          disabled={!canRedo}
        >
          <Icon>redo</Icon>
        </Button>
      </Tooltip>
    </div>
  );
};

HistoryButtons.displayName = 'HistoryButtons';

export default HistoryButtons;
