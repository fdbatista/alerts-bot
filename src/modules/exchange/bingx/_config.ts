export const BINGX_API_PROTOCOL = 'https'
export const BINGX_API_HOST = 'open-api.bingx.com'

export const BINGX_ENDPOINTS = {
    userBalance: '/openApi/swap/v3/user/balance',
    tradingFees: '/openApi/swap/v2/user/commissionRate',
    placeOrder: {
        method: 'POST',
        uri: '/openApi/swap/v2/trade/order/test',
    }
}
