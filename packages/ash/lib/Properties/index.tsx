import type { PagePreset } from '../types';
import { useEditor } from '../hooks';
import ElementProperties from './ElementProperties';
import PageProperties from './PageProperties';

export declare interface PropertiesProps {
  pagePresets?: PagePreset[];
}

const Properties = ({ pagePresets }: PropertiesProps) => {
  const { tree, selectedId } = useEditor();
  const node = selectedId ? tree.nodes.get(selectedId) : null;

  return node ? (
    <ElementProperties key={node.id} element={node.element} />
  ) : (
    <PageProperties presets={pagePresets} />
  );
};

Properties.displayName = 'Properties';

export default Properties;
