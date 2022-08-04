const { getUrls, fetchTitle, getUrlTitles } = require('../../utils');

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

const mockUrlToTitle = {
  'www.google.com': 'Google',
  'www.dawn.com/events/': 'Events - DAWN.COM - DAWN.COM',
  'https://amk-msf.herokuapp.com': 'Movie Search',
};

const urls = Object.keys(mockUrlToTitle);
const urlWithTitles = urls.map((url) => ({ url, title: mockUrlToTitle[url] }));

describe('fetchTitle method', () => {
  beforeAll(() => {
    const https = require('https');
    jest.spyOn(https, 'request').mockImplementation((options, callback) => {
      const functionBody = (event, callback) => {
        const { hostname, path } = options;
        const url = `${hostname}${path}`;
        const title =
          mockUrlToTitle[url] ||
          mockUrlToTitle[`https://${url}`] ||
          mockUrlToTitle[`http://${url}`];
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
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should return "Google"', () => {
    const url = urls[0];
    fetchTitle(url, ({ title }) => {
      expect(title).toBe(mockUrlToTitle[url]);
    });
  });

  it('should return title "Events - DAWN.COM - DAWN.COM"', () => {
    const url = urls[1];
    fetchTitle(url, ({ title }) => {
      expect(title).toBe(mockUrlToTitle[url]);
    });
  });

  it('should return title "Movie Search"', () => {
    const url = urls[2];
    fetchTitle(url, ({ title }) => {
      expect(title).toBe(mockUrlToTitle[url]);
    });
  });

  it('should return title "NO RESPONSE"', () => {
    const url = 'abcsad';
    fetchTitle(url, ({ title }) => {
      expect(title).toBe('NO RESPONSE');
    });
  });
});

describe('getUrlTitles method', () => {
  beforeAll(() => {
    jest.mock('../../utils', () => {
      const original = jest.requireActual('../../utils');
      return {
        ...original,
        fetchTitle: (url) => mockUrlToTitle[url] || 'NO RESPONSE',
      };
    });
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should return [{ url: "abcd", title: "NO RESPONSE"}]', () => {
    const urls = ['abcd'];
    getUrlTitles(urls, (urlWithTitles) => {
      expect(urlWithTitles.length).toBe(urls.length);
      expect(urlWithTitles[0].url).toBe(urls[0]);
      expect(urlWithTitles[0].title).toBe('NO RESPONSE');
    });
  });

  it('should return [{ url: "www.google.com", title: "Google"}]', () => {
    const urlSlice = urls.slice(0, 1);
    getUrlTitles(urlSlice, (urlWithTitles) => {
      expect(urlWithTitles.length).toBe(urlSlice.length);
      expect(urlWithTitles[0].url).toBe(urlSlice[0]);
      expect(urlWithTitles[0].title).toBe(mockUrlToTitle[urlSlice[0]]);
    });
  });

  it('should return urlWithTitles array declared above', () => {
    getUrlTitles(urls, (result) => {
      expect(result.length).toBe(urlWithTitles.length);
      result.forEach(({ url, title }, index) => {
        expect(url).toBe(urlWithTitles[index].url);
        expect(title).toBe(urlWithTitles[index].title);
      });
    });
  });
});
