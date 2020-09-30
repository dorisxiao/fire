const code = require('./extends/codes');
const { isArray } = require('util');
const { request } = require('http');
/**
 * @interface 普通用户接口
 */
module.exports = exports = {
    /**
     * 获取该家庭设备(house)
     * @title 获取该家庭设备
     * @api /user/common/device/list
     * @method get
     * @param _id string 房屋家庭ID
     * @param type int 类型 1 烟感 2 视频
     * @param token string token
     * @verify _id token
     * @returns success JSON {code:0,data:{array:[{number:"",location:""}]}}
     */
    '/user/common/device/list': async (
        ctx, db,
        _id, type
    ) => {
        // ？？根据类型查询是否需要
        let house = await db.House.findOne({ _id: _id }, { devices: 1 });
        return code[0].data({ array: house ? house.devices : [] });
    },
    /**
     * 获取用户详细信息
     * @title 获取用户详细信息(user)
     * @api /user/common/get
     * @method get
     * @param _id string 户主ID
     * @param token string token
     * @verify _id token
     * @returns success JSON {code:0,data:{name:"",phone:""}
     */
    '/user/common/get': async (
        ctx, db,
        _id
    ) => {
        return code[0].data(await db.User_Public.findOne({ _id: _id }));
    },
    /**
     * 用户新增家庭地址
     * 将新增家庭信息返回
     * 谁新增谁是户主
     * 
     * @title 用户新增家庭地址(house)(new)
     * @api /user/common/house/add
     * @method post
     * @param _id string 需新增家庭用户ID 户主
     * @param area_code string 县级代码
     * @param community string 社区
     * @param estate string 小区id
     * @param property string 物业
     * @param address string 详细地址
     * @param room_number string 楼栋号
     * @param protected string 受保护对象
     * @param contact string 紧急联系人
     * @param phone string 联系号码
     * @param contact_address string 联系地址
     * @param token string token
     * @verify _id area_code room_number address protected contact phone contact_address token
     * @returns success JSON {code:0,data:{}}
     */
    '/user/common/house/add': async (
        ctx, db,
        _id, area_code, community, estate, property, address, room_number, protected, phone, contact_address, contact, warp, area
    ) => {
        // 判断该用户是否存在
        let item = await db.User_Public.findOne({ _id: _id });
        if (!item) return code[40008];

        let house = { area_code, community, estate, property, address, room_number, protected, contact, phone, contact_address, area };
        house.user = {};
        house.user._id = (item._id).toString();
        house.user.name = item.name;
        house.user.phone = item.phone;// 谁新增谁是户主
        await db.House.save(warp(house));

        return code[0].data(house);
    },
    /**
     * 获取房屋详细信息
     * @title 获取房屋详细信息(house)
     * @api /user/common/houses/get
     * @method get
     * @param _id string 房屋id
     * @param token string token
     * @verify _id token
     * @returns success JSON {code:0,data:{number:"",location:""}
     */
    '/user/common/house/get': async (
        ctx, db,
        _id
    ) => {
        let house = await db.House.findOne({ _id: _id });
        return code[0].data(house);
    },
    /**
     * 获取该户主下所有用户
     * @title 获取该户主下所有用户(user)
     * @api /user/common/list
     * @method get
     * @param houseId string 房屋ID
     * @param token string token
     * @verify houseId token
     * @returns success JSON {code:0,data:{array:[{user:""}]}}
     */
    '/user/common/list': async (
        ctx, db,
        houseId
    ) => {
        let user = await db.House.findOne({ _id: db.ObjectId(houseId) }, { user: 1, family: 1 });
        return code[0].data({ array: user ? user.family : [], user: user ? user.user : {} });
    },
    /**
     * status 报警1 一键报警2 已接警3 已处置4 已完结5
     * 根据房屋ID查询所有用户ID
     * 再根据用户ID查询所有敬请信息
     * 获取该家庭所有报警信息
     * @title 获取该家庭所有报警信息(polices,Device_Polices)
     * @api /user/common/police/list
     * @method get
     * @param _id string 户主ID
     * @param token string token
     * @param index int 页码
     * @param size int 数量
     * @verify _id token
     * @returns success JSON {code:0,data:{array:[{number:"",type:""}]}}
     */
    '/user/common/police/list': async (
        ctx, db,
        _id, index, size
    ) => {
        if (index) index = parseInt(index); else index = 0;
        if (size) size = parseInt(size); else size = 10;
        let result = [], _ids = [], house = {};
        let houses = await db.House.find({ "user._id": _id }).toArray();
        for (const item of houses) {
            let houseId = (item._id).toString();
            _ids.push(houseId);
            house[houseId] = item.address;
        }
        let polices = await db.Device_Polices.find({ house: { $in: _ids } }).skip(index * size).limit(size).toArray();
        for (const item of polices) {
            let install = await db.Device_Installs.findOne({ device: item.device });
            result.push({ police: item, address: house[item.house], device: install });
        }
        return code[0].data(result);
    },
    /**
     * status 报警1 一键报警2 已接警3 已处置4 已完结5
     * 获取报警详情
     * @title 获取报警详情(polices,Device_Polices)
     * @api /user/common/police/get
     * @method get
     * @param _id string 警情编号ID
     * @param token string token
     * @verify _id token
     * @returns success JSON {code:0,data:{array:[{name:"",value:""}]}}
     */
    '/user/common/police/get': async (
        ctx, db, _id
    ) => {
        let police = await db.Device_Polices.findOne({ _id: _id });
        return code[0].data(police);
    },
    /**
     * 新增已有人员 和设备权限
     * 户主新增家庭成员
     * @title 户主新增家庭成员(house/user/Device_Permissions)
     * @api /user/common/add
     * @method post
     * @param _id string 房屋ID
     * @param devices JSON 可以查看的设备 [{device:"222",location:"名称",look:true}]
     * @param name string 名称
     * @param phone string 电话
     * @param token string token
     * @verify name phone token _id devices
     * @returns success JSON {code:0,data:{}}
     */
    '/user/common/add': async (
        ctx, db, _id, name, phone, devices, warp
    ) => {
        console.log(phone);
        let item = await db.User_Public.findOne({ phone: phone.trim() });
        if (!item) return code[40009];
        let house = await db.House.findOne({ _id: _id });
        if (!house) return code[40006];
        let family = { _id: (item._id).toString(), name: item.name, phone: item.phone };
        house.family = [family];
        // 新增家庭成员
        if (!house.family) await db.House.save(house);
        if (house.family && house.family instanceof Array) await db.House.update({ _id: _id }, { "$push": { family: family } });
        // 给新用户增加设备权限
        for (const i of JSON.parse(devices)) {
            console.log(i);
            let device = await db.Devices.findOne({ _id: db.ObjectId(i.device) });
            let user = { _id: (item._id).toString(), type: [1], look: i.look, location: i.location, number: i.number };//??设置常态下的设备权限时  应该赋予type什么权限
            await db.Devices.update({ _id: db.ObjectId(i._id) }, { "$push": { user: user } });

        }
        return code[0].data();
    },
    /**
    * 删除家庭成员
    * @title 删除家庭成员(user_public)
    * @api /user/common/remove
    * @method post
    * @param _id string 解绑用户ID
    * @param houseId string 房屋ID
    * @param token string token
    * @verify token _id houseId
    * @returns success JSON {code:0,data:{}}
    */
    '/user/common/remove': async (
        ctx, db, _id, houseId, warp
    ) => {
        await db.House.update({ _id: db.ObjectId(houseId) }, { "$pull": { family: { _id: _id.toString() } } }, { multi: true });
        // 移除该家庭成员 并移除它的权限
        await db.Devices.update({ "user._id": _id.toString() }, { "$pull": { user: { _id: _id.toString() } } }, { multi: true });
        return code[0].data();
    },
    /**
     * 修改姓名
     * @title 修改姓名(user)
     * @api /user/common/modify
     * @method post
     * @param name string 名称
     * @param imageurl string 头像
     * @param sex string 性别
     * @param _id string 用户ID
     * @param token string token
     * @verify _id token
     * @returns success JSON {code:0,data:{}}
     */
    '/user/common/modify': async (
        ctx, db, _id, name, warp, imageurl, sex
    ) => {
        let item = await db.User_Public.findOne({ _id: _id });
        if (!item) return code[40008];
        if (name) item.name = name;
        if (imageurl) item.imageurl = imageurl;
        if (sex) item.sex = sex;
        await db.User_Public.save(warp(item));
        return code[0].data();
    },
    /**
     * 获取消息
     * @title 获取消息(Message)
     * @api /user/common/message/list
     * @method get
     * @param _id string 家庭房屋ID
     * @param index int 页码 
     * @param size int 每页条数
     * @param token string token
     * @verify houseId index size token
     * @returns success JSON {code:0,data:{}}
     */
    '/user/common/message/list': async (
        ctx, db, _id, index, size
    ) => {
        if (index) index = index ? parseInt(index) : 0;
        if (count) size = size ? parseInt(count) : 10;
        let result = await db.Message.find({ user: _id }).skip(index * size).limit(size).toArray();
        let total = await db.Message.find({ user: _id }).count();
        return code[0].data({ array: result, total: total });
    },
    /**
     * 获取该户主所有家庭信息
     * @title 获取该户主所有家庭信息(house)
     * @api /user/common/house/list
     * @method get
     * @param _id string 户主ID
     * @param token string token
     * @verify _id token
     * @returns success JSON {code:0,data:{}}
     */
    '/user/common/house/list': async (
        ctx, db, _id
    ) => {
        let houses = await db.House.find({ "user._id": _id.toString() }).toArray();
        return code[0].data({ array: houses });
    },
    /**
     * 编辑家庭信息
     * @title 编辑家庭信息(house)
     * @api /user/common/house/modify
     * @method get
     * @param _id string 家庭ID
     * @param house json 修改对象
     * @param token string token
     * @verify _id house token
     * @returns success JSON {code:0,data:{}}
     */
    '/user/common/house/modify': async (
        ctx, db, _id, house, warp
    ) => {
        let item = await db.House.findOne({ _id: _id });
        if (!item) return code[10000];
        for (const key in house)
            item[key] = house[key];
        delete house._id;
        await db.House.save(warp(item));
        return code[0];
    },
    /**
     * 获取用户所有设备权限 
     * @title 获取用户所有设备权限(Devices)(new)
     * @api /user/common/permission/get
     * @method get
     * @param userId string 用户ID
     * @param houseId string 房屋ID
     * @param token string token
     * @verify userId token
     * @returns success JSON {code:0,data:{}}
     */
    '/user/common/permission/get': async (
        ctx, db, userId, houseId
    ) => {
        // 如果是户主查询所有设备
        let house = await db.House.findOne({ _id: db.ObjectId(houseId) });
        let permissions = [];
        if (house.user._id == userId) {
            permissions = house.devices;
        } else {
            let deviceId = [];
            house.devices.forEach(item => {
                deviceId.push(db.ObjectId(item._id));
            });
            permissions = await db.Devices.find({ _id: { "$in": deviceId }, "user._id": userId }).toArray();
            for (const item of permissions) {
                for (const pei of item.user) {
                    if (pei._id == userId) item.user = pei;
                }
            }
        }
        return code[0].data({ array: permissions });
    },
    /**
     * 根据房屋获取所有设备
     * 再获取权限
     * 获取该权限类型所有用户
     * @title 获取该权限类型所有用户
     * @api /user/common/permission/type
     * @method get
     * @param type int 类型 1实时视频 2图片 type 为0时 都无权限 
     * @param houseId string 房屋ID
     * @param token string token
     * @verify type token houseId
     * @returns success JSON {code:0,data:{}}
     */
    '/user/common/permission/type': async (
        ctx, db, type, houseId
    ) => {
        type = parseInt(type);
        let house = await db.House.findOne({ _id: db.ObjectId(houseId) });
        let deviceId = [];
        house.devices.forEach(item => {
            deviceId.push(db.ObjectId(item._id));
        });
        let roles = [], users = [], deviceIds = [];
        let permissions = await db.Devices.find({ _id: { "$in": deviceId } }, { _id: 1, user: 1, role: 1 }).toArray();
        permissions.forEach(item => {
            deviceIds.push((item._id).toString());
            item.user.forEach(user => {
                users.push(user);
            });
            item.role.forEach(role => {
                roles.push(role);
            });
        });
        return code[0].data({ array: { deviceId: deviceIds, users: users, roles: roles } });
    },
    /**
     * 修改用户常态下查看权限 
     * @title 修改用户查看权限(Device)（new）
     * @api /user/common/permission/modify
     * @method get
     * @param userId string 用户ID
     * @param devices array 设备ID ["998877"] 拿到的是什么 修改的时候就传什么参数
     * @param token string token
     * @verify userId devices token
     * @returns success JSON {code:0,data:{}}
     */
    '/user/common/permission/modify': async (
        ctx, db, userId, devices, warp
    ) => {
        for (const device of JSON.parse(devices)) {
            await db.Devices.update({_id: db.ObjectId(device.device), "user._id": userId},{"$push":{user:{_id:userId}}});
        }
        return code[0].data();
    },
    /**
     * 修改隐私设置
     * @title 修改隐私设置(Device)（new）
     * @api /user/common/privacy/modify
     * @method get
     * @param userId string 用户ID
     * @param device JSON 修改参数 ["998877"] 拿到的是什么 修改的时候就传什么参数
     * @param token string token
     * @verify userId device token
     * @returns success JSON {code:0,data:{}}
     */
    '/user/common/privacy/modify': async (
        ctx, db, userId, device, warp
    ) => {
        for (const item of device.deviceId) {
            let d = await db.Devices.findOne({ _id: db.ObjectId(item), "user._id": userId });
            d.user = device.user;
            d.role = device.role
            await db.Devices.save(warp(d));
        }
        return code[0].data();
    },
    /**
     * @title 一键报警
     * @api /user/common/police
     * @method post
     * @param content String 报警内容
     * @param device String 设备编号
     * @param user string 操作人
     * @param _id string 设备报警ID 
     * @verify content device user _id
     * @returns success JSON {code:0,data:{token:xxxxx}} 
     * @returns error JSON {code:90000,message:'错误信息!'}
     */
    '/user/common/police': async (
        ctx, db, warp,
        content, device, user, _id
    ) => {
        let police = { content: content, device: device, status: 2, user: user };
        await db.Polices.save(warp(police));
        let police_ = await db.Polices.findOne({ device: device, user: user });
        let device_ = await db.Device_Polices.findOne({ _id: _id });
        device_.police = police_._id;
        device_.status = 2;
        if (!device_.disposal) device_.disposal = [{ user: user, status: 2, time: police_.time }];
        if (device_.disposal && device_.disposal instanceof Array) device_.disposal.push({ user: user, status: 2, time: police_.time });
        await db.Device_Polices.save(warp(device_));
        //调用链路接口将警情信息发送到内网
        // superagent.post('https://gayd.sczwfw.gov.cn/').send({}).end();
        // await request("post",{},"https://gayd.sczwfw.gov.cn/");
        return code[0];
    },
    /**
     * (接口负责人：肖雪)
     * @title 获取区县
     * @api /area/array
     * @method get/post
     * @returns success JSON {code:0}
     * @returns error JSON {}
     */
    '/area/array': async (
        ctx, db
    ) => {
        let result = await db.Area_Code.find().toArray();
        result = listToTree(result);
        function listToTree(oldArr) {
            oldArr.forEach(element => {
                let parentAreaId = element.parent;
                element["label"] = element["name"];
                if (parentAreaId !== "0") {
                    oldArr.forEach(ele => {
                        if (ele.value == parentAreaId) {
                            //当内层循环的ID== 外层循环的parendId时，（说明有children），需要往该内层id里建个children并push对应的数组；
                            if (!ele.children) {
                                ele.children = [];
                            }
                            ele.children.push(element);
                        }
                    });
                }
            });
            oldArr = oldArr.filter(ele => ele.parent === "0"); //这一步是过滤，按树展开，将多余的数组剔除；
            return oldArr;
        }
        return code[0].data({ array: result });
    },
}
