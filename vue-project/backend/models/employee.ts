import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { User } from './user.js';

@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  id;

  @Column({ type: 'varchar', length: 255 })
  username;

  @Column({ type: 'varchar', length: 255 })
  email;

  @Column({ type: 'varchar', length: 255 })
  password;

  @Column({ type: 'varchar', length: 100 })
  status;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at;

  @Column({ type: 'json', nullable: true })
  bgInfo;

  @OneToOne(() => User, (user) => user.employee)
  user;
}
