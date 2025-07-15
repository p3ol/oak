declare module '@ckeditor/ckeditor5-dev-utils' {
  export const styles: {
    getPostCssConfig: (options: {
      themeImporter?: { themePath: string };
      minify?: boolean;
    }) => any;
  };
}
