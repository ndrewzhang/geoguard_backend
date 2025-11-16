const dns = require('dns');
const { resolveUrlToIp } = require('../src/utils/helper');

jest.mock('dns');

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
