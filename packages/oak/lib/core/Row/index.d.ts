import { ColElement } from '../Col';
import { BaseElement, ResponsiveDisplay } from '../../component';

export declare interface RowElement extends BaseElement {
  type: 'row';
  settings?: {
    flexDirection?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
    justifyContent?:
      | 'flex-start'
      | 'center'
      | 'flex-end'
      | 'space-between'
      | 'space-around';
    alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
    gutters?: 'Column gap' | 'Enabed' | 'Disabled';
    [key: string]: any;
  };
  responsive?: ResponsiveDisplay
  cols: Array<ColElement>;
  [key: string]: any;
}
