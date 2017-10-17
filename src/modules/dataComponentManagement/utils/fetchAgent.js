/**
 * Created by AnThen on 2017-4-10.
 */
import CONSTANT  from 'Utils/constant';
function fetchList(arg,cb){
    _.ajax({
        url:'/api/resourcesapplication/getlistdata',
        data:arg,
        success:function(res){
            cb&&cb(res)
        },
        error(res){
            cb&&cb(res);
        }
    })
}
function getProjects(arg,cb){
    _.ajax({
        url:'/api/resourcesapplication/getprojects',
        data:arg,
        success:function(res){
            cb&&cb(res)
        },
        error(res){
            cb&&cb(res);
        }
    })
}
function upload(formData,cb){
    $.ajax({
        url:`${CONSTANT.fileUpload}/xd_module/upload`,
        data:formData,
        type: 'POST',
        dataType: 'JSON',
        //async: false,
        cache: false,
        contentType: false,
        processData: false,
        success:function(res){
            cb&&cb(res)
        },
        error(res){
            cb&&cb({code: "400", msg: "请求失败！", data: ""});
        }
    })
}
export {
    fetchList,
    getProjects,
    upload
}

