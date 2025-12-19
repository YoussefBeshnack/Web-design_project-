import express from 'express';
const router = express.Router();
import feedbackController from '../controller/feedbackController.js';

router.get('/', feedbackController.getAllFeedbacks);
router.post('/add', feedbackController.addFeedback);
router.post('/sync', feedbackController.syncFeedbacks);
router.delete('/delete', feedbackController.deleteFeedback);

export default router;