/**
 * Created by AnThen on 2017-7-4.
 */
import Toast from 'adminUI/components/admin-toast/index';

export function fetchSelectList(view){
    let _this=view;
    //项目下拉框
    _.ajax({
        url:'/api/projectmanagement/selectlist',
        method:'POST',
        data:{
            pageNum:1,
            pageSize:100
        },
        success:function(res){
            if(res.code=="0"){
                _this.$parent.$parent.$parent.projectSelectOptions=[];
                _this.$parent.$parent.$parent.projectSelectOptionsInit=[];
                res.data.list.forEach((prom,i)=>{
                    var interobj ={
                        value:prom,
                        text: prom.projectName
                    };
                    if(i<11) {
                        _this.$parent.$parent.$parent.projectSelectOptions.push(interobj);
                    }
                    _this.$parent.$parent.$parent.projectSelectOptionsInit.push(interobj);
                });
            }
        },
        error:function(res){
        }
    })
}
/**
 *
 * @param view
 */
export function createProjectHandler(view){
    let _this=view;
    //return true 表示不关闭弹窗
    if(_this.validateForm())
    {
        _this.isShowMarkLoading=true;
        var submitobj ={
            "createUserId": "",
            "projectCode":_this.projectcode,
            "projectDesc": _this.projectdesc,
            "projectName": _this.projectname
        };
        $.when( _.ajax({
            url:'/api/projectmanagement/addinfo',
            method:'POST',
            data:submitobj})
        ).then(function(res, textStatus, jqXHR){
            _this.isShowMarkLoading=false;
                if(res&&res.code=="0"){
                    Toast({
                        message: '创建成功'
                    })
                    _this.fetchData(1);
                }else{
                    if(res.msg){
                        Toast({
                            message: res.msg
                        })
                    }
                    _this.fetchData(1);
                }
                fetchSelectList(view)

        });

    }
}