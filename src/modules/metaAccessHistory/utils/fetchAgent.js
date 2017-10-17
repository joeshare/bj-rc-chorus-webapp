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


