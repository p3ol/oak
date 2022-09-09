import { classNames, omit } from '@poool/junipero-utils';

import { useBuilder } from '../../hooks';
import options from './index.options';
import settings from './index.settings';
import Droppable from '../Droppable';
import Element from '../Element';
import Text from '../Text';

const Foldable = ({
  element,
  parent,
  ...rest
}) => {
  const { moveElement } = useBuilder();
  const config = {
    cantBeDeleted: true,
    cantBeDragged: true,
    cantBeDuplicated: true,
    notDroppable: true,
  };

  const onDropElement = (position, data) => {
    moveElement(data, element, { parent, position });
  };

  return (
    <div
      { ...omit(rest, ['builder']) }
      className={classNames(
        element.settings?.flexDirection &&
            'oak-direction-' + element.settings.flexDirection,
        element.settings?.alignItems &&
            'oak-align-' + element.settings.alignItems,
        element.settings?.justifyContent &&
            'oak-justify-' + element.settings.justifyContent,
      )}
    >
      <Droppable onDrop={onDropElement.bind(null, 'before')}>
        <div className="oak-drop-zone oak-before" />
      </Droppable>
      <Text
        name="core.components.foldable.sections.content"
        default="See more content section"
      />
      <div
        className={classNames(
          'oak-foldable-content',
          element.content?.settings?.flexDirection &&
            'oak-direction-' + element.content.settings.flexDirection,
          element.content?.settings?.alignItems &&
            'oak-align-' + element.content.settings.alignItems,
          element.content?.settings?.justifyContent &&
            'oak-justify-' + element.content.settings.justifyContent,
        )}
      >
        <Element
          element={element.content}
          parent={element}
          config={config}
        />
      </div>
      <Text
        name="core.components.foldable.sections.seeMore"
        default="See More title section"
      />
      <div
        className={classNames(
          'oak-foldable-see-more',
          'oak-foldable-content',
          element.seeMore?.settings?.flexDirection &&
            'oak-direction-' + element.seeMore.settings.flexDirection,
          element.seeMore?.settings?.alignItems &&
            'oak-align-' + element.seeMore.settings.alignItems,
          element.seeMore?.settings?.justifyContent &&
            'oak-justify-' + element.seeMore.settings.justifyContent,
        )}
      >
        <Element
          element={element.seeMore}
          parent={element}
          config={config}
        />
      </div>
      <Text
        name="core.components.foldable.sections.seeLess"
        default="See less title section"
      />
      <div
        className={classNames(
          'oak-foldable-see-less',
          'oak-foldable-content',
          element.seeLess?.settings?.flexDirection &&
            'oak-direction-' + element.seeLess.settings.flexDirection,
          element.seeLess?.settings?.alignItems &&
            'oak-align-' + element.seeLess.settings.alignItems,
          element.seeLess?.settings?.justifyContent &&
            'oak-justify-' + element.seeLess.settings.justifyContent,
        )}
      >
        <Element
          element={element.seeLess}
          parent={element}
          config={config}
        />
      </div>
      <Droppable onDrop={onDropElement.bind(null, 'after')}>
        <div className="oak-drop-zone oak-after" />
      </Droppable>
    </div>
  );
};

Foldable.settings = settings;
Foldable.options = options;
export default Foldable;
