const request = require('./extends/request');
const code = require('./extends/codes');
const util = require('./extends/util');
/**
 * @interface 设备
 */
module.exports = exports = {
    /**
     * 获取直播地址
     * @title 获取直播地址
     * @api /device/live
     * @method get
     * @param deviceId string 设备ID
     * @param token string token
     * @verify deviceId token
     * @returns success JSON {code:0}
     */
    '/device/live': async (
        ctx, db,
        deviceId
    ) => {
        return code[0].data(await request("GET",{},util["deviceurl"]+`device/live?deviceId=${deviceId}`));
    },
    /**
     * 获取设备列表
     * @title 获取设备列表
     * @api /device/array
     * @method get
     * @param index string 页数
     * @param size string 数量
     * @param token string token
     * @verify token
     * @returns success JSON {code:0}
     */
    '/device/array': async (
        ctx, db,
        index,size
    ) => {
        if(!index) index = 1;
        if(!size) size = 100;
        return code[0].data(await request("GET",{},util["deviceurl"]+`device/array?page=${parseInt(index)}&pageSize=${parseInt(size)}`));
    },
    /**
     * 获取未关联设备列表
     * @title 获取未关联设备列表
     * @api /device/unlink/array
     * @method get
     * @param token string token
     * @verify token
     * @returns success JSON {code:0}
     */
    '/device/unlink/array': async (
        ctx, db
    ) => {
        return code[0].data(await request("GET",{},util["deviceurl"]+`device/unlink/array?deviceId=${deviceId}`));
    },
    /**
     * 获取设备截图
     * @title 获取设备截图
     * @api /device/capture
     * @method get
     * @param deviceId string 设备ID
     * @param token string token
     * @verify deviceId token
     * @returns success JSON {code:0}
     */
    '/device/capture': async (
        ctx, db,
        deviceId
    ) => {
        return code[0].data(await request("GET",{},util["deviceurl"]+`device/capture?deviceId=${deviceId}`));
    },
    /**
     * 解绑设备
     * @title 解绑设备
     * @api /device/unbind
     * @method get
     * @param deviceId string 设备ID
     * @param token string token
     * @verify deviceId token
     * @returns success JSON {code:0}
     */
    '/device/unbind': async (
        ctx, db,
        deviceId
    ) => {
        return code[0].data(await request("GET",{},util["deviceurl"]+`device/unbind?deviceId=${deviceId}`));
    },
    /**
     * 获取设备详情
     * @title 获取设备详情
     * @api /device/info/get
     * @method get
     * @param deviceId string 设备ID
     * @param token string token
     * @verify deviceId token
     * @returns success JSON {code:0}
     */
    '/device/info/get': async (
        ctx, db,
        deviceId
    ) => {
        return code[0].data(await request("GET",{},util["deviceurl"]+`device/info/get?deviceId=${deviceId}`));
    },
    /**
     * mode 每一位表示一个设置开关状态
     * 0 设备开关 1：开，0：关
     * 1 高清视频开关 1：开，0：关
     * 2 麦克风开关 1：开，0：关
     * 3 状态指示灯 1：开，0：关
     * 4 夜视开关 1：开，0：关，2：自动
     * 如：mode=11112
     * 设置设备信息
     * @title 设置设备信息
     * @api /device/info/set
     * @method get
     * @param deviceId string 设备ID
     * @param deviceName string 设备名称
     * @param mode 每一位表示一个设置开关状态
     * @param token string token
     * @verify deviceId token
     * @returns success JSON {code:0}
     */
    '/device/info/set': async (
        ctx, db,
        deviceId, deviceName, mode
    ) => {
        return code[0].data(await request("GET",{},util["deviceurl"]+`device/info/set?deviceId=${deviceId}&deivceName=${deviceName}&mode=${mode}`));
    },
    /**
     * 绑定设备
     * @title 绑定设备
     * @api /device/bind
     * @method get
     * @param modelName string 摄像头设备型号
     * @param wifiPassword string wifi密码
     * @param wifiSsid wifi名称
     * @param mode 0直接返回二维码 1返回二维码字符串 获取到单个或多个二维码(多个每2秒切换一次)，用于设备扫描绑定
     * @param token string token
     * @verify modelName wifiPassword wifiSsid token
     * @returns success JSON {code:0}
     */
    '/device/bind': async (
        ctx, db,
        modelName, wifiPassword, mode,wifiSsid
    ) => {
        const superagent = require("superagent");
        let result = await superagent.get(util["deviceurl"]+`device/bind?modelName=${modelName}&wifiPassword=${wifiPassword}&mode=${mode}&wifiSsid=${wifiSsid}`,{encoding:null});
        return result.body;
    },
}