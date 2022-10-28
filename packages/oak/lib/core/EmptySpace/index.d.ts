import { BaseElement, ResponsiveDisplay } from '../../component';

export declare interface EmptySpaceElement extends BaseElement {
  type: 'empty-space';
  settings?: {
    height?: string;
    [key: string]: any;
  };
  responsive?: ResponsiveDisplay;
  [key: string]: any;
}
