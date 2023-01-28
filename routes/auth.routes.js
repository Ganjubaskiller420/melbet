import { Router } from 'express';
import { login, register } from '../controllers/user.controller.js';

const router = Router();
// router
// 	.route('/register')
// 	.get((req, res) =>
// 		res.render('register', {
// 			login: req.session.login,
// 			errors: [],
// 			alreadyExists: false,
// 		})
// 	)
// 	.post(register, (req, res) => {
// 		if (req.body.rememberMe) {
// 			res.redirect('/');
// 		} else res.redirect('/login');
// 	});
router
	.route('/login')
	.get((req, res) =>
		res.render('login', {
			login: req.session.login,
		})
	)
	.post(login, (req, res) => res.redirect('/'));

router.route('/logout').get((req, res) => {
	if (req.session.login) {
		req.session.destroy();
	}
	res.redirect('/');
});

export default router;
