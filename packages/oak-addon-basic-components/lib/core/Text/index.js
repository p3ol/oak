import settings from './index.settings';

const Text = ({ element, className }) => {
  const renderContent = () => '';

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{
        __html: typeof element.content === 'string'
          ? element.content
          : renderContent(),
      }}
    />
  );
};

Text.settings = settings;

export default Text;
