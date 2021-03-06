/**
 * Created by AnThen on 2017-4-10.
 */
/**
 * 获取项目数据
 * @param arg
 * @param cb
 */
export function fetchProjectSelect(cb){
   return  _.ajax({
        url:'/api/projectmanagement/selectlist',
        method:'POST',
        async:false,
        data:{
           pageNum:1,
           pageSize:100
        },
        success(res){
            cb&&cb(res);
        },
        error(res){
            cb&&cb(res);
        }
    })
}
export function promiseFetch(URL,arg) {
    return new Promise(function (resolve, reject) {
        _.ajax({
            url:URL,
            method:'POST',
            data:arg,
            success(res){
                resolve(res)
            },
            error(res){
                resolve(res)
            }

    })
    });
}



