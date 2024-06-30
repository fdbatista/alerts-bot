import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Asset } from "./asset";

@Index("IDX_4882fe46c9e9b471f3313b53a8", ["assetId"], {})
@Entity("ticker", { schema: "public" })
export class Ticker {
  @Column("timestamp with time zone", { primary: true, name: "timestamp" })
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
