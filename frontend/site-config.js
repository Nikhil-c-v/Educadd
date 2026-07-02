// -------------------------------------------------------
// LOCAL DEVELOPMENT: leave EDUCADD_API_URL as empty string.
// PRODUCTION (same-domain Vercel): keep empty to use current origin.
// PRODUCTION (separate backend host): set this to your backend URL.
//   e.g. 'https://edu-cadd-backend.onrender.com'
// -------------------------------------------------------
(async function resolveApiUrl() {
	const host = window.location.hostname;
	const isLocalHost = ['localhost', '127.0.0.1', ''].includes(host) || host === 'null';
	const fallbackApiBase = isLocalHost ? 'http://localhost:5000' : window.location.origin;
	let resolvedValue = '';
	let storageValue = '';
	const metaValue = document
		.querySelector('meta[name="educadd-api-url"]')
		?.getAttribute('content')
		?.trim() || '';

	try {
		storageValue = (localStorage.getItem('EDUCADD_API_URL') || '').trim();
	} catch (error) {
		storageValue = '';
	}

	try {
		const configUrl = `${fallbackApiBase}/api/config?t=${Date.now()}`;
		const response = await fetch(configUrl, { cache: 'no-store' });
		if (response.ok) {
			const config = await response.json();
			resolvedValue = config.apiBaseUrl || config.backendUrl || fallbackApiBase;
		}
	} catch (error) {
		resolvedValue = fallbackApiBase;
	}

	window.EDUCADD_API_URL = metaValue || resolvedValue || storageValue || fallbackApiBase;
	console.log('[EDUCADD Config] API URL set to:', window.EDUCADD_API_URL);
})();
