module.exports = exports = {
    /**
     * 获取文件信息
     */
    '/document.json': async _ => {
        let documents = [];
        let interfaces = require('./interfaces.json');
        let items = {};
        for (const key in interfaces) {
            if (interfaces[key].doc) {
                let title = interfaces[key].full.replace('./interfaces/', '').replace('.js', "");
                if (interfaces[key].inter) {
                    title = interfaces[key].inter;
                }
                !items[title] && (items[title] = { title: title, array: [] });
                items[title].array.push(interfaces[key].doc);
            }
        }
        for (const key in items)
            items[key].array.length > 0 && documents.push(items[key]);
        return {
            code: 0,
            data: documents,
            codes: require('./extends/codes')
        }
    },
    '/config.json': async_ => {
        return { code: 0, data: require('../config.json') };
    }
}