import * as dotenv from 'dotenv';
import fetch from 'node-fetch';
import { getToken } from './getToken.js';
import log from './logger.js';
console.log = log;
const genRequestObject = async (clientId, partnerId, fromDate, toDate) => {
	return {
		SkipCount: 0,
		TakeCount: 100,
		OrderBy: null,
		FieldNameToOrderBy: '',
		PartnerId: partnerId,
		ReportSectionType: null,
		IsLastPaymentRequests: false,
		PartnerIds: [],
		FromDate: fromDate,
		ToDate: toDate,
		Ids: [],
		Type: 2,
		IsCreatedOrUpdate: false,
		UserNames: [],
		Currencies: [],
		CheckHasNote: null,
		CheckHasAttantion: null,
		Statuses: [],
		States: [],
		Names: [],
		CreatorNames: [],
		ClientIds: [{ OperationTypeId: 1, IntValue: clientId }],
		UserIds: [],
		PartnerPaymentSettingIds: [],
		PaymentSystemIds: [],
		BetShopIds: [],
		BetShopNames: [],
		Amounts: [],
		CreationDates: [],
		LastUpdateDates: [],
		ClientCategoryName: [],
		Categories: [],
		Tag: [],
		autoTransferIdram: false,
		CurrencyId: null,
		AutoRefresh: false,
		ClientId: clientId,
		ExternalTransactionIds: [],
	};
};

const genParams = async (requestObject, token) => {
	const details = {
		Method: 'GetPlayerPaymentRequestsPaging',
		Controller: 'PaymentSystem',
		TimeZone: '3',
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
			Authorization: token,
		},
		body: payload,
		method: 'POST',
	};
};

export const getClientDepositData = async (id, from_date, to_date) => {
	let reqObj = await genRequestObject(id, process.env.partnerId, from_date, to_date);
	let data;
	try {
		do {
			let response = await fetch(process.env.url_dep, await genParams(reqObj, await getToken())).catch((err) => {
				console.log(`ERR:${err}`);
			});
			data = JSON.parse(JSON.stringify(await response.json()));
			if (data.ResponseCode === 29 || data.ResponseCode === 68) {
			} else if (data.ResponseCode === 22) {
				console.log('Client Not Found: ' + data.ResponseCode);
				return null;
			}
		} while (data.ResponseCode !== 0);
	} catch (ex) {
		console.log(ex);
		return null;
	}
	return data.ResponseObject;
};

export default { genRequestObject, genParams, getClientDepositData };
