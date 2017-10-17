/**
 * Created by AnThen on 2017-4-10.
 */
"use strict";
import MessageBox from 'adminUI/components/admin-message-box/index';
import Toast from 'adminUI/components/admin-toast/index';
var errMsg="网络问题请联系管理员";
//获取模块数据
function sourcesFetch(url,data,method,cb){
    return _.ajax({
        url,
        method,
        data,
        success:function(res){
            cb&&cb(res)
        },
        error:function(res){
            cb&&cb(res)
        }
    })
}
//获取模块数据
function fetchXdModules(moduleAliasName,projectId,cb){
   return _.ajax({
        url:'/api/taskdevelopment/getxdmodules',
        method:'POST',
        data:{
            moduleType:0,
            moduleAliasName,
            projectId
        },
        success:function(res){
            cb&&cb(res)
        }
    })
}
/**
 * 获取组件属性
 * @param arg
 * @param cb
 */
function fetchModuleProperty(arg,cb){
    return _.ajax({
        url:'/api/taskdevelopment/getmoduleproperty',
        method:'POST',
        data:arg,
        success:function(res){
            cb&&cb(res)
        },
        error(res){
            cb&&cb(res);
        }
    })
};
/*
 {
 "code": 0,
 "msg": "保存成功"
 "data":[{
 "jobId":"",任务ID
 }]
 }
 0：保存成功
 "4001","项目ID不能为空"
 "4005","任务不存在"
 "4006","任务类型错误"
 "4004"："创建人用户ID不能为空"
 "4007"："创建人用户名不能为空"
 "4010"："更新人用户ID不能为空"
 "4011"："更新人用户名不能为空"
 "4040","工作流DSL不能为空"
 "4041","工作流中节点不能为空"
 "4042","执行容器ID不能为空"
 "4900","调度类型错误"
 "4902","调度信息不能为空"
 "4903","调度方式不能为空"
 */
function jobSave(arg,cb){
    return _.ajax({
        url:'/api/taskdevelopment/jobsave',
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
 *  获取容器数据
 * @param projectId
 * @param cb
 */
function fetchInstance(projectId,cb){
    return _.ajax({
        url:'/api/taskdevelopment/getInstance',
        async:false,
        data:{projectId},
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
function jobUndeploy(arg,cb){
    return _.ajax({
        url:'/api/taskdevelopment/jobundeploy',
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
 * 删除
 * @param cb
 */
function jobDelJob(cb){
    return  _.ajax({
        url:'/api/taskdevelopment/jobdeljob',
        method:"POST",
        success(res){
            cb&&cb(res);
        },
        error(res){
            cb&&cb(res);
        }
    })
}
/**
 * 表达式检查
 * @param cb
 */
function jobValidCronWithInterval(v,cb){
    return _.ajax({
        url:'/api/taskdevelopment/jobvalidcronwithinterval',
        data:{cronExpression:v},
        async:false,
        success(res){
            cb&&cb(res);
        },
        error(res){
            cb&&cb(res);
        }
    })
}
function validateTaskName(arg,cb){
    return _.ajax({
        url:'/api/taskdevelopment/validatetaskname',
        async:false,
        data:{
            "taskName":arg.taskName
        },
        success(res){
            cb&&cb(res);
        },
        error(res){
            cb&&cb(res);
        }
    })
}
/**
 * 重名检查
 * @param cb
 */
function jobValidJobaliaSname(arg,cb){
    return _.ajax({
        url:'/api/taskdevelopment/jobvalidjobaliasname',
        method:"POST",
        async:false,
        data:arg,
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
 *  获取任务部署信息
 * @param arg
 * @param cb
 */
function getDeployInfo(id,cb){
    return  _.ajax({
        url:'/api/taskdevelopment/jobdeployinfo',
        data:{
            jobId:id
        },
        success(res){
            cb&&cb(res);
        },
        error(res){
            cb&&cb(res);
        }
    });

}
/**
 * 手动执行
 * @param jobId
 * @param cb
 */
function excuteJob(arg,cb){
    return  _.ajax({
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
/**
 * 获取表数据
 * @param arg
 * @param cb
 */
function fetchProjectTables(cb){
   return  _.ajax({
        url:'/api/taskdevelopment/getprojecttables',
        success(res){
            cb&&cb(res);
        },
        error(res){
            cb&&cb(res);
        }
    })
}

export default {
    fetchXdModules,
    fetchModuleProperty,
    fetchInstance,
    jobSave,
    jobDeploy,
    jobUndeploy,
    jobDelJob,
    jobValidCronWithInterval,
    jobValidJobaliaSname,
    getDeployInfo,
    getJobinfo,
    validateTaskName,
    excuteJob,
    fetchProjectTables,
    sourcesFetch
}

