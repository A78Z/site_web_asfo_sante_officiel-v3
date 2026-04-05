declare module 'dom-to-image-more' {
  interface Options {
    width?: number;
    height?: number;
    style?: Record<string, string>;
    quality?: number;
    cacheBust?: boolean;
    bgcolor?: string;
    filter?: (node: Node) => boolean;
    imagePlaceholder?: string;
  }
  function toPng(node: Node, options?: Options): Promise<string>;
  function toJpeg(node: Node, options?: Options): Promise<string>;
  function toBlob(node: Node, options?: Options): Promise<Blob>;
  function toSvg(node: Node, options?: Options): Promise<string>;
  function toCanvas(node: Node, options?: Options): Promise<HTMLCanvasElement>;
  function toPixelData(node: Node, options?: Options): Promise<Uint8ClampedArray>;
  export { toPng, toJpeg, toBlob, toSvg, toCanvas, toPixelData };
  export default { toPng, toJpeg, toBlob, toSvg, toCanvas, toPixelData };
}
