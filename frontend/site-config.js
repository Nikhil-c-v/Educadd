// -------------------------------------------------------
// LOCAL DEVELOPMENT: leave EDUCADD_API_URL as empty string.
// PRODUCTION (same-domain Vercel): keep empty to use current origin.
// PRODUCTION (separate backend host): set this to your backend URL.
//   e.g. 'https://edu-cadd-backend.onrender.com'
// Deployed: 2026-06-20T16:10Z - Load from external JSON
// -------------------------------------------------------
(async function resolveApiUrl() {
	let staticValue = '';
	
	// Try to load from external JSON file (won't be cached aggressively)
	try {
		const response = await fetch('./api-config.json?t=' + Date.now());
		if (response.ok) {
			const config = await response.json();
			staticValue = config.apiUrl;
		}
	} catch (e) {
		// Fallback to hardcoded value
		staticValue = 'https://educadd-kqah.onrender.com';
	}
	
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

	window.EDUCADD_API_URL = metaValue || storageValue || staticValue;
	console.log('[EDUCADD Config] API URL set to:', window.EDUCADD_API_URL);
})();
