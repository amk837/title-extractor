import { getUrlTitles } from '../utils/index.js';

const task1 = async (req, res) => {
  const addresses = req?.query?.address;

  if (!addresses) {
    res.send('<h1> No address param</h1>');
    return;
  }
  const urls = typeof addresses === 'string' ? [addresses] : [...addresses];

  const onFinish = (urlWithTitles) => {
    res.render('index', { urlWithTitles });
  }

  getUrlTitles(urls, onFinish);
};

export default task1;
