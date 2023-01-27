import { fetch } from 'cross-fetch';
import { getToken } from './getToken.js';
import log from './logger.js';
console.log = log;
const generateParams = (clientId, token) => {
	return {
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
			Authorization: token,
		},
		body: JSON.stringify({ ClientId: clientId }),
		method: 'POST',
	};
};

export const getClient = async (id) => {
	let data;
	try {
		do {
			let response = await fetch(process.env.url_id, generateParams(id, await getToken())).catch((err) => {
				console.log(err);
			});
			data = JSON.parse(JSON.stringify(await response.json()));
			if (data.ResponseCode === 29 || data.ResponseCode === 68) {
				console.log('ResponseCode: ' + data.ResponseCode);
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
export default { generateParams, getClient };
