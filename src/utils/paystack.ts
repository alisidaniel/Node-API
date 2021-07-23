import axios from 'axios';
import config from '../config/config';

interface IRecipiant {
    type: string;
    name: string;
    description: string;
    account_number: string;
    bank_code: string;
}

interface ITransfer {
    amount: number;
    source: string;
    recipient: string;
    reason: string;
}

interface IToken {
    transfer_code: string;
    // otp: string;
}

interface IResolver {
    account_number: string;
    bank_code: string;
}

const options = {
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.paystack.secret_key}`
    }
};
export default class paystackService {
    static async verifyTransaction(reference: string) {
        try {
            const response = await axios.get(
                `${config.paystack.url}/transaction/verify/${reference}`,
                options
            );
            if (response.data.data.status === 'success') {
                return true;
            }
            return false;
        } catch (e) {
            throw new Error(e);
        }
    }

    static async getTransaction(reference: string) {
        try {
            const response = await axios.get(
                `${config.paystack.url}/transaction/verify/${reference}`,
                options
            );
            return response.data;
        } catch (e) {
            throw new Error(e);
        }
    }

    static async accountResolver(data: IResolver) {
        try {
            const response = await axios.get(
                `${config.paystack.url}/bank/resolve?${data.account_number}&${data.bank_code}`
            );
            return response.data;
        } catch (e) {
            throw new Error(e);
        }
    }

    static async createTransferRecipiant(data: IRecipiant): Promise<any> {
        try {
            const response = await axios.post(
                `${config.paystack.url}/transferrecipient`,
                { ...data },
                options
            );
            return response.data.data.recipient_code;
        } catch (e) {
            throw new Error(e);
        }
    }

    static async initiateTransfer(data: ITransfer) {
        try {
            const response = await axios.post(
                `${config.paystack.url}/transfer`,
                { ...data },
                options
            );
            return response.data;
        } catch (e) {
            throw new Error(e);
        }
    }

    static async finalizeTransfer(data: IToken) {
        try {
            const response = await axios.post(
                `${config.paystack.url}/transfer/finalize_transfer`,
                { ...data },
                options
            );
            return response;
        } catch (e) {
            throw new Error(e);
        }
    }
}
