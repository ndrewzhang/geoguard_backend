const dns = require('dns');
const { URL } = require('url');

/**
 * Resolve a URL (or hostname) to its IP address.
 * Accepts full URLs (https://example.com/path) or plain hostnames (example.com).
 * Returns the first resolved IP (IPv4 or IPv6) as a string.
 *
 * @param {string} inputUrl - The URL or hostname to resolve.
 * @returns {Promise<string>} - Resolved IP address.
 * @throws {TypeError} - If input is not a non-empty string.
 * @throws {Error} - If DNS resolution fails.
 */
async function resolveUrlToIp(inputUrl) {
	if (typeof inputUrl !== 'string' || inputUrl.trim() === '') {
		throw new TypeError('inputUrl must be a non-empty string');
	}

	let hostname = inputUrl.trim();

	// If input looks like a URL, try to parse and extract hostname
	try {
		// Ensure protocol exists for URL parsing; default to http if absent
		if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(hostname)) {
			hostname = `http://${hostname}`;
		}
		const parsed = new URL(hostname);
		hostname = parsed.hostname;
	} catch (err) {
		// If parsing fails, fall back to treating the input as a raw hostname
		hostname = inputUrl.trim();
	}

	return new Promise((resolve, reject) => {
		// Use family 0 to allow both IPv4 and IPv6; returns first found
		dns.lookup(hostname, { family: 0 }, (err, address) => {
			if (err) return reject(err);
			resolve(address);
		});
	});
}

/**
 * Lookup IP information from ipstack.com for a given input (URL/hostname/IP).
 * This resolves the input to an IP (using resolveUrlToIp) and then calls
 * https://api.ipstack.com/<ip>?access_key=<apiKey> and returns the parsed JSON.
 *
 * @param {string} input - URL, hostname, or IP address to lookup.
 * @param {string} apiKey - ipstack API access key.
 * @param {object} [opts] - Optional settings.
 * @param {number} [opts.timeout=10000] - Request timeout in milliseconds.
 * @returns {Promise<object>} - Parsed JSON response from ipstack.
 * @throws {TypeError} - If arguments are invalid.
 * @throws {Error} - If network request fails or ipstack returns non-200.
 */
async function lookupIpstack(input, apiKey, opts = {}) {
	if (typeof apiKey !== 'string' || apiKey.trim() === '') {
		throw new TypeError('apiKey must be a non-empty string');
	}

	const timeout = typeof opts.timeout === 'number' && opts.timeout > 0 ? opts.timeout : 10000;

	// Resolve the input to an IP address (works for URLs, hostnames, or raw IPs)
	const ip = await resolveUrlToIp(input);
	console.info(`lookupIpstack: resolved "${input}" to IP "${ip}"`);


	const https = require('https');
	const { URL } = require('url');

	const url = new URL(`https://api.ipstack.com/${encodeURIComponent(ip)}`);
	console.info(`lookupIpstack: querying ipstack for IP "${ip}"`);
	console.info('URL =', url.toString());
	url.searchParams.set('access_key', apiKey);

	return new Promise((resolve, reject) => {
		const req = https.get(url, (res) => {
			const { statusCode } = res;
			const contentType = res.headers['content-type'] || '';

			let raw = '';
			res.setEncoding('utf8');
			res.on('data', (chunk) => { raw += chunk; });
			res.on('end', () => {
				if (statusCode < 200 || statusCode >= 300) {
					// Try to include body in error when possible
					let message = `ipstack request failed with status ${statusCode}`;
					try {
						const parsed = JSON.parse(raw);
						message += `: ${JSON.stringify(parsed)}`;
					} catch (e) {
						if (raw) message += `: ${raw}`;
					}
					return reject(new Error(message));
				}

				try {
					const parsed = JSON.parse(raw);
					resolve(parsed);
				} catch (err) {
					reject(new Error('Failed to parse ipstack JSON response: ' + err.message));
				}
			});
		});

		req.on('error', (err) => reject(err));
		req.setTimeout(timeout, () => {
			req.destroy(new Error('ipstack request timed out'));
		});
	});
}

module.exports = {
	resolveUrlToIp,
	lookupIpstack,
};
