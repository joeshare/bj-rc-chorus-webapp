/**
 * Created by AnThen on 2017-3-3.
 */
import CONSTANT from './constant.js'
let cacheNavMenus=[];
let userResources=[];
let _resizeHandlers={};

let menuvue=null;
let _currentProjectCode=null;
let _currentProjectInfo=null;
let _currentProjectId=null;
let _currentProjectOwner=null;
let _currentUserInfo=null;
let _needFilterTransfer = null;
/**
 * ajax封装
 * @param opts
 * @param customOpts
 * @returns {*}
 */
module.exports = {
    ajax: function (arg) {
        let opts = $.extend(true,{method:"POST"},arg);
        opts.dataType='json';
        if(opts.urlType=='full')
        {
            opts.url=opts.url;
        }
        else {
            opts.url=CONSTANT.host+opts.url;
        }
        var successFn=opts.success;
        opts.success=function(res){
            if(res&&res.code==8002){
                window.location.href="/login.html";
                return ;
            }
            if(res&&res.code==8200){
                window.location.href="/maintained.html";
                return ;
            }
            successFn&&successFn(res)
        }
        return $.ajax(opts);
    },
    /**
     * example new Date(times)
     * @param time Date
     * @param fmt "yyyy-MM-dd" /"yyyy-MM-dd hh:mm:ss"
     * @returns String
     */
    date2String(time, fmt) {
        var o = {
            "M+": time.getMonth() + 1, //月份
            "d+": time.getDate(), //日
            "h+": time.getHours(), //小时
            "m+": time.getMinutes(), //分
            "s+": time.getSeconds(), //秒
            "q+": Math.floor((time.getMonth() + 3) / 3), //季度
            "S": time.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (time.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    },
    string2Date(s){
        return  new Date(Date.parse(s.replace(/-/g, "/")));
    },
    isArray(obj){
        return Object.prototype.toString.call(obj) === '[object Array]';
    },
    validate(obj) {
        for(var k in obj){
            if(obj[k]){
                return false;
            }
        }
        return true;
    },
    /**
     *  uuid
     * @param len 位数
     * @returns {string}
     */
    uuid(len){
        var text="";
        var possible="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        for(var i=0;i<len;i++) text+=possible.charAt(Math.floor(Math.random()*possible.length));
        return text;
    },
    /**
     * 随机数字
     * @param len 位数
     * @returns {string}
     */
    random(n){
        var num="";
        for(var i=0;i<n;i++) {
            num+=Math.floor(Math.random()*10);
        }
        return num;
    },
    currentProjectOwner:{
        set(v){
            _currentProjectOwner=v;
        },
        get(){
            return _currentProjectOwner;
        }
    },
    currentProjectCode:{
        set(v){
            _currentProjectCode=v;
        },
        get(){
            return _currentProjectCode;
        }
    },
    currentProjectInfo:{
        set(v){
           // console.log('_currentProjectId',v)
            _currentProjectInfo=v;
        },
        get(){
            return _currentProjectInfo;
        }
    },
    currentProjectId:{
        set(v){
           // console.log('_currentProjectId',v)
            _currentProjectId=v;
        },
        get(){
            return _currentProjectId;
        }
    },
    navMenus:{
        set(v){
            cacheNavMenus=v;
        },
        get(v){
            return cacheNavMenus;
        }
    },
    needFilterTransfer:{
        set(v){
            _needFilterTransfer=v;
        },
        get(){
            return _needFilterTransfer;
        }
    },

    updatemenu(data){

    },
    currentUserInfo:{
        set(v){
            _currentUserInfo=v;
        },
        get(){
            return _currentUserInfo;
        }
    },
    userResources:{
        set(v){
            userResources=v;
        },
        check(v){
            return userResources.indexOf(v)>-1;
        }
    },
    namespace :function(s){
        var arr = s.split('.');
        var ns = this;
        for(var i=0,k=arr.length;i<k;i++){
            if(typeof ns[arr[i]] == 'undefined'){
                ns[arr[i]] = {};
            }
            ns = ns[arr[i]];
        }
    },
    registerAppResizeHandler(pageKey,handler){
        _resizeHandlers[pageKey]=handler;
    },
    //是否是第一次进入路由钩子
    isFirsEntryRouteHook:true,
    appResize(){
        for(var k in _resizeHandlers){
            if(typeof _resizeHandlers[k]=='function'){
                _resizeHandlers[k]()
            }
        }
    },
    formatNum(num){
        return  (num + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
    },
    transferbetye(param,deep)
    {
        if(Math.abs(param)>1024)
        {
            param = param/1024;
            return this.transferbetye(param,deep+1)
        }
        else{

            switch(deep){
                case 0:
                    param=param.toFixed(0)+' B';
                    break;
                case 1:
                    param=param.toFixed(2)+' KB';
                    break;
                case 2:
                    param=param.toFixed(2)+' MB';
                    break;
                case 3:
                    param=param.toFixed(2)+' GB';
                    break;
                case 4:
                    param=param.toFixed(2)+' TB';
                    break;
                case 5:
                    param=param.toFixed(2)+' PB';
                    break;
                case 6:
                    param=param.toFixed(2)+' EB';
                    break;
            }
            return param;
        }
    },
    transfertime(param,deep)
    {
        let markstep =60;
        if(deep==2) {
            markstep=24;
        }
        if(param>markstep)
        {
            param = param/markstep;

            return  this.transfertime(param,deep+1)
        }
        else{

            switch(deep){
                case 0:
                    param=param.toFixed(0)+' 秒';
                    break;
                case 1:
                    param=param.toFixed(2)+' 分钟';
                    break;
                case 2:
                    param=param.toFixed(2)+' 小时';
                    break;
                case 3:
                    param=param.toFixed(2)+' 天';
                    break;
            }
            return param;
        }
    },
    strLength : function(str){
        return str.replace(/[^\x00-\xff]/g,"aa").length;
    },
    urltransfer(route,url){
        if(_needFilterTransfer) {
            if (window.confirm("页面没有保存，确定离开吗")) {
                _needFilterTransfer=false;
                route.push(url);
                return true;
            }
            else{
                return false;
            }
        }else{
            route.push(url);
            return true;
        }
    },
    getWebsocketUrl(){
        console.log(window.location.hostname)
       return CONSTANT.websocket.replace(/{(.+?)}/gim,function(word){
            return window.location.hostname ;
          }) ;
    }

};