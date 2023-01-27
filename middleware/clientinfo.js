import { fetch } from 'cross-fetch';
import { parse } from 'csv-parse';
import * as dotenv from 'dotenv';
import { getClient } from '../modules/client.js';
import sheetDao from '../modules/dao.js';
import { getToken, initialize } from '../modules/getToken.js';

dotenv.config({ path: '../.env' });

function isId(id) {
	return /^\d{9}$/.test(id);
}

export const getClientInfo = async (req, res, next) => {
	let body = req.body;

	body.start = parseInt(body.start);
	body.part = parseInt(body.part);

	sheetDao.spreadsheetId = body.link;
	sheetDao.sheetName = body.table;

	await initialize(body.google2fa);
	const columns = {
		fullname: body.fullname.toUpperCase(),
		phone: body.phone.toUpperCase(),
		city: body.city.toUpperCase(),
		email: body.email.toUpperCase(),
	};
	clientinfo(body.id_column, columns, body);
	next();
};

const clientinfo = async (idsColumn, columns, body) => {
	const ids = await sheetDao.getColumn(idsColumn);
	for (let i = body.start; i < ids.length; i += body.part) {
		console.log(' ' + i + ' - ' + (i + body.part) + ' | ' + ids.length);
		let clients = [];
		for (let j = 0; j < body.part; j++) {
			let index = i + j;
			let id = ids[index];
			if (isId(id)) {
				console.log(index + ': ' + id);
				await getClient(id).then((client) => {
					clients.push(client);
				});
			} else {
				console.log(index + ': ' + id + ' is not ID!');
				clients.push(null);
			}
		}
		await sheetDao.setAllClientInfo(clients, i + 1, body.part, columns);
	}
};
