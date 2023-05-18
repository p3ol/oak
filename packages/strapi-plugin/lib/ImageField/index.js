import React, { useState } from 'react';
import { createGlobalStyle } from 'styled-components';
import { ImageField as OakImageField } from '@oakjs/react';
import { prefixFileUrlWithBackendUrl, useLibrary } from '@strapi/helper-plugin';

// Strapi is making this very difficult
// -------------------------
// Basically, oak editables are absolutely positioned, and have a z-index of 20.
// Weirdly enough, strapi media library modals have a z-index of 4 AND
// use styled-components, so we can't target any selector as they are scoped.
// For a short period of time, the modals were targetable using
// [data-react-portal], but it has been removed since Strapi 4.10.x.
// This selector is very, very far from being bulletproof, but it works for now.
const GlobalStyling = createGlobalStyle`
  body > div:not(#app):has([aria-modal="true"]),
  body > div:not(#app) > div {
    z-index: 100;
  }
`;

const ImageField = ({ value: valueProp, onChange }) => {
  const [value, setValue] = useState(valueProp);
  const [opened, setOpened] = useState(false);
  const { components } = useLibrary();
  const MediaLibraryDialog = components['media-library'];

  const onSelectAssets = files => {
    const formattedFiles = files.map(f => ({
      name: f.name,
      alt: f.alternativeText || f.name,
      url: prefixFileUrlWithBackendUrl(f.url),
      mime: f.mime,
    }));

    const val = { url: formattedFiles[0].url, name: formattedFiles[0].name };
    setValue(val);
    setOpened(false);
    onChange({ value: val });
  };

  return (
    <>
      <GlobalStyling />
      <OakImageField
        className="oak-w-full"
        value={value}
        onOpenDialog={() => setOpened(true)}
      />
      { opened && (
        <MediaLibraryDialog
          allowedTypes={['images']}
          onClose={() => setOpened(false)}
          onSelectAssets={onSelectAssets}
        />
      ) }
    </>
  );
};

export default ImageField;
