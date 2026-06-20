// -------------------------------------------------------
// LOCAL DEVELOPMENT: leave EDUCADD_API_URL as empty string.
// PRODUCTION (same-domain Vercel): keep empty to use current origin.
// PRODUCTION (separate backend host): set this to your backend URL.
//   e.g. 'https://edu-cadd-backend.onrender.com'
// Deploy version: 2026-06-20 15:45 UTC
// -------------------------------------------------------
(function resolveApiUrl() {
	const staticValue = 'https://educadd-kqah.onrender.com';
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
})();
