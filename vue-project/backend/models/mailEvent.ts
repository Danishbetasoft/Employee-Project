import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { MailRecord } from './mailRecords.js';
@Entity()
export class MailEvent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  event_type: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ManyToOne(() => MailRecord, mailRecord => mailRecord.events)
  mailRecord;
}
