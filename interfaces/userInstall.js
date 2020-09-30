const code = require('./extends/codes');
/**
 * @interface 安装人员接口
 */
module.exports = exports = {
    /**
     * 根据人员ID获取设备编号 根据设备编号获取房屋编号 再获取房屋信息
     * 根据状态(安装、维护)分别查询总数 安装中1 安装完成2 维护中3 status
     * 获取今日安装人员设备列表(Device_Installs/Devices/House)
     * @title 获取今日安装人员设备列表
     * @api /user/install/device/list
     * @method get
     * @param userId string 安装师傅ID
     * @param index string 安装师傅ID
     * @param size string 安装师傅ID
     * @param token string token
     * @verify userId token
     * @returns success JSON {code:0,data:{array:[{number:"",address:""}],installcount:100,maintaincount:100}}
     */
    '/user/install/device/list': async (
        ctx, db,
        userId, index, size
    ) => {
        if (index) index = parseInt(index);
        if (size) size = parseInt(size);
        let day = new Date();
        let hour_24 = new Date(day.getFullYear() + "-" + (day.getMonth() + 1) + "-" + day.getDate() + " 0:0:0").getTime();
        let hour_ = new Date(day.getFullYear() + "-" + (day.getMonth() + 1) + "-" + day.getDate() + " 23:59:59").getTime();
        let device_install = [],totalCount = 0;
        if (index && size) {
            device_install = await db.Device_Installs.find({ user: userId }).sort({ time: -1 }).skip(index * size).limit(size).toArray();
            totalCount = await db.Device_Installs.find({ user: userId }).count();
        } else {
            device_install = await db.Device_Installs.find({ user: userId, time: { $gte: hour_24, $lte: hour_ } }).toArray();
        }
        let list = [];
        for (let item of device_install) {
            let obj = {};
            let device = await db.Devices.findOne({ _id: db.ObjectId(item.device) });
            obj.number = device ? device.number : "";
            let house = await db.House.findOne({ _id: db.ObjectId(item.house) });
            obj.address = house ? house.address : "";
            obj.status = item.status;
            obj.location = item.location;
            list.push(obj);
        }
        let installcount = await db.Device_Installs.find({ user: userId, time: { $gte: hour_24, $lte: hour_ }, status: { $in: [1, 2] } }).count();
        let maintaincount = await db.Device_Installs.find({ user: userId, time: { $gte: hour_24, $lte: hour_ }, status: 3 }).count();
        return code[0].data({ array: list, installcount: installcount, maintaincount: maintaincount,totalCount:totalCount });
    },
    /**
     * 根据手机号查出用户信息id 根据用户ID查询房屋列表
     * 根据手机号获取用户信息和用户家庭信息
     * @title 根据手机号获取用户信息和用户家庭信息(user/house)
     * @api /user/install/houses/list
     * @method get
     * @param phone string 用户手机号
     * @param token string token
     * @verify phone token
     * @returns success JSON {code:0,data:{name:"",house:[{room_number:"12-1-2102",address:""}]}}
     */
    '/user/install/houses/list': async (
        ctx, db,
        phone
    ) => {
        let user = await db.User_Public.findOne({ phone: { $regex: phone } }, { phone: 1, name: 1, _id: 1, houses: 1 });
        return code[0].data(user);
    },
    /**
     * 用户新增家庭地址
     * @title 用户新增家庭地址(house)(new)
     * @api /user/install/houses/add
     * @method post
     * @param _id string 户主ID
     * @param name string 名称
     * @param area_code string 县编码
     * @param community string 社区
     * @param estate string 小区id
     * @param property string 物业id
     * @param address string 详细地址
     * @param room_number string 楼栋号
     * @param token string token
     * @verify _id provincial room_number address token
     * @returns success JSON {code:0,data:{}}
     */
    '/user/install/house/add': async (
        ctx, db, warp, role_id,
        _id, name, area_code, community, estate, property, address, room_number
    ) => {
        area_code = parseInt(area_code);
        let item = await db.User_Public.findOne({ _id: _id });
        if (!item) return code[40008];
        let house = {area_code,name,community,estate,property,address,room_number};
        await db.House.save(warp(house));
        // 更新房屋信息
        let houses = [];
        houses.push(warp(house));
        item.role = await role_id("户主");
        if (item.houses && item.houses instanceof Array) {
            item.houses.forEach(element => {
                houses.push(element);
            });
        }
        item.houses = houses;
        await db.User_Public.save(warp(item));
        return code[0].data(house);
    },
    /**
     * 
     * 获取某地区下的所有小区
     * @title 获取某地区下的所有小区(Community)(new)
     * @api /user/install/community/list
     * @method get
     * @param area_code string 县级代码
     * @param token string token
     * @verify provincial city district token
     * @returns success JSON {code:0,data:{}}
     */
    '/user/install/community/list': async (
        ctx, db,
        area_code
    ) => {
        area_code = parseInt(area_code);
        let result = await db.Community.find({ area_code: area_code }).toArray();
        return code[0].data({ array: result });
    },
    /**
     * 
     * 根据房屋信息获取已安装设备
     * @title 根据房屋信息获取设备(house)
     * @api /user/install/house/list
     * @method get
     * @param _id string 房屋id
     * @param token string token
     * @verify _id token
     * @returns success JSON {code:0,data:{array:[{number:"",location:""}]}}
     */
    '/user/install/house/list': async (
        ctx, db,
        _id
    ) => {
        let house = await db.House.findOne({ _id: _id }, { _id: 1, devices: 1 });
        return code[0].data({ array: house ? house.devices : {} });
    },
    /**
     * 安装中1 安装完成2 维护中3 status
     * 安装设备
     * @title 安装设备(Device_Installs)
     * @api /user/install/device/add
     * @method post
     * @param location string 安装位置
     * @param deviceNumber string 设备编号
     * @param userId string 安装师傅ID
     * @param type int 类型 1烟感 2视频
     * @param remark string 备注
     * @param _id string 房屋ID
     * @param token string token
     * @verify location userId _id token deviceNumber
     * @returns success JSON {code:0,data:{}}
     */
    '/user/install/device/add': async (
        ctx, db, warp,
        userId, location, remark, _id, deviceNumber
    ) => {
        // 更新房屋设备记录
        let device_ = await db.Devices.findOne({ number: deviceNumber }, { _id: 1, number: 1, type: 1 });
        if (!device_) return code[40004];
        let house = await db.House.findOne({ _id: _id }, { _id: 1, devices: 1 });
        if (!house) return code[40006];
        let device = {};
        device.device = (device_._id).toString();
        device.user = userId;
        device.location = location;
        device.remark = remark;
        device.status = 2;
        device.house = _id.toString();
        device.type = device_.type;
        await db.Device_Installs.save(warp(device));
        let devices = [];
        device.number = deviceNumber;
        devices.push(warp(device));
        if (house.devices && house.devices instanceof Array) {
            house.devices.forEach(element => {
                devices.push(element);
            });
        }
        house.devices = devices;
        await db.House.save(warp(house));
        return code[0].data(device);
    },
    /**
     * 根据设备编号获取设备信息
     * @title 根据设备编号获取设备信息(Device)
     * @api /user/install/device/get
     * @method get
     * @param number string 设备编号
     * @param token string token
     * @verify number token
     * @returns success JSON {code:0,data:{array:[{number:"",type:""}]}}
     */
    '/user/install/device/get': async (
        ctx, db,
        number
    ) => {
        let result = [];
        let devices = await db.Devices.find({ number: { $regex: number } }).toArray();
        for (const item of devices) {
            let ins = await db.Device_Installs.findOne({ device: item._id });
            if (!ins) result.push(item);
        }
        return code[0].data({ array: result });
    },
    /**
     * 根据设备编号获取设备详情
     * @title 根据设备编号获取设备详情(Device)
     * @api /user/install/device/info
     * @method get
     * @param number string 设备编号
     * @param token string token
     * @verify number token
     * @returns success JSON {code:0,data:{array:[{number:"",type:""}]}}
     */
    '/user/install/device/info': async (
        ctx, db,
        number
    ) => {
        let install = {};
        let device = await db.Devices.findOne({ number: number });
        if (device) install = await db.Device_Installs.findOne({ device: device._id });
        device["location"] = install.location;
        return code[0].data(device);
    },
    /**
     * 获取安装位置
     * @title 获取安装位置(User_Type)
     * @api /user/device/locations
     * @method get
     * @param _id string 户主ID
     * @param token string token
     * @verify _id token
     * @returns success JSON {code:0,data:{array:[{name:"",value:""}]}}
     */
    '/user/device/locations': async (
        ctx, db, _id
    ) => {
        let locations = await db.User_Type.find({ user: _id }).toArray();
        return code[0].data({ array: locations });
    },
    /**
     * 新增安装位置
     * @title 新增安装位置(User_Type)
     * @api /user/device/locations/add
     * @method post
     * @param _id string 户主ID
     * @param name string 名称
     * @param value string 值
     * @param token string token
     * @verify value _id token
     * @returns success JSON {code:0,data:{}}
     */
    '/user/device/locations/add': async (
        ctx, db, _id, value, warp
    ) => {
        let type = {};
        type.name = db.uuid();
        type.value = value;
        type.user = _id;
        type.type = 0;
        await db.User_Type.save(warp(type));
        return code[0].data();
    },
    /**
     * 安装维护反馈
     * @title 安装维护反馈(feedback)
     * @api /user/device/feedback/add
     * @method post
     * @param deviceId string 设备ID
     * @param info string 反馈信息
     * @param remark string 备注
     * @param userId string 维护ID
     * @param imageUrl array 图片地址
     * @param token string token
     * @verify userId info deviceId token
     * @returns success JSON {code:0,data:{}}
     */
    '/user/device/feedback/add': async (
        ctx, db, userId, deviceId, info, remark, warp, imageUrl
    ) => {
        let feedback = {};
        feedback.device = deviceId;
        feedback.info = info;
        feedback.user = userId;
        feedback.remark = remark;
        feedback.imageUrl = imageUrl;
        await db.Feedback.save(warp(feedback));
        return code[0].data(feedback);
    },
    /**
     * 获取设备维护反馈
     * @title 获取设备维护反馈(feedback)
     * @api /user/device/feedback/list
     * @method get
     * @param deviceId string 设备ID
     * @param index int 页码 
     * @param size int 每页条数
     * @param token string token
     * @verify token deviceId
     * @returns success JSON {code:0,data:{}}
     */
    '/user/device/feedback/list': async (
        ctx, db, deviceId, index, size
    ) => {
        if (index) index = parseInt(index); else index = 0;;
        if (size) size = parseInt(count); else size = 10;
        let feedbacks = await db.Feedback.find({ device: deviceId }).skip(index * size).limit(size).toArray();
        let result = [];
        for (const item of feedbacks) {
            let user = await db.User_Install.findOne({ _id: db.ObjectId(item.user) }, { _id: 1, name: 1, phone: 1 });
            if (user) {
                item.name = user.name;
                item.phone = user.phone;
            }
            result.push(item);
        }
        return code[0].data({ array: result });
    }
}