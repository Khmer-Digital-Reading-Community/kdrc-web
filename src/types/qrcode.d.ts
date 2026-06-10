declare module "qrcode" {
  const QRCode: {
    toDataURL(text: string, options?: object): Promise<string>;
    toCanvas(canvas: HTMLCanvasElement, text: string, options?: object): Promise<void>;
    toString(text: string, options?: object): Promise<string>;
  };
  export = QRCode;
}
