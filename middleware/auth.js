import jwt from 'jsonwebtoken';
import config from '../config/conf.js';

const verifyToken = (req, res, next) => {
	const token = req.session.token;

	if (!token) {
		//return res.status(403).send('No token provided!');
		return res.redirect('/login');
	}

	jwt.verify(token, config.SECRET_KEY, (err, decoded) => {
		if (err) {
			return res.status(401).send('Unauthorized!');
		}
		req.userId = decoded.id;
		next();
	});
};
export default verifyToken;
