const dns = require('dns');
const https = require('https');
const { resolveUrlToIp, lookupIpstack } = require('../src/utils/helper');

jest.mock('dns');
jest.mock('https');

describe('resolveUrlToIp', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('resolves a plain hostname', async () => {
    dns.lookup.mockImplementation((hostname, options, cb) => {
      cb(null, '93.184.216.34');
    });

    const ip = await resolveUrlToIp('example.com');
    expect(ip).toBe('93.184.216.34');
    expect(dns.lookup).toHaveBeenCalledWith('example.com', { family: 0 }, expect.any(Function));
  });

  test('resolves a full URL with protocol and path', async () => {
    dns.lookup.mockImplementation((hostname, options, cb) => {
      cb(null, '2606:2800:220:1:248:1893:25c8:1946');
    });

    const ip = await resolveUrlToIp('https://example.com/some/path');
    expect(ip).toBe('2606:2800:220:1:248:1893:25c8:1946');
    expect(dns.lookup).toHaveBeenCalledWith('example.com', { family: 0 }, expect.any(Function));
  });

  test('throws on invalid input', async () => {
    await expect(resolveUrlToIp('')).rejects.toThrow(TypeError);
    await expect(resolveUrlToIp(null)).rejects.toThrow(TypeError);
  });

  test('propagates DNS errors', async () => {
    dns.lookup.mockImplementation((hostname, options, cb) => {
      const err = new Error('ENOTFOUND');
      cb(err);
    });

    await expect(resolveUrlToIp('doesnotexist.example')).rejects.toThrow('ENOTFOUND');
  });
});

describe('lookupIpstack', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('successful ipstack lookup returns parsed JSON', async () => {
    dns.lookup.mockImplementation((hostname, options, cb) => {
      cb(null, '1.2.3.4');
    });

    const mockRes = {
      statusCode: 200,
      headers: { 'content-type': 'application/json' },
      setEncoding: jest.fn(),
      on: (event, cb) => {
        if (event === 'data') cb(JSON.stringify({ ip: '1.2.3.4', country_name: 'Testland' }));
        if (event === 'end') cb();
      },
    };

    const mockReq = {
      on: jest.fn(),
      setTimeout: jest.fn(),
      destroy: jest.fn(),
    };

    https.get.mockImplementation((url, cb) => {
      cb(mockRes);
      return mockReq;
    });

    const info = await lookupIpstack('example.com', 'valid_key');
    expect(info).toEqual({ ip: '1.2.3.4', country_name: 'Testland' });
    expect(https.get).toHaveBeenCalled();
  });

  test('throws on invalid apiKey argument', async () => {
    await expect(lookupIpstack('example.com', '')).rejects.toThrow(TypeError);
    await expect(lookupIpstack('example.com', null)).rejects.toThrow(TypeError);
  });

  test('rejects when ipstack returns non-200 status', async () => {
    dns.lookup.mockImplementation((hostname, options, cb) => {
      cb(null, '1.2.3.4');
    });

    const body = JSON.stringify({ error: 'invalid_access_key' });
    const mockRes = {
      statusCode: 401,
      headers: { 'content-type': 'application/json' },
      setEncoding: jest.fn(),
      on: (event, cb) => {
        if (event === 'data') cb(body);
        if (event === 'end') cb();
      },
    };

    const mockReq = {
      on: jest.fn(),
      setTimeout: jest.fn(),
      destroy: jest.fn(),
    };

    https.get.mockImplementation((url, cb) => {
      cb(mockRes);
      return mockReq;
    });

    await expect(lookupIpstack('1.2.3.4', 'bad_key')).rejects.toThrow(/ipstack request failed/);
  });
});
