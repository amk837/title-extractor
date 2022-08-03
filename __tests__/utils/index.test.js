const { getUrls, fetchTitle } = require('../../utils');

describe('getUrls method', () => {
  it('should return null', () => {
    expect(getUrls(null)).toBe(null);
  });

  it('should return ["google.com"]', () => {
    const url = 'google.com';
    const urls = getUrls(url);
    expect(urls.length).toBe(1);
    expect(urls[0]).toBe(url);
  });

  it('should return ["google.com", "dawn.com"]', () => {
    const addresses = ['google.com', 'dawn.com'];
    const urls = getUrls(addresses);
    expect(urls.length).toBe(addresses.length);
    expect(urls[1]).toBe(addresses[1]);
    expect(urls[2]).toBe(addresses[2]);
  });
});

const urlToTitle = {
  'www.google.com': 'Google',
  'www.dawn.com/events/': 'Events - DAWN.COM - DAWN.COM',
  'https://amk-msf.herokuapp.com': 'Movie Search',
};

const urls = Object.keys(urlToTitle);

const https = require('https');
jest.spyOn(https, 'request').mockImplementation((options, callback) => {
  const functionBody = (event, callback) => {
    const { hostname, path } = options;
    const url = `${hostname}${path}`;
    const title =
      urlToTitle[url] ||
      urlToTitle[`https://${url}`] ||
      urlToTitle[`http://${url}`];
    const isValidUrl = !!title && options.port === 443;

    if (event === 'data' && isValidUrl) {
      callback(`<title>${title}</title>`);
    }
    if (event === 'error' && !isValidUrl) {
      callback();
    }
  };
  class mockRequest {
    on(...params) {
      functionBody(...params);
      return this;
    }
    once(...params) {
      functionBody(...params);
      return this;
    }
    end(...params) {
      functionBody(...params);
      return this;
    }
  }
  const objectToReturn = new mockRequest();
  callback(objectToReturn);

  return objectToReturn;
});

describe('fetchTitle method', () => {
  it('should return "Google"', () => {
    const url = urls[0];
    fetchTitle(url, ({ title }) => {
      expect(title).toBe(urlToTitle[url]);
    });
  });

  it('should return title "Events - DAWN.COM - DAWN.COM"', () => {
    const url = urls[1];
    fetchTitle(url, ({ title }) => {
      expect(title).toBe(urlToTitle[url]);
    });
  });

  it('should return title "Movie Search"', () => {
    const url = urls[2];
    fetchTitle(url, ({ title }) => {
      expect(title).toBe(urlToTitle[url]);
    });
  });

  it('should return title "NO RESPONSE"', () => {
    const url = 'abcsad';
    fetchTitle(url, ({ title }) => {
      expect(title).toBe('NO RESPONSE');
    });
  });
});
