import { mockState } from '@poool/junipero-utils';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import { usePopper } from 'react-popper';
import { SelectField } from '@poool/junipero';

import { AppContext } from '../../contexts';

import styles from './index.styl';

export default ({ col, element }) => {
  const [popper, setPopper] = useState();
  const [reference, setReference] = useState();
  const [state, dispatch] = useReducer(mockState, {
    placement: 'bottom-end',
    opened: false,
  });

  const [arrow, setArrow] = useState();
  const { setElement } = useContext(AppContext);

  const positionnement = [
    { title: 'Aligné en haut', value: 'flex-start' },
    { title: 'Centré', value: 'center' },
    { title: 'Aligné en bas', value: 'flex-end' },
  ];

  const remove = (element, col) => {
    setElement(element, { cols: element.cols.filter(c => c.id !== col.id) },
    );
  };

  const editColumn = (element, col) => {
    col.editing = !col.editing;
    setElement(element, {});
  };

  const { styles: popperStyles, attributes } = usePopper(reference, popper, {
    placement: 'left-start',
    modifiers: [
      ...[],
      { name: 'arrow', options: { element: arrow } },
      {
        name: 'offset',
        options: {
          offset: [0, -20],
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
            <SelectField
              label="Positionnement du texte"
              boxed={false}
              value={col.alignment}
              parseValue={item => item.value}
              parseTitle={item => item.title}
              onChange={item => {
                col.alignment = item.value;
                setElement(element, {});
              }}
              placeholder="Select one..."
              options={positionnement}
            />
            <a href="#" onClick={remove.bind(null, element, col)}>remove
            </a>
          </div>
      }
    </>
  );
};
