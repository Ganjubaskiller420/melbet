import { Router } from 'express';
import fs from 'fs';
import verifyToken from '../middleware/auth.js';
const router = Router();
router.route('/log').get(verifyToken, (req, res) => {
	if (fs.existsSync('log.bin')) {
		fs.readFile('log.bin', 'utf8', function (err, data) {
			res.send(JSON.stringify(data));
		});
	}
});
router.route('/deletelog').get(verifyToken, (req, res) =>
	fs.unlink('log.bin', function (err) {
		if (err) res.sendStatus(400);
		else res.sendStatus(200);
	})
);

export default router;
