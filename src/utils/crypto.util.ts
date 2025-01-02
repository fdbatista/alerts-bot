import * as CryptoJS from "crypto-js";

export class CryptoUtil {
    static signRequest(urlParams: string, apiSecret: string): string {
        return CryptoJS.enc.Hex.stringify(CryptoJS.HmacSHA256(urlParams, apiSecret))
    }
}
