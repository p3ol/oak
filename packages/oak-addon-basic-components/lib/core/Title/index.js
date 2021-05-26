import settings from './index.settings';

const Title = ({ element, className }) => {
  const Tag = element.headingLevel || 'h1';

  return (
    <div className={className}>
      <Tag
        className="oak-title-block"
        dangerouslySetInnerHTML={{ __html: element.content }}
      />
    </div>
  );
};

Title.settings = settings;

export default Title;
