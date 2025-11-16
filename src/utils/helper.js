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

module.exports = {
	resolveUrlToIp,
};
