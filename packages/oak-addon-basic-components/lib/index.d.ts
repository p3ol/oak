import { BaseComponent } from '@poool/oak';
import { ResponsiveDisplay } from '@poool/oak/lib/component';

export declare interface TextComponent extends BaseComponent {
  type: 'text';
  responsive?: ResponsiveDisplay;
  url: String;
  content?: String;
  [key?: String]: any;
}

export declare interface TitleComponent extends BaseComponent {
  type: 'text';
  responsive?: ResponsiveDisplay;
  url: String;
  content?: String;
  heading: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  [key?: String]: any;
}

export declare interface ImageComponent extends BaseComponent {
  type: 'image';
  responsive?: ResponsiveDisplay;
  url: String;
  settings?: {
    size?: 'auto' | 'full' | 'custom'
    width?: String;
    height?: String;
    textAlign?: 'left' | 'center' | 'right';
    [key?: String]: any;
  }
  [key?: String]: any;
}

export declare interface ButtonComponent extends BaseComponent {
  type: 'Button';
  responsive?: ResponsiveDisplay;
  action: 'link' | 'event';
  content?: String;
  url?: String;
  event?: String;
  settings: {
    buttonType: 'button' | 'link';
    [key?: String]: any
  }
  [key?: String]: any
}
