import { Router } from 'express';
import { realtimebidding } from 'googleapis/build/src/apis/realtimebidding/index.js';
import verifyToken from '../middleware/auth.js';
import { getClientInfo } from '../middleware/clientinfo.js';
import { getDeposits } from '../middleware/deposits.js';

const router = Router();

router
	.route('/deposits')
	.get(verifyToken, (req, res) =>
		res.render('deposits', {
			login: req.session.login,
		})
	)
	.post(verifyToken, getDeposits, (req, res) => {
		res.render('success', {
			data: `https://docs.google.com/spreadsheets/d/${req.body.link}`,
			login: req.session.login,
		});
	});

router
	.route('/clientinfo')
	.get(verifyToken, (req, res) =>
		res.render('clientinfo', {
			login: req.session.login,
		})
	)
	.post(verifyToken, getClientInfo, (req, res) => {
		res.render('success', {
			data: `https://docs.google.com/spreadsheets/d/${req.body.link}`,
			login: req.session.login,
		});
	});

export default router;
