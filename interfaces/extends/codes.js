module.exports = exports = {
    "0": "成功",
    "10000": "未查询到_id相关数据",
    "40000": "账号或验证码错误",
    "40001": "该手机号已存在",
    "40002": "该手机号不存在",
    "40003": "账号或密码错误",
    "40004": "没有该设备",
    "40005": "设备与所选类型设备不匹配",
    "40006": "房屋不存在",
    "40008": "户主不存在",
    "40009": "该用户不存在",
}
for (const key in exports) {
    let message = exports[key];
    exports[key] = {
        code: parseInt(key), message: message, data: function (data) {
            return { code: parseInt(key), message: message, data: data }
        }
    }
}