import './Checkout.css';

import Button from '../../components/Button/Button';
import Input from '../../components/Input/Input';
import Select, { Option } from '../../components/Select/Select';
import { getIdentificationTypes, getInstallments, initMercadoPago } from '@mercadopago/sdk-react';
import { createCardToken } from '@mercadopago/sdk-react/coreMethods';

import { useEffect, useState } from 'react';
import { Installments } from '@mercadopago/sdk-react/coreMethods/getInstallments/types';
import { IdentificationType } from '@mercadopago/sdk-react/coreMethods/getIdentificationTypes/types';
import Loading from '../../components/Loading/Loading';
import { useClientAPI, useInternalRoutes } from '../../utils/hooks';
import { useNavigate } from 'react-router-dom';
import Error from '../../components/Error/Error';

initMercadoPago('TEST-a3ac2850-b7e1-443f-be77-e03b0e8ee3cf', { locale: 'pt-BR' });

export default function Checkout() {
    const clientAPI = useClientAPI();
    const navigate = useNavigate();
    const internalRoutes = useInternalRoutes();
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
    const [activeInstallment, setActiveInstallment] = useState('');
    const [error, setError] = useState(null);
    const [amount, setAmount] = useState('15');
    const [isLoadingInstallments, setIsLoadingInstallments] = useState(false);
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        getIdentificationTypesByMercadoPago();
    }, []);

    useEffect(() => {
        if (cardNumber.length > 5 && !isLoadingInstallments) {
            getInstallmentsByCard();
        }
    }, [cardNumber]);

    const getIdentificationTypesByMercadoPago = async () => {
        setIsLoading(true);
        setIdentificationTypes(await getIdentificationTypes());
        setIsLoading(false);
    }

    const getInstallmentsByCard = async () => {
        try {
            setIsLoadingInstallments(true);
            const installments = await getInstallments({
                amount: amount.toString(),
                bin: cardNumber
            });

            if (installments && installments.length > 0) {
                setCardInstallment(installments![0]);
            }
        } catch (err: any) {
            setError(err.toString());
        } finally {
            setIsLoadingInstallments(false);
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
        if (response) {
            var result = await clientAPI.savePayment({
                installments: cardInstallment!.payer_costs[parseInt(activeInstallment) - 1].installments!,
                payment_method_id: cardInstallment!.payment_method_id,
                status: 'PENDING',
                token: response.id,
                transaction_amount: cardInstallment!.payer_costs[parseInt(activeInstallment) - 1].total_amount,
                payer: {
                    email,
                    identification: {
                        number: document,
                        type: typeDocument
                    }
                }
            });
            if (result.ok) {
                navigate(internalRoutes.payment);
            }
        }
    }

    return (
        <div className="checkout">
            {
                error ? <Error error={error} /> :
                    isLoading ? <Loading />
                        :
                        <>
                            <div className="forms">
                                <div className="form">
                                    <h3>Dados do pagador</h3>
                                    <Input id='email' value={email} onChanged={setEmail} placeholder='E-mail do pagador' type='email' />
                                    <Select
                                        value={typeDocument}
                                        placeholder='Selecione o tipo do documento'
                                        onChanged={setTypeDocument}
                                        options={identificationTypes == null ? [] : identificationTypes.map((type) => ({ key: type.id, value: type.name }))}
                                    />
                                    <Input value={document} onChanged={setDocument} placeholder='Número de identificação' type='tel' />
                                </div>
                                <div className="form">
                                    <h3>Dados do pagamento</h3>
                                    <Input value={amount} onChanged={setAmount} placeholder='Valor do pagamento' type='tel' />
                                    <Input value={cardNumber} onChanged={setCardNumber} placeholder='Número do cartão' type='number' />
                                    <Input value={cardholderName} onChanged={setCardholderName} placeholder='Nome do títular' type='text' />
                                    <Input value={cardExpirationMonth} onChanged={setCardExpirationMonth} placeholder='Mês de expiração (MM)' type='tel' />
                                    <Input value={cardExpirationYear} onChanged={setCardExpirationYear} placeholder='Ano de expiração (YYYY)' type='tel' />
                                    <Input value={securityCode} onChanged={setSecurityCode} placeholder='CVV' type='number' />
                                    <Select
                                        placeholder='Selecione o número de parcelas'
                                        value={activeInstallment}
                                        onChanged={setActiveInstallment}
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