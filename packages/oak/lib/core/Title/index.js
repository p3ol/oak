import React, { useContext } from 'react';

import { AppContext } from '../../contexts';
import Edit from '../Edit';

import styles from '../Text/index.styl';

const Title = ({ element }) => {
  const { setElement } = useContext(AppContext);

  return (
    element.editing
      ? <textarea id="story" name="story" className={styles.textarea}
        rows="5" onChange={
          value => setElement(element, { content: value.target.value })
        }
      >
        {element.content}
      </textarea>
      : (element.headingLevel === 1 ? <h1>{element.content}</h1>
        : element.headingLevel === 2 ? <h2>{element.content}</h2>
          : element.headingLevel === 3 ? <h3>{element.content}</h3>
            : <h4>{element.content}</h4>)
  );
};

Title.options = [{
  render: ({ element }) => {
    const { setElement } = useContext(AppContext);

    return (
      <Edit title='Title options'></Edit>
    );
  },
}];
export default Title;
