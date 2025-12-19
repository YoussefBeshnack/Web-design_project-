import express from 'express';
const router = express.Router();
import xpController from '../controller/xpController.js';

router.get('/', xpController.getAllXps);
router.post('/add', xpController.addXp);
router.post('/sync', xpController.syncXps);
router.delete('/delete', xpController.deleteXp);

export default router;