import React, { useRef, useContext, useLayoutEffect } from 'react';
import { classNames } from '@poool/junipero-utils';

import { AppContext } from '../../contexts';
import Catalogue from '../Catalogue';
import Element from '../Element';
import Option from '../Option';
import Edit from '../Edit';

import styles from './index.styl';

const Row = ({ className, element, onDelete = () => {} }) => {
  const catalogueRef = useRef();
  const { addElement, removeElement, setElement } = useContext(AppContext);

  useLayoutEffect(() => {
    if (!element.cols?.length) {
      setElement(element,
        { cols: [
          { size: 6, content: [], id: 0, style: {
            col: { flex: '1' },
            content: { } },
          },
          { size: 6, content: [], id: 1, style: {
            col: { flex: '1' },
            content: { },
          },
          },
        ],
        });
    }
  }, []);
  const dragOver = e => e.preventDefault();

  const drop = (e, i, col) => {
    const targetRect = e.currentTarget.getBoundingClientRect();
    const targetMiddleY = targetRect?.top + targetRect?.height / 2;
    let isAfter = false;

    if (e.clientY >= targetMiddleY) {
      isAfter = true;
    }

    const component =
    JSON.parse(e.dataTransfer.getData('text'));
    let offset = 0;
    col.content = col.content.filter((e, id) => {
      if (e.id === component.id) { offset = i < id ? 1 : 0; }

      return e.id !== component.id;
    }
    );

    if (isAfter) {
      col.content.splice(i + offset, 0, component);
    } else {
      col.content.splice(i - 1 + offset, 0, component);
    }

    setElement(element, {});
  };

  const doesRowFitContent = () => {
    return element.cols?.filter(
      col => col.style?.col?.flex !== '' &&
      col.style?.col?.flex !== null).length === 0;
  };

  const onAppend = (col, isFirst, component) => {
    addElement(component.construct(), col.content, isFirst);
    catalogueRef.current?.close();
  };

  const divide = (currentCol, isBefore) => {
    const index = element.cols.indexOf(currentCol);
    const idMax = element.cols.map(col => col.id).reduce(function (a, b) {
      return Math.max(a, b);
    }) + 1;
    element.cols.splice(isBefore ? index : index + 1, 0,
      { size: 6, content: [], id: idMax, style: {
        col: { flex: '1' }, content: {},
      },
      }
    );
    setElement(element, { cols: element.cols });
  };

  const remove = (element, col) => {
    setElement(element, { cols: element.cols.filter(c => c.id !== col.id) },
    );

    if (element.cols.length < 1) {
      onDelete();
    }
  };

  return (
    <div className={classNames(className, styles.row)}
      style={{ width: doesRowFitContent() ? 'fit-content' : '100%' }}
    >
      { element?.cols?.map((col, i) => (
        <div className={styles.col}
          style={{
            flex: col.style.col.flex,
            width: col.style.col.width,
          }}
          key={i}>
          <div className={classNames(styles.gutters, styles.left)}>
            <div className={styles.divide}>
              <a href="#" onClick={divide.bind(null, col, true)}>
                <span className="material-icons">
                add
                </span></a>
            </div>
          </div>
          <div className={styles.flex}>
            <div className={styles.border}>
              { col.content.length > 0 &&
                <Catalogue
                  className={styles.catalogue}
                  ref={catalogueRef}
                  onAppend={onAppend.bind(null, col, true)}
                />
              }
            </div>
            {col.content.length > 0 &&

            <div className={styles.mainContent}
              style={{ alignItems: col.style.content.alignItem || 'flex-start',

              }}>
              <div
                style={{
                  textAlign: col.style.content.textAlign || 'start',
                }}>
                { col.content?.map((item, i) => (
                  <span key={i}
                    onDragOver={dragOver}
                    onDrop={e => drop(e, i, col)}
                  >
                    <Element
                      element={item}
                      className={styles.element}
                      onDelete={removeElement.bind(null, item, col.content)}
                    />
                  </span>
                )) }
              </div>
            </div>
            }
            {col.content.length === 0 &&
                <Catalogue
                  className={styles.catalogue}
                  ref={catalogueRef}
                  onAppend={onAppend.bind(null, col, false)}
                />
            }
            { col.content.length > 0 &&
              <div className={styles.border}>
                <Catalogue
                  className={styles.catalogue}
                  ref={catalogueRef}
                  onAppend={onAppend.bind(null, col, false)}
                />
              </div>
            }
          </div>
          <div className={classNames(styles.gutters, styles.right)}>
            <Edit element={element} col={col}></Edit>

            <div className={styles.divide}>
              <a href="#" onClick={divide.bind(null, col, false)}>
                <span className="material-icons">
                add
                </span></a>
            </div>
            <a href="#" onClick={remove.bind(null, element, col)}>

              <span className="material-icons">
                delete
              </span></a>
          </div>

        </div>
      ))}

    </div>
  );
};

Row.options = [{
  name: 'cols',
  render: ({ className }) => {

    return (
      <Option
        option={{ icon: 'view_column' }}
        className={classNames(className, styles.column)}
      />
    );
  },
}];

export default Row;
