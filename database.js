
const {
    MongoClient,
    ObjectId,
    GridFSBucket
} = require('mongodb');
const config = require('./config.json');
var collection = {};
var __undefined = {};

//返回client 和 db
module.exports = exports = async function (uri) {
    if (!uri)
        uri = `mongodb://${config.user}:${config.pwd}@${config.online ? config.remote : '127.0.0.1'}:27017/AI_Fire`;
    if (collection[uri] && collection[uri].client.isConnected())
        return collection[uri];
    if (collection[uri]) collection[uri].client.close();
    return await new Promise((resolve, reject) => {
        MongoClient.connect(uri, {
            poolSize: 20,
            minSize: 10,
            autoReconnect: true,
            keepAlive: true,
            socketTimeoutMS: 0,
            reconnectTries: Number.MAX_VALUE,
            reconnectInterval: 1000,
            useNewUrlParser: true,
            useUnifiedTopology: true
        }, function (err, client) {
            if (err)
                reject(err);
            else {
                resolve(collection[uri] = warp(client.db(), client));
            }
        });
    });
    function warp(db, client) {
        db.client = client;
        db.ObjectId = ObjectId;
        db.tables = async function () {
            let result = [];
            (await db.collections()).forEach(t => result.push(t.collectionName));
            return result;
        }
        db.dropCollection = async _ => {
            await client.db().dropDatabase();
        }
        db.uuid = function (n) {
            let template = 'xxxyxxxyxxxyxxxy';
            if (n) {
                template = '';
                for (let i = 0; i < n; i++)
                    template += Math.random() > 0.5 ? 'x' : 'y';
            }
            return template.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0,
                    v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }
        return new Proxy(__undefined, {
            get: function (_, name, __) {
                if (db[name])
                    return db[name];
                else {
                    if (name.startsWith('fs-')) {
                        db[name] = new GridFSBucket(db, { bucketName: name.replace('fs-', '') });
                        return db[name];
                    }
                    let table = db.collection(name);
                    return table;
                }
            }
        })
    }
}