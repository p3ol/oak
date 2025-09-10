declare module '@ckeditor/ckeditor5-icons/theme/icons/font-color.svg';

declare module '@ckeditor/ckeditor5-dev-translations';

declare module '@ckeditor/ckeditor5-dev-utils' {
  export const styles: {
    getPostCssConfig: (options: {
      themeImporter?: { themePath: string };
      minify?: boolean;
    }) => any;
  };

  export const bundler: {
    getLicenseBanner: () => string;
  };
}
