import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("strategy", { schema: "public" })
export class Strategy {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "name" })
  name: string;

  @Column("boolean", { name: "is_active" })
  isActive: boolean;
}
