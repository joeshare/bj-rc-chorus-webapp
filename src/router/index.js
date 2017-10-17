/**
 * Created by AnThen on 2017-2-28.
 */
//临时模板//{ template: '<div>memberManagement</div>' };
import VueRouter from "vue-router";
const Vue = require('vue');
import CONSTANT  from 'Utils/constant';
import {routes}  from './config.js';
function getRouterArr(){
    let main=[];
    let sub=[];
    routes.forEach(o=>{
        let path=o.path;
        if(/^(\/[^\/]+){2,}$/.test(path)){
            sub.push(path)
        }else{
            main.push(path)
        }

    })
    return {
        main,
        sub
    };
}
function getDefaultProjectInfo(){
    let defaultProjectInfo=window.localStorage.getItem('defaultProjectInfo')
    let changeproject=null;
    try{
        changeproject=JSON.parse(defaultProjectInfo);
    }catch(e){
       // console.log('route beforeEach defaultProjectInfo error')
    }
    return changeproject;
}
const routerPathMap=getRouterArr();
const routerMainPathArr=routerPathMap.main;
const routerSubPathArr=routerPathMap.sub;
const router = new VueRouter({
    routes
});
router.beforeEach((to, from, next)=>{
    //http://chorusweb.dataengine.com/#/guide
    let path=to.path,
        pathArr=[],
        //路由是否正确
        isRouterRight=false,
        //是否有子路由
        hasSubRouter=false;
    path.replace(/^(\/[^\/]+){2,}$/, function(r){
        pathArr=r.split("/");
        hasSubRouter=true;
        return r;
    })
    if(pathArr&&pathArr.length>0){
        path="/"+pathArr[1];
    }
    let data={};
    //console.log('_.isFirsEntryRouteHook',_.isFirsEntryRouteHook)
    if(_.isFirsEntryRouteHook){
        try{
            let dfaultProjectInfo=getDefaultProjectInfo();
            if(dfaultProjectInfo){
                data={valueobje:JSON.stringify({value:dfaultProjectInfo,
                    text:dfaultProjectInfo.projectName})}
            }
        }catch (e){
            console.log('valueobje JSON error')
        }
        _.isFirsEntryRouteHook=false;
    }
    if(hasSubRouter){
        for(let spath of routerSubPathArr){
            //目前最多的是2级路由
            let tmpArr= [];
            spath.replace(/^(\/[^\/]+){2,}$/, function(r){
                tmpArr=r.split("/");
                return r;
            })
            let tmpStr_clone = JSON.parse(JSON.stringify(tmpArr));
            //截取数组的前三个进行比对
            let tmpStr= tmpStr_clone.splice(0,3).join("/");
            let pathArr_clone  = JSON.parse(JSON.stringify(pathArr));
            let pathArrStr= pathArr_clone.splice(0,3).join("/");
            if(tmpStr==pathArrStr&&tmpArr.length==pathArr.length){
                 isRouterRight=true;
                 break;
            }
        }
    }else{
        isRouterRight=routerMainPathArr.indexOf(path)>-1;
    }
    _.ajax({
        url:'/api/getMenus',
        async: false,
        data,
        method:'post',
        success:function(res){
            var hash="/guide";
            if(res&&!res.code){
               _.navMenus.set(res.data.menus)
                console.log('isRouterRight',isRouterRight);
                if(!isRouterRight){
                    return next({path:hash});
                }else if(res.data.resource_codes.indexOf(path)>-1||CONSTANT.guideRouteArr.indexOf(path)>-1){
                    hash=to.path;
              }
            }
            next();
        },
        error:function(){
            window.location.hash="/guide";
            next();
        }
    })
})


module.exports = router;