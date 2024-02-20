import Button from '../components/button';
import Input from '../components/input';
import Select, { Option } from '../components/select';
import { getIdentificationTypes, getInstallments, initMercadoPago } from '@mercadopago/sdk-react';
import { createCardToken } from '@mercadopago/sdk-react/coreMethods';

import './checkout.css';
import { useEffect, useState } from 'react';
import { Installments } from '@mercadopago/sdk-react/coreMethods/getInstallments/types';
import { IdentificationType } from '@mercadopago/sdk-react/coreMethods/getIdentificationTypes/types';

initMercadoPago('TEST-a3ac2850-b7e1-443f-be77-e03b0e8ee3cf', { locale: 'pt-BR' });

export default function Checkout() {
    const [cardNumber, setCardNumber] = useState('');
    const [cardholderName, setCardholderName] = useState('');
    const [cardExpirationMonth, setCardExpirationMonth] = useState('');
    const [cardExpirationYear, setCardExpirationYear] = useState('');
    const [securityCode, setSecurityCode] = useState('');
    const [email, setEmail] = useState('');
    const [document, setDocument] = useState('');
    const [typeDocument, setTypeDocument] = useState('');
    const [identificationTypes, setIdentificationTypes] = useState<IdentificationType[] | undefined>();
    const [cardInstallment, setCardInstallment] = useState<Installments | undefined>();
    const [loadingInstallments, setLoadingInstallments] = useState(false);
    const [loading, setLoading] = useState(false);
    const amount = 15;


    useEffect(() => {
        init();
    }, []);

    useEffect(() => {
        if (cardNumber.length > 5 && !loadingInstallments) {
            getInstallmentsByCard();
        }
    }, [cardNumber]);

    const init = async () => {
        setLoading(true);
        setIdentificationTypes(await getIdentificationTypes());
        setLoading(false);
    }

    const getInstallmentsByCard = async () => {
        try {
            setLoadingInstallments(true);
            const installments = await getInstallments({
                amount: amount.toString(),
                bin: cardNumber
            });

            if (installments && installments.length > 0) {
                setCardInstallment(installments![0]);
            }
        } catch (err) {
            console.log('------------');
            console.log(err);
            console.log('------------');
        } finally {
            setLoadingInstallments(false);
        }

    }

    const handleClickPay = async () => {
        const response = await createCardToken({
            cardExpirationMonth,
            cardExpirationYear,
            cardholderName,
            cardNumber,
            securityCode,
            identificationNumber: document,
            identificationType: typeDocument
        });
        console.log(response);
    }

    return (
        <div className="checkout">
            {
                loading ? <div>Carregando...</div>
                    :
                    <>
                        <div className="forms">
                            <div className="form">
                                <h3>Dados do pagador</h3>
                                <Input value={email} onChanged={setEmail} placeholder='E-mail do pagador' type='email' />
                                <Select
                                    value={typeDocument}
                                    onChanged={setTypeDocument}
                                    options={identificationTypes == null ? [] : identificationTypes.map((type) => ({ key: type.id, value: type.name }))}
                                />
                                <Input value={document} onChanged={setDocument} placeholder='Número de identificação' type='tel' />
                            </div>
                            <div className="form">
                                <h3>Dados do pagamento</h3>
                                <Input value={amount.toString()} placeholder='Valor do pagamento' type='tel' />
                                <Input value={cardNumber} onChanged={setCardNumber} placeholder='Número do cartão' type='number' />
                                <Input value={cardholderName} onChanged={setCardholderName} placeholder='Nome do títular' type='text' />
                                <Input value={cardExpirationMonth} onChanged={setCardExpirationMonth} placeholder='Mês de expiração (MM)' type='tel' />
                                <Input value={cardExpirationYear} onChanged={setCardExpirationYear} placeholder='Ano de expiração (YYYY)' type='tel' />
                                <Input value={securityCode} onChanged={setSecurityCode} placeholder='CVV' type='number' />
                                <Select
                                    placeholder='Selecione o número de parcelas'
                                    options={
                                        cardInstallment == null ? [] :
                                            cardInstallment!.payer_costs.map<Option>((value) => ({ key: value.installments.toString(), value: value.recommended_message }))
                                    }
                                />
                            </div>
                        </div>
                        <Button text='Pagar' onClick={handleClickPay} />
                    </>
            }
        </div>
    );
}