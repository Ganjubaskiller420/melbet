import { Router } from 'express';
import authRoutes from './auth.routes.js';
import deposits from './deposits.routes.js';

const router = Router();
router.use(deposits);
router.use(authRoutes);
router.get('/', (req, res) => {
	res.render('main', {
		login: req.session.login,
	});
});

router.get('/login', (req, res) => {
	res.render('login', {
		login: req.session.login,
	});
});

export default router;
