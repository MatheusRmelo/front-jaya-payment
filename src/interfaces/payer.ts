import { Identification } from "@mercadopago/sdk-react/coreMethods/util/types";

export interface Payer {
    id?: string,
    payment_id?: string,
    entity_type?: string,
    type?: string,
    email: string,
    identification: Identification,
    created_at?: string,
    updated_at?: string,
}