import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Book } from "./book";

@Index("IDX_3873dc5385db92b1e48b30a20e", ["bookId", "timestamp"], {
  unique: true,
})
@Entity("ticker", { schema: "public" })
export class Ticker {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: string;

  @Column("integer", { name: "book_id" })
  bookId: number;

  @Column("timestamp with time zone", { name: "timestamp" })
  timestamp: Date;

  @Column("double precision", { name: "low", precision: 53 })
  low: number;

  @Column("double precision", { name: "high", precision: 53 })
  high: number;

  @Column("double precision", { name: "last", precision: 53 })
  last: number;

  @Column("double precision", { name: "volume", precision: 53 })
  volume: number;

  @Column("double precision", { name: "vwap", precision: 53 })
  vwap: number;

  @Column("double precision", { name: "ask", precision: 53 })
  ask: number;

  @Column("double precision", { name: "bid", precision: 53 })
  bid: number;

  @ManyToOne(() => Book, (book) => book.tickers, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    lazy: true,
  })
  @JoinColumn([{ name: "book_id", referencedColumnName: "id" }])
  book: Promise<Book>;
}
