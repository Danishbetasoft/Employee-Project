import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { Role } from './role.js';
import { Employee } from './employee.js';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id;

  @Column({ type: 'varchar', length: 255, unique: true })
  username;

  @Column({ type: 'varchar', length: 255 })
  email;

  @Column({ type: 'varchar', length: 255 })
  password;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  created_at;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at;

  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: 'role_id' })
  role;

  @OneToOne(() => Employee, (employee) => employee.user, { cascade: true })
  @JoinColumn({ name: 'employee_id' })
  employee;
}
