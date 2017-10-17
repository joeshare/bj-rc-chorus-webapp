/**
 * Created by AnThen on 2017-4-10.
 */
import MessageBox from 'adminUI/components/admin-message-box/index';
import Toast from 'adminUI/components/admin-toast/index';
var errMsg="网络问题请联系管理员";
import CONSTANT  from 'Utils/constant';
function streamMonitorList(arg,cb){
    _.ajax({
        url:'/api/taskmonitor/streammonitorlist',
        data:arg,
        success:function(res){
            cb&&cb(res)
        },
        error(res){
            cb&&cb(res);
        }
    })
}
/**
 * 列表查询
 * @param arg
 * @param cb
 */
function jobMonitorList(arg,cb){
    _.ajax({
        url:'/api/taskmonitor/jobmonitorlist',
        data:arg,
        success:function(res){
            cb&&cb(res)
        },
        error(res){
            cb&&cb(res);
        }
    })
}
function downloadFile(arg,cb){
    window.location.href=`${CONSTANT.fileDownload}/downloadFile/${arg.date}/${arg.executionId}`;
}
/**
 * 子任务查询
 * @param arg
 * @param cb
 */
function getSubJobMonitorList(arg,cb){
    _.ajax({
        url:'/api/taskmonitor/getsubjobmonitorlist',
        data:arg,
        success:function(res){
            cb&&cb(res)
        },
        error(res){
            cb&&cb(res);
        }
    })
};
/**
 * 重启
 * @param jobExecutionId
 * @param cb
 */
function restartJob(jobExecutionId,cb){
    _.ajax({
        url:'/api/taskmonitor/restartjob',
        async:false,
        data:{jobExecutionId},
        success:function(res){
            cb&&cb(res)
        },
        error(res){
            cb&&cb(res);
        }
    })
};
function streamMonitorDetail(arg,cb){
    _.ajax({
        url:'/api/taskmonitor/streammonitordetail',
        data:arg,
        success:function(res){
            cb&&cb(res)
        },
        error(res){
            cb&&cb(res);
        }
    })
}
export default {
    jobMonitorList,
    getSubJobMonitorList,
     streamMonitorDetail,
     downloadFile,
    streamMonitorList,
    restartJob

}

