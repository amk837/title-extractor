import express from 'express';
import { task1, task2, task3 } from '../controllers/tasks.js';
import { getUrls } from '../utils/index.js';

const router = express.Router();

router.use((req, res, next) => {
  const urls = getUrls(req?.query?.address);

  if (!urls) {
    res.send('<h1> No address param</h1>');
    return;
  }
  req.urls = urls;
  next();
});

router.get('/task1/I/want/title/', task1);
router.get('/task2/I/want/title/', task2);
router.get('/task3/I/want/title/', task3);

export default router;
