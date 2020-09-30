const storage = require('./storage');

module.exports = exports = async (ctx, db, scope) => {
    //扩展
    //db
    scope.warp = function (data) {
        data.time = new Date().getTime();
        return data;
    }
    if (ctx.path.startsWith('/config')) return { code: 200 };
    if (ctx.path.startsWith('/document.json')) return { code: 200 };
    if (ctx.path.startsWith('/user/common/login')) return { code: 200 };
    if (ctx.path.startsWith('/user/install/login')) return { code: 200 };
    if (ctx.path.startsWith('/user/install/name/login')) return { code: 200 };
    if (ctx.path.startsWith('/user/property/login')) return { code: 200 };
    if (ctx.path.startsWith('/user/register')) return { code: 200 };
    if (ctx.path.startsWith('/user/sms/get')) return { code: 200 };
    //token判断
    if (!scope.token) return { code: 65280, message: "未授权使用此接口或授权信息未传递" };
    if (scope.token) {
        let user = await db.User_Manager.findOne({ token: scope.token, state: 1 });
        let user_install = await db.User_Install.findOne({ token: scope.token, state: 1 });
        let user_common = await db.User_Public.findOne({ token: scope.token, state: 1 });
        if (!user && !user_install && !user_common) return { code: 65280, message: "token已经失效/不存在/用户被禁止" };
        if (user) scope.master = user;
        if (user_install) scope.master = user_install;
        if (user_common) scope.master = user_common;
    }
    scope.role_id = async function (name) {
        let role = await db.Role.findOne({ name: { $regex: name }});
        if (role) return role._id;
        return;
    }

    return { code: 200 };
}