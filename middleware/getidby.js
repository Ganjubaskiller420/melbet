import * as dotenv from 'dotenv';
import sheetDao from '../modules/dao.js';
import { getClientByEmail } from '../modules/email.js';
import { close, getToken, initialize } from '../modules/getToken.js';
import { getClientByPhone } from '../modules/phone.js';

dotenv.config({ path: '../.env' });

export const getIdBy = async (req, res, next) => {
	let body = req.body;
	body.id = body.id.toUpperCase();

	body.start = parseInt(body.start);
	body.part = parseInt(body.part);
	body.amount = parseInt(body.amount);

	sheetDao.spreadsheetId = body.link;
	sheetDao.sheetName = body.table;

	await initialize(body.google2fa);
	if (body.by === 'email') idByEmail(body.value_column, body.id, body);
	else idByPhone(body.value_column, body.id, body);
	next();
};
const idByEmail = async (emailColumn, idColumn, body) => {
	const emails = await sheetDao.getColumn(emailColumn);
	let end = body?.amount + body.start;
	let length = emails.length < end ? emails.length : end;
	for (let i = body.start; i < length; i += body.part) {
		console.log(`--- ${i} - ${i + body.part} | [${length}] ---`);
		// console.log(' ' + i + ' - ' + (i + body.part) + ' | ' + emails.length);
		let clients = [];
		for (let j = 0; j < body.part; j++) {
			let index = i + j;
			let email = emails[index];
			if (email) {
				console.log(index + ': ' + email);
				await getClientByEmail(email).then((client) => {
					clients.push(client);
				});
			} else {
				console.log(index + ': ' + email + ' is not email!');
				clients.push(null);
			}
		}
		await sheetDao.setId(clients, i + 1, body.part, idColumn);
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

const idByPhone = async (phoneColumn, idColumn, body) => {
	const phones = await sheetDao.getColumn(phoneColumn);
	let end = body?.amount + body.start;
	let length = phones.length < end ? phones.length : end;
	for (let i = body.start; i < length; i += body.part) {
		console.log(`--- ${i} - ${i + body.part} | [${length}] ---`);
		let clients = [];
		for (let j = 0; j < body.part; j++) {
			let index = i + j;
			let phone = phones[index];
			if (phone) {
				console.log(index + ': ' + phone);
				await getClientByPhone(phone).then((client) => {
					clients.push(client);
				});
			} else {
				console.log(index + ': ' + phone + ' is not email!');
				clients.push(null);
			}
		}
		await sheetDao.setId(clients, i + 1, body.part, idColumn);
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
