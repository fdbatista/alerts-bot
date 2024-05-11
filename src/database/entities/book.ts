import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Ticker } from "./ticker";

@Index("UQ_233978864a48c44d3fcafe01573", ["name"], { unique: true })
@Entity("book", { schema: "public" })
export class Book {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "name", unique: true })
  name: string;

  @Column("character varying", { name: "description" })
  description: string;

  @OneToMany(() => Ticker, (ticker) => ticker.book, { lazy: true })
  tickers: Promise<Ticker[]>;
}
