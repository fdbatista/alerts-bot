import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Asset } from "./asset";

@Index("IDX_78e85f67bf7b11254c2e7aaa8c", ["assetId", "timestamp"], {
  unique: true,
})
@Index("index_timestamp", ["timestamp"], {})
@Entity("ticker", { schema: "public" })
export class Ticker {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("timestamp with time zone", { name: "timestamp" })
  timestamp: Date;

  @Column("integer", { name: "asset_id" })
  assetId: number;

  @Column("double precision", { name: "low", precision: 53 })
  low: number;

  @Column("double precision", { name: "high", precision: 53 })
  high: number;

  @Column("double precision", { name: "open", precision: 53 })
  open: number;

  @Column("double precision", { name: "close", precision: 53 })
  close: number;

  @Column("double precision", { name: "volume", nullable: true, precision: 53 })
  volume: number | null;

  @ManyToOne(() => Asset, (asset) => asset.tickers, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    lazy: true,
  })
  @JoinColumn([{ name: "asset_id", referencedColumnName: "id" }])
  asset: Promise<Asset>;
}
