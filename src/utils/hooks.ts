import axios, { AxiosInstance } from "axios";
import { Payment } from "../interfaces/payment";

interface APIResponse<T> {
    message: string,
    result: T | null,
    success: boolean
}

function useClientAPI() {
    const client: AxiosInstance = axios.create({
        baseURL: 'http://localhost:8000/api',
    });

    const getPayments = async (): Promise<APIResponse<Payment[]>> => {
        try {
            var result = await client.get('payments');
            return {
                message: result.data.message,
                success: true,
                result: result.data.result
            };
        } catch (err: any) {
            return {
                message: err.toString(),
                success: false,
                result: null
            };
        }
    }

    const savePayment = async (payment: Payment): Promise<APIResponse<Payment>> => {
        try {
            var result = await client.post('payments', payment);
            return {
                message: result.data.message,
                success: true,
                result: result.data.result
            };
        } catch (err: any) {
            return {
                message: err.toString(),
                success: false,
                result: null
            };
        }
    }

    const confirmPayment = async (id: string): Promise<APIResponse<boolean>> => {
        try {
            await client.patch(`payments/${id}`, { 'status': 'PAID' });
            return {
                message: "Sucesso",
                success: true,
                result: true
            };
        } catch (err: any) {
            return {
                message: err.toString(),
                success: false,
                result: null
            };
        }


    }

    const cancelPayment = async (id: string): Promise<APIResponse<boolean>> => {
        try {
            await client.delete(`payments/${id}`);
            return {
                message: "Sucesso",
                success: true,
                result: true
            };
        } catch (err: any) {
            return {
                message: err.toString(),
                success: false,
                result: null
            };
        }
    }

    return {
        getPayments,
        savePayment,
        confirmPayment,
        cancelPayment
    }
}



function useInternalRoutes() {
    const payment = '/';
    const checkout = '/checkout';

    return {
        payment,
        checkout
    };
}

export {
    useClientAPI,
    useInternalRoutes
};