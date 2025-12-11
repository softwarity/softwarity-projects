/// <reference types="vite/client" />

declare module 'virtual:menu-data' {
  export const menuData: {
    title: string;
    sections: Array<{
      type?: 'separator';
      title?: string;
      items?: Array<{
        type: 'link' | 'separator';
        text?: string;
        url?: string;
      }>;
      subSections?: Array<{
        title: string;
        items: Array<{
          type: 'link' | 'separator';
          text?: string;
          url?: string;
        }>;
      }>;
    }>;
  };
}

declare module '*.css?inline' {
  const content: string;
  export default content;
}
