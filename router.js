const Koa = require('koa');
const Router = require('koa-router');
const convert = require('koa-convert');
const http = require('http');
const app = new Koa();
const router = new Router();
const server = http.Server(app.callback());
const vm = require('vm');
const header = "FLY/gz";

app.use(require('koa-compress')());
app.use(convert(require('koa-cors')()));
app.use(require('koa-static')('public'));
app.use(require('koa-body')({
    multipart: true,
    jsonLimit: "512MB",
    formLimit: "512MB",
    textLimit: "512MB",
    formidable: {
        maxFileSize: 200 * 1024 * 1024
    }
}));
app.use(router.routes()).use(router.allowedMethods());

const pako = {
    gzip: function (source) {
        const zlib = require('zlib');
        source == undefined && (source = "");
        try {
            let buffer = zlib.gzipSync(JSON.stringify(source));
            return buffer.toString('base64');
        } catch (error) {
            console.log(`Pako GZip Error ${error.message}`)
            return source;
        }
    },
    ungzip: function (source) {
        const zlib = require('zlib');
        source == undefined && (source = "");
        try {
            let buffer = Buffer.from(JSON.stringify(source), 'base64');
            let result = zlib.gunzipSync(buffer);
            return JSON.parse(result.toString());
        } catch (error) {
            console.log(`Pako UnGZip Error ${error.message}`)
            return source;
        }
    }
}

let interfaces = require('./interfaces/interfaces.json');

for (const key in interfaces) {
    const inter = interfaces[key];
    let fullargs = "";
    inter.args.forEach(t => {if(t) fullargs += t + ","});
    let script = new vm.Script(
        `__func__(${fullargs})`);
    router.all(key, async ctx => {
        try {
            ctx.compress = true;
            let scope = { __func__: require(inter.full)[key] };
            let tables = [];
            inter.args.forEach(t => {
                scope[t] = undefined;
                t.indexOf('$') != -1 && tables.push(t);
            });
            function args2v(item) {
                for (const key in item) {
                    if (item[key] == undefined) continue;
                    if (item[key] instanceof Object) {
                        item[key] = JSON.stringify(item[key]);
                    }
                    if (!Number.isInteger(item[key]) && item[key].trim().startsWith('{') &&
                        item[key].trim().endsWith('}')) {
                        try {
                            scope[key] = JSON.parse(item[key]);
                        } catch (error) {
                            scope[key] = item[key];
                        }
                    } else
                        scope[key] = item[key];
                }
            }
            args2v(ctx.params);
            args2v(ctx.query);
            args2v(ctx.request.body);
            args2v(ctx.request.files);
            scope.ctx = ctx;
            scope.db = await require('./database')();
            let auth = await (require('./interfaces/extends/auther')(ctx, scope.db, scope));
            if (auth.code != 200) {
                return ctx.body = auth;
            }
            ctx.scope = scope;
            ctx.storage = require('./interfaces/extends/storage');
            ctx.compress = true;
            ctx.verify = (params) => {
                let nohas = [];
                params.split(',').forEach(t => !scope[t] && nohas.push(t));
                if (nohas.length) return nohas;
            }
            ctx.sleep = async (delay) => await new Promise((res, _) => setTimeout(_ => res(), delay));
            ctx.uuid = (n) => {
                let template = 'xxxyxxxyxxxyxxxyxxxy';
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
            //解压
            for (const key in scope) {
                if (typeof (scope[key]) == 'string' && scope[key].startsWith(header)) {
                    scope[key] = pako.ungzip(scope[key].replace(header, ''));
                }
            }
            let doc = inter.doc;
            for (let i = 0; doc && i < doc.verify.length; i++) {
                let tmp = undefined;
                try {
                    tmp = eval(`scope.${doc.verify[i]}`);
                } catch{ }
                if (tmp == undefined) {
                    return ctx.body = { code: 0xF000, message: `参数${doc.verify[i]}为必传字段` }
                }
            }
            //处理_id
            if (scope._id) scope._id = scope.db.ObjectId(scope._id);
            let result = await script.runInContext(vm.createContext(scope));
            if (!result) result = require('./interfaces/extends/codes')[0];
            if (!scope.__debug__) {
                //压缩
                ctx.body = {
                    code: result.code,
                    message: result.message
                }
                if (result.data && typeof (result.data) != "function")
                    ctx.body.data = header + pako.gzip(result.data);
            } else
                ctx.body = result;
        } catch (error) {
            ctx.body = {
                code: 0xffff,
                message: error.stack
            }
        }
    });
}
module.exports = exports = port => server.listen(port);