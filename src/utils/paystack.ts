import axios from 'axios';
import config from '../config/config';

export default class paystackService {
    static async verifyTransaction(reference: string) {
        try {
            const options = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${config.paystack.secret_key}`
                }
            };

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
    static async transferFund() {
        try {
        } catch (e) {
            throw new Error(e);
        }
    }
}
