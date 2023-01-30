import { fetch } from 'cross-fetch';
import { parse } from 'csv-parse';
import * as dotenv from 'dotenv';
import sheetDao from '../modules/dao.js';
import { getClientDepositData } from '../modules/deposit.js';
import { close, getToken, initialize } from '../modules/getToken.js';
// import { deposit } from '../scripts.js';

dotenv.config({ path: '../.env' });

function isId(id) {
	return /^\d{9}$/.test(id);
}

export const getDeposits = async (req, res, next) => {
	let body = req.body;
	body.hasDep = body.hasDep.toUpperCase();
	body.depSum = body.depSum.toUpperCase();
	body.start = parseInt(body.start);
	body.part = parseInt(body.part);
	body.amount = parseInt(body.amount);
	body.from += 'T00:00:00.000Z';
	body.to += 'T00:00:00.000Z';
	sheetDao.spreadsheetId = body.link;
	sheetDao.sheetName = body.table;
	await initialize(body.google2fa);
	deposit(body.id_column, body);
	next();
};
const deposit = async (idsColumn, body) => {
	const ids = await sheetDao.getColumn(idsColumn);
	let end = body?.amount + body.start;
	let length = ids.length < end ? ids.length : end;
	for (let i = body.start; i < length; i += body.part) {
		console.log(`--- ${i} - ${i + body.part} | [${length}] ---`);
		let clients = [];
		for (let j = 0; j < body.part; j++) {
			let index = i + j;
			let id = ids[index];
			if (isId(id)) {
				console.log(index + ': ' + id);
				await getClientDepositData(id, body.from, body.to).then((client) => {
					clients.push(client);
				});
			} else {
				console.log(index + ': ' + id + ' is not ID!');
				clients.push(null);
			}
		}
		const columns = {
			depositExistance: body.depSum,
			depositAmount: body.hasDep,
		};
		sheetDao.setDepositAmount(clients, i + 1, body.part, columns);
		if (process.env.stop_script === 'true') {
			console.log('STOP');
			process.env.stop_script = 'false';
			close();
			return;
		}
	}
	console.log('Succesfully complete');
	close();
};
