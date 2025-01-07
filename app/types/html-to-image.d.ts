declare module 'html-to-image' {
  export function toPng(node: HTMLElement, options?: Options): Promise<string>;
  
  interface Options {
    cacheBust?: boolean;
    filter?: (node: HTMLElement) => boolean;
    width?: number;
    height?: number;
    style?: object;
    quality?: number;
    backgroundColor?: string;
    canvasWidth?: number;
    canvasHeight?: number;
    pixelRatio?: number;
  }
} 