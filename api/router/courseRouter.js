import express from 'express';
const router = express.Router();
import courseController from '../controller/courseController.js';

router.get('/', courseController.getAllCourses);
router.post('/add', courseController.addCourse);
router.post('/sync', courseController.syncCourses);
router.delete('/delete', courseController.deleteCourse);

export default router;