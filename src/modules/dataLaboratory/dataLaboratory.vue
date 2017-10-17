<style lang="scss">
    .dataLaboratory{
        table.admin-table{
            width:100%;
            min-width: 900px;
        }
        table tr th{
            text-align: center;
            min-width: 100px;
        }
        .ad-input-core{
            width: 540px;
        }
        .dataLaboratory-dialog{
            .admin-input{
                width:560px;
            }
        }
    }
</style>
<template>
<div class="dataLaboratory">

    <nav-bar :nav-list="navlist" ></nav-bar>
    <div class="chorus-toolbar">
        <div class="toolbar-r">
            <div @click="showCreateModal=true"><button class="chorus-button admin-small">新建</button></div>
        </div>
    </div>
    <div class="chorus-grid-wrapper">
        <table class="admin-table admin-striped">
            <thead>
            <tr>
                <th>实验室名称</th>
                <th>实验室编码</th>
                <th>实验室描述</th>
                <th>实验室状态</th>
                <th>创建人</th>
                <th>创建时间</th>
                <th style="width:400px;">操作</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in dataList">
                <td>{{item.labName}}</td>
                <td>{{item.labCode}}</td>
                <td>{{item.labDesc}}</td>
                <td>{{item.labStatus}}</td>
                <td>{{item.createUserName}}</td>
                <td>{{item.createTime}}</td>
                <td>
                    <button class="chorus-button admin-small" :disabled="item.labStatusCode == '1'" @click="startLab(item.labCode)">启动</button>
                    <button class="chorus-button admin-small" :disabled='item.labStatusCode == "2"' @click="stopLab(item.labCode)">停止</button>
                    <button class="chorus-button admin-small" :disabled='item.labStatusCode == "1"' @click="deleteLab(item.labCode)">销毁</button>
                    <button class="chorus-button admin-small" :disabled='item.labStatusCode == "2"' @click="comeInLab(item.labCode)">进入实验室</button>
                </td>
            </tr>
            <tr v-if="dataList.length === 0"><td colspan="7" style="text-align: center;">暂无数据</td></tr>
            </tbody>
            <tfoot>
            </tfoot>
        </table>
    </div>
    <div  style="text-align: right;">
        <ad-paginator :total-count="pager.totalCount" :page-size="pager.pageSize" :current-page="pager.currentPage"  @toggle-page="togglePage($event)"></ad-paginator>
    </div>
    <ad-modal
            title="实验室创建"
            :display="showCreateModal"
            width="640px"
            height="540px"
            :buttons="[
                {
                        text: '取消',
                        name: 'cancel',
                        buttonClass:'admin-small',
                        handler: '() => {this.showCreateModal = false;}'
                },
                {
                        text: '确定',
                        name: 'ok',
                        buttonClass:'admin-small',
                        handler: createDataLab
                    }]"
            @admin-modal-off="() => {showCreateModal = false;}">

        <div class="dataLaboratory-dialog" style="padding:10px;">
            <div style="padding: 10px;">
                <ad-input
                    label="实验室名称："
                    placeholder=""
                    :warnings="warningsMap['labName']"
                    @blur="validateNotEmpty(addModel.labName, 'labName')"
                    v-model="addModel.labName"
                    value=""
                ></ad-input>
            </div>
            <div style="padding: 10px;">
                <ad-input
                    label="实验室编码："
                    placeholder=""
                    :warnings="warningsMap['labCode']"
                    @blur="validateNotEmpty(addModel.labCode, 'labCode')"
                    v-model="addModel.labCode"
                    value=""
                ></ad-input>
            </div>
            <div style="padding: 10px;">
                <ad-input
                    type="textarea"
                    placeholder=""
                    label="实验室描述："
                    :warnings="warningsMap['labDesc']"
                    @keyup="validateNotEmpty(addModel.labDesc, 'labDesc')"
                    v-model="addModel.labDesc"
                    value=""
                ></ad-input>
            </div>

        </div>
    </ad-modal>
    <div style="display: none;">
        <div id="data-lab-spinner" style="position: fixed;
        width: 100%;height: 100%;
        padding-left:45%;
        padding-top: 20%;
        display: flex;
        flex-flow: row;
        z-index: 999999;
        background-color:rgba(0,0,0,.75)">
            <ad-spinner type="circle" color="#0e9ee2;" size="50px"></ad-spinner>
        </div>
    </div>
</div>
</template>
<script>
    let _timer = 0;
    let _timeOut = 60;
    import navBar  from '../../admin-ui-extend/components/admin-navbar.vue';
    import CONSTANT from '../../js/utils/constant.js'
    import adSelect from '../../admin-ui/components/admin-select'
    import AdModal from '../../admin-ui/components/admin-modal'
    import AdInput from '../../admin-ui/components/admin-input'
    import AdSpinner from '../../admin-ui/components/admin-spinner'
    import adPaginator from '../../admin-ui/components/admin-paginator';
    import msgBox from '../../admin-ui/components/admin-message-box/index.js'
    import toast from '../../admin-ui/components/admin-toast'
    
    export default {
        name:'dataLaboratory',
        mounted: function () {
            this.iniProject()
        },
        components: {
            adSelect,
            AdModal,
            AdInput,
            AdSpinner,
            adPaginator,
            navBar,
            toast
        },
        data () {
            return {
                navlist:[{id:1,text:'数据分析',url:''},{id:2,text:'数据实验室',url:''}],
                showCreateModal:false,
                projectCode:'',
                dataList:{},
                warningsMap:{},
                addModel:{},
                _interval:null,
                pager:{
                    totalCount:0,
                    pageSize:CONSTANT.pageSize,
                    currentPage:1,
                }
            }
        },
        watch:{
            showCreateModal(v){
                if(!v){
                    this.addModel ={};
                    this.warningsMap={};
                }
            }
        },
        methods:{
//            proChanage:function (s) {
//                this.projectCode = s.value;
//                this.getPagerData();
//            },
            togglePage:function (e) {
                this.getPagerData(e);
            },
            alert:function (message) {
                msgBox({
                    message,
                    type: 'alert',
                    confirm () {}
                })
            },
            confirm:function(message,operator,labCode){
                let that = this;
                msgBox({
                    message,
                    type:'confirm',
                    confirm(){
                        switch (operator){
                            case 'deleteLab':
                                _.ajax({
                                    url:'/api/datalaboratory/delete',
                                    method:'post',
                                    data:{
                                        url:'/'+that.projectCode+'/'+labCode+'/delete'
                                    },
                                    success:function(res){
                                        if(res.code ==="0"){
                                            toast({
                                                duration:1000,
                                                message:'销毁成功'
                                            })
                                            that.getPagerData();
                                        }else {
                                            msgBox({
                                                message:"销毁失败",
                                                type: 'alert',
                                                confirm () {}
                                            })
                                        }
                                    }
                                })
                                break;
                            case 'stopLab':
                                _.ajax({
                                    url:'/api/datalaboratory/stop',
                                    method:'post',
                                    data:{
                                        url:'/'+that.projectCode+'/'+labCode+'/stop'
                                    },
                                    success:function(res){
                                        if(res.code ==="0"){
                                            that.getPagerData();
                                        }
                                    }
                                })
                                break;
                            case 'startLab':
                                _timer = 0;
                                $("body").prepend($("#data-lab-spinner"));
                                $("#data-lab-spinner:first").show();
                                _.ajax({
                                    url:'/api/datalaboratory/start',
                                    method:'post',
                                    data:{
                                        url:'/'+that.projectCode+'/'+labCode+'/start'
                                    },
                                    success:function(res){
                                        if(res.code ==="6035") {
                                            $("#data-lab-spinner:first").hide();
                                            that.getPagerData();
                                            that.alert(res.msg);
                                        }else if(res.code ==="0"){
                                            that._interval = null;
                                            that._interval = setInterval(function () {
                                                that.alive(labCode);
                                            },2000)
                                        }
                                    }
                                })
                                break;
                            default:
                                break;
                        }

                    }
                });
            },
            alive:function (labCode) {
                let that = this;
                _.ajax({
                    url:'/api/datalaboratory/alive',
                    method:'post',
                    data:{
                        url:'/'+that.projectCode+'/'+labCode+'/alive'
                    },
                    success:function(res){
                        if(res){
                            that.getPagerData();
                            clearInterval(that._interval);
                            $("#data-lab-spinner:first").hide();
                            toast({
                                duration:1000,
                                message:'启动成功'
                            })
                        }else {
                            _timer +=2;
                            if (_timer >=_timeOut){
                                clearInterval(that._interval);
                                $("#data-lab-spinner:first").hide();
                                that.alert('启动超时');
                                that.getPagerData();
                            }
                        }

                    }
                })
            },
            startLab:function (labCode) {
                this.confirm('确认启动该实验室？','startLab',labCode);
            },
            stopLab:function (labCode) {
                this.confirm('确认停止该实验室？','stopLab',labCode);
            },
            deleteLab:function (labCode) {
                this.confirm('确认销毁该实验室？','deleteLab',labCode);
            },
            comeInLab:function (labCode) {
                let tempUrl = CONSTANT.laboratoryPageUrl;
                tempUrl = tempUrl.replace('{projectCode}',this.projectCode).replace('{labCode}',labCode);
                window.open(tempUrl);
            },
            createDataLab:function () {
                let _addM = {};
                _addM["labName"]=this.addModel.labName;
                _addM["labCode"]=this.addModel.labCode;
                _addM["labDesc"]=this.addModel.labDesc;
                //_addM["createUserName"]=_curUser;
                _addM["projectCode"]=this.projectCode;

                this.validateNotEmpty(this.addModel.labName,'labName');
                this.validateNotEmpty(this.addModel.labCode,'labCode');
                this.validateNotEmpty(this.addModel.labDesc,'labDesc');

                let that = this;
                if(!_.validate(that.warningsMap)){
                    return true;
                }
                that.addModel ={};

                _.ajax({
                    url:'/api/datalaboratory/create',
                    method:'post',
                    data:_addM,
                    success:function(res){
                        if(res.code ==="0"){
                            that.getPagerData();
                            that.showCreateModal=false;
                            toast({
                                duration:1000,
                                message:'创建实验室成功'
                            })
                        }else {
                            console.log("新建实验室失败：",res);
                            msgBox({
                                message:"新建实验室失败",
                                type: 'alert',
                                confirm () {}
                            });
                        }
                    }
                })
            },
            validateNotEmpty:function(v, key){
                if(!v || /^\s+$/.test(v) || v.length ==0){
                    this.$set(this.warningsMap, key, ['不能为空'])
                }else if(key === 'labCode' && !/^[a-zA-Z]+$/g.test(v)){
                    this.$set(this.warningsMap, key, ['必须为字母'])
                }else if(key === 'labDesc' && v.length>100){
                    this.$set(this.warningsMap, key, ['长度不能超过100个汉字'])
                }else {
                    this.$set(this.warningsMap, key, null)
                }
            },
            iniProject:function () {
                let that = this;
                that.projectCode=_.currentProjectInfo.get().projectCode;
                that.getPagerData();
            },
            getPagerData:function (pageIndex) {
                if (!/^[0-9]+$/.test(pageIndex)){
                    pageIndex=1;
                }else {
                    pageIndex = pageIndex < 1 ? 1 : pageIndex;
                }

                let that = this;
                _.ajax({
                    url:'/api/datalaboratory/getdatalablist',
                    method:'post',
                    data:{
                        url:'/'+that.projectCode+'/'+pageIndex+'/'+that.pager.pageSize
                    },
                    success:function(res){

                        if(res.code ==="0"){
                            res.data.list.forEach((m)=>{
                                m.createTime = _.date2String(new Date(m.createTime),'yyyy-MM-dd hh:mm:ss');
                            });
                            that.dataList = res.data.list;
                            that.pager.totalCount = res.data.total;
                            that.pager.currentPage = res.data.pageNum;
                        }
                    }
                })
            }
        }
    }
</script>