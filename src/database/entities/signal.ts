import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("UQ_9222425033cea8a896b0dabc29d", ["name"], { unique: true })
@Entity("signal", { schema: "public" })
export class Signal {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "name", unique: true })
  name: string;

  @Column("integer", { name: "candlestick_minutes" })
  candlestickMinutes: number;
}
