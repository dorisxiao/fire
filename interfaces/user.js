const code = require('./extends/codes');
const crypto = require('crypto');
/**
 * @interface 用户
 */
module.exports = exports = {
    /**
     * 用户登录时根据TOken判断是否是首次登陆
     * 判断token是否存在 存在就是第一次登陆
     * @title 普通用户验证码登录
     * @api /user/common/login
     * @method post
     * @param phone string 手机号码
     * @param smsCode string 验证码
     * @verify phone smsCode
     * @returns success JSON {code:0,data:{token:xxxxx}} 登录成功后会返回用户token 其他字段见数据库文档
     * @returns error JSON {code:40000,message:'账号或验证码错误!'}
     */
    '/user/common/login': async (
        ctx, db,
        phone, smsCode, warp
    ) => {
        // 先判断用户是否存在
        let user = await db.User_Public.findOne({ phone: phone, state: 1 });
        if (!user) return code[40000];
        // 查询一分钟前的验证码
        let time = ((new Date().getTime()) - (60 * 1000));
        let verify = await db.Verification_Code.findOne({ phone: phone, code: smsCode, time: { $gt: time } });
        if (!verify) return code[40000];

        let first = false;
        // 判断是否有Token
        if (user.token) first = false;
        else first = true;
        user.token = db.uuid();
        await db.User_Public.save(warp(user));
        user.first = first;
        return code[0].data(user);
    },
    /**
    * 安装人员验证码登录
    * @title 安装人员验证码登录
    * @api /user/install/login
    * @method post
    * @param phone string 手机号码
    * @param smsCode string 验证码
    * @verify phone smsCode
    * @returns success JSON {code:0,data:{token:xxxxx}} 登录成功后会返回用户token 其他字段见数据库文档
    * @returns error JSON {code:40000,message:'账号或验证码错误!'}
    */
    '/user/install/login': async (
        ctx, db,
        phone, smsCode, warp
    ) => {
        // 先判断用户是否存在
        let user = await db.User_Install.findOne({ phone: phone, state: 1 });
        if (!user) return code[40000];
        // 查询一分钟前的验证码
        let time = ((new Date().getTime()) - (60 * 1000));
        let verify = await db.Verification_Code.findOne({ phone: phone, code: smsCode, time: { $gt: time } });
        if (!verify) return code[40000];
        user.token = db.uuid();
        await db.User_Install.save(warp(user));
        return code[0].data(user);
    },
    /**
    * 安装人员用户名登录
    * @title 安装人员用户名登录
    * @api /user/install/name/login
    * @method post
    * @param name string 用户名
    * @param pwd string 密码
    * @verify name pwd
    * @returns success JSON {code:0,data:{token:xxxxx}} 登录成功后会返回用户token 其他字段见数据库文档
    * @returns error JSON {code:40000,message:'账号或密码错误!'}
    */
    '/user/install/name/login': async (
        ctx, db,
        warp, pwd, name
    ) => {
        pwd = crypto.createHash('md5').update(pwd).digest("hex");
        // 先判断用户是否存在
        let user = await db.User_Install.findOne({ name: name, pwd: pwd, state: 1 });
        if (!user) return code[40003];
        user.token = db.uuid();
        await db.User_Install.save(warp(user));
        return code[0].data(user);
    },
    /**
     * 物业验证码登录
    * @title 物业验证码登录
    * @api /user/property/login
    * @method post
    * @param phone string 手机号码
    * @param smsCode string 验证码
    * @verify phone smsCode
    * @returns success JSON {code:0,data:{token:xxxxx}} 登录成功后会返回用户token 其他字段见数据库文档
    * @returns error JSON {code:40000,message:'账号或验证码错误!'}
    */
    '/user/property/login': async (
        ctx, db,
        phone, smsCode, warp
    ) => {
        // 先判断用户是否存在
        let user = await db.User_Manger.findOne({ phone: phone, state: 1 });
        if (!user) return code[40000];
        // 查询一分钟前的验证码
        let time = ((new Date().getTime()) - (60 * 1000));
        let verify = await db.Verification_Code.findOne({ phone: phone, code: smsCode, time: { $gt: time } });
        if (!verify) return code[40000];
        user.token = db.uuid();
        await db.User_Manger.save(warp(user));
        return code[0].data(user);
    },
    /**
     * @title 户主注册
     * @api /user/register
     * @method post
     * @param name string 用户姓名
     * @param phone string 用户手机号
     * @param imageurl string 头像
     * @verify name phone
     * @returns success JSON {code:0,data:{}} 登录成功后会返回用户token 其他字段见数据库文档
     * @returns error JSON {code:40001,message:'该手机号已存在!'}
     */
    '/user/register': async (
        ctx, db,
        name, phone, warp,imageurl
    ) => {
        // 先判断用户是否存在
        let user_ = await db.User_Public.findOne({ phone: phone, state: 1 });
        if (user_) return code[40001];
        let user = {};
        user.name = name;
        user.phone = phone;
        user.state = 1;
        if(imageurl) user.imageurl = imageurl;
        user.time = new Date().getTime();
        await db.User_Public.save(warp(user));
        return code[0].data();
    },
    /**
     * @title 获取验证码
     * @api /user/sms/get
     * @method post
     * @param phone string 用户手机号
     * @verify phone
     * @returns success JSON {code:0,data:{}} 登录成功后会返回用户token 其他字段见数据库文档
     * @returns error JSON {code:40001,message:'该手机不存在!'}
     */
    '/user/sms/get': async (
        ctx, db,
        phone, warp
    ) => {
        // 先判断用户是否存在
        let user_1 = await db.User_Public.findOne({ phone: phone, state: 1 });
        let user_2 = await db.User_Manger.findOne({ phone: phone, state: 1 });
        let user_3 = await db.User_Install.findOne({ phone: phone, state: 1 });
        if (!user_1 && !user_2 && !user_3) return code[40002];
        let smsCode = await db.Verification_Code.findOne({ phone: phone });
        if (!smsCode) smsCode = {};
        // 获取验证码发送短信
        let code_ = "111166";
        // 
        smsCode.code = code_;
        smsCode.phone = phone;
        await db.Verification_Code.save(warp(smsCode));// 有就修改 无增加
        return code[0].data(smsCode);
    },
    /**
     * @title 获取所有角色
     * @api /user/role/list
     * @method get
     * @param token string token
     * @verify token
     * @returns success JSON {code:0,data:{}}
     */
    '/user/role/list': async (
        ctx, db
    ) => {
        return code[0].data({ array: await db.Role.find().toArray() });
    }
}