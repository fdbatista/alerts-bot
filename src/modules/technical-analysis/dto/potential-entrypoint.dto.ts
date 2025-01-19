export enum PotentialEntrypointType {
    BREAK = 'Price above trend line and previous peak',
    BOUNCE = 'Price bounce',
    GOLDEN_CROSS = 'SMA crossover',
    DEATH_CROSS = 'SMA crossover',
    NONE = "NONE",
}

export interface PotentialEntrypoint {
    type: string;
    context: any;
    currentPrice: number;
}
