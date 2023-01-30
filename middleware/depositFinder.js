import sheetDao from '../modules/dao.js';
import log from '../modules/logger.js';
console.log = log;
export const depositFinder = async (req, res, next) => {
	let body = req.body;

	body.deposit_column_1 = body.deposit_column_1.toUpperCase();
	body.deposit_column_2 = body.deposit_column_2.toUpperCase();
	body.id_column_1 = body.id_column_1.toUpperCase();
	body.id_column_2 = body.id_column_2.toUpperCase();

	sheetDao.spreadsheetId = body.link_2;
	sheetDao.sheetName = body.table_2;

	let ids_to = await sheetDao.getColumn(body.id_column_2);

	sheetDao.spreadsheetId = body.link_1;
	sheetDao.sheetName = body.table_1;

	let ids_from = await sheetDao.getColumn(body.id_column_1);
	let deposits_from = await sheetDao.getColumn(body.deposit_column_1);
	let deposits_to = [];

	sheetDao.spreadsheetId = body.link_2;
	sheetDao.sheetName = body.table_2;

	ids_to.forEach((id, index) => {
		if (Array(ids_from).includes(id)) {
			let dep = deposits_from[index];
			console.log(dep);
			deposits_to.push();
		} else deposits_to.push('-');
	});

	await sheetDao.writeColumn(deposit_column_2, deposits_to, 0, deposits_to.length);
	next();
};
