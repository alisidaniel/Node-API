import Ledger, { directionType } from '../server/models/ledgerModel';
import { generateRef } from './generateRef';
import User from '../server/models/userModel';

interface Params {
    userId: string;
    amount: number;
    oldBalance: number;
    newBalance: number;
    entity: string;
    entityId: string;
    transactionCode: string;
}

interface IClass {
    transactionLog: (key: Params) => any;
}

const codeMapDescription = [
    { code: '001', message: 'Wallet Topup' },
    { code: '002', message: 'Wallet withdrawal' },
    { code: '003', message: 'Refund fund' },
    { code: '004', message: 'Admin approve transfer' }
];

export default class financeLoger implements IClass {
    public async transactionLog(key: Params): Promise<any> {
        try {
            const balanceDiff = key.newBalance - key.oldBalance;
            const direction = balanceDiff > 0 ? directionType.Credit : directionType.Credit;
            const amount = Math.abs(balanceDiff);
            let description: string = '';
            codeMapDescription.map((el: any) => {
                if (el.code === key.transactionCode) {
                    description = el.message;
                }
            });

            const log = new Ledger({
                reference: `MID-${generateRef(10)}`,
                amount,
                description,
                direction,
                newBalance: key.newBalance,
                oldBalance: key.oldBalance,
                entity: key.entity, // Ref model
                entityId: key.entityId, // Ref id
                user: key.userId,
                transactionCode: key.transactionCode
            });

            await log.save();

            await User.updateOne({ _id: key.userId }, { $set: { walletBalance: key.newBalance } });
        } catch (e) {
            throw Error(e);
        }
    }
}
