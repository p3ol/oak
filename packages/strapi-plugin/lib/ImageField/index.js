import React, { useState } from 'react';
import { createGlobalStyle } from 'styled-components'
import { ImageField as OakImageField } from '@oakjs/react';
import { prefixFileUrlWithBackendUrl, useLibrary } from '@strapi/helper-plugin';

const GlobalStyling = createGlobalStyle`
  body > [data-react-portal] > div {
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
          multiple={false}
          onClose={() => setOpened(false)}
          onSelectAssets={onSelectAssets}
        />
      ) }
    </>
  );
};

export default ImageField;
