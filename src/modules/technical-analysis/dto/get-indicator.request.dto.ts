import { Transform } from 'class-transformer';
import { IsInt } from 'class-validator';

export class GetIndicatorRequestDto {

    @IsInt()
    @Transform(({ value }) => parseInt(value))
    assetId: number;

    @IsInt()
    @Transform(({ value }) => parseInt(value))
    minutes: number;

    @IsInt()
    @Transform(({ value }) => parseInt(value))
    take: number;

}
