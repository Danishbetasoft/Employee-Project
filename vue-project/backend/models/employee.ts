import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  id: number = 0;

  @Column()
  username: string = '';

  @Column()
  email: string = '';

  @Column('json', { nullable: true })
  bgInfo: Record<string, any> = {};
}