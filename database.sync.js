//1.数据到云端，查询本地库中需要上传的数据，可以联网(上传)
//2.数据到本地，根据本地库时间戳抓取最新数据到本地
//5分钟同步一次
const mongo = require('./database');
const config = require('./config.json');
const fs = require('fs');
try {
    fs.mkdirSync(`${process.cwd()}/database.sync`);
} catch{ }
// $gte: delay
async function DataTransToClond(table, where_reback, reback) {
    const local = await mongo(`mongodb://127.0.0.1:8500/fly`);
    const remote = await mongo(`mongodb://${config.remote}:8500/fly`);

    let items = await local[table].find({ tag: 0 }).sort({ time: 1 }).toArray();
    for (const item of items) {
        item.tag = 1;
        item.time = remote.ObjectId().getTimestamp().getTime();
        let where = where_reback(item, local, remote);
        let rx = await remote[table].findOne(where);
        if (rx) {
            //修改
            await reback(item, rx);
            await remote[table].save(rx);
        } else {
            //新增
            if (!where._id)
                delete item._id;
            await remote[table].save(item);
        }
        await local[table].save(item);
    }
}

async function DataTransToLocal(table, where_reback, reback) {
    const delay = GetSyncDelay(table);
    const local = await mongo(`mongodb://127.0.0.1:8500/fly`);
    const remote = await mongo(`mongodb://${config.remote}:8500/fly`);

    let items = await remote[table].find({ time: { $gt: delay } }).sort({ time: 1 }).toArray();
    for (const item of items) {
        item.tag = 1;
        let where = where_reback(item, local, remote);
        let rx = await local[table].findOne(where);
        if (rx) {
            //修改
            await reback(rx, item);
            await local[table].save(rx);
        } else {
            //新增
            if (!where._id)
                delete item._id;
            await local[table].save(item);
        }
        SetSyncDelay(table, item.time);
    }
}

async function L2Cload() {
    function common_where(item, local, remote) {
        return { _id: item._id }
    }
    function common_change(local, remote) {
        for (const key in local)
            remote[key] = local[key];
    }
    //User
    await DataTransToClond("User", common_where, common_change);
    //Batch
    await DataTransToClond("Batch", common_where, common_change);
    //Plane
    await DataTransToClond("Plane", common_where, common_change);
    //Score
    await DataTransToClond("Batch", common_where, common_change);
    //BatchScore
    await DataTransToClond("BatchScore", common_where, (local, remote) => {
        //修改不操作
    });
    //用文件去判断上传
    let pathes = fs.readdirSync(`${process.cwd()}/database.sync`).sort((a, b) => {
        let at = fs.lstatSync(`${process.cwd()}/database.sync/${a}`);
        let bt = fs.lstatSync(`${process.cwd()}/database.sync/${b}`);
        return bt.atime - at.atime;
    });
    for (const path of pathes) {
        let ids = path.split('-');
        let bid = ids[0];
        let uid = ids[1];
        //查询本地数据
        const local = await mongo(`mongodb://127.0.0.1:8500/fly`);
        const remote = await mongo(`mongodb://${config.remote}:8500/fly`);

        let localBatch = await local.BatchScore.findOne({ bid: local.ObjectId(bid) });
        let remoteBatch = await remote.BatchScore.findOne({ bid: remote.ObjectId(bid) });
        if (localBatch && remoteBatch) {
            for (const key in localBatch) {
                if (key.endsWith(uid))
                    remoteBatch[key] = localBatch[key];
            }
            remoteBatch.tag = 1;
            remoteBatch.time = remote.ObjectId().getTimestamp().getTime();
            remote.BatchScore.save(remoteBatch);
        }
        fs.unlinkSync(`${process.cwd()}/database.sync/${path}`);
    }
}
async function C2Local() {
    function common_where(item, local, remote) {
        return { _id: item._id }
    }
    function common_change(local, remote) {
        for (const key in remote)
            local[key] = remote[key];
    }
    //User
    await DataTransToLocal("User", common_where, common_change);
    //Batch
    await DataTransToLocal("Batch", common_where, common_change);
    //Plane
    await DataTransToLocal("Plane", common_where, common_change);
    //Score
    await DataTransToLocal("Score", common_where, common_change);
    //BatchScore 
    await DataTransToLocal("BatchScore", common_where, (local, remote) => {
        //如果存在就不替换
        let has = {};
        remote.susers.forEach(id => {
            let fs = require('fs');
            has[id] = fs.existsSync(`${process.cwd()}/database.sync/${remote.bid}-${id}`)
        });
        for (const key in remote) {
            let scope = key.split('_');
            tmp = scope[scope.length - 1];
            if (has[tmp] == true) {
                continue;
            }
            local[key] = remote[key];
        }
    });
}
async function IOing() {
    try {
        await L2Cload();
    } catch { }
    try {
        await C2Local();
    } catch { }
    setTimeout(_ => { IOing(); }, 60 * 1000);
}
IOing();

function GetSyncDelay(name) {
    const fs = require('fs');
    let item = JSON.parse(fs.readFileSync('./database.sync.json').toString());
    if (item[name]) return item[name];
    return 0;
}
function SetSyncDelay(name, delay) {
    const fs = require('fs');
    let item = JSON.parse(fs.readFileSync('./database.sync.json').toString());
    item[name] = delay;
    fs.writeFileSync('./database.sync.json', JSON.stringify(item));
}
