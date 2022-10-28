import { BaseComponent, ResponsiveDisplay } from '../../component';

export declare interface EmptySpaceComponent extends BaseComponent {
  type: 'empty-space';
  settings?: {
    height?: string;
    [key: string]: any;
  };
  responsive?: ResponsiveDisplay;
  [key: string]: any;
}
