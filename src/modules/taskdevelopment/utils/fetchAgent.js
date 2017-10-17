/**
 * Created by AnThen on 2017-4-10.
 */
import MessageBox from 'adminUI/components/admin-message-box/index';
import Toast from 'adminUI/components/admin-toast/index';
var errMsg="网络问题请联系管理员";
/**
 *  获取任务不是信息
 * @param arg
 * @param cb
 */
function getDeployInfo(arg,cb){
    _.ajax({
        url:'/api/taskdevelopment/jobdeployinfo',
        method:"POST",
        success(res){
            cb&&cb(res);
        },
        error(res){
            cb&&cb(res);
        }
    })
}
function getJobinfo(id,cb){
    return  _.ajax({
        url:'/api/taskdevelopment/getjobinfo',
        async:false,
        data:{jobId:id},
        success(res){
            cb&&cb(res);
        },
        error(res){
            cb&&cb(res);
        }
    })
}
/**
 * 上线
 * @param cb
 */
function jobDeploy(arg,cb){
    return  _.ajax({
        url:'/api/taskdevelopment/jobdeploy',
        data:arg,
        success(res){
            cb&&cb(res);
        },
        error(res){
            cb&&cb(res);
        }
    })
}
/**
 * 卸载
 * @param cb
 */
function jobUndeploy(id,cb){
    _.ajax({
        url:'/api/taskdevelopment/jobundeploy',
        method:"POST",
        data:{jobId:id},
        success(res){
            cb&&cb(res);
        },
        error(res){
            cb&&cb(res);
        }
    })
}
/**
 * 删除
 * @param cb
 */
function jobDelJob(v,cb){
    _.ajax({
        url:'/api/taskdevelopment/jobdeljob',
        method:"POST",
        data:{jobId:v},
        success(res){
            cb&&cb(res);
        },
        error(res){
            cb&&cb(res);
        }
    })
}
function getProjectJobs(arg,cb){
    _.ajax({
        url:'/api/taskdevelopment/getprojectjobs',
        method:"POST",
        data:arg,
        success(res){
            cb&&cb(res);
        },
        error(res){
            cb&&cb(res);
        }
    })
}
/**
 * 手动执行
 * @param jobId
 * @param cb
 */
function excuteJob(arg,cb){
    _.ajax({
        url:'/api/taskdevelopment/excutejob',
        data:arg,
        success(res){
            cb&&cb(res);
        },
        error(res){
            cb&&cb(res);
        }
    })
}
export default {
    jobDeploy,
    jobUndeploy,
    jobDelJob,
    getProjectJobs,
    getDeployInfo,
    excuteJob,
    getJobinfo
}

