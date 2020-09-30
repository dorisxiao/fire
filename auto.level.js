//排名自动计算
//每1分钟计算一次
const power = require('./interfaces/extends/power');

async function GoLevel() {
    try {
        //获取人员列表
        let db = await require('./database')();
        let users = await db.User.find({
            mode: 0, state: 1
        }).toArray();

        for (const user of users) {
            let uid = user._id.toString();
            //找到场次信息
            let bs = await db.BatchScore.find({
                users: {
                    $elemMatch: {
                        $eq: uid
                    }
                },
                submit: 1,
                state: 1
            }).sort({
                end: 1
            }).toArray();
            user.winner = 0;
            user.loser = 0;
            user.tier = 0;
            //总得分
            user.score = 0;
            //命中率
            user.hitpercent = 0;
            //生存率
            user.livepercent = 0;
            //电抗率
            user.epercent = 0;
            //违规率
            user.foulpercent = 0;
            //理论水平平均分
            user.scorepercent = 0;

            let lls = await db.Score.find({ uid: uid }).toArray();
            for (const l of lls) {
                user.scorepercent += l.score;
            }
            user.scorepercent /= lls.length;
            isNaN(user.scorepercent) && (user.scorepercent = 0);

            //总场次
            user.fight = 0;
            //电抗率
            let times = 0;
            let total = 0;
            //命中率
            let mz = 0;
            let wmz = 0;
            //规避率
            let behit = 0;
            let hide = 0;
            for (const item of bs) {
                let batch = await db.Batch.findOne({
                    _id: item.bid,
                    state: 1
                });
                if (!batch) continue;
                if (item.winner.find(id => id == uid)) user.winner++;
                if (item.loser.find(id => id == uid)) user.loser++;
                if (item.tier.find(id => id == uid)) user.tier++;
                let qcid = uid;
                batch.vs.forEach(item => {
                    let sinfo = item.sgroup.find(t => t.hid == uid);
                    if (sinfo) qcid = sinfo.uid;
                    let tinfo = item.tgroup.find(t => t.hid == uid);
                    if (tinfo) qcid = tinfo.uid;
                });

                let power_a = item[`power_a_${qcid}`];
                if (power_a) {
                    user.score += power_a.score;
                }
                for (const key in power_a.weapon) {
                    mz += power_a.weapon[key][0];
                    wmz += power_a.weapon[key][1];
                }
                let power_f = item[`power_f_${qcid}`];
                if (power_f) {
                    user.livepercent += power_f.livepercent;
                }
                for (const key in power_f.behit) behit += power_f.behit[key];
                for (const key in power_f.hide) hide += power_f.hide[key];

                let power_e = item[`power_e_${qcid}`];
                if (power_e) {
                    times += power_e.times;
                    total += power_e.total;
                }
                let power_foul = item[`power_foul_${qcid}`];
                if (power_foul) {
                    user.foulpercent += power_foul.total;
                }
            }
            //求平均
            user.hitpercent += mz / (mz + wmz);
            user.livepercent = hide / (hide + behit);
            user.epercent = times / total;
            user.foulpercent /= bs.length;
            isNaN(user.hitpercent) && (user.hitpercent = 0);
            isNaN(user.livepercent) && (user.livepercent = 0);
            isNaN(user.epercent) && (user.epercent = 0);
            isNaN(user.foulpercent) && (user.foulpercent = 0);
            //场次
            user.fight = bs.length;
            if (bs.length) {
                //最近工作时间
                user.woketime = bs[0].end;
                //胜率
                user.rate = user.winner / (user.winner + user.loser + user.tier);
                if (isNaN(user.rate)) user.rate = 0;
            }
            await db.User.save(user);
        }
        //排名
        users = await db.User.find({
            mode: 0, state: 1
        }).sort({
            rate: -1, fight: 1
        }).toArray();
        let level = 1;
        let last = undefined;
        for (const user of users) {
            if (!last) last = user;
            user.level = level;
            if (user.rate == last.rate) {
                if (user.fight == last.fight) {
                    user.level = level;
                } else user.level = ++level;
            } else user.level = ++level;
            await db.User.save(user);
            last = user;
        }
    } catch (error) {
        console.log('GoLevel ' + error.message);
    }
    setTimeout(_ => { GoLevel() }, 60 * 1000 * 1);
}

//成绩自动计算
//每1分钟计算一次
async function GoScore() {
    try {
        let db = await require('./database')();
        //找到场次信息
        let bs = await db.BatchScore.find({
            submit: 0,
            state: 1
        }).toArray();
        for (let score of bs) {
            //是否所有人都有成绩
            let go_power = true;
            score.susers.forEach(uid => {
                if (score[`score_${uid}`] == undefined)
                    go_power = false;
            });
            if (!go_power) continue;
            //查询批次
            let batch = await db.Batch.findOne({
                _id: score.bid,
                state: 1
            });
            if (!batch) continue;
            await power.MakePower(db, batch, score);
        }
    } catch (error) {
        console.log('GoScore ' + error.message);
    }
    setTimeout(_ => { GoScore() }, 60 * 1000 * 1);
}

GoLevel();
GoScore();