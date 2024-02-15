import {
  AddonObject,
  ComponentObject,
  ComponentsGroupObject,
  FieldObject,
} from '@oakjs/core';

export declare function textField(props?: object): FieldObject;
export declare function textAreaField(props?: object): FieldObject;
export declare function selectField(props?: object): FieldObject;
export declare function colorField(props?: object): FieldObject;
export declare function imageField(props?: object): FieldObject;
export declare function dateField(props?: object): FieldObject;
export declare function toggleField(props?: object): FieldObject;

export declare function rowComponent(props?: object): ComponentObject;
export declare function colComponent(props?: object): ComponentObject;
export declare function emptySpaceComponent(props?: object): ComponentObject;
export declare function titleComponent(props?: object): ComponentObject;
export declare function textComponent(props?: object): ComponentObject;
export declare function imageComponent(props?: object): ComponentObject;
export declare function buttonComponent(props?: object): ComponentObject;
export declare function foldableComponent(props?: object): ComponentObject;

export declare function baseFields(): Array<FieldObject>;
export declare function baseComponents(): Array<ComponentObject>;

export declare function coreComponentsGroups(): ComponentsGroupObject;

export declare function baseAddon(): AddonObject;
