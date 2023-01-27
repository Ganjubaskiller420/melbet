import { Router } from 'express';
import authRoutes from './auth.routes.js';
import operations from './operations.routes.js';

const router = Router();
router.use(operations);
router.use(authRoutes);

const modules = [
	{ name: 'Deposits', route: 'deposits' },
	{ name: 'Clients Info', route: 'clientinfo' },
	{ name: 'Get Id By', route: 'getidby' },
];

router.get('/', (req, res) => {
	res.render('main', {
		login: req.session.login,
		modules: modules,
	});
});

router.get('/login', (req, res) => {
	res.render('login', {
		login: req.session.login,
	});
});

export default router;
