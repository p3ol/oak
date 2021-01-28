import React, { useRef, useContext, useLayoutEffect } from 'react';
import { classNames } from '@poool/junipero-utils';

import { AppContext } from '../../contexts';
import Catalogue from '../Catalogue';
import Element from '../Element';
import Option from '../Option';
import Edit from '../Edit';

import styles from './index.styl';

const Row = ({ className, element }) => {
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
      { size: 6, content: [], id: idMax, style: { col: {}, content: {} },
      }
    );
    setElement(element, { cols: element.cols });
  };

  return (
    <div className={classNames(className, styles.row)}>
      { element?.cols?.map((col, i) => (
        <div className={styles.col} style={{
          flex: col.style.col.flex,
          width: col.style.col.width,
        }}
        key={i}>
          { col.content.length > 0 &&
              <div className={classNames(styles.addElement, styles.before)}>
                <Catalogue
                  className={styles.catalogue}
                  ref={catalogueRef}
                  onAppend={onAppend.bind(null, col, true)}
                />
              </div>
          }
          <Edit element={element} col={col}></Edit>
          <a href="#" onClick={divide.bind(null, col, true)}
            className={classNames(styles.divide, styles.before)}>
            <span className="material-icons">
                chevron_left
            </span></a>
          <a className={classNames(styles.divide, styles.after)}
            href="#" onClick={divide.bind(null, col, false)}>
            <span className="material-icons">
                chevron_right
            </span></a>
          <div className={styles.flex}
            style={{ alignItems: col.style.content.alignItem || 'flex-start',
              textAlign: col.style.content.textAlign || 'start',
            }}
          >
            <div className={styles.mainContent}>
              { col.content?.map((item, i) => (
                <Element
                  key={i}
                  element={item}
                  className={styles.element}
                  onDelete={removeElement.bind(null, item, col.content)}
                />
              )) }
              {col.content.length === 0 &&
              <div className={styles.addElement}>
                <Catalogue
                  className={styles.catalogue}
                  ref={catalogueRef}
                  onAppend={onAppend.bind(null, col, false)}
                />
              </div>
              }
            </div>
          </div>

          { col.content.length > 0 &&
              <div className={classNames(styles.addElement, styles.after)}>
                <Catalogue
                  className={styles.catalogue}
                  ref={catalogueRef}
                  onAppend={onAppend.bind(null, col, false)}
                />
              </div>
          }

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
