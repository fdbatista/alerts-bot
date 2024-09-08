import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("UQ_e12875dfb3b1d92d7d7c5377e22", ["email"], { unique: true })
@Index("IDX_USER_EMAIL", ["email"], { unique: true })
@Entity("user", { schema: "public" })
export class User {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "full_name", length: 64 })
  fullName: string;

  @Column("character varying", { name: "user_name", length: 16 })
  userName: string;

  @Column("character varying", { name: "email", unique: true, length: 64 })
  email: string;

  @Column("character varying", { name: "password", length: 64 })
  password: string;
}
