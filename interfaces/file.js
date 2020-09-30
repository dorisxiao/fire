const code = require('./extends/codes');
const gridfs = require('./extends/fs');
const fs = require('fs');
/**
 * @interface 文件服务
 */
module.exports = exports = {
    /**
     * @title 获取文件列表
     * @api /file/array
     * @method get/post
     * @param token string Token
     * @param index int 第几页 0开始 默认0
     * @param count int 返回条数 默认30 -1为全部
     * @verify token
     * @returns success JSON {code:0,data:{}}
     * @returns error JSON 
     */
    '/file/array': async (
        ctx, db,
        index, count
    ) => {
        if (index) index = parseInt(index); else index = 0;
        if (count) count = parseInt(count); else count = 30;

        let pathes = fs.readdirSync(`${process.cwd()}/upload/`);
        pathes = pathes.sort((a, b) => {
            let as = fs.lstatSync(`${process.cwd()}/upload/${a}`);
            let bs = fs.lstatSync(`${process.cwd()}/upload/${b}`);
            return bs.atime.getTime() - as.atime.getTime();
        });
        let result = [];
        for (let i = index; i < count; i++) {
            if (!pathes[i]) break;
            let info = fs.lstatSync(`${process.cwd()}/upload/${pathes[i]}`);
            result.push({ name: pathes[i], time: info.atime.getTime() });
        }
        return code[0].data(result);
    },
    /**
     * @title 文件上传
     * @api /file/upload
     * @method get/post
     * @param token string Token
     * @param file file 文件
     * @verify token 
     * @returns success JSON {code:0,data:{}}
     * @returns error JSON 
     */
    '/file/upload': async (
        ctx, db,
        file
    ) => {
        let tmp = fs.readFileSync(file.path);
        fs.writeFileSync(`${process.cwd()}/public/upload/${file.name}`, tmp);
        let filename = `upload/${file.name}`;
        return code[0].data(filename);
    },
    /**
     * @title 文件上传
     * @api /file/girdfs/upload
     * @method get/post
     * @param token string Token
     * @param file file base64
     * @param fileName 文件名称
     * @param name 模块名称
     * @verify token file fileName name
     * @returns success JSON {code:0,data:{}}
     * @returns error JSON 
     */
    '/file/girdfs/upload': async (
        ctx, db,
        file,fileName,name
    ) => {
        let tmp = fs.readFileSync(file.path);
        let file_base64 = new Buffer(tmp).toString("base64");
        await gridfs.SImg(file_base64,file.name,name);
        return code[0].data(file.name);
    },
    /**
     * @title 获取文件
     * @api /file/girdfs/get
     * @method get/post
     * @param token string Token
     * @param fileName string 文件名称
     * @param name string 模块名称
     * @verify token fileName name
     * @returns success JSON {code:0,data:{}}
     * @returns error JSON 
     */
    '/file/girdfs/get': async (
        ctx, db,
        fileName,name
    ) => {
        let r = await gridfs.GImg(fileName,name);
        return r;
    },
    /**
     * @title 文件删除
     * @api /file/delete
     * @method get/post
     * @param token string Token
     * @param name string 文件名
     * @verify token 
     * @returns success JSON {code:0,data:{}}
     * @returns error JSON 
     */
    '/file/delete': async (
        ctx, db,
        name
    ) => {
        fs.unlinkSync(`${process.cwd()}/upload/${name}`);
        return code[0];
    },
    /**
     * @title 文件获取
     * @api /file/get/:path
     * @method get
     * @param token string Token
     * @verify token 
     * @returns success Stream
     * @returns error JSON 
     */
    '/file/get/:path': async (
        ctx, db,
        path
    ) => {
        ctx.scope.__debug__ = 1;
        return fs.readFileSync(`${process.cwd()}/upload/${path}`)
    }
}