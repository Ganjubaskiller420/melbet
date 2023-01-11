import { Router } from 'express';
import { realtimebidding } from 'googleapis/build/src/apis/realtimebidding/index.js';
import verifyToken from '../middleware/auth.js';
import { getDeposits } from '../middleware/deposits.js';
const router = Router();

router
	.route('/deposits')
	.get((req, res) =>
		res.render('deposits', {
			login: req.session.login,
		})
	)
	.post(getDeposits, (req, res) => {
		res.render('success', {
			data: `https://docs.google.com/spreadsheets/d/${req.body.link}`,
			login: req.session.login,
		});
	});

// router.route('/success').get((req, res) => {
// 	res.render('success', {
// 		data: `https://docs.google.com/spreadsheets/d/${req.sheet}`,
// 		login: req.session.login,
// 	});
// });

export default router;
