
module.exports = exports = {
    GImg: async function GImg(path,name) {
        const db = await require('../../database')();
        return await new Promise((res, rej) => {
            let allbuf = [];
            db[`fs-${name}`].openDownloadStreamByName(path).
                on('data', buf => buf.forEach(t => allbuf.push(t))).
                on('end',  _ => {
                    res(Buffer.from(allbuf));
                }).
                on('error', error => {
                    console.log(error.message);
                    res('');
                });
        });
    },
    SImg: async function SImg(img, filename, name) {
        const db = await require('../../database')();
        // img = img.split('base64,')[1];
        return await new Promise((res, rej) => {
            let wr = db[`fs-${name}`].openUploadStream(filename);
            wr.write(Buffer.from(img, 'base64'));
            wr.end();
            wr.on('finish', _ => {
                res();
            }).on('error', _ => {
                res(false);
            })
        });
    }


}
