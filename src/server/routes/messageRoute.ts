import express from 'express';
import disputeController from '../controllers/disputeController';

const router = express.Router();

router.get('/broadcast', function () {
    console.log('hello');
});

export default router;
