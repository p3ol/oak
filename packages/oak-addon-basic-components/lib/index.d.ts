import { BaseElement } from '@poool/oak';
import { ResponsiveDisplay } from '@poool/oak/lib/component';

export declare interface TextElement extends BaseElement {
  type: 'text';
  responsive?: ResponsiveDisplay;
  url: String;
  content?: String;
  [key: string]: any;
}

export declare interface TitleElement extends BaseElement {
  type: 'text';
  responsive?: ResponsiveDisplay;
  url: String;
  content?: String;
  heading: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  [key: string]: any;
}

export declare interface ImageElement extends BaseElement {
  type: 'image';
  responsive?: ResponsiveDisplay;
  url: String;
  settings?: {
    size?: 'auto' | 'full' | 'custom'
    width?: String;
    height?: String;
    textAlign?: 'left' | 'center' | 'right';
    [key: string]: any;
  }
  [key: string]: any;
}

export declare interface ButtonElement extends BaseElement {
  type: 'Button';
  responsive?: ResponsiveDisplay;
  action: 'link' | 'event';
  content?: String;
  url?: String;
  event?: String;
  settings: {
    buttonType: 'button' | 'link';
    [key: string]: any
  }
  [key: string]: any
}
