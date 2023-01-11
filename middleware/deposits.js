import SheetDAO from '../dao.js';
import deposit from '../deposit.js';
import token from '../getToken.js';
let accessToken;
const sheetDao = new SheetDAO();
export const getDeposits = async (req, res, next) => {
	console.log(req.body);
	let pref = req.body;
	pref.hasDep = pref.hasDep.toUpperCase();
	pref.depSum = pref.depSum.toUpperCase();
	pref.from += 'T00:00:00.000Z';
	pref.to += 'T00:00:00.000Z';
	sheetDao.spreadsheetId = pref.link;
	sheetDao.sheetName = pref.table;
	processDeposits(parseInt(pref.start), parseInt(pref.part), pref.from, pref.to, pref.id_column, pref.google2fa);
	next();
};
function isId(id) {
	return /^\d{9}$/.test(id);
}
// console.log = function (info) {
// 	let out = document.getElementById('output');
// 	out.textContent += info;
// };
const processDeposits = async (start, part, from_date, to_date, id_column, google2fa) => {
	let index;
	accessToken = await token.initialize(google2fa).then(() => {
		return token.getToken();
	});
	const ids = await sheetDao.getColumn(id_column);

	for (let i = start; i < ids.length; i += part) {
		console.log(' ' + i + ' - ' + (i + part));
		let clients = [];
		for (let j = 0; j < part; j++) {
			index = i + j;
			let id = ids[index];
			if (isId(id)) {
				console.log(index + ': ' + id);
				await deposit.getDepositData(id, from_date, to_date, accessToken).then((client) => {
					clients.push(client);
				});
			} else {
				console.log(index + ': ' + id + ' is not ID!');
				clients.push(null);
			}
		}
		await sheetDao.setAllInfo(clients, i + 1, part);
	}
};
