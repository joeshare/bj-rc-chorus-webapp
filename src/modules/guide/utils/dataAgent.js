export  function setProjectSelectData(data,view){
    let currentArry = [];
    let initArray=[];
    data&&data.list&&data.list.length&&data.list.forEach((prom,i)=>{
        var interobj ={
            value:prom,
            text: prom.projectName
        };
        if(prom.active) {
            view.setCurrentProjectInfo(prom);
            view.projectobj=prom.projectName;
            view.currentSelectRecorder=interobj;
        }
        if(i<11) {
            currentArry.push(interobj);
        }
        initArray.push(interobj);
    });
    view.projectSelectOptions=currentArry;
    view.projectSelectOptionsInit=initArray;
}
//验证资源申请

function _validateApplyResource(view){
    view.validateNotEmptyApply(view.cpu,"cpu");
    view.validateNotEmptyApply(view.memory,"memory");
    view.validateNotEmptyApply(view.storage,"storage");
    view.txtAreaVali(view.reason,"reason");
    return _.validate(view.applyWarningsMap)
}

export function validateCreateFormData(view){
    //验证基本信息
    let flag1=view.validateForm();
    //验证资源申请
    let flag2=_validateApplyResource(view);
    return flag1&&flag2;
}