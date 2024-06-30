import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Asset } from "./asset";

@Index("UQ_6e0db0ccbeebb7fb823a3ad7ce4", ["name"], { unique: true })
@Entity("asset_type", { schema: "public" })
export class AssetType {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "name", unique: true })
  name: string;

  @OneToMany(() => Asset, (asset) => asset.type, { lazy: true })
  assets: Promise<Asset[]>;
}
