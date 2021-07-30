import express from 'express';
import walletController from '../controllers/walletController';
import { isAdmin } from '../middlewares/authMiddleware';

const router = express.Router();

const controller = new walletController();

router.get('/withdrawals', controller.withrawals);

router.get('/user/withdrawals', controller.userWithdraws);

router.get('/withdrawals/:withdrawId', controller.singleWithdraw);

router.post('/initiate/withdraw', controller.makeWithdrawalRequest);

router.put('/edit/withdraw/:withdrawId', controller.editWithdraw);

router.delete('/delete/withdraw/:withdrawId', controller.deleteWithdraw);

router.post('/topUp', controller.topUp);

router.post('/approve/reject/withdraw', [isAdmin], controller.disburseOrReject);

router.get('/transaction/ledger', [isAdmin], controller.getLedgerRecords);

export default router;
