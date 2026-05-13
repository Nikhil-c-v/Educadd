// -------------------------------------------------------
// LOCAL DEVELOPMENT: leave EDUCADD_API_URL as empty string.
// PRODUCTION (GoDaddy): set this to your deployed backend URL.
//   e.g. window.EDUCADD_API_URL = 'https://api.yourdomain.com';
// -------------------------------------------------------
(function resolveApiUrl() {
	const staticValue = '';
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

	window.EDUCADD_API_URL = staticValue || metaValue || storageValue;
})();
