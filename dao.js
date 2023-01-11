import * as dotenv from 'dotenv';
import { google } from 'googleapis';
const env = dotenv.config();
const auth = new google.auth.GoogleAuth({
	keyFile: 'keys.json',
	scopes: 'https://www.googleapis.com/auth/spreadsheets',
});
//const client = auth.getClient(); uncomment and replace auth with client in line below
const service = google.sheets({ version: 'v4', auth: auth });

const columns = {
	totalDeposits: 'B',
	contact_closed: '',
	is_get_through: '',
	comment: '',
};

class SheetDAO {
	spreadsheetId = '';
	sheetName = '';
	writeCell = async (row, column, data) => {
		await service.spreadsheets.values.update({
			auth,
			spreadsheetId: this.spreadsheetId,
			range: `${sheetName}!${column}:${column}${row}`,
			valueInputOption: 'RAW',
			resource: {
				values: [[data]],
			},
		});
	};
	writeColumn = async (column, data, start, end) => {
		data = data.map((data) => {
			return [data];
		});
		await service.spreadsheets.values.update({
			auth,
			spreadsheetId: this.spreadsheetId,
			range: `${this.sheetName}!${column}${start}:${column}${end}`,
			valueInputOption: 'RAW',
			resource: {
				values: data,
			},
		});
	};
	setAllInfo = async (clients, partNum, partSize) => {
		let depositAmount = [];
		for (let i = 0; i < clients.length; i++) {
			if (clients[i] === null) {
				depositAmount.push('');
			} else {
				let totalDeposit = 0;
				let entities = clients[i].PaymentRequests.Entities;
				console.log(clients[i].PaymentRequests);
				if (entities.length > 0) {
					for (let j = 0; j < entities.length; j++) {
						console.log(entities[j].Amount);
						if (entities[j].Status === 8) {
							console.log('rec');
							totalDeposit += entities[j].Amount;
						}
					}
					console.log(`${entities[0].ClientId} has deposit ${totalDeposit}`);
					depositAmount.push(totalDeposit);
				} else {
					depositAmount.push('');
				}
			}
		}
		console.log('Info collected');
		await this.writeColumn(columns.totalDeposits, depositAmount, partNum, partNum + partSize);
		console.log('Recorded...');
	};
	getColumn = async (column) => {
		console.log('get column');
		const getValues = await service.spreadsheets.values.get({
			auth,
			spreadsheetId: this.spreadsheetId,
			range: `${this.sheetName}!${column}:${column}`,
		});
		return [].concat.apply([], getValues.data.values);
	};
	setInfo = async (client, row) => {
		let lastDepositDate = client.LastDepositDate;
		if (lastDepositDate !== undefined && lastDepositDate > fromDate) {
			await writeCell(row, columns.contact_closed, 'да');
			await writeCell(row, columns.comment, 'Есть депозит');
			await writeCell(row, columns.is_get_through, 'нет');
		}
	};
}
export default SheetDAO;
