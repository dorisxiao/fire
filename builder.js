function transform(text) {
    let docs = text.match(/\/\*\*([\s\S]*?)\*\//g);
    let result = {
        inter: ""
    };
    if (!docs) return;
    docs.forEach(doc => {
        if (doc.indexOf('@interface') != -1) {
            doc.split('\n').forEach(t => {
                t = t.replace("/**", "").replace("*/", "").replace("*", "").trim();
                if (t.startsWith("@interface")) result.inter = t.replace("@interface", "").trim();
            });
        }
        if (doc.indexOf('@api') == -1) return;
        let scope = doc.split('\n');
        let item = {
            note: '',    //注释
            title: '',   //标题
            api: '',     //路由
            method: '',  //请求方式
            param: [],          //参数列表
            verify: [],         //校验的字段
            returns: {
                success: '', //返回成功
                error: '',   //返回失败
            }
        }
        scope.forEach(tmp => {
            tmp = tmp.replace("/**", "").replace("*/", "").replace("*", "").trim();
            if (tmp == "" || tmp == undefined) return;
            if (tmp.startsWith("@title"))
                return item.title = tmp.replace("@title", "").trim();
            if (tmp.startsWith("@api"))
                return item.api = tmp.replace("@api", "").trim();
            if (tmp.startsWith("@method"))
                return item.method = tmp.replace("@method", "").trim();
            if (tmp.startsWith("@param")) {
                let ps = tmp.replace("@param", "").trim().split(' ');
                let param = { key: ps[0], note: "", type: ps[1] };
                if (ps.length >= 2) {
                    for (let i = 2; i < ps.length; i++)param.note += ps[i] + " ";
                }
                return item.param.push(param);
            }
            if (tmp.startsWith("@verify")) {
                tmp.replace("@verify", "").trim().split(" ").forEach(t => {
                    t != "" && item.verify.push(t);
                });
                return;
            }
            if (tmp.startsWith("@returns")) {
                let returns = tmp.replace("@returns", "").trim().split(" ");
                !item.returns[returns[0]] && (item.returns[returns[0]] = "");
                for (let i = 1; i < returns.length; i++)
                    item.returns[returns[0]] += " " + returns[i];
                return;
            }
            item.note += `${tmp}\r\n`;
        });
        result[item.api] = item;
    });
    return result;
}
let path = `${process.cwd()}/interfaces`;
let interfaces = {};
require('fs').readdirSync(path).forEach(t => {
    if (!t.endsWith('.js')) return;
    let inter = require(`${path}/${t}`);
    let text = require('fs').readFileSync(`${path}/${t}`).toString();
    let docs = transform(text);
    if (!docs) return;
    for (const key in inter) {
        const func = inter[key];
        let args = func.toString().match(/async\s*\w*\(([\s\S]*?)\)/);
        if (!args) { args = [] };
        if (args[1]) {
            let tmp = args[1].split(',');
            args = [];
            tmp.forEach(t => args.push(t.trim()));
        }
        interfaces[key] = {
            full: `./interfaces/${t}`,
            args: args,
            doc: docs[key],
            inter: docs.inter
        }
    }
});
require('fs').writeFileSync(`${process.cwd()}/interfaces/interfaces.json`, JSON.stringify(interfaces));
