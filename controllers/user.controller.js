import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import config from '../config/conf.js';
import User from '../models/user.js';

export const register = (req, res, next) => {
	const { login, password, confirmPassword, rememberMe } = req.body;
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		res.render('register', {
			login: req.session.login,
			errors: errors.array(),
			alreadyExists: false,
		});
		return;
	} else if (password !== confirmPassword) {
		errors.confirmPassword.msg = 'Passwords not equal';
		res.render('register', {
			login: req.session.login,
			errors: errors.array(),
			alreadyExists: false,
		});
		return;
	} else {
		User.findOne({ login: login }).then((result) => {
			if (result) {
				res.render('register', {
					login: req.session.login,
					errors: [],
					alreadyExists: true,
				});
				return;
			}
		});
	}

	User.create({
		login: login,
		password: bcrypt.hashSync(password),
	})
		.then(() => {
			if (rememberMe) {
				res.redirect(307, '/login');
			}
			next();
		})
		.catch((err) => {
			console.log(`Failed to register: ${err}`);
			return res.status(500).send('Error, try again later');
		});
};

export const login = (req, res, next) => {
	const { login, password } = req.body;
	User.findOne({ login: login })
		.then((user) => {
			if (user) {
				const originalHash = user.password;
				const isValidPassword = bcrypt.compareSync(password, originalHash);
				if (isValidPassword) {
					req.session.token = jwt.sign({ id: user.id }, config.SECRET_KEY, {
						expiresIn: 1000 * 60 * 60,
					});
					req.session.login = login;
				} else return res.status(401).send('Invalid password');
				next();
			} else return res.status(404).send('User not found');
		})
		.catch((err) => {
			console.log(`Failed to log in: ${err}`);
			return res.status(500).send('Error, try again later');
		});
};
