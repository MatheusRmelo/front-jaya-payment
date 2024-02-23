import { useEffect, useMemo, useState } from 'react';
import './payments.css';
import { Payment } from '../interfaces/payment';
import { useClientAPI, useInternalRoutes } from '../utils/hooks';
import { useNavigate } from 'react-router-dom';
import Button from '../components/button';
import Loading from '../components/loading';
import Modal from '../components/modal';

export default function Payments() {
    const clientAPI = useClientAPI();
    const navigate = useNavigate();
    const internalRoutes = useInternalRoutes();
    const [payments, setPayments] = useState<Payment[]>([]);
    const [activePayment, setActivePayment] = useState<number>(-1);
    const [loading, setLoading] = useState(false);
    const [showConfirmPayment, setShowConfirmPayment] = useState(false);
    const [showCancelPayment, setShowCancelPayment] = useState(false);
    const [loadingModal, setLoadingModal] = useState(false);

    useEffect(() => {
        getPayments();
    }, []);

    const getPayments = async () => {
        setLoading(true);
        var response = await clientAPI.getPayments();
        console.log(response);
        if (response.result != null) {
            setPayments(response.result);
        }
        setLoading(false);
    }

    const handleClickActionPayment = (index: number, cancel: boolean = false) => {
        if (cancel) {
            setShowCancelPayment(true);
        } else {
            setShowConfirmPayment(true);
        }
        setActivePayment(index);
    }

    const handleClickNewPayment = () => {
        navigate(internalRoutes.checkout);
    }

    const handleClickConfirmPayment = async () => {
        setLoadingModal(true);
        var response = await clientAPI.confirmPayment(payments[activePayment].id!);
        if (response.success) {
            var newPayments = payments;
            newPayments[activePayment].status = 'PAID';
            setPayments([...newPayments]);
        }
        setShowConfirmPayment(false);
        setLoadingModal(false);
    }

    const handleClickCancelPayment = async () => {
        setLoadingModal(true);
        var response = await clientAPI.cancelPayment(payments[activePayment].id!);
        if (response.success) {
            var newPayments = payments;
            newPayments[activePayment].status = 'CANCELED';
            setPayments([...newPayments]);
        }
        setShowCancelPayment(false);
        setLoadingModal(false);
    }

    return (
        <div>
            <Modal
                title='Deseja confirmar o pagamento?'
                description='Ao confirmar o pagamento o status será atualizado para pago'
                visible={showConfirmPayment && activePayment != -1} setVisible={setShowConfirmPayment}
                onConfirm={handleClickConfirmPayment}
                loading={loadingModal}
            />
            <Modal
                title='Deseja cancelar o pagamento?'
                description='Ao cancelar o pagamento o status será atualizado para CANCELADO'
                visible={showCancelPayment && activePayment != -1} setVisible={setShowCancelPayment}
                loading={loadingModal}
                onConfirm={handleClickCancelPayment}
                style='danger'
            />
            <div className='payment-header'>
                <h1>Pagamentos</h1>
                <Button width='300px' text='Novo pagamento' onClick={handleClickNewPayment} />
            </div>
            <div className="tbl-header">
                <table cellPadding={0} cellSpacing={0} border={0}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Preço</th>
                            <th>Parcelas</th>
                            <th>Token</th>
                            <th>Metódo de pagamento</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                </table>
            </div>
            <div className="tbl-content">
                {
                    loading ? <Loading /> : <table cellPadding={0} cellSpacing={0} border={0}>
                        <tbody>
                            {
                                payments.map((payment, index) => (
                                    <tr key={payment.id}>
                                        <td>{payment.id}</td>
                                        <td style={{ fontSize: 16 }}>{payment.transaction_amount.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</td>
                                        <td>{payment.installments}</td>
                                        <td>{payment.token}</td>
                                        <td>{payment.payment_method_id}</td>
                                        <td style={{ fontSize: 16 }}>{payment.status == 'PAID' ? 'PAGO' : payment.status == 'CANCELED' ? 'CANCELADO' : 'PENDENTE'}</td>
                                        <td className='action-column'>
                                            {
                                                payment.status != 'PAID' &&
                                                <Button text='Confirmar pagamento' variant='outline' onClick={() => { handleClickActionPayment(index, false) }} />
                                            }
                                            {
                                                payment.status != 'CANCELED' &&
                                                <Button text='Cancelar pagamento' style='danger' onClick={() => { handleClickActionPayment(index, true); }} />
                                            }
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                }

            </div>
        </div>
    );
}