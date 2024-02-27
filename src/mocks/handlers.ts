import { HttpResponse, http } from 'msw';
import { Payment } from '../interfaces/payment';


export const handlers = [
    http.get('http://localhost:8000/api/payments', () => {
        return HttpResponse.json({
            result: <Payment[]>[
                {
                    id: "9c253550-25ae-4574-8435-86f77ed2abf9",
                    transaction_amount: 15,
                    installments: 1,
                    token: "weqwewqewqeeewqeewqew",
                    payment_method_id: "master",
                    notification_url: "http://localhost/rest/webhook/payment",
                    status: "PAID",
                    payer: {
                        id: "9c253550-25ae-4574-8435-86f77ed2abf9",
                        email: "teste@gmail.com",
                        identification: {
                            type: "CPF",
                            number: "9999999999"
                        }
                    }
                },
                {
                    id: "9c253550-25ae-4574-8435-86f77ed2ab2e",
                    transaction_amount: 99,
                    installments: 3,
                    token: "weqwewqewqeeewqeewqew",
                    payment_method_id: "master",
                    notification_url: "http://localhost/rest/webhook/payment",
                    status: "CANCELED",
                    payer: {
                        id: "9c253550-25ae-4574-8435-86f77ed2abf9",
                        email: "teste@gmail.com",
                        identification: {
                            type: "CPF",
                            number: "9999999999"
                        }
                    }
                },
            ],
            message: 'Sucesso',
            ok: true
        });
    })
];