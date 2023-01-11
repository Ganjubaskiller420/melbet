const token = require('./getToken.js');
let accessToken;
const generateParams = (token, clientId) => {
	return {
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			Authorization: token,
		},
		body: JSON.stringify({ ClientId: clientId }),
		method: 'POST',
	};
};

export const getClient = async (id, accessToken) => {
	let data;
	try {
		do {
			let response = await fetch(url, generateParams(accessToken, id)).catch((err) => {
				console.log(err);
			});

			data = JSON.parse(JSON.stringify(await response.json()));
			if (data.ResponseCode === 29 || data.ResponseCode === 68) {
				console.log('ResponseCode: ' + data.ResponseCode);
				accessToken = await token.getToken();
			} else if (data.ResponseCode === 22) {
				console.log('ResponseCode: ' + data.ResponseCode);
				return null;
			}
		} while (data.ResponseCode !== 0);
	} catch (ex) {
		console.log(ex);
		return null;
	}
	return data.ResponseObject;
};
