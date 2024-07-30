import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Asset } from "./asset";

@Index("IDX_17c49166201127eb78464326dc", ["assetId", "minutes", "timestamp"], {
  unique: true,
})
@Entity("stoch", { schema: "public" })
export class Stoch {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("timestamp with time zone", { name: "timestamp" })
  timestamp: Date;

  @Column("integer", { name: "asset_id" })
  assetId: number;

  @Column("integer", { name: "minutes" })
  minutes: number;

  @Column("double precision", { name: "k", nullable: true, precision: 53 })
  k: number;

  @Column("double precision", { name: "d", nullable: true, precision: 53 })
  d: number;

  @ManyToOne(() => Asset, (asset) => asset.stoches, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    lazy: true,
  })
  @JoinColumn([{ name: "asset_id", referencedColumnName: "id" }])
  asset: Promise<Asset>;
}
