import { Element } from './component';

export declare function useOptions(): Object;
export declare function useBuilder(): {
  components: Array<any>;
  content: Array<Element>;
  [key: string]: any;
};
export declare function useElement(): {
  element: Object;
  parent: Object;
};
