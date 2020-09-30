const code = require('./extends/codes');
/**
 * @interface 通用
 */
module.exports = exports = {
    /**
     * @title 单表内容分页搜索
     * @api /common/:table/search
     * @method get/post
     * @param token string Token
     * @param index int 第几页 0开始 默认0
     * @param count int 返回条数 默认30 -1为全部
     * @param search JSON 搜索条件 {字段1:值,字段2:值} 
     * @param projection JSON {字段1:0,字段2:1}
     * @param start int 开始时间
     * @param end int 结束时间
     * @verify token
     * @returns success JSON {code:0,data:{}}
     * @returns error JSON 
     */
    '/common/:table/search': async (
        ctx, db,
        table, index, count, search, start, end, projection
    ) => {
        if (index) index = parseInt(index);
        if (count) count = parseInt(count);
        if (start) start = parseInt(start);
        if (end) end = parseInt(end);

        if (index == undefined) index = 0;
        if (count == undefined) count = 30;
        if (count == -1) count = 0xFFFFFFFF;
        if (index < 0) index = 0;
        let where = {};
        if (start != undefined || end != undefined) where.time = {};
        if (start) where.time["$gte"] = start;
        if (end) where.time["$lte"] = end;
        if (search) for (let key in search) {
            where[key] = search[key];
            if (typeof (search[key]) == "string")
                where[key] = new RegExp(search[key]);
            if (key == "_id") {
                where[key] = db.ObjectId(search[key])
            }
        }
        let arr = await db[table].
            find(where, projection ? { projection: projection } : undefined).
            sort({ time: -1 }).skip(index * count).limit(count).toArray();
        return code[0].data({
            index: index,
            count: arr.length,
            total: await db[table].count(where),
            array: arr
        });
    },
    /**
     * @title 单表内容新增
     * @api /common/:table/add
     * @method get/post
     * @param token string Token
     * @param data Json 需要添加的数据 
     * @verify token data
     * @returns success JSON {code:0,data:{}}
     * @returns error JSON 
     */
    '/common/:table/add': async (
        ctx, db,
        data, table, warp
    ) => {
        delete data._id;
        await db[table].save(warp(data));
        return code[0];
    },
    /**
     * @title 单表内容修改
     * @api /common/:table/modify
     * @method get/post
     * @param token string Token
     * @param _id string 数据id
     * @param data Json 需要修改的数据 
     * @verify token _id data
     * @returns success JSON {code:0,data:{}}
     * @returns error JSON 
     */
    '/common/:table/modify': async (
        ctx, db,
        data, table, _id, warp
    ) => {
        let item = await db[table].findOne({ _id: _id });
        if (!item) return code[10000];
        for (const key in data)
            item[key] = data[key];
        delete data._id;
        await db[table].save(warp(item));
        return code[0];
    }
}