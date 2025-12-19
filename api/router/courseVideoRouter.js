import express from 'express';
const router = express.Router();
import courseVideoController from '../controller/courseVideoController.js';

router.get('/', courseVideoController.getAllCourseVideos);
router.post('/add', courseVideoController.addCourseVideo);
router.post('/sync', courseVideoController.syncCourseVideos);
router.delete('/delete', courseVideoController.deleteCourseVideo);

export default router;