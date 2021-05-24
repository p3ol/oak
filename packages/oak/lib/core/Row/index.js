import { nanoid } from 'nanoid';
import { classNames } from '@poool/junipero-utils';

import { useBuilder } from '../../hooks';
import Col from '../Col';

const Row = ({
  element,
  parent,
  ...rest
}) => {
  const { setElement, removeElement } = useBuilder();

  const onDivide = (index, isBefore) => {
    element.cols.splice(isBefore ? index : index + 1, 0, {
      content: [],
      id: nanoid(),
      style: {},
    });

    setElement(element, { cols: element.cols });
  };

  const onRemoveCol = index => {
    element.cols.splice(index, 1);
    setElement(element, { cols: element.cols });

    if (element.cols.length <= 0) {
      removeElement(element, { parent });
    }
  };

  return (
    <div
      { ...rest }
      style={element.style}
    >
      <div
        className={classNames(
          'oak-row-content',
          element.settings?.alignItems &&
            'oak-align-' + element.settings.alignItems,
          element.settings?.justifyContent &&
            'oak-justify-' + element.settings.justifyContent
        )}
      >
        { element?.cols?.map((col, i) => (
          <Col
            key={i}
            element={col}
            onPrepend={onDivide.bind(null, i, true)}
            onAppend={onDivide.bind(null, i, false)}
            onRemove={onRemoveCol.bind(null, i)}
          />
          // <div
          //   className="oak-col"
          //   style={{
          //     flex: col.style.col.flex,
          //     width: col.style.col.width,
          //   }}
          //   onDrop={e => {
          //     const targetRect = e.currentTarget.getBoundingClientRect();
          //     const targetMiddleY = targetRect?.top + targetRect?.height / 2;
          //     let position = 'before';
          //
          //     if (e.clientY >= targetMiddleY) {
          //       position = 'after';
          //     }
          //
          //     const droppedElement = JSON.parse(e.dataTransfer.getData('text'));
          //     addElement(droppedElement, col.content, { position });
          //     e.stopPropagation();
          //   }}
          //   key={i}
          // >
          //   <div className="oak-divider oak-left">
          //     <a
          //       href="#"
          //       onClick={e => {
          //         e.preventDefault();
          //         divide(col, true);
          //       }}
          //     >
          //       <span className="material-icons">
          //         add
          //       </span>
          //     </a>
          //   </div>
          //   <div className="oak-col-content">
          //     { col.content.length > 0 && (
          //       <Catalogue
          //         ref={catalogueRef}
          //         onAppend={onPrepend.bind(null, col)}
          //       />
          //     ) }
          //     {col.content.length > 0 && (
          //       <div
          //         className="oak-col-content-inner"
          //         style={{
          //           alignItems: col.style.content.alignItem || 'flex-start',
          //         }}
          //       >
          //         <div
          //           style={{
          //             textAlign: col.style.content.textAlign || 'start',
          //           }}
          //         >
          //           { col.content?.map((item, i) => (
          //             <Element
          //               key={i}
          //               parent={element.content}
          //               element={item}
          //               onDelete={removeElement.bind(null, item, col.content)}
          //               onMove={onMove.bind(null, col)}
          //             />
          //           )) }
          //         </div>
          //       </div>
          //     ) }
          //     { col.content.length === 0 && (
          //       <Catalogue
          //         ref={catalogueRef}
          //         onAppend={onAppend.bind(null, col)}
          //       />
          //     ) }
          //     { col.content.length > 0 && (
          //       <div className="oak-border">
          //         <Catalogue
          //           ref={catalogueRef}
          //           onAppend={onAppend.bind(null, col)}
          //         />
          //       </div>
          //     ) }
          //   </div>
          //   <div className={classNames('oak-gutters', 'oak-right')}>
          //     <div className="oak-top">
          //       <EditBox title="Col options" light={true}>
          //         <RowEdit
          //           col={col}
          //           element={element}
          //         />
          //       </EditBox>
          //       <a
          //         href="#"
          //         className="oak-delete"
          //         onClick={e => { e.preventDefault(); remove(element, col); }}
          //       >
          //         <span className="material-icons">
          //         clear
          //         </span>
          //       </a>
          //     </div>
          //     <div className="oak-divider oak-right">
          //       <a
          //         href="#"
          //         onClick={e => {
          //           e.preventDefault();
          //           divide(col, false);
          //         }}
          //       >
          //         <span className="material-icons">
          //           add
          //         </span>
          //       </a>
          //     </div>
          //   </div>
          // </div>
        )) }
      </div>
    </div>
  );
};

Row.options = [];

export default Row;
