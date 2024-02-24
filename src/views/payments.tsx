import { useEffect, useMemo, useState } from 'react';
import './payments.css';
import { Payment } from '../interfaces/payment';
import { useClientAPI, useInternalRoutes } from '../utils/hooks';
import { useNavigate } from 'react-router-dom';
import Button from '../components/button';
import Loading from '../components/loading';
import Modal from '../components/modal';
import Table from '../components/Table';

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
                confirmText='Confirmar pagamento'
            />
            <Modal
                title='Deseja cancelar o pagamento?'
                description='Ao cancelar o pagamento o status será atualizado para CANCELADO'
                visible={showCancelPayment && activePayment != -1} setVisible={setShowCancelPayment}
                loading={loadingModal}
                onConfirm={handleClickCancelPayment}
                style='danger'
                confirmText='Cancelar pagamento'
            />
            <div className='payment-header'>
                <h1>Pagamentos</h1>
                <Button width='300px' text='Novo pagamento' onClick={handleClickNewPayment} />
            </div>
            <Table >
                <tr>
                    <th>ID</th>
                    <th>Preço</th>
                    <th>Parcelas</th>
                    <th>Metódo de pagamento</th>
                    <th>Status</th>
                    <th className='action' style={{ textAlign: 'center' }}>Ações</th>
                </tr>
                {
                    payments.map((payment, index) => (
                        <tr key={payment.id} className={index % 2 == 0 ? 'even' : ''}>
                            <td>{payment.id}</td>
                            <td style={{ fontSize: 16 }}>{payment.transaction_amount.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</td>
                            <td>{payment.installments}</td>
                            <td>{payment.payment_method_id}</td>
                            <td style={{ fontSize: 16 }}>{payment.status == 'PAID' ? 'PAGO' : payment.status == 'CANCELED' ? 'CANCELADO' : 'PENDENTE'}</td>
                            <td className='action'>
                                {
                                    payment.status != 'PAID' &&
                                    <Button text='Confirmar' height='40px' onClick={() => { handleClickActionPayment(index, false) }} />
                                }
                                {
                                    payment.status != 'CANCELED' &&
                                    <Button text='Cancelar' height='40px' style='danger' onClick={() => { handleClickActionPayment(index, true); }} />
                                }
                            </td>
                        </tr>
                    ))
                }
            </Table>

        </div>
    );
}