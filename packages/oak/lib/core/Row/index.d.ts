import { ColComponent } from '../Col';
import { BaseComponent, ResponsiveDisplay } from '../../component';

export declare interface RowComponent extends BaseComponent {
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
  cols: Array<ColComponent>;
  [key: string]: any;
}
