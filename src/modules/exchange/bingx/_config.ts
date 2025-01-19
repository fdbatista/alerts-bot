export const BINGX_ENDPOINTS = {
    baseUrl: 'https://open-api.bingx.com',
    userBalance: {
        method: 'GET',
        uri: '/openApi/swap/v3/user/balance'
    },
    tradingFees: {
        method: 'GET',
        uri: '/openApi/swap/v2/user/commissionRate'
    },
    placeOrder: {
        method: 'POST',
        uri: '/openApi/swap/v2/trade/order',
    }
}
