var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from "typeorm";
import { MailEvent } from "./mailEvent.js";
let MailRecord = class MailRecord {
    id;
    user_id;
    company_name;
    to_emails;
    cc_emails;
    bcc_emails;
    message;
    tracking_id;
    createdAt;
    events;
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], MailRecord.prototype, "id", void 0);
__decorate([
    Column(),
    __metadata("design:type", Number)
], MailRecord.prototype, "user_id", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], MailRecord.prototype, "company_name", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], MailRecord.prototype, "to_emails", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], MailRecord.prototype, "cc_emails", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], MailRecord.prototype, "bcc_emails", void 0);
__decorate([
    Column({ type: "text", nullable: true }),
    __metadata("design:type", String)
], MailRecord.prototype, "message", void 0);
__decorate([
    Column({ unique: true }),
    __metadata("design:type", String)
], MailRecord.prototype, "tracking_id", void 0);
__decorate([
    CreateDateColumn({ name: "created_at" }),
    __metadata("design:type", Date)
], MailRecord.prototype, "createdAt", void 0);
__decorate([
    OneToMany(() => MailEvent, (mailEvent) => mailEvent.mailRecord, { cascade: true }),
    __metadata("design:type", Array)
], MailRecord.prototype, "events", void 0);
MailRecord = __decorate([
    Entity()
], MailRecord);
export { MailRecord };
//# sourceMappingURL=mailRecords.js.map