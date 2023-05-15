import {
  AddonObject,
  ComponentObject,
  ComponentSettingsTabObject,
  ComponentsGroupObject,
  FieldObject,
} from './types';

export function textField(...props: any[]): FieldObject;
export function textareaField(...props: any[]): FieldObject;
export function selectField(...props: any[]): FieldObject;
export function colorField(...props: any[]): FieldObject;
export function imageField(...props: any[]): FieldObject;
export function dateField(...props: any[]): FieldObject;
export function toggleField(...props: any[]): FieldObject;

export function rowComponent(...props: any[]): ComponentObject;
export function colComponent(...props: any[]): ComponentObject;
export function emptySpaceComponent(...props: any[]): ComponentObject;
export function titleComponent(...props: any[]): ComponentObject;
export function textComponent(...props: any[]): ComponentObject;
export function imageComponent(...props: any[]): ComponentObject;
export function buttonComponent(...props: any[]): ComponentObject;
export function foldableComponent(...props: any[]): ComponentObject;

export function stylingSettings(...props: any[]): ComponentSettingsTabObject;
export function responsiveSettings(...props: any[]): ComponentSettingsTabObject;

export function baseFields(): Array<FieldObject>;
export function baseComponents(): Array<ComponentObject>;
export function baseSettings(): Array<ComponentSettingsTabObject>;

export function coreComponentsGroup(...props: any[]): ComponentsGroupObject;

export function baseAddon(): AddonObject;
