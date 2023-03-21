import { forwardRef, useCallback, useRef, useImperativeHandle } from 'react';
import { classNames } from '@junipero/react';

import { GROUP_CORE } from '../components';
import { BuilderContext } from '../contexts';
import { useRootBuilder } from '../hooks';
import Element from '../Element';
import Catalogue from '../Catalogue';

const Builder = forwardRef(({ className, value, addons, ...opts }, ref) => {
  const innerRef = useRef();
  const catalogueRef = useRef();
  const floatingsRef = useRef();
  const { builder, content } = useRootBuilder({
    content: value,
    addons: [
      { components: [GROUP_CORE] },
      ...(addons || []),
    ],
    ...opts,
  });

  useImperativeHandle(ref, () => ({
    builder,
    content,
    catalogueRef,
    innerRef,
  }));

  const getContext = useCallback(() => ({
    builder,
    content,
    rootRef: innerRef,
    floatingsRef,
  }), [builder, content]);

  const onAppend = component => {
    catalogueRef.current?.close();
    const element = component.construct?.() || {};
    const override = builder.getOverride('component', element.type);

    const elementWithContent = {
      ...element,
      content: typeof element.content === 'function'
        ? element.content(/*getText*/) : element.content,
    };

    builder.addElement({
      ...elementWithContent,
      ...(
        override?.construct &&
        typeof override.construct === 'function'
          ? override.construct(elementWithContent)
          : {}
      ),
    });
  };

  const onPaste = element => {
    catalogueRef.current?.close();
    builder.addElement(element, { resetIds: true });
  };

  return (
    <BuilderContext.Provider value={getContext()}>
      <div
        ref={innerRef}
        className={classNames(
          'oak builder',
          className
        )}
      >
        <div className="elements oak-flex oak-flex-col oak-gap-4">
          { content?.map((element, i) => (
            <Element
              key={element.id || i}
              index={i}
              element={element}
            />
          )) }

          <div className="add-element oak-flex oak-justify-center">
            <Catalogue
              ref={catalogueRef}
              onAppend={onAppend}
              onPaste={onPaste}
            />
          </div>
        </div>

        <div className="floatings" ref={floatingsRef} />
      </div>
    </BuilderContext.Provider>
  );
});

Builder.displayName = 'Builder';

export default Builder;
