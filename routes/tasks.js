const express = require('express');
const { task1, task2, task3 } = require('../controllers/tasks.js');
const { getUrls } = require('../utils/index.js');


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

module.exports = router;
