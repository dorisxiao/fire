require('./router')(require('./config').bind);
// require('./auto.level');
// !require('./config').online && require('./database.sync');

try {
    require('fs').mkdirSync('upload');
} catch { }
