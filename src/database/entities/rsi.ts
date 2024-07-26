import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Asset } from "./asset";

@Index("IDX_6d7e774a90f8592446073e021c", ["assetId", "minutes", "timestamp"], {
  unique: true,
})
@Entity("rsi", { schema: "public" })
export class Rsi {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("timestamp with time zone", { name: "timestamp" })
  timestamp: Date;

  @Column("integer", { name: "asset_id" })
  assetId: number;

  @Column("integer", { name: "minutes" })
  minutes: number;

  @Column("double precision", { name: "value", nullable: true, precision: 53 })
  value: number | null;

  @ManyToOne(() => Asset, (asset) => asset.rsis, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    lazy: true,
  })
  @JoinColumn([{ name: "asset_id", referencedColumnName: "id" }])
  asset: Promise<Asset>;
}
