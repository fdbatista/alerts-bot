import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Asset } from "./asset";

@Index("IDX_78e85f67bf7b11254c2e7aaa8c", ["assetId", "timestamp"], {
  unique: true,
})
@Index("index_timestamp", ["timestamp"], {})
@Entity("ticker", { schema: "public" })
export class Ticker {
  @Column("timestamp with time zone", { primary: true, name: "timestamp" })
  timestamp: Date;

  @Column("integer", { primary: true, name: "asset_id" })
  assetId: number;

  @Column("double precision", { name: "price", precision: 53 })
  price: number;

  @ManyToOne(() => Asset, (asset) => asset.tickers, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    lazy: true,
  })
  @JoinColumn([{ name: "asset_id", referencedColumnName: "id" }])
  asset: Promise<Asset>;
}
