export declare class Component {
  static FIND_PREDICATE: (id: string) => Function;

  constructor(props: object);
  type: string;
  id: string;
  name: string;
  group: string;
}

export declare class ComponentsGroup {
  static FIND_PREDICATE: (id: string) => Function;

  constructor(props: object);
  type: string;
  id: string;
  name: string;
  components: Array<Component>;
}

export declare class Field {
  static FIND_PREDICATE: (type: string) => Function;

  constructor(props: object);
  type: string;
}
