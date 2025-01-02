export class HttpUtil {
    static buildQueryParams(payload: any, urlEncode: boolean): string {
        return Object.entries(payload).map(([key, value]) => {
            const encodedValue = urlEncode ? encodeURIComponent(value as string) : value;
            return `${key}=${encodedValue}`;
        }).join('&');
    }
}
