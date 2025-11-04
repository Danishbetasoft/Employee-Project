import { MailEvent } from "./mailEvent.js";
export declare class MailRecord {
    id: number;
    user_id: number;
    company_name: string;
    to_emails: string;
    cc_emails: string;
    bcc_emails: string;
    message: string;
    tracking_id: string;
    createdAt: Date;
    events: MailEvent[];
}
//# sourceMappingURL=mailRecords.d.ts.map