/**
 * Created by AnThen on 2017-4-10.
 */

/**
 * 获取组件属性
 * @param arg
 * @param cb
 */
function fetchFieldType(cb){
    _.ajax({
        url:'/api/datatablemanagement/gethivetypes',
        method:'POST',
        success:function(res){
            cb&&cb(res)
        },
        error(res){
            cb&&cb(res);
        }
    })
};
function add(arg,cb){
    _.ajax({
        url:'/api/datatablemanagement/add',
        method:'POST',
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
    fetchFieldType,
    add

}

