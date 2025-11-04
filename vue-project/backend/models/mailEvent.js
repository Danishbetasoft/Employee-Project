var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from "typeorm";
import { MailRecord } from "./mailRecords.js";
let MailEvent = class MailEvent {
    id;
    mailRecord;
    user_id;
    event_type;
    createdAt;
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], MailEvent.prototype, "id", void 0);
__decorate([
    ManyToOne(() => MailRecord, (mailRecord) => mailRecord.events, { onDelete: "CASCADE" }),
    JoinColumn({ name: "form_id" }),
    __metadata("design:type", MailRecord)
], MailEvent.prototype, "mailRecord", void 0);
__decorate([
    Column(),
    __metadata("design:type", Number)
], MailEvent.prototype, "user_id", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], MailEvent.prototype, "event_type", void 0);
__decorate([
    CreateDateColumn({ name: "created_at" }),
    __metadata("design:type", Date)
], MailEvent.prototype, "createdAt", void 0);
MailEvent = __decorate([
    Entity()
], MailEvent);
export { MailEvent };
//# sourceMappingURL=mailEvent.js.map