import { ReactNode, ComponentPropsWithoutRef } from 'react';
import {
  ElementObject,
  ComponentObject,
  Component,
  ComponentOverride,
  ComponentOverrideObject,
} from '@oakjs/core';

export declare interface DisplayableSettingsProps
  extends ComponentPropsWithoutRef<any> {
  element?: ElementObject;
  component?: ComponentObject | Component;
  override?: ComponentOverrideObject | ComponentOverride;
}

declare function DisplayableSettings(props: DisplayableSettingsProps):
  ReactNode | JSX.Element;

export default DisplayableSettings;
