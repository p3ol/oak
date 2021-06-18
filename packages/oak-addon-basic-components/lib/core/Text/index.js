import { Fragment } from 'react';

import settings from './index.settings';
import Node from '../Editor/Node';

const Text = ({ element, className }) => (
  <div className={className}>
    { typeof element.content === 'string' ? (
      <Node type="paragraph" children={[{ text: element.content }]} />
    ) : element.content.map((c, i) => (
      <Fragment key={i}>
        <Node { ...c } />
        { i < element.content.length - 1 ? <br /> : null }
      </Fragment>
    )) }
  </div>
);

Text.settings = settings;

export default Text;
