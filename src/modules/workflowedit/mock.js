/**
 * Created by AnThen on 2017-3-6.
 */
function queryTableData() {
    var arr = [];
    var num = 15;
    while (num--) {
        arr.push({
            "jobId": Math.ceil(Math.random() * 1000),//任务ID,
            "jobName": _.uuid(6),//任务运行名称(英文和下划线)
            "jobAliasName": "",//任务名称
            "jobType": "1",//任务类型(1:实时 2:定期)
            "status": Math.random()>0&& Math.random()<0.3?"UNDEPLOY":(Math.random()>=0.3&& Math.random()<0.7?'DEPLOY':'DELETE'),//发布状态(UNDEPLOY:下线 DEPLOY:线上 DELETE:删除),
            description:_.uuid(16),
            "deployUserId": _.uuid(6),// 任务负责人ID
            "deployUserName": _.uuid(6),// 任务负责人名
            "createUser": _.uuid(6),// 任务创建人
            "createUserName": _.uuid(6),// 任务创建人名
            "createTime": _.date2String(new Date(),"yyyy-MM-dd hh:mm:ss")// 任务创建时间
        })
    }
    return {
        "code": 0,
        "msg": "取得成功",
        "data": arr
    }
}
function getXdModules(){

}
function propertySourceData(){
    return [{ valB:1,valC:'a',valA:'asd'},{ valB:2,valC:'b',valA:'cvb'},{ valB:3,valC:'c',valA:'rty'}
        ]
}
function propertySourceData2(){
    return [{ valB:2,valC:'a1',valA:'asd1'},{ valB:3,valC:'b1',valA:'cvb1'},{ valB:3,valC:'c1',valA:'rty1'}
    ]
}
module.exports = {
    queryTableData,
    propertySourceData,
   propertySourceData2

};