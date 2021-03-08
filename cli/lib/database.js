const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const { ShowWarning }  = require('./show-warning');


class Database {
	/*
	 * Standard Constructor is Standard
	 */
	constructor() {
		this.dbURL = 'mongodb://127.0.0.1:27017';
		this.dbName = 'fontfool';
		this.db;
		this.client;
		MongoClient.connect(this.dbURL, {
			useUnifiedTopology: true,
			useNewUrlParser: true
		}, (err, client) => {
			if (err) {
				throw err;
				console.log(`Critical error: Couldn't connect to DB`, err);
				process.exit(0);
			}
			this.client = client;
			this.db = this.client.db(this.dbName);
		});
	}

	close = () => {
		this.client.close();
	}

	connectionEstablished = async () => {
		return new Promise(async resolve => {
			const interval = setInterval(() => {
				if (this.db) {
					clearInterval(interval);
					resolve();
				}
			}, 500);
		});
	}

	recordError = async (messageObj) => {
		const errColl = this.db.collection('errors');
		errColl.insertOne(messageObj);
	}

	addFont = async (fontData) => {
		return new Promise(async (resolve, reject) => {
			await this.addIndex(fontData);
			const fontCollection = this.db.collection('fonts');
			// check to see if this font is already in collection
			const docs = await this.findIndex(fontData.md5sum, fontCollection);
			// if not indexed insert it
			if (!docs) {
				await fontCollection.insertOne(fontData, (err, result) => {
					if (err) {
						console.log('addFont method failed', err);
						process.exit(0);
					}
					resolve();
				});
			} else {
				resolve();
			}
		});
	}

	findIndex = async ( md5, collection ) => {
		return new Promise(async (resolve, reject) => {
			const index = await collection.findOne({
				md5sum: md5
			});

			resolve(index || false);
		});
	};

	addIndex = async ( fontData ) => {
		return new Promise(async (resolve, reject) => {
			const indexCollection = this.db.collection('index');
			// check to see if this font is already indexed
			const docs = await this.findIndex(fontData.md5sum, indexCollection);

			const fontIndex = {
				hidden: false,
				favorite: false,
				md5sum: fontData.md5sum,
				name: fontData.fontName,
				size: fontData.size
			};
			// if not indexed insert it
			if (!docs) {
				await indexCollection.insertOne(fontIndex, (err, result) => {
					if (err) {
						console.log('addFont method failed', err);
						process.exit(0);
					}
				});
				resolve();
			} else {
				resolve();
			}
		});
	}

}

module.exports = Database;
