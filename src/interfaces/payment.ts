import { Payer } from "./payer";

export interface Payment {
    id?: string,
    transaction_amount: number,
    installments: number,
    token: string,
    payment_method_id: string,
    notification_url?: string,
    status: string,
    payer: Payer,
    created_at?: string,
    updated_at?: string,
}