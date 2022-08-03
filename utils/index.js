const https = require('https');

const fetchTitle = (url, onFetchComplete) => {
  const [hostname, ...paths] = url.replace(/https?:\/\//, '').split('/');
  const path = `${paths.join('/') && `/${paths.join('/')}`}`;

  https
    .request({ hostname, path, port: 443 }, (res) => {
      res.once('data', (chunk) => {
        const parsedChunk = chunk.toString();
        const title = parsedChunk.match(/<title>(.+?)<\/title>/i)?.[1];

        if (title) {
          onFetchComplete({ url, title });
          return;
        } else {
          onFetchComplete({ url, title: 'NO TITLE' });
          return;
        }
      });
    })
    .on('error', (err) => {
      onFetchComplete({ url, title: 'NO RESPONSE' });
      return;
    })
    .end();
};

exports.fetchTitle = fetchTitle;

exports.getUrlTitles = (urls, onFinish) => {
  const addressWithTitles = [];

  for (let index = 0; index < urls.length; index++) {
    fetchTitle(urls[index], (addressWithTitle) => {
      const count = addressWithTitles.push(addressWithTitle);
      if (count === urls.length) {
        onFinish(addressWithTitles);
      }
    });
  }
};

exports.getUrls = (addresses) => {
  if (!addresses) return null;

  const urls = typeof addresses === 'string' ? [addresses] : [...addresses];
  return urls;
};
