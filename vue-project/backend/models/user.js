var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { Role } from './role.js';
import { Employee } from './employee.js';
let User = class User {
    id;
    username;
    email;
    password;
    created_at;
    updated_at;
    role;
    employee;
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Object)
], User.prototype, "id", void 0);
__decorate([
    Column({ type: 'varchar', length: 255, unique: true }),
    __metadata("design:type", Object)
], User.prototype, "username", void 0);
__decorate([
    Column({ type: 'varchar', length: 255 }),
    __metadata("design:type", Object)
], User.prototype, "email", void 0);
__decorate([
    Column({ type: 'varchar', length: 255 }),
    __metadata("design:type", Object)
], User.prototype, "password", void 0);
__decorate([
    Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Object)
], User.prototype, "created_at", void 0);
__decorate([
    Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Object)
], User.prototype, "updated_at", void 0);
__decorate([
    ManyToOne(() => Role, (role) => role.users),
    JoinColumn({ name: 'role_id' }),
    __metadata("design:type", Object)
], User.prototype, "role", void 0);
__decorate([
    OneToOne(() => Employee, (employee) => employee.user, { cascade: true }),
    JoinColumn({ name: 'employee_id' }),
    __metadata("design:type", Object)
], User.prototype, "employee", void 0);
User = __decorate([
    Entity()
], User);
export { User };
//# sourceMappingURL=user.js.map