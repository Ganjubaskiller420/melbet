import { fetch } from 'cross-fetch';
import { parse } from 'csv-parse';
import * as dotenv from 'dotenv';
import fs from 'fs';
import { getClient } from './modules/client.js';
import sheetDao from './modules/dao.js';
import { getClientDepositData } from './modules/deposit.js';
import { getClientByEmail } from './modules/email.js';
import { getToken, initialize } from './modules/getToken.js';
import log from './modules/logger.js';
import { getClientByPhone } from './modules/phone.js';
dotenv.config();
console.log = log;
//import { clientinfo, deposit, idByEmail, idByPhone } from './modules/executes.js';

function isNumeric(value) {
	return /^\d+$/.test(value);
}

function isId(id) {
	return /^\d{9}$/.test(id);
}

var args = process.argv.slice(2);
args = args.map((arg) => arg.toUpperCase());

let start = parseInt(process.env.start);
let part = parseInt(process.env.part_size);
let from_date = process.env.from_date;
let to_date = process.env.to_date;

const checkArgs = (count) => {
	if (args.length < count + 1) {
		console.log('args smaller than count');
		return false;
	} else
		for (let i = 1; i < count + 1; i++) {
			if (!args[i]) return false;
		}
	return true;
};

const mainLoop = async () => {
	switch (args[0].toLowerCase()) {
		case 'deposit':
			if (checkArgs(2)) {
				await initialize(); // authorize in admin-panel
				deposit(args[1], args[2]);
			} else console.log('Bad arguments!');
			break;
		case 'idbyemail':
			if (checkArgs(2)) {
				await initialize(); // authorize in admin-panel
				idByEmail(args[1], args[2]);
			} else console.log('Bad arguments!');
			break;
		case 'idbyphone':
			if (checkArgs(2)) {
				await initialize(); // authorize in admin-panel
				idByPhone(args[1], args[2]);
			} else console.log('Bad arguments!');
			break;
		case 'clientinfo':
			if (checkArgs(5)) {
				const columns = {
					fullname: args[2],
					phone: args[3],
					city: args[4],
					email: args[5],
				};
				await initialize(); // authorize in admin-panel
				clientinfo(args[1], columns);
			} else console.log('Bad arguments!');
			break;
	}
};

export const deposit = async (idsColumn, depositColumn) => {
	const ids = await sheetDao.getColumn(idsColumn);
	for (let i = start; i < ids.length; i += part) {
		console.log(' ' + i + ' - ' + (i + part) + ' | ' + ids.length);
		let clients = [];
		for (let j = 0; j < part; j++) {
			let index = i + j;
			let id = ids[index];
			if (isId(id)) {
				console.log(index + ': ' + id);
				await getClientDepositData(id, from_date, to_date).then((client) => {
					clients.push(client);
				});
			} else {
				console.log(index + ': ' + id + ' is not ID!');
				clients.push(null);
			}
		}
		await sheetDao.setDepositAmount(clients, i + 1, part, depositColumn);
	}
};

export const clientinfo = async (idsColumn, columns) => {
	const ids = await sheetDao.getColumn(idsColumn);
	for (let i = start; i < ids.length; i += part) {
		console.log(' ' + i + ' - ' + (i + part) + ' | ' + ids.length);
		let clients = [];
		for (let j = 0; j < part; j++) {
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
		await sheetDao.setAllClientInfo(clients, i + 1, part, columns);
	}
};

export const idByEmail = async (emailColumn, idColumn) => {
	const emails = await sheetDao.getColumn(emailColumn);
	for (let i = start; i < emails.length; i += part) {
		console.log(' ' + i + ' - ' + (i + part) + ' | ' + emails.length);
		let clients = [];
		for (let j = 0; j < part; j++) {
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
		await sheetDao.setId(clients, i + 1, part, idColumn);
	}
};

export const idByPhone = async (phoneColumn, idColumn) => {
	const phones = await sheetDao.getColumn(phoneColumn);
	for (let i = start; i < phones.length; i += part) {
		console.log(' ' + i + ' - ' + (i + part) + ' | ' + phones.length);
		let clients = [];
		for (let j = 0; j < part; j++) {
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
		await sheetDao.setId(clients, i + 1, part, idColumn);
	}
};
if (args.length) mainLoop();
