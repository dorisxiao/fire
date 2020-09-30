const request = require("request");
async function reqhttp(method,header,url){
    let req = { url: url, method: method};
    if(header) req={ url: url, method: method,headers:header,timeout:10000};
    return new Promise((reslove, reject) => {
        request(req, async function (err, res, body) {
            if (err){
                console.log("请求接口超时",err);
                reject("接口请求错误",err);
            }else{
                reslove(body);
            }
        });
    })
}
module.exports = reqhttp;