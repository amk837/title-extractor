const { fetchTitle, getUrlTitles } = require('../utils/index.js');
const Async = require('async');

const onFinish = (res, urlWithTitles) => {
  res.render('index', { urlWithTitles });
};


exports.task1 = (req, res) => {
  getUrlTitles(req.urls, onFinish.bind(null, res));
};

exports.task2 = (req, res) => {
  const urls = req.urls;

  const queue = urls.map((url) => (callback) => {
    fetchTitle(url, (urlWithTitle) => {
      callback(null, urlWithTitle);
    });
  });

  Async.parallel(queue, (err, urlsWithTitles) => {
    if (!err) {
      onFinish(res, urlsWithTitles);
    }
  });
};

exports.task3 = (req, res) => {
  const urls = req.urls;

  const promises = urls.map(
    (url) =>
      new Promise((resolve) => {
        fetchTitle(url, resolve);
      })
  );

  Promise.all(promises).then(onFinish.bind(null, res));
};
