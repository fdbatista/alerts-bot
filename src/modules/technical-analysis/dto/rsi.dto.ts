import { Transform } from 'class-transformer';
import { IsInt } from 'class-validator';

export class GetRsiDto {

    @IsInt()
    @Transform(({ value }) => parseInt(value))
    assetId: number;

    @IsInt()
    @Transform(({ value }) => parseInt(value))
    minutes: number;

}
