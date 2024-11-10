export enum PotentialEntrypointType {
    BREAK = 'Price above trend line and previous peak',
    BOUNCE = 'Price bouncing near SMA',
    GOLDEN_CROSS = 'SMA crossover',
    DEATH_CROSS = 'SMA crossover',
    NONE = "NONE",
}

export interface PotentialEntrypoint {
    type: PotentialEntrypointType;
    context: any;
}
