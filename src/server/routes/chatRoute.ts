import express from 'express';
import chatRoomController from '../controllers/chatRoomController';

const router = express.Router();

router.get('/', chatRoomController.getRecentConversation);

router.get('/:roomId', chatRoomController.getConversationByRoomId);

router.post('/initiate', chatRoomController.initiate);

router.post('/:roomId/message', chatRoomController.postMessage);

router.put('/:roomId/mark-read', chatRoomController.markConversationReadByRoomId);

router.delete('/room/:roomId', chatRoomController.deleteRoomById);
router.delete('/message/:messageId', chatRoomController.deleteMessageById);

export default router;
