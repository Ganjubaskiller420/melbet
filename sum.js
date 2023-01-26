// const { By, Key, Builder, Options } = require('selenium-webdriver');
// const SheetDAO = require('./dao.js');
// const token = require('./getToken.js');
// const { fetch } = require('cross-fetch');
// const fs = require('fs');
// const { parse } = require('csv-parse');
// const { getDepositData } = require('./deposit.js');
// const { isClientExistsByPhone } = require('./phone.js');

import { fetch } from 'cross-fetch';
import { parse } from 'csv-parse';
import fs from 'fs';
// import { Builder, By, Key, Options } from 'selenium-webdriver';
import SheetDAO from './dao.js';
//import getDepositData from './deposit.js';
import client from './client.js';
import deposit from './deposit.js';
import email from './email.js';
import token from './getToken.js';
import phone from './phone.js';

function isNumeric(value) {
	return /^\d+$/.test(value);
}

function isId(id) {
	return /^\d{9}$/.test(id);
}

let accessToken;

const mainLoop = async (start, part) => {
	const sheetDao = new SheetDAO();
	let from_date = '2023-01-01T20:00:00.000Z'; //process.env.from_date;
	let to_date = '2023-12-31T00:00:00.000Z'; //process.env.to_date;
	let index;
	accessToken = await token.initialize().then(() => {
		return token.getToken();
	});
	const ids = await sheetDao.getColumn('L');
	for (let i = start; i < ids.length; i += part) {
		console.log(' ' + i + ' - ' + (i + part));
		let clients = [];
		for (let j = 0; j < part; j++) {
			//console.log(ids[i + j])
			index = i + j;
			let id = ids[index];
			if (isId(id)) {
				console.log(index + ': ' + id);
				await client.getClient(id).then((client) => {
					clients.push(client);
				});
				// await deposit.getDepositData(id, from_date, to_date, accessToken).then((client) => {
				// 	clients.push(client);
				// });
				// await email.isClientExistsByEmail(id, accessToken).then((result) => {
				// 	clients.push(result);
				// });
				// await phone.isClientExistsByPhone(id, accessToken).then((result) => {
				// 	clients2.push(result);
				// });
			} else {
				console.log(index + ': ' + id + ' is not ID!');
				clients.push(null);
			}
		}
		//await sheetDao.setAllInfo(clients, i + 1, part);
		//await sheetDao.setAllClientInfo(clients, i + 1, part);
		//await sheetDao.setAllInfo(clients, i + 1, part);
		//await sheetDao.idByPhone(clients, i + 1, part);
		await sheetDao.registrationDate(clients, i + 1, part, 'Q');
	}
};

mainLoop(0, 100);
