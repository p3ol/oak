import { mockState } from '@poool/junipero-utils';
import React, { useContext, useReducer, useState } from 'react';
import { usePopper } from 'react-popper';
import { SelectField, TextField } from '@poool/junipero';

import { AppContext } from '../../contexts';

import styles from './index.styl';

export default ({ col, element }) => {
  const [popper, setPopper] = useState();
  const [reference, setReference] = useState();
  const [state, dispatch] = useReducer(mockState, {
    placement: 'bottom-end',
    opened: false,
  });

  const { setElement } = useContext(AppContext);

  const vertical = [
    { title: 'Aligné en haut', value: 'flex-start' },
    { title: 'Centré', value: 'center' },
    { title: 'Aligné en bas', value: 'flex-end' },
  ];

  const horizontal = [
    { title: 'Aligné à gauche', value: 'start' },
    { title: 'Centré', value: 'center' },
    { title: 'Aligné à droite', value: 'end' },
    { title: 'Justifié', value: 'justify' },
  ];

  const remove = (element, col) => {
    setElement(element, { cols: element.cols.filter(c => c.id !== col.id) },
    );
  };

  const { styles: popperStyles, attributes } = usePopper(reference, popper, {
    placement: 'left-start',
    modifiers: [
      ...[],
      {
        name: 'offset',
        options: {
          offset: [0, -24],
        },
      },
    ],
  });

  return (
    <>
      <a
        href="#"
        ref={setReference}
        onClick={() => dispatch({ opened: !state.opened })}
        className={styles.delete}>
        <span className="material-icons" >
          edit
        </span>
      </a>
      { state.opened &&
          <div
            ref={setPopper}
            style={popperStyles.popper}
            {...attributes.popper}
            data-placement={'bottom'}
            className={styles.popper}
          >
            <div className={styles.top}>
              <a
                href="#"
                onClick={() => dispatch({ opened: !state.opened })}
              >
                <span className="material-icons" >
                  edit
                </span>
              </a>
              <span>col options</span>

            </div>
            <div className={styles.flex}>
              <SelectField
                label="Alignement vertical"
                boxed={false}
                value={col.style.vertical}
                parseValue={item => item.value}
                parseTitle={item => item.title}
                className={styles.item}
                onChange={item => {
                  col.style.vertical = item.value;
                  setElement(element, {});
                }}
                options={vertical}
              />
              <SelectField
                label="Alignement horizontal"
                boxed={false}
                value={col.style.horizontal || 'start'}
                parseValue={item => item.value}
                parseTitle={item => item.title}
                className={styles.item}
                onChange={item => {
                  col.style.horizontal = item.value;
                  setElement(element, {});
                }}
                options={horizontal}
              />
              <TextField
                boxed={false}
                placeholder="Proportion de la colonne"
                value={col.style.flex}
                onChange={item => {
                  col.style.flex = item.value;
                  setElement(element, {});
                }}
              />
              <a href="#" className={styles.item} onClick={remove.bind(null, element, col)}>remove
              </a>
            </div>

          </div>
      }
    </>
  );
};
