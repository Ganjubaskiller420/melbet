import bodyParser from 'body-parser';
import { default as connectMongoDBSession } from 'connect-mongodb-session';
import cookieParser from 'cookie-parser';
import ejsMate from 'ejs-mate';
import express from 'express';
import session from 'express-session';
import fs from 'fs';
import { MongoClient } from 'mongodb';
import mongoose from 'mongoose';
import path from 'path';
import config from './config/conf.js';
import router from './routes/routes.js';

const MongoDBStore = connectMongoDBSession(session);

const app = express();
const __dirname = path.resolve();
app.set('view engine', 'ejs');
app.engine('ejs', ejsMate);
app.set('port', config.PORT);

app.use(express.json());
app.use(bodyParser.json());
app.use(
	bodyParser.urlencoded({
		extended: true,
	})
);
const run = () => {
	app.use(
		session({
			secret: config.SECRET_KEY,
			cookie: {
				maxAge: 1000 * 60 * 60 * 24,
			},
			store: new MongoDBStore({
				uri: config.CONNECTION_STRING,
				collection: 'sessions',
				databaseName: 'bookmaker-script',
			}),
			resave: true,
			saveUninitialized: true,
		})
	);
	app.use(router);
	app.use(express.static(path.resolve(__dirname, 'views')));

	app.listen(config.PORT, console.log(`http://localhost:${config.PORT}`));
};

mongoose
	.connect(config.CONNECTION_STRING)
	.then(() => run())
	.catch((err) => console.log(`Failed to connect. Error: ${err}`));

MongoClient.connect(config.CONNECTION_STRING, function (err, db) {
	if (err) throw err;
	let keysDB = db.db('keys');
	//keysDB.collection('google_keys').insertOne(keys);
	keysDB
		.collection('google_keys')
		.findOne({}, {})
		.then((obj) => {
			delete obj._id;
			fs.writeFileSync('keys.json', JSON.stringify(obj));
		});
});
