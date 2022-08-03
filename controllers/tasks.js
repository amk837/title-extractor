import { fetchTitle, getUrlTitles } from '../utils/index.js';
import Async from 'async';

const onFinish = (res, urlWithTitles) => {
  res.render('index', { urlWithTitles });
};

export const task1 = (req, res) => {
  getUrlTitles(req.urls, onFinish.bind(null, res));
};

export const task2 = (req, res) => {
  const urls = req.urls;
  const urlMapper = (url) => {
    const asyncCallback = (callback) => {
      fetchTitle(url, (urlWithTitle) => {
        callback(null, urlWithTitle);
      });
    };
    return asyncCallback;
  };
  const queue = urls.map(urlMapper);

  Async.parallel(queue, (err, urlsWithTitles) => {
    if (!err) {
      onFinish(res, urlsWithTitles);
    }
  });
};

export const task3 = (req, res) => {
  const urls = req.urls;

  const promises = urls.map(
    (url) =>
      new Promise((resolve) => {
        fetchTitle(url, resolve);
      })
  );

  Promise.all(promises).then(onFinish.bind(null, res));
};
