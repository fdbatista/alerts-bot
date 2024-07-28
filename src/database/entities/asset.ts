import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { AssetType } from "./asset-type";
import { Ema } from "./ema";
import { Rsi } from "./rsi";
import { Stoch } from "./stoch";
import { StrategySignal } from "./strategy-signal";
import { Ticker } from "./ticker";

@Index("asset_external_id_key", ["externalId"], { unique: true })
@Index("UQ_119b2d1c1bdccc42057c303c44f", ["name"], { unique: true })
@Index("UQ_45b83954906fc214e750ba53286", ["symbol"], { unique: true })
@Entity("asset", { schema: "public" })
export class Asset {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "external_id", unique: true })
  externalId: string;

  @Column("character varying", { name: "symbol", unique: true })
  symbol: string;

  @Column("character varying", { name: "name", unique: true })
  name: string;

  @Column("boolean", { name: "is_active" })
  isActive: boolean;

  @ManyToOne(() => AssetType, (assetType) => assetType.assets, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    lazy: true,
  })
  @JoinColumn([{ name: "type_id", referencedColumnName: "id" }])
  type: Promise<AssetType>;

  @OneToMany(() => Ema, (ema) => ema.asset, { lazy: true })
  emas: Promise<Ema[]>;

  @OneToMany(() => Rsi, (rsi) => rsi.asset, { lazy: true })
  rsis: Promise<Rsi[]>;

  @OneToMany(() => Stoch, (stoch) => stoch.asset, { lazy: true })
  stoches: Promise<Stoch[]>;

  @OneToMany(() => StrategySignal, (strategySignal) => strategySignal.asset, {
    lazy: true,
  })
  strategySignals: Promise<StrategySignal[]>;

  @OneToMany(() => Ticker, (ticker) => ticker.asset, { lazy: true })
  tickers: Promise<Ticker[]>;
}
