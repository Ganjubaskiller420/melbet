import { ok } from 'assert';
import * as dotenv from 'dotenv';
import { Router } from 'express';
import fs from 'fs';
import { remotebuildexecution } from 'googleapis/build/src/apis/remotebuildexecution/index.js';
import verifyToken from '../middleware/auth.js';
import { getClientInfo } from '../middleware/clientinfo.js';
import { depositFinder } from '../middleware/depositFinder.js';
import { getDeposits } from '../middleware/deposits.js';
import { getIdBy } from '../middleware/getidby.js';

dotenv.config({ path: '../.env' });

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

router
	.route('/getidby')
	.get(verifyToken, (req, res) =>
		res.render('getidby', {
			login: req.session.login,
		})
	)
	.post(verifyToken, getIdBy, (req, res) => {
		res.render('success', {
			data: `https://docs.google.com/spreadsheets/d/${req.body.link}`,
			login: req.session.login,
		});
	});

router
	.route('/deposit_finder')
	.get(verifyToken, (req, res) =>
		res.render('deposit_finder', {
			login: req.session.login,
		})
	)
	.post(verifyToken, depositFinder, (req, res) => {
		res.render('success', {
			data: `https://docs.google.com/spreadsheets/d/${req.body.link}`,
			login: req.session.login,
		});
	});

router.route('/stop').get(verifyToken, (req, res) => {
	process.env.stop_script = 'true';
	res.sendStatus(200);
});

// router.route('/success_test').get(verifyToken, (req, res) => {
// 	res.render('success', {
// 		data: `https://docs.google.com/spreadsheets/d/1bZdMJgoVhboWwQ-CzN4TUTPlgXa-QNOmidPuOsyaK3s`,
// 		login: req.session.login,
// 	});
// });

export default router;
