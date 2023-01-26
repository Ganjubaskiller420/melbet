import { fetch } from 'cross-fetch';
import token from './getToken.js';
const genRequestObject = async (email, partnerId) => {
	return {
		SkipCount: 0,
		TakeCount: 1,
		OrderBy: null,
		FieldNameToOrderBy: '',
		PartnerId: partnerId,
		Ids: [],
		Emails: [{ OperationTypeId: 8, StringValue: email }],
		UserNames: [],
		UniqueIds: [],
		FirstNames: [],
		LastNames: [],
		MobileNumbers: [],
		PhoneNumbers: [],
		CurrencyIds: [],
		DocumentNumbers: [],
		RegistrationIps: [],
		SportClinetIds: [],
		ShebaNumbers: [],
		SocialCardNumbers: [],
		FromList: false,
		IsQuickSearch: true,
	};
};

const genParams = async (requestObject, accessToken) => {
	const details = {
		Method: 'GetClientsShort',
		Controller: 'Client',
		TimeZone: '2',
		RequestObject: JSON.stringify(requestObject),
	};
	let payload = [];
	for (let property in details) {
		let encodedKey = encodeURIComponent(property);
		let encodedValue = encodeURIComponent(details[property]);
		payload.push(encodedKey + '=' + encodedValue);
	}
	payload = payload.join('&');

	return {
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
			Authorization: accessToken,
		},
		body: payload,
		method: 'POST',
	};
};

const isClientExistsByEmail = async (email, accessToken) => {
	let reqObj = await genRequestObject(email, process.env.partnerId);
	let data;
	try {
		let counter = 0;
		do {
			let response = await fetch(process.env.url_dep, await genParams(reqObj, accessToken)).catch((err) => {
				console.log(`ERR:${err}`);
			});
			data = JSON.parse(JSON.stringify(await response.json()));
			if (data.ResponseCode === 29 || data.ResponseCode === 68) {
				console.log('ResponseCode: ' + data.ResponseCode);
				accessToken = await token.getToken();
				// counter++;
				// await new Promise((r) => setTimeout(r, 1000));
				// if (counter >= 3) {
				// 	accessToken = await token.getToken();
				// 	counter = 0;
				// }
			} else if (data.ResponseCode === 22) {
				console.log('ResponseCode: ' + data.ResponseCode);
				return null;
			}
			console.log(data);
		} while (data.ResponseCode !== 0);
	} catch (ex) {
		console.log(ex);
		return null;
	}
	return data.ResponseObject;
};

export default { genRequestObject, genParams, isClientExistsByEmail };
