import https from 'https';

export const getUrlTitles = (urls, onFinish) => {
  const addressWithTitles = [];
  const fetchTitle = (index) => {
    if (index >= urls.length) {
      onFinish(addressWithTitles);
      return;
    }

    const url = urls[index];
    const [hostname, ...paths] = url.replace(/https?:\/\//, '').split('/');
    const path = `${paths.join('/') && `/${paths.join('/')}`}`;

    https
      .request({ hostname, path, port: 443 }, (res) => {
        res.once('data', (chunk) => {
          const parsedChunk = chunk.toString();
          const title = parsedChunk.match(/<title>(.+?)<\/title>/i);

          if (title?.[1]) {
            addressWithTitles.push({ url, title });
          } else {
            addressWithTitles.push({ url, title: 'NO TITLE' });
          }
        });

        res.on('error', (err) => {
          fetchTitle(index + 1);
        });

        res.once('end', () => {
          fetchTitle(index + 1);
        });
      })
      .on('error', (err) => {
        addressWithTitles.push({ url, title: 'NO RESPONSE' });
        fetchTitle(index + 1);
      })
      .end();
  };
  fetchTitle(0);
};
