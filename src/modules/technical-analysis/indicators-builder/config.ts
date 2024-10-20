export const BUILD_INDICATORS: string = 'indicators.build';
export const RUN_TECHNICAL_ANALYSIS: string = 'technical-analysis.run';

export const BROADCAST_TECHNICAL_DATA: string = 'technical-analysis.broadcast';
export const NOTIFY_TECHNICAL_RESULT: string = 'technical-analysis.notify';

export const INDICATORS_GRANULARITIES: number[] = [
    1, 5, 15, 30, 60, 180, 360, 1440
];

export const INDICATORS: string[] = [
    'rsi', 'stoch', 'sma-10', 'sma-20', 'sma-50', 'sma-200',
]

export const RSI_CONFIG = { period: 14 };
export const EMA_CONFIG = { period: 45 };
export const STOCH_CONFIG = { kPeriod: 14, dPeriod: 3 };
