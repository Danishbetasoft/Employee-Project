import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { MailEvent } from "./mailEvent.js";

@Entity()
export class MailRecord {
  @PrimaryGeneratedColumn()
  id: number = 0;

  @Column()
  user_id: number = 0;

  @Column()
  company_name: string = '';

  @Column({ nullable: true })
  to_emails: string= '';

  @Column({ nullable: true })
  cc_emails: string = '';

  @Column({ nullable: true })
  bcc_emails: string=   '';

  @Column({ type: "text", nullable: true })
  message: string = '';

  @Column()
  tracking_id: string = '';

  @OneToMany(() => MailEvent, (mailEvent) => mailEvent.mailRecord)
  events: MailEvent[]
}
