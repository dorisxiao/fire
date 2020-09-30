# 接口规范
>  *代表必填项
### 调用商
`GET /login`
>  功能:用户登录

提交参数
```
   * account:登录名
   * password:密码
```
返回参数
```
成功
    {code:0,msg:'成功!',data:结果信息,cost:耗时}
失败
    {code:-1,msg:'失败!',data:结果信息,cost:耗时}
```

`POST /register`
>  功能:用户注册

提交参数
```
   * name:用户名
   * account:登录名
   * password:密码
   * type:调用商类型
   * system_name:开发系统名称
   * phone:联系方式
   * contacts:联系人
```
返回参数
```
成功
    {code:0,msg:'成功!',data:结果信息,cost:耗时}
失败
    {code:-1,msg:'失败!',data:结果信息,cost:耗时}
```

`POST /update`
>  功能:用户信息更新

提交参数
```
    name:用户名
    account:登录名
    password:密码
    type:调用商类型
    system_name:开发系统名称
    phone:联系方式
    contacts:联系人
```
返回参数
```
成功
    {code:0,msg:'成功!',data:结果信息,cost:耗时}
失败
    {code:-1,msg:'失败!',data:结果信息,cost:耗时}
```

`POST /interface/register`
>  功能:接口注册

提交参数
```
   * name:接口名称
    kind:接口分类
   * ip:接口地址
   * path:接口路由
   * target_ip:目标地址
   * time_type:开放时间类型(日期/时间段-true/false)
   * start_time:开放开始时间
   * end_time:开放结束时间
    describe:接口描述
   * test_url:接口测试地址
   
```
返回参数
```
成功
    {code:0,msg:'成功!',data:结果信息,cost:耗时}
失败
    {code:-1,msg:'失败!',data:结果信息,cost:耗时}
```