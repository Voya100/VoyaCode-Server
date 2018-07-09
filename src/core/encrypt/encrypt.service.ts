import { ServerConfigService } from '@core/server-config/server-config.service';
import { Injectable } from '@nestjs/common';
import urlCrypt, { UrlCrypt } from 'url-crypt';

@Injectable()
export class EncryptService {
  private urlCrypt: UrlCrypt;

  constructor(config: ServerConfigService) {
    this.urlCrypt = urlCrypt(config.encryptPassword);
  }

  /**
   * Encrypts the data and returns it in url compatible base64 format.
   * toEncrypt needs to be JSONifiable
   */
  urlEncrypt(toEncrypt: any): string {
    return this.urlCrypt.cryptObj(toEncrypt);
  }

  /**
   * Decrypts the data encrypted by urlEncrypt
   */
  urlDecrypt(toDecrypt: string) {
    return this.urlCrypt.decryptObj(toDecrypt);
  }
}
