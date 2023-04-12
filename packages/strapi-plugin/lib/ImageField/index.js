import React, { useState } from 'react';
import { Icon, Text } from '@oakjs/react';
import { TouchableZone } from '@junipero/react';
import { prefixFileUrlWithBackendUrl, useLibrary } from '@strapi/helper-plugin';

const ImageField = ({ onChange }) => {
  const [opened, setOpened] = useState(false);
  const { components } = useLibrary();
  const MediaLibraryDialog = components['media-library'];

  const handleSelectAssets = files => {
    const formattedFiles = files.map(f => ({
      alt: f.alternativeText || f.name,
      url: prefixFileUrlWithBackendUrl(f.url),
      mime: f.mime,
    }));

    onChange(formattedFiles);
  };

  const toggle = () => {
    setOpened(o => !o);
  };

  return (
    <div className="image-field oak-flex oak-items-center oak-gap-4">
      <TouchableZone onClick={toggle} className="!oak-w-full">
        <Icon className="!oak-text-alternate-text-color">add</Icon>
        <span>
          <Text name="core.fields.image.add">
            Add image
          </Text>
        </span>
      </TouchableZone>
      { opened && (
        <MediaLibraryDialog
          allowedTypes={['images']}
          multiple={false}
          onClose={() => setOpened(false)}
          onSelectAssets={handleSelectAssets}
        />
      ) }
    </div>
  );
};

export default ImageField;
