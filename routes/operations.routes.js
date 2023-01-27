import { ok } from 'assert';
import { Router } from 'express';
import fs from 'fs';
import verifyToken from '../middleware/auth.js';
import { getClientInfo } from '../middleware/clientinfo.js';
import { getDeposits } from '../middleware/deposits.js';
import { getIdBy } from '../middleware/getidby.js';
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

router.route('/log').get(verifyToken, (req, res) =>
	fs.readFile('log.bin', 'utf8', function (err, data) {
		res.send(JSON.stringify(data));
	})
);
router.route('/deletelog').get(verifyToken, (req, res) =>
	fs.unlink('log.bin', function (err) {
		if (err) res.sendStatus(400);
		else res.sendStatus(200);
	})
);

export default router;
