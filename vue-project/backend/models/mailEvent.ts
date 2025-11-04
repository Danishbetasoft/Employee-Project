import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm";
import { MailRecord } from "./mailRecords.js";

@Entity()
export class MailEvent {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => MailRecord, (mailRecord) => mailRecord.events, { onDelete: "CASCADE" })
  @JoinColumn({ name: "form_id" })
  mailRecord: MailRecord;   

  @Column()
  user_id: number;

  @Column()
  event_type: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;
}
