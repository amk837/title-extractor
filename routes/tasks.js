import express from 'express';
import task1 from '../controllers/task1.js';

const router = express.Router();

router.get('/task1/I/want/title/', task1);
router.get('/I/want/title/', task1);
router.get('/I/want/title/', task1);

export default router;
