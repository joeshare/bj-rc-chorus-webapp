/**
 * Created by AnThen on 2017-3-3.
 */
import MessageBox from 'adminUI/components/admin-message-box/index'
import AdminInput from 'adminUI/components/admin-input.vue';
import adSelect from 'adminUI/components/admin-select.vue';
import AdminCheckbox from 'adminUI/components/admin-checkbox.vue';
import AdModal from 'adminUI/components/admin-modal.vue';
import Paginator from 'adminUI/components/admin-paginator.vue';
import Toast from 'adminUI/components/admin-toast/index';
import navBar  from '../../admin-ui-extend/components/admin-navbar.vue';
import CONSTANT  from 'Utils/constant';
import {tabs, activeTabName} from  './tabs.js';

import AdminPaginator from 'adminUI/components/admin-paginator.vue';
import {info} from './mock/mock';
import fetchAgent from  './utils/fetchAgent.js';
import dataUtils from './utils/dataUtils.js';
import canvasUtils from './utils/canvasUtils.js';
import {canvas as CanvasModel} from  './models/canvasModel.js';
import nodeDataModel from './models/nodeDataModel.js';
import adSpinner from 'adminUI/components/admin-spinner';
import Vue from 'vue';
//import nodersa from 'node-rsa';
const BATCHTPYE=2;
var labelArr=[{nodeName:'执行完成',fillStyle:"RGBA(51,204,0,0.7)",strokeStyle:"RGBA(51,204,0,0.7)",x:20,y:660},
    {nodeName:'执行中',fillStyle:"RGBA(255,255,0,0.7)",strokeStyle:"RGBA(255,255,0,0.7)",x:105,y:660},
    {nodeName:'执行异常',fillStyle:"RGBA(255,0,0,0.7)",strokeStyle:"RGBA(255,0,0,0.7)",x:200,y:660},
    {nodeName:'未执行',fillStyle:"RGBA(153,153,153,0.7)",strokeStyle:"RGBA(153,153,153,0.7)",x:295,y:660}];

const COLORMAP={
    "COMPLETED":"#3CB371",
    "FAILED":"#f36a5a",
    "STARTED":"#6f7073",
    "UNSTARTED":"#6f7073",
    "STOPPED":"#f36a5a",
    "UNKNOWN":"#f36a5a"
};

const  userId = _.currentUserInfo.get()? _.currentUserInfo.get().id:'';

export default {
    components: {
        AdminInput,
        AdModal,
        AdminCheckbox,
        adSelect,
        AdminPaginator,
        Toast,
        navBar,
        adSpinner,
        'adTabs':resolve => require(['adminUI/components/admin-tabs.vue'], resolve)
    },
    data () {
        let _this=this;

        return {
            COLORMAP:COLORMAP,
            isFirstFetchDetails:true,
            setTimeoutID:null,
            setTimeoutCheckID:null,
            websocketobject:null,
            currentRecoder:null,
            currentRecoderType:null,
            navlist:[{id:1,text:'数据开发',url:''},{id:2,text:'任务监控',url:''}],
            data:[],
            streamData:[],
            workFlowDSL:[],
            taskList:[],
            modalDisplay: false,
            modalButtons:[{
                text: '取消',
                buttonClass:'ad-auxiliary admin-small',
                name: 'cancel',
                handler(){
                    _this.clearTimeoutID();
                    _this.initModalButtons();
                }
            },{
                text: '刷新',
                buttonClass:'ad-auxiliary admin-small  task-monitor-disabled',
                name: 'refresh',
                handler(){
                    return true;
                }
            }],
            checkmodalDisplay: false,
            checkmodalButtons:[{
                text: '关闭',
                buttonClass:'ad-auxiliary admin-small',
                name: 'cancel',
                handler(){
                    _this.clearTimeoutCheckID();
                }
            },{
                text: '下载',
                buttonClass:'ad-auxiliary admin-small',
                name: 'refresh',
                handler(){

                    _this.listClickDownloadLog(_this.curententry);
                    return true;
                }
            }],
            logList:[],
            batchTotalCount: 0,
            totalCount: 0,
            batchPageSize:CONSTANT.pageSize,
            pageSize:CONSTANT.pageSize,
            batchCurrentPage: 1,
            currentPage: 1,
            tabStyle:{ minHeight:"400px"},
            activeTabName,
            executionStatusStarted:true,
            executionStatusFailed:true,
            executionStatusCompleted:true,
            streamTable:{
                jobAliasName:"",
                currentPage: 1,
                totalCount: 0
            },
            restartBtnDisbled:false,
            detailsInfoBtnDisbled:false,
            isHiddenLoading:true,
            tabs,
            searchKey:'',
            curententry:null,
            hasscroll:false,
            verifier:'',
            isfirstsend:true,
            timestamp:'',
            nowarpcss:"warpcss",
            maxrows:500,
            refreshs:1000,
            logsearchKey:"",
            logsearchSum:0,
            ignorecase:true,
            realtime:true,
            commandList:[],
            commandIndex:0,
            inputfocus:true,
            commandTip:false
        }
    },
    created() {
        this.projectId=_.currentProjectInfo.get().projectId;
        this.fetchJobMonitorList(1);
        this.fetchStreamJobMonitorList(1);
        this.initverifier();
     
    },
    mounted(){
        this.setCanvasStyle();
        canvasUtils.setView(this);

        let _this =this;
        $(window).keydown(function (event) {
            if (event.keyCode == 27) {
                _this.closeLogWindow();
            }

        });

        $('.logpanel').parent().parent().append('<div class="ion-close-round close-icon" title="可按Esc退出" style="position: absolute;"></div>');

        $('.close-icon').on('click',(function () {
            _this.closeLogWindow();
        }));


    },
    destroyed(){
    },
    watch: {
        executionStatusStarted(){
            this.fetchJobMonitorList(1);
        },
        executionStatusFailed(){
            this.fetchJobMonitorList(1);
        },
        executionStatusCompleted(){
            this.fetchJobMonitorList(1);
        }
    },
    methods: {
        initwebsocket(param){
            let _this =this;

            this.websocketobject = new WebSocket(`${_.getWebsocketUrl()}`);

            this.websocketobject.onopen = function(e){
                _this.loadlog(param);
            }
            this.websocketobject.onclose = function(e){
                console.log("服务器关闭");
            }
            this.websocketobject.onerror = function(){
                console.log("连接出错");
            }

            this.websocketobject.onmessage = function(e){

                if(_this.realtime){
                let currentcarray = _this.logList;
                let localdata = JSON.parse(e.data);
                _this.timestamp = localdata.end;
                localdata.lines.forEach(m=>{
                    let regm = m.substring(0,50);
                    if(regm.indexOf(' INFO ')>-1){
                        currentcarray.push({id:'',log:m,style:"INFO"});
                    }
                    if(regm.indexOf(' WARN ')>-1){
                        currentcarray.push({id:'',log:m,style:"WARN"});
                    }
                    if(regm.indexOf(' ERROR ')>-1){
                        currentcarray.push({id:'',log:m,style:"ERROR"});
                    }
                })

                if(currentcarray.length>_this.maxrows){
                    currentcarray = currentcarray.splice(currentcarray.length-_this.maxrows,currentcarray.length);
                }

                _this.logList =currentcarray;
                if(!_this.hasscroll){
                    _this.$nextTick(function(){
                            let doclist =  document.querySelector(".loglist");
                            let logpanel = document.querySelector(".logpanel");
                            logpanel.scrollTop = doclist.offsetHeight;
                    });
                }
                }
            }
        },
        clearTimeoutID(){
            window.clearTimeout(this.setTimeoutID);
            this.setTimeoutID=null;
        },
        clearTimeoutCheckID(){
            window.clearTimeout(this.setTimeoutCheckID);
            this.websocketobject&&this.websocketobject.close();
            this.setTimeoutCheckID=null;
        },
        initModalButtons(){
            var _this=this;
            this.modalButtons.splice(1,1,{
                text: '刷新',
                buttonClass:'ad-auxiliary admin-small  task-monitor-disabled',
                name: 'refresh',
                handler(){
                    return true;
                }
            })
        },
        setModalButtons(){
            var _this=this;
            this.modalButtons.splice(1,1,{
                text: '刷新',
                buttonClass:'ad-auxiliary admin-small',
                name: 'refresh',
                handler(){
                    _this.fetchDetailsInfo(_this.currentRecoder,_this.currentRecoderType);
                    _this.countDown(15)
                    return true;
                }
            })
        },
        countDown(secs){
            var _this=this;
            if(--secs>0){
                this.modalButtons.splice(1,1,{
                    text: `${secs}s`,
                    buttonClass:'ad-auxiliary admin-small task-monitor-disabled',
                    name: 'refresh',
                    handler(){
                        return true;
                    }
                })
                _this.setTimeoutID=setTimeout(function (){
                    this.countDown(secs)
                }.bind(this),1000);
            }else{
                this.setModalButtons();
            }
        },
        fetchDetailsInfoCallBack(res,type){
            if(this.isFirstFetchDetails){
                this.setModalButtons();
                this.isFirstFetchDetails=false;
            }
            var _this=this;
            var _positionArr=[];
            if(res.code==0){
                dataUtils.transformJobData(_this,res.data)
                dataUtils.setPositionArr(_this.workFlowDSL.tasks,0,_positionArr)
            }
            _this.detailsInfoBtnDisbled=false;
            if(!_positionArr.length){
                return
            }
            this.workflowType=res.jobType=type;
            if(res.jobType==BATCHTPYE){
                _positionArr.unshift([{name:'start',type:"START",jobExecuteStatus:"COMPLETED",edgeData:[_positionArr[0][0].name]}]);
                _positionArr[_positionArr.length-1][0].edgeData=['end'];
                _positionArr.push([{name:'end',type:"END",edgeData:[]}]);
            }
            dataUtils.setNodePositionByTwoDimension(_positionArr, 830,700,type);
            var dataMaps=dataUtils.getPonitLineArr(_positionArr,_this.taskList,type);
            if(dataMaps.nodeData){
                dataMaps.nodeData.forEach((opt,i)=>{
                    if(_this.workflowStatus!==BATCHTPYE){
                        opt.propertyData.jobExecuteStatus='COMPLETED';
                        opt.jobExecuteStatus='COMPLETED';
                    }
                    nodeDataModel.setNodeData(opt)
                })
            }
            var lineData=dataUtils.getLineDataByCanvasData(dataMaps.lineMaps);
            _this.points=dataMaps.points?dataMaps.points:[];
            //设置end 颜色 must before getLineDataByCanvasData
            this.setNodeColor(dataMaps.lineMaps)
            var lineData=dataUtils.getLineDataByCanvasData(dataMaps.lineMaps);
            _this.lineData=lineData;
            CanvasModel.init(_this.points?_this.points:[],_this.lineData?_this.lineData:[],this.workflowType,res.data.recordCount,"task-monitor-canvas",false);
        },
        fetchDetailsInfo(res,type){
            var _this=this;
            var jobId=res.jobId,executionId=res.jobExecutionId,projectId=_this.projectId;
            this.modalDisplay=true;
            this.taskList=[];
            if(type==BATCHTPYE){
                fetchAgent.getSubJobMonitorList({jobId,executionId,projectId},function(res){
                    _this.isHiddenLoading=true;

                    _this.fetchDetailsInfoCallBack(res,type);
                })
            }else{
                fetchAgent.streamMonitorDetail({jobId},function(res){
                    _this.isHiddenLoading=true;
                    _this.fetchDetailsInfoCallBack(res,type);
                })
            }

        },
        time2Date(time){
            return time?_.date2String(new Date(time),"yyyy-MM-dd hh:mm:ss"):"";
        },
        jobStreamDetailsInfo(res){
            this.isFirstFetchDetails=true;
            CanvasModel.clearCanvas();
            this.detailsInfoBtnDisbled=true;
            this.isHiddenLoading=false;
            var _this=this;
            _this.currentRecoder=res;
            _this.currentRecoderType=1;
            setTimeout(function(){
                _this.fetchDetailsInfo(res,1)
            },10)
        },
        jobDetailsInfo(res,thiz){
            this.isFirstFetchDetails=true;
            CanvasModel.clearCanvas();
            this.detailsInfoBtnDisbled=true;
            this.isHiddenLoading=false;
            var _this=this;
            _this.currentRecoder=res;
            _this.currentRecoderType=2;
            setTimeout(function(){
                _this.fetchDetailsInfo(res,2)
            },10)

           // this.disable='';
         },
        batchTogglePage(indexPage){
            this.fetchJobMonitorList(indexPage)
        },
        togglePage(indexPage){
            this.fetchStreamJobMonitorList(indexPage)
        },
        setCanvasStyle(){
            var $main=$('.chorus-main');
            this.tabStyle.height=($main.height()-20)+"px";
        },
        messageAlert(message,handler){
            MessageBox({
                message,
                type: 'alert',
                confirm () {
                }
            })
        },
        getPointParentById(id){
            var node=null;
            this.points.every((p)=>{
                if(p.edgeData.indexOf(id)>-1){
                    node=p;
                    return false;
                }
                return true;
            })
            return node;
        },
        getPointById(id){
            var node=null;
            this.points.every((p)=>{
                if(p.id==id){
                    node=p;
                    return false;
                }
                return true;
            })
            return node;
        },
        //设置end 节点 颜色
        setNodeColor(lineMaps){
            var _this=this;
            this.points.forEach((p,i)=>{
                if(p.id=='end'||p.moduleType=="fork"||p.moduleType=="join"){
                   var nodeParent=_this.getPointParentById(p.id);
                    if(nodeParent.jobExecuteStatus=="COMPLETED" ){
                        p.strokeStyle=p.fillStyle="RGBA(51,204,0,0.7)";
                    }else{
                        lineMaps[p.id].propertyData.jobExecuteStatus="";
                        p.jobExecuteStatus="";
                        p.strokeStyle=p.fillStyle="RGBA(153,153,153,0.7)";
                    }
                }
            })
        },
        getExecutionStatus(){
            var arr=[];
            if(this.executionStatusStarted){
                arr.push("STARTED");
            }
            if(this.executionStatusFailed){
                arr.push("FAILED");
                arr.push("UNKNOWN");
            }
            if(this.executionStatusCompleted){
                arr.push("COMPLETED");
            }
            return arr;
        },
        date2String(date,pattern){
           return _.date2String(date,pattern);
        },
        string2Date(str){
           return _.string2Date(str)
        },
        listClickCheckLog(param){
            this.checkmodalDisplay =true;
            this.initwebsocket(param);
            this.curententry = param;
            this.logList=[];
            this.hasscroll=false;
            this.isfirstsend = true;
            this.logsearchSum=0;
            this.logsearchKey="";
            this.realtime =true;

        },
        listClickDownloadLog(rec){
            if(rec.jobStartTime){
                var dateStr=_.date2String(_.string2Date(rec.jobStartTime),"yyyy-MM-dd")
                this.downloadFiler(dateStr,rec.jobExecutionId);
            }
        },
        downloadFiler(date,executionId){
            fetchAgent.downloadFile({date,executionId})
        },
        getJobExecuteStatusText(status){
            var maps={
                "UNDEPLOY":"未发布",
                "FAILED":"执行失败",
                "COMPLETED":"执行完成",
                "STARTED":"执行中",
                "DEPLOY":"发布",
                "UNKNOWN":"执行失败",
                "STOPPED":"停止"
            };
            return maps[status]?maps[status]:"未知"
        },
        /**
         * 批量列表
         * @param page
         */
        fetchJobMonitorList(page){
            var _this=this;
            var projectId=this.projectId;
            fetchAgent.jobMonitorList({
                projectId,
                page,
                rowCnt:CONSTANT.pageSize,
                executionStatus:JSON.stringify(_this.getExecutionStatus()),
                jobAliasName:this.searchKey
            },function(res){
                    if(res.code==0){
                        _this.data=res.data.list
                        _this.batchTotalCount=res.data.total;
                        _this.batchCurrentPage=res.data.pageNum;
                    }else if(res.code==5002){
                        _this.data=[];
                        _this.batchTotalCount=0;
                        _this.batchCurrentPage=1;
                    }
            })
        },
        /**
         * 流式列表
         * @param page
         */
        fetchStreamJobMonitorList(page){
            var _this=this;
            var projectId=this.projectId;
            fetchAgent.streamMonitorList({
                projectId,
                page,
                jobAliasName:_this.streamTable.jobAliasName,
                rowCnt:_this.pageSize
            },function(res){
                if(res.code==0){
                    _this.streamData=res.data.list
                    _this.streamTable.totalCount=res.data.total;
                    _this.streamTable.currentPage=res.data.pageNum;
                }else if(res.code==5002){
                    _this.streamData=[]
                    _this.streamTable.totalCount=0;
                    _this.streamTable.currentPage=1;
                }
            })
        },
        onsearchClick(v){
            var _this=this;
            this.fetchStreamJobMonitorList(1)
        },
        toggleTab(activeTabName){
            this.activeTabName=activeTabName;
        },
        /**
         * 重启
         * @param res
         */
        restartJob(res){
            var _this=this;
            MessageBox({
                message:'确定要重启吗？',
                type: 'confirm',
                confirm () {
                    _this.restartBtnDisbled=true
                    fetchAgent.restartJob(res.jobExecutionId,function(res){
                        if(res&&res.code==0){
                            Toast( {message: '重启成功！',
                                duration: 2000})
                            _this.fetchJobMonitorList(1)
                        }else {
                            _this.messageAlert('重启失败！')
                        }
                        _this.restartBtnDisbled=false;
                    })
                }
            })
        },
        loadlog(param){
            let  _this =this;

            if(this.websocketobject&&this.realtime)
            {
                let  projectId = _.currentProjectInfo.get().projectId;

                let sendobj ={handle:"logmessage",verifier:this.verifier,content:{userId:userId,projectId:projectId,executionId:param.jobExecutionId,isfirstsend:_this.isfirstsend,timestamp:_this.timestamp}}

                this.websocketobject.send(JSON.stringify(sendobj));
                this.isfirstsend = false;
            }

            _this.setTimeoutCheckID=setTimeout(function (){
                _this.loadlog(param)
            }.bind(this),_this.refreshs);
        },
        initverifier(){

            /*  let  verifier=  JSON.stringify({userinfo:_.currentUserInfo.get()});
            let clientKey = new nodersa({b: 512});
            let _this =this;
            _.ajax({
                url:'/api/getPublicKey',
                success:function(res){
                    console.log('res.publickey',res.publickey);
                    clientKey.importKey(res.publickey);
                    _this.verifier = clientKey.encrypt(verifier, 'base64');

                    console.log('_this.verifier',_this.verifier);
                },
                error(res){
                }
            })*/

            let _this =this;
           // setTimeout(function () {
                _this.verifier = JSON.stringify({userinfo:_.currentUserInfo.get()});
            //},300)


        },
        onscorllevent(){

            this.hasscroll = true;
        },
        commandlog(event){
            if(event.keyCode ==13){
                if(!this.logsearchKey) return;
                this.logsearchSum=0;
                this.logsearchKey =this.logsearchKey.replace(/^\s+|\s+$/gm,'');

                if(this.logsearchKey.length>0){
                    this.commandList.push(this.logsearchKey);
                    this.commandIndex = 0;
                    //:flt strs 过虑不含strs的记录行
                    if(/^:flt/.test(this.logsearchKey)){
                        this.logsearchKey=this.logsearchKey.replace(':flt','').replace(/^\s+|\s+$/gm,'');
                        this.logList = this.logList.filter((o)=>{
                            return o.log.indexOf(this.logsearchKey)>-1
                        })
                    }
                    //:clear 清屏
                    if(/^:clear/.test(this.logsearchKey)){
                        this.logList =[];
                        this.logsearchKey="";
                        return;
                    }
                    //:find strs 查找strs字符，跟直接输入strs回车一样
                    if(/^:find/.test(this.logsearchKey)){
                        this.logsearchKey=this.logsearchKey.replace(':find','').replace(/^\s+|\s+$/gm,'');
                    }
                    //:exit 退出日志对话框
                    if(/^:exit/.test(this.logsearchKey)){
                        this.closeLogWindow();
                        this.logsearchKey="";
                        return;
                    }
                    //:btm 滚动到最底部
                    if(/^:btm/.test(this.logsearchKey)){
                        gotoBottom();
                        this.logsearchKey="";
                        return;
                    }
                    //:top 滚动到顶部
                    if(/^:top/.test(this.logsearchKey)){
                        let logpanel = document.querySelector(".logpanel");
                        logpanel.scrollTop = 0;
                        this.logsearchKey="";
                        return;
                    }
                    //:maxr 20 日志页最大20行
                    if(/^:maxr/.test(this.logsearchKey)){
                        this.logsearchKey=this.logsearchKey.replace(':maxr','').replace(/^\s+|\s+$/gm,'');
                        if(/^[1-9]\d+$/.test(this.logsearchKey)){
                            if(this.logsearchKey>10000){
                                this.logList.push({id:'',log:`-----行数上限不能大于10000-----`,style:"ERROR"});
                            }else{
                                this.maxrows = this.logsearchKey;
                                this.logList = this.logList.slice(this.logsearchKey*-1);
                                this.logList.push({id:'',log:`-----当前日志监听记录行数上限${this.maxrows}行-----`,style:"INFO"});
                            }
                            gotoBottom();
                        }
                        this.logsearchKey="";
                        return;
                    }
                    //:refi 2000 日志监听刷新间隔2000毫秒
                    if(/^:refi/.test(this.logsearchKey)){
                        this.logsearchKey=this.logsearchKey.replace(':refi','').replace(/^\s+|\s+$/gm,'');
                        if(/^[1-9]\d+$/.test(this.logsearchKey)) {
                            if(this.logsearchKey<100){
                                this.logList.push({id:'',log:`-----时间设置不能少于100毫秒-----`,style:"ERROR"});
                            }
                            else{
                                this.refreshs = this.logsearchKey;
                                this.logList.push({id:'',log:`-----当前日志监听刷新间隔${this.refreshs}毫秒-----`,style:"INFO"});
                            }
                            gotoBottom();
                        }
                        this.logsearchKey="";
                        return;
                    }
                    //:tail 20 显示日志最后20行
                    if(/^:tail/.test(this.logsearchKey)){
                        this.logsearchKey=this.logsearchKey.replace(':tail','').replace(/^\s+|\s+$/gm,'');
                        if(/^[1-9]\d*$/.test(this.logsearchKey)) {
                            this.logList = this.logList.slice(this.logsearchKey*-1);
                            //this.maxrows = this.logsearchKey;
                        }
                        this.logsearchKey="";
                        return;
                    }
                    //:load 重新加载日志
                    if(/^:load/.test(this.logsearchKey)){
                        let logkey = this.logsearchKey;
                        logkey=logkey.replace(':load','').replace(/^\s+|\s+$/gm,'');
                        let currentdate = new Date();
                        if(logkey){
                            logkey=logkey.replace(' ','');
                            if(/^[1-9]\d*(d|D|h|H|m|M)$/.test(logkey)) {
                                let timeType =logkey.charAt(logkey.length - 1).toLocaleLowerCase();
                                let timevalue = logkey.substring(0,logkey.length-1);
                                switch(timeType){
                                    case 'd':
                                        currentdate.setDate(currentdate.getDate() - timevalue);
                                        break;
                                    case 'h':
                                        currentdate.setHours(currentdate.getHours() - timevalue);
                                        break;
                                    case 'm':
                                        currentdate.setMinutes(currentdate.getMinutes() - timevalue);
                                        break;
                                }
                                var vtimestamp = Date.parse(currentdate);
                                this.timestamp=vtimestamp;
                            }else{
                                this.isfirstsend = true;
                            }
                        }else{
                            this.isfirstsend = true;
                        }
                        this.realtime = true;
                        this.logsearchKey="";
                        this.logList.push({id:'',log:`-----日志加载---${currentdate}-----`,style:"INFO"});
                        gotoBottom();
                        return;
                    }


                    let logarray = this.logList;
                    logarray.forEach(lo=>{
                        let reTag = /<[^>]*>/g;
                        lo.log = lo.log.replace(reTag, "");
                        let reTag2 =  new RegExp(this.logsearchKey,'g');
                        if( this.ignorecase ){
                            reTag2 =  new RegExp(this.logsearchKey,'ig');
                        }
                        let replacestr =  lo.log.match(reTag2)// reTag2.exec(lo.log);
                        if(replacestr&&replacestr.length>0){
                            this.logsearchSum+=replacestr.length;
                            lo.log= lo.log.replace(reTag2,`<span style="background-color: yellow;color:black;">${replacestr[0]}</span>`)
                        }
                    })
                    this.logList =logarray;
                    this.logsearchKey="";

                    function gotoBottom() {
                        setTimeout(function () {
                            let doclist =  document.querySelector(".loglist");
                            let logpanel = document.querySelector(".logpanel");
                            logpanel.scrollTop = doclist.offsetHeight;
                        },30)

                    }
                }
            }
            if(this.commandList.length>0) {
                if (event.keyCode == 38) {
                    this.commandIndex = this.commandIndex < 1 ? this.commandList.length-1 : this.commandIndex - 1;
                    this.logsearchKey = this.commandList[this.commandIndex];
                }
                if (event.keyCode == 40) {
                    this.commandIndex = this.commandIndex >= this.commandList.length ? 0 : this.commandIndex + 1;
                    this.logsearchKey = this.commandList[this.commandIndex];
                }
            }
        },
        newline(){
            this.nowarpcss = this.nowarpcss =='nowarpcss'?"warpcss":"nowarpcss";
        },
        ignorecases(){
            this.ignorecase = this.ignorecase?false:true;
        },
        realtimes(){
            this.realtime = this.realtime?false:true;
        },
        closeLogWindow(){
            this.checkmodalDisplay = false;
            this.clearTimeoutCheckID();
            this.commandTip=false;
        },
        showcommandTip(){
            this.commandTip=!this.commandTip;
        }

    }

}