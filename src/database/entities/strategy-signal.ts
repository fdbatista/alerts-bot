import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Asset } from "./asset";

@Entity("strategy_signal", { schema: "public" })
export class StrategySignal {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "strategy_id" })
  strategyId: number;

  @Column("integer", { name: "signal_id" })
  signalId: number;

  @Column("boolean", { name: "is_active" })
  isActive: boolean;

  @ManyToOne(() => Asset, (asset) => asset.strategySignals, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    lazy: true,
  })
  @JoinColumn([{ name: "asset_id", referencedColumnName: "id" }])
  asset: Promise<Asset>;
}
