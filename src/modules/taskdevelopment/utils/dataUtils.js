/**
 * Created by AnThen on 2017-4-10.
 */
/**
 * Created by AnThen on 2017-3-6.
 */
function result2Table(data) {
    var statusMap={
        "UNDEPLOY":'线下',
        "DEPLOY":'线上',
        "DELETE":'删除'
    };
    var jobTypeMap={
       "1":'实时',
        2:'定期'
    };
    return data.filter((r,i)=>{
        r['statusText']= statusMap[r.status];
        r['jobTypeText']= jobTypeMap[r.jobType];
        return  r['status']!="DELETE";
    });
}

module.exports = {
    result2Table
};