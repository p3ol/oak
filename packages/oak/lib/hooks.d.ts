import { Component } from './component';

export declare function useOptions(): Object;
export declare function useBuilder(): {
  components: Array<any>;
  content: Array<Component>;
  [key: string]: any;
};
export declare function useElement(): {
  element: Object;
  parent: Object;
};
