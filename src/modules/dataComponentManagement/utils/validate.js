/**
 * Created by AnThen on 2017-4-10.
 */

//组件级别，0：平台级别，1：项目级别
const PLATFORM=0;
function validateModuleName(v){
    let success=true,msg=null;
    if(!/^([a-zA-Z][a-zA-Z0-9]+)|([\u4e00-\u9fa5]+)$/.test(v)){
        success=false;
        msg=['必填项,以字母开头的字母和数字或中文'];
    }else if(v.length>20){
        success=false;
        msg=['长度不能超过20字符'];
    }
    return {
        success,
        msg
    };
}
function validateModuleAliasName(v){
    let success=true,msg=null;
    if(!/^([a-zA-Z][a-zA-Z0-9]+)|([\u4e00-\u9fa5]+)$/.test(v)){
        success=false;
        msg=['必填项,以字母开头的字母和数字或中文'];
    }else if(v.length>20){
        success=false;
        msg=['长度不能超过20字符'];
    }
    return {
        success,
        msg
    };
}
function validateModuleDesc(v){
    let success=true,msg=null;
    if(v&&v.length>128){
        success=false;
        msg=['长度不能超过128字符'];
    }
    return {
        success,
        msg
    };
}
function validateProjectId(v,moduleLevel){
    let success=true,msg=null;
    if(moduleLevel!==PLATFORM&&v==PLATFORM){
        success=false;
        msg=['请选择一个所属项目'];
    }
    return {
        success,
        msg
    };
}
function validateFileName(v){
    let success=true,msg=null;
    if(!v||!$.trim(v)){
        success=false;
        msg=['必填项'];
    }
    return {
        success,
        msg
    };
}
export {
    validateModuleName,
    validateModuleAliasName,
    validateModuleDesc,
    validateProjectId,
    validateFileName
}

