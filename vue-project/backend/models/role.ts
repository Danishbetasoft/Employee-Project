import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from './user.js';
@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string; 

  @Column()
  created_at: Date = new Date();

  @Column()
  updated_at: Date = new Date();

  @OneToMany(() => User, user => user.role)
  users: User[];
}
