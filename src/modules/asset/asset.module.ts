import { Module } from '@nestjs/common';
import { AssetService } from './asset.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asset } from 'src/database/entities/asset';

@Module({
  imports: [TypeOrmModule.forFeature([Asset])],
  providers: [AssetService],
  exports: [AssetService],
})
export class AssetModule {}
