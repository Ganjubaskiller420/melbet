const { By, Key, Builder, Options } = require('selenium-webdriver');
const SheetDAO = require('./dao.js');
const token = require('./getToken.js');

const { fetch } = require('cross-fetch');
const fs = require('fs');
const { parse } = require('csv-parse');
const { getDepositData } = require('./deposit.js');

function isNumeric(value) {
	return /^\d+$/.test(value);
}

function isId(id) {
	return /^\d{9}$/.test(id);
}

let accessToken;

// const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const mainLoop = async (start, part) => {
	let from_date = process.env.from_date;
	let to_date = process.env.to_date;
	let index;
	accessToken = await token.initialize().then(() => {
		return token.getToken();
	});
	const ids = await getColumn(process.env.id_column);
	for (let i = start; i < ids.length; i += part) {
		console.log(' ' + i + ' - ' + (i + part));
		let clients = [];
		for (let j = 0; j < part; j++) {
			//console.log(ids[i + j])
			index = i + j;
			let id = ids[index];
			if (isId(id)) {
				console.log(index + ': ' + id);
				// await getClient(id, accessToken).then((client) => {
				// 	clients.push(client);
				// });
				await getDepositData(id, from_date, to_date, accessToken).then((client) => {
					clients.push(client);
				});
			} else {
				tempData = id;
				console.log(index + ': ' + id + ' is not ID!');
				clients.push(null);
			}
		}
		await SheetDAO.setAllInfo(clients, i + 1, part);
	}
};

mainLoop(0, 100);
