// -------------------------------------------------------
// LOCAL DEVELOPMENT: leave EDUCADD_API_URL as empty string.
// PRODUCTION (same-domain Vercel): keep empty to use current origin.
// PRODUCTION (separate backend host): set this to your backend URL.
//   e.g. 'https://edu-cadd-backend.onrender.com'
// -------------------------------------------------------
(async function resolveApiUrl() {
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
		const response = await fetch('/api/config?t=' + Date.now(), { cache: 'no-store' });
		if (response.ok) {
			const config = await response.json();
			resolvedValue = config.apiBaseUrl || config.backendUrl || '';
		}
	} catch (error) {
		resolvedValue = '';
	}

	window.EDUCADD_API_URL = metaValue || storageValue || resolvedValue;
	console.log('[EDUCADD Config] API URL set to:', window.EDUCADD_API_URL);
})();
