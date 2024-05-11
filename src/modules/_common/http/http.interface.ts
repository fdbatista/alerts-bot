export interface IHttpService {
    get(uri: string, headers?: any): any;
    post(uri: string, body: object, headers?: object): any;
}
