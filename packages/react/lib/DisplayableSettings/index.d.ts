import { ReactNode, ComponentPropsWithoutRef } from 'react';
import {
  ElementObject,
  Element as CoreElement,
  ComponentObject,
  Component,
} from '@oakjs/core';

export declare interface DisplayableSettingsProps
  extends ComponentPropsWithoutRef<any> {
  className?: string;
  element?: ElementObject | CoreElement;
  component?: ComponentObject | Component;
}

declare function DisplayableSettings(props: DisplayableSettingsProps):
  ReactNode | JSX.Element;

export default DisplayableSettings;
