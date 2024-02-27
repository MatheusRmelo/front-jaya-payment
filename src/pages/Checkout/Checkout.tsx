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
import useFormatter from '../../utils/formatter';
import useValidate from '../../utils/validate/validate';

initMercadoPago('TEST-a3ac2850-b7e1-443f-be77-e03b0e8ee3cf', { locale: 'pt-BR' });

export default function Checkout() {
    const clientAPI = useClientAPI();
    const navigate = useNavigate();
    const formatter = useFormatter();
    const internalRoutes = useInternalRoutes();
    const validate = useValidate();
    const [cardNumber, setCardNumber] = useState('');
    const [cardholderName, setCardholderName] = useState('');
    const [cardExpirationMonth, setCardExpirationMonth] = useState('');
    const [cardExpirationYear, setCardExpirationYear] = useState('');
    const [securityCode, setSecurityCode] = useState('');
    const [email, setEmail] = useState('');
    const [document, setDocument] = useState('');
    const [typeDocument, setTypeDocument] = useState('');
    const [errors, setErrors] = useState<any>({});
    const [identificationTypes, setIdentificationTypes] = useState<IdentificationType[] | undefined>();
    const [cardInstallment, setCardInstallment] = useState<Installments | undefined>();
    const [activeInstallment, setActiveInstallment] = useState('');
    const [error, setError] = useState<string | undefined>();
    const [amount, setAmount] = useState('15');
    const [isLoadingInstallments, setIsLoadingInstallments] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isBusy, setIsBusy] = useState(false);


    useEffect(() => {
        getIdentificationTypesByMercadoPago();
    }, []);

    useEffect(() => {
        if (formatter.getOnlyNumbers(cardNumber).length > 5 && !isLoadingInstallments && amount != '') {
            getInstallmentsByCard();
        } else if (amount == '') {
            setCardInstallment(undefined);
            setActiveInstallment('');
        }
    }, [cardNumber, amount]);

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
                bin: formatter.getOnlyNumbers(cardNumber)
            });

            if (installments && installments.length > 0) {
                setCardInstallment(installments![0]);
            }
        } catch (err: any) {
            console.log(err);
            setError(err.message ?? err.toString());
        } finally {
            setIsLoadingInstallments(false);
        }

    }

    const handleClickPay = async () => {
        try {
            let errors: any = {};
            let identificationNumber: string = formatter.getOnlyNumbers(document);
            let isValidDocument: boolean = typeDocument == 'CPF' ? validate.isValidCPF(identificationNumber) : validate.isValidCNPJ(identificationNumber);
            if (!isValidDocument) {
                errors['document'] = 'Documento inválido';
            }
            if (email == '') {
                errors['email'] = 'Informação obrigatória';
            }
            if (formatter.getOnlyNumbers(cardExpirationMonth) == '') {
                errors['cardExpirationMonth'] = 'Informação obrigatória';
            }
            if (formatter.getOnlyNumbers(cardExpirationYear) == '') {
                errors['cardExpirationYear'] = 'Informação obrigatória';
            }
            if (formatter.getOnlyNumbers(cardNumber) == '') {
                errors['cardNumber'] = 'Informação obrigatória';
            }
            if (cardholderName == '') {
                errors['cardholderName'] = 'Informação obrigatória';
            }
            if (formatter.getOnlyNumbers(securityCode) == '') {
                errors['securityCode'] = 'Informação obrigatória';
            }
            setErrors(errors);
            if (Object.keys(errors).length > 0) return;
            setIsBusy(true);
            const response = await createCardToken({
                cardExpirationMonth: formatter.getOnlyNumbers(cardExpirationMonth),
                cardExpirationYear: formatter.getOnlyNumbers(cardExpirationYear),
                cardholderName,
                cardNumber: formatter.getOnlyNumbers(cardNumber),
                securityCode: formatter.getOnlyNumbers(securityCode),
                identificationNumber: identificationNumber,
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
                            number: identificationNumber,
                            type: typeDocument
                        }
                    }
                });

                if (result.ok) {
                    navigate(internalRoutes.payment);
                }
            }
        } catch (err: any) {
            if (err instanceof Array) {
                setError(err[0].message ?? "Falha ao solicitar pagamento");
            } else {
                setError(err.message ?? err.toString());
            }
        } finally {
            setIsBusy(false);
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
                                    <Input error={errors!['email']} value={email} onChanged={setEmail} placeholder='E-mail do pagador' type='email' />
                                    <Select
                                        value={typeDocument}
                                        placeholder='Selecione o tipo do documento'
                                        onChanged={setTypeDocument}
                                        options={identificationTypes == null ? [] : identificationTypes.map((type) => ({ key: type.id, value: type.name }))}
                                    />
                                    <Input
                                        disabled={typeDocument == ''}
                                        error={errors!['document']}
                                        withMask mask={typeDocument == 'CPF' ? "999.999.999-99" : "99. 999. 999/9999-99"}
                                        value={document} onChanged={setDocument} placeholder='Número de identificação' type='tel' />
                                </div>
                                <div className="form">
                                    <h3>Dados do pagamento</h3>
                                    <Input error={errors!['amount']} value={amount} onChanged={setAmount} placeholder='Valor do pagamento' type='tel' />
                                    <Input error={errors!['cardNumber']} withMask mask={'9999 9999 9999 9999'} value={cardNumber} onChanged={setCardNumber} placeholder='Número do cartão' type='tel' />
                                    <Input error={errors!['cardholderName']} value={cardholderName} onChanged={setCardholderName} placeholder='Nome do títular' type='text' />
                                    <Input error={errors!['cardExpirationMonth']} withMask mask={'99'} value={cardExpirationMonth} onChanged={setCardExpirationMonth} placeholder='Mês de expiração (MM)' type='tel' />
                                    <Input error={errors!['cardExpirationYear']} withMask mask={'9999'} value={cardExpirationYear} onChanged={setCardExpirationYear} placeholder='Ano de expiração (YYYY)' type='tel' />
                                    <Input error={errors!['securityCode']} withMask mask={'9999'} value={securityCode} onChanged={setSecurityCode} placeholder='CVV' type='tel' />
                                    <Select
                                        placeholder={isLoadingInstallments ? 'Carregando...' : 'Selecione o número de parcelas'}
                                        value={activeInstallment}
                                        onChanged={setActiveInstallment}
                                        options={
                                            cardInstallment == null ? [] :
                                                cardInstallment!.payer_costs.map<Option>((value) => ({ key: value.installments.toString(), value: value.recommended_message }))
                                        }
                                    />
                                </div>
                            </div>
                            <Button text='Pagar' loading={isBusy} onClick={handleClickPay} />
                        </>
            }
        </div>
    );
}