declare module 'url-crypt' {
  function urlCrypt(secret: string): UrlCrypt;

  export interface UrlCrypt {
    cryptObj(toEncrypt: any): string;
    decryptObj(toDecrypt: string): any;
  }

  export default urlCrypt;
}
