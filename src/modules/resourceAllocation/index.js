import navBar  from '../../admin-ui-extend/components/admin-navbar.vue';
import CONSTANT from 'Utils/constant'
import adPaginator from 'adminUI/components/admin-paginator';
import adSelect from 'adminUI/components/admin-select'
import AdModal from 'adminUI/components/admin-modal'
import AdInput from 'adminUI/components/admin-input'
import toast from 'adminUI/components/admin-toast'
import adCheckbox from 'adminUI/components/admin-checkbox'
import msgBox from 'adminUI/components/admin-message-box/index'
import AdSpinner from 'adminUI/components/admin-spinner'
import base from './base.js'

let _timer = 0;
let _timeOut = 60;

export default {
    name:'resourceAllocation',
    created: function () {
        this.getResourceAllocation();
        this.getTemplate();
    },
    extends:base,
    components: {
        adSelect,
        AdModal,
        AdInput,
        adCheckbox,
        adPaginator,
        navBar,
        AdSpinner,
        toast
    },
    data () {
        return {
            navlist:[{id:1,text:'项目管理',url:''},{id:2,text:'资源配置',url:''}],
            checkboxes:[],
            checkboxValues:[],
            defaultCheckboxValue:'',//java
            addInfo:{
                CPU:'',//CPU
                RAM:'',//内存
                storage:'',//存储
                purpose:''//用途
            },
            addCon : {
                name:"",
                template:"",
                count:"",
                remark:""
            },
            projectId:null,
            options: [],
            adjustTemplateId:'',
            utilValue:'',
            utils:[],
            triggerValue:false,
            modalDisplay: false,
            detail_modalDisplay:false,
            con_modalDisplay :false,
            adjustment_modalDisplay :false,
            tableData:{},
            ProsecutionData:{},
            theResource:{},
            adjustmentObject:{
                id:"",
                name:"",
                template:"",
                count:"",
                remark:""
            },
            requireWarnings:null,
            requireWarnings1: null,
            rCPU:null,
            rRAM:null,
            rStorage:null,
            adCount:{},
            validators:this._validators,
            conWarningsMap:{},
            applyWarningsMap:{},
            dataList:[],
            pager:{
                totalCount:0,
                pageSize:CONSTANT.pageSize,
                currentPage:1
            },
            _interval:null
        }
    },
    mounted: function () {
        this.iniProject();
        this.getEnvironmentList();
    },
    methods: {
        closeApplyHistory:function () {
            this.detail_modalDisplay = false;
        },
        closeConDialog:function () {
            this.con_modalDisplay = false;
            this.cancel();
        },
        closeAdjustDialog:function () {
            this.adjustment_modalDisplay = false;
            this.cancel();
        },
        //初始化项目
        iniProject:function () {
            let that = this;
            try{
                that.projectId = _.currentProjectInfo.get().projectId;
                that.getResourceAllocation();
                that.getProsecution();
                that.getResourceByCurPro();
            }catch (e){
                console.log(e)
            }


        },
        //初始化容器模板
        getTemplate:function () {
            let that = this;
            _.ajax({
                url: '/api/resourceallocation/getreourcetemplae',
                method: 'post',
                data: {},
                success: function (res) {
                    if(res.code ==="0"){
                        res.data.forEach((m)=>{
                            that.utils.push({
                                text:m.resourceCpu+"c, "+m.resourceMemory+"g",
                                value:m.resourceTemplateId
                            })
                        });
                        if(res.data && res.data.length>0){
                            that.utilValue=res.data[0].resourceTemplateId;
                        }
                    }
                }
            });
        },
        //分页页码切换
        togglePage:function(pIndex){
            this.getResourceAllocation(pIndex);
            this.getResourceByCurPro();
        },
        //获取所有容器
        getResourceAllocation:function(pageIndex){
            if(!this.projectId){
                return;
            }
            if (!/^[0-9]+$/.test(pageIndex)){
                pageIndex=1;
            }else {
                pageIndex = pageIndex < 1 ? 1 : pageIndex;
            }

            let that = this;
            _.ajax({
                url:'/api/resourceallocation/getresourceallocation',
                method:'post',
                data:{
                    url:'/list/'+that.projectId+'/'+pageIndex+'/'+that.pager.pageSize
                },
                success:function(res){
                    if(res.code ==="0"){
                        that.dataList = res.data.list;
                        that.pager.totalCount = res.data.total;
                        that.pager.currentPage = res.data.pageNum;
                    }
                }
            })

        },
        //项目切换
        change (v, e) {
            this.singleBoxValue = e.target.checked
        },
        //修改容器状态
        oper (item,status){
            let that = this;
            if(item.instanceId){
                //容器状态操作
                if(status =='start'){
                    msgBox({
                        message:"确认启动该容器？",
                        type:'confirm',
                        confirm(){
                            //$("body").prepend($("#data-resourceAll-spinner"));
                            //$("#data-resourceAll-spinner:first").show();
                            //that._interval = null;
                            //_timer = 0;
                            // 不再使用轮询方式查找状态
                            that.startInstance(item)
                            // that._interval = setInterval(function () {
                            //     that.getConStatus(item.projectId,item.groupName,'start');
                            // },2000);
                            //that.operDataToServer('/start',item.instanceId);
                        }
                    })
                }else if(status =="destroy"){

                    msgBox({
                        message:"确认销毁该容器？",
                        type:'confirm',
                        confirm(){
                            that.operDataToServer('/destroy',item.instanceId)
                        }
                    })
                }else if(status =='stop'){

                    msgBox({
                        message:"确认停止该容器？",
                        type:'confirm',
                        confirm(){
                            $("body").prepend($("#data-resourceAll-spinner"));
                            $("#data-resourceAll-spinner:first").show();
                            that._interval = null;
                            _timer = 0;
                            that._interval = setInterval(function () {
                                that.getConStatus(item.projectId,item.groupName,'stop');
                            },2000);
                            that.operDataToServer('/stop',item.instanceId);
                        }
                    })
                }
            }

        },
        //启动容器
        startInstance:function(item){
            //不用等待状态修改后的回数，当启动开始时，将转台改成“启动中”
            item.commonStatus.statusCode='2117';
            item.commonStatus.statusName ='启动中';
            _.ajax({
                url:'/api/resourceallocation/opercon',
                method:'post',
                data:{
                    "url":'/start',
                    "instanceId":item.instanceId
                }
            })
        },
        operDataToServer:function (_url,instanceId) {
            let that = this;
            _.ajax({
                url:'/api/resourceallocation/opercon',
                method:'post',
                data:{
                    "url":_url,
                    "instanceId":instanceId
                },
                success:function(res){
                    //不用等待状态修改后的回数，当启动开始时，将转台改成“启动中”
                    if(res.code !=="0"){
                        let _m = res.msg;
                        _timer = 0;
                        clearInterval(that._interval);
                        $("#data-resourceAll-spinner").hide();
                        msgBox({
                            message:_m,
                            type: 'alert',
                            confirm () {}
                        })
                    }else {
                        if(_url.indexOf('/start')==0){
                        }else if(_url.indexOf('/stop')==0){
                        }else{
                            that.getResourceByCurPro();
                            that.getResourceAllocation();
                            toast({
                                message:res.msg,
                                duration: 1000
                            })
                        }
                    }
                }
            })
        },
        //获取容器状态
        getConStatus:function (projectId,groupName,oper) {
            let that = this;
            _.ajax({
                url: '/api/resourceallocation/getinfo',
                method: 'post',
                data: {
                    "projectId":projectId,
                    "groupName":groupName
                },
                success: function (res) {
                    _timer +=2;
                    if (_timer >=_timeOut){
                        _timer = 0;
                        clearInterval(that._interval);
                        $("#data-resourceAll-spinner").hide();
                        let _msg = oper ==='start' ? '启动' : '停止';
                        msgBox({
                            message: _msg + '超时',
                            type: 'alert',
                            confirm () {}
                        });
                        return;
                    }

                    if(res && res.code ==="0"){
                        if(oper ==='start'){
                            if(res.data==='RUNNING'){
                                //启动成功
                                _timer = 0;
                                clearInterval(that._interval);
                                $("#data-resourceAll-spinner").hide();
                                that.getResourceAllocation();
                                toast({
                                    message:'启动成功',
                                    duration: 1000
                                })
                            }
                        }else {
                            //stop
                            if(res.data ==='STOPPED'){
                                //停止成功
                                _timer = 0;
                                clearInterval(that._interval);
                                $("#data-resourceAll-spinner").hide();
                                that.getResourceAllocation();
                                toast({
                                    message:'停止成功',
                                    duration: 1000
                                })
                            }
                        }
                    }else {
                        clearInterval(that._interval);
                        $("#data-resourceAll-spinner").hide();
                        msgBox({
                            message:res.msg,
                            type: 'alert',
                            confirm () {}
                        });
                    }
                }
            });
        },
        //申请历史
        getProsecution:function(){
            let that = this;
            _.ajax({
                url:'/api/resourceallocation/getprosecution',
                method:'post',
                data:{
                    "projectId":this.projectId
                },
                success:function(res){
                    if(res.code ==="0"){
                        that.ProsecutionData = res.data;
                        that.ProsecutionData.forEach((m)=>{
                            m.createTime = _.date2String(new Date(m.createTime),'yyyy-MM-dd hh:mm:ss');
                            m.updateTime =m.updateTime? _.date2String(new Date(m.updateTime),'yyyy-MM-dd hh:mm:ss'):'';
                        });
                    }
                }
            })
        },
        //申请资源
        saveRes () {
            let that = this;
            that.validateNotEmptyApply(this.addInfo.CPU,"CPU");
            that.validateNotEmptyApply(this.addInfo.RAM,"RAM");
            that.validateNotEmptyApply(this.addInfo.storage,"storage");
            that.txtAreaVali(this.addInfo.purpose);
            if(!_.validate(that.applyWarningsMap)){
                return true;
            }
            _.ajax({
                url: '/api/resourceallocation/addprosecution',
                method: 'post',
                data: {
                    "projectId": this.projectId,
                    "cpu":this.addInfo.CPU,
                    "memory":this.addInfo.RAM,
                    "storage":this.addInfo.storage,
                    "reason":this.addInfo.purpose
                },
                success: function (res) {
                    if(res.code ==="0"){
                        toast({
                            message:'添加资源成功',
                            duration: 1000
                        })
                        that.getProsecution();
                    }else {
                        msgBox({
                            message:"添加资源失败",
                            type:'alert',
                            confirm(){}
                        })
                    }
                }
            });

            this.addInfo ={
                CPU:'',//CPU
                RAM:'',//内存
                storage:'',//存储
                purpose:''//用途
            }

            return false;
        },
        //取消申请资源
        cancelApply:function() {
            this.modalDisplay = false;
            this.addInfo = {
                CPU: '',//CPU
                RAM: '',//内存
                storage: '',//存储
                purpose: ''//用途
            };
            this.applyWarningsMap = {};

        },
        validateCheckBox:function(v){
            if(v.length ==0){
                this.$set(this.conWarningsMap, "environment", ['请选择执行环境'])
            }else{
                this.$set(this.conWarningsMap, "environment", null)
            }
        },
        //取消创建容器
        cancel:function(){
            this.validators = [{validator: function () { return true }}];
            this.addCon.name="";
            this.addCon.template="";
            this.checkboxValues=[this.defaultCheckboxValue];
            this.addCon.count="";
            this.addCon.remark="";
            this.conWarningsMap={};
        },
        //打开创建容器模板
        showConModal () {
            this.checkboxValues = [this.defaultCheckboxValue];
            this.con_modalDisplay = true;
        },
        //创建容器请求
        createCon () {
            let that= this;

            that.validateNotEmpty(that.addCon.name,"name");
            that.validateNotEmpty(that.addCon.count,"count");
            that.validateNotEmpty(that.addCon.remark,"remark");

            that.validateCheckBox(that.checkboxValues);
            if(!_.validate(that.conWarningsMap)){
                return true;
            }

            _.ajax({
                url: '/api/resourceallocation/addresourceallocation',
                method: 'post',
                data: {
                    projectId:this.projectId,
                    groupName:this.addCon.name,
                    resourceTemplateId:this.utilValue,
                    instanceSize:this.addCon.count,
                    environmentIdList:JSON.stringify(that.checkboxValues),//"Java8" 1
                    instanceDesc:this.addCon.remark
                },
                success: function (res) {
                    if(res.code === "0"){
                        toast({
                            message:'创建容器成功',
                            duration: 1000
                        })
                        that.getResourceByCurPro();
                        that.getResourceAllocation();
                    }else {
                        msgBox({
                            message:res.msg,
                            type: 'alert',
                            confirm () {}
                        })
                    }
                }
            });

            this.addCon.name="";
            this.addCon.template="";
            this.checkboxValues=[this.defaultCheckboxValue];
            this.addCon.count="";
            this.addCon.remark="";


            return false;

        },
        //编辑的时候，绑定数据操作
        showAdjustment (item) {
            this.adCount ={};
            this.adjustment_modalDisplay = true;
            this.adjustmentObject.id= item.instanceId;
            this.adjustmentObject.name= item.groupName;
            this.adjustTemplateId= item.resourceTemplate.resourceTemplateId;
            item.environmentInfoList.forEach((m)=>{
                this.checkboxValues.push(m.environmentId);
            })

            this.adjustmentObject.count=item.instanceSize;
            this.adjustmentObject.remark=item.instanceDesc;

        },
        //容器数量调整
        adjustment (){
            if(!/^[1-9]\d*$/g.test(this.adjustmentObject.count)){
                this.$set(this.adCount, "count", ['必须为正整数']);
                return true;
            }else{
                var adjustData = {
                    "instanceId":this.adjustmentObject.id,
                    "instanceSize":this.adjustmentObject.count,
                    "instanceDesc":this.adjustmentObject.remark
                };
                var that = this;
                _.ajax({
                    url: '/api/resourceallocation/adjust',
                    method: 'post',
                    data: adjustData,
                    success: function (res) {
                        if(res.code=="0"){
                            toast({
                                message:'调整成功',
                                duration: 1000
                            })
                            that.getResourceByCurPro();
                            that.getResourceAllocation();
                        }else {
                            msgBox({
                                message:res.msg,
                                type: 'alert',
                                confirm () {}
                            })
                        }
                    }
                });
            }

        },
        //显示申请资源窗口
        showModal () {
            this.modalDisplay = true;
            this.validators=this._validators;
        },
        //显示申请历史窗口
        showDetailModal () {
            this.detail_modalDisplay = true;
        },
        //获取环境url
        getEnvironmentList (){
            let that = this;
            _.ajax({
                url: '/api/resourceallocation/environment',
                method: 'post',
                data: {},
                success: function (res) {
                    if(res.code=="0"){
                        res.data.forEach((m)=>{
                            that.checkboxes.push({
                                value:m.environmentId,
                                text:m.environmentName
                            });
                        })
                        if(res.data && res.data.length && res.data.length > 0){
                            that.checkboxValues = [res.data[0].environmentId];
                            that.defaultCheckboxValue = res.data[0].environmentId;
                        }

                    }else {
                        msgBox({
                            message:'获取环境列表整异常',
                            type: 'alert',
                            confirm () {}
                        })
                    }
                }
            });
        },
        //根据当前项目获取可用配资源
        getResourceByCurPro:function(){

            let that = this;
            _.ajax({
                url: '/api/resourceallocation/availableresource',
                method: 'post',
                data: {
                    "url":'/'+that.projectId
                },
                success: function (res) {
                    if(res.code=="0"){
                        that.theResource ={
                            CPU:res.data.resourceCpu? res.data.resourceCpu +"  C" :"0  C",
                            RAM:res.data.resourceMemory?res.data.resourceMemory +"  G":"0  G",
                            storage:res.data.resourceStorage ?res.data.resourceStorage +"  G":"0  G"
                        }
                    }else{
                        that.theResource ={
                            CPU:"0  C",
                            RAM:'0  G',
                            storage:'0  G'
                        }
                    }
                }
            });


        }
    },
    computed:{
        _validators (){
            return [
                {
                    validator (v) {
                        return /^[1-9]\d*$/g.test(v)
                    },
                    warning: '必须为正整数'
                }
            ];
        }
    }
}