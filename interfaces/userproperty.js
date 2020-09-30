const code = require('./extends/codes');
const user = require('./user');
/**
 * @interface 物业人员接口
 */
module.exports = exports = {
    /**
     * 获取物业所有小区数
     * @title 获取物业所有小区数(Community)
     * @api /user/property/estate/list
     * @method get
     * @param _id string 物业ID
     * @param token string token
     * @verify _id token
     * @returns success JSON {code:0,data:{array:[{estate:""}]}}
     */
    '/user/property/estate/list': async (
        ctx, db,
        _id
    ) => {
        let communitys = await db.Community.find({property:_id}).toArray();
        let users = await db.House.find({property:_id}).count();
        return code[0].data({ array:communitys,count:communitys.length ,user_count:users});
    },
    /**
     * @title 获取所有小区(community)
     * @api /user/property/community/list
     * @method get
     * @param _id string 物业ID
     * @param token string token
     * @verify _id token
     * @returns success JSON {code:0,data:{array:[{estate:""}]}}
     */
    '/user/property/community/list': async (
        ctx, db,
        _id
    ) => {
        let result = [];
        // 查出所有小区
        let communitys = await db.Community.find({property:_id}).toArray();
        // 查出小区所有房屋数
        for (const item of communitys) {
            let obj = {};
            let houses = await db.House.find({community:item._id}).count();
            obj.name = item.name;
            obj.count = houses;
            result.push(obj);
        }
        return code[0].data({array:result});
    },
    /**
     * 获取物业所有小区住户
     * @title 获取物业所有小区住户(estate)
     * @api /property/community/user/list
     * @method get
     * @param _id string 物业ID
     * @param communityId string 小区ID
     * @param token string token
     * @verify _id communityId token
     * @returns success JSON {code:0,data:{array:[{estate:""}]}}
     */
    '/user/property/community/user/list': async (
        ctx, db,
        _id, communityId
    ) => {
        let result = [];
        let houses = await db.House.find({community:communityId,property:_id}).toArray();
        for (const item of houses) {
            let obj = {};
            let user = await db.User_Public.findOne({"User_Public.houses._id":item._id});
            obj.room_number = item.room_number;
            obj.user = user;
            result.push(obj);
        }
        return code[0].data({array:result});
    },
    /**
     * 用户新增小区
     * @title 用户新增小区(Community)
     * @api /user/property/community/add
     * @method post
     * @param userId string 需新增小区物业ID
     * @param provincial string 省
     * @param city string 市
     * @param district string 区
     * @param community string 社区
     * @param estate string 小区
     * @param property string 物业
     * @param address string 详细地址
     * @param room_number string 楼栋号
     * @param estate_people string 小区联系人
     * @param peoplePhone string 小区联系人电话
     * @param imageUrl string 图片路径
     * @param token string token
     * @verify userId provincial city district room_number address estate token
     * @returns success JSON {code:0,data:{}}
     */
    '/user/property/community/add': async (
        ctx, db,warp,
        userId, provincial, city, district, community, estate, property, address, room_number, estate_people, peoplePhone,imageUrl
    ) => {
        let comm = {};
        comm.property = userId;
        comm.provincial = provincial;
        comm.city = city;
        comm.district = district;
        comm.community = community;
        comm.estate = estate;
        comm.property = property;
        comm.address = address;
        comm.room_number = room_number;
        comm.estate_people=estate_people;
        comm.peoplePhone = peoplePhone;
        comm.imageUrl = imageUrl;
        await db.Community.save(warp(comm));
        return code[0].data();
    },
    /**
     * 
     * 获取小区详细信息
     * @title 获取小区详细信息(Community)
     * @api /user/property/community/get
     * @method get
     * @param _id string 小区id
     * @param token string token
     * @verify _id token
     * @returns success JSON {code:0,data:{}}
     */
    '/user/property/community/get': async (
        ctx, db,
        _id
    ) => {
        return code[0].data(await db.Community.findOne({_id:_id}));
    },
    /**
     * 根据物业查出所有报警设备
     * 在查处报警详情
     * 获取该物业管理所有报警信息
     * @title 获取该物业管理所有报警信息(house,Polices)
     * @api /property/polices/list
     * @method get
     * @param _id string 物业ID
     * @param index string 页码
     * @param size string 每页条数
     * @param token string token
     * @verify index _id size token
     * @returns success JSON {code:0,data:{array:[{content:"",location:""}]}}
     */
    '/user/property/polices/list': async (
        ctx, db,
        _id, index, size
    ) => {
        let result = [];
        let house = await db.House.find({property:_id},{_id:1,devices:1,address:1}).skip(index * size).limit(size).toArray();
        if(house){
            for (const item of house.devices) {
                let polices = await db.Polices.find({device:item._id}).toArray();
                let obj = {};
                obj.address = house.address;
                obj.police = polices;
                result.push(obj);
            }
        }
        return code[0].data(result);
    },
    /**
     * 根据物业ID  获取所有户主 在根据户主查询所有消息
     * 物业个人中心
     * @title 物业个人中心(house,message)
     * @api /user/property/statistics
     * @method get
     * @param _id string 物业ID
     * @param token string token
     * @verify _id token
     * @returns success JSON {code:0,data:{array:[{number:"",user:"",message:10}]}}
     */
    '/user/property/statistics': async (
        ctx, db,
        _id
    ) => {
        let user = await db.User_Manager.findOne({_id:_id});
        return code[0].data(user);
    }
}