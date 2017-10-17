<style lang="scss">
    .resources-application{

        table tr td,table tr th{
            line-height:24px;
        }
        #hasOper,#waitingOper,#hasCommit{
            padding:10px 0px;
        }
        table tr td{
            text-align:left;
        }
        textarea.admin-input-core{
            width:460px;
        }
        table.showDialog{
            width:460px;
        }
        .admin-input .admin-input-core{
            height: 100px;
            line-height: 1em;
        }
    }    
</style>
<template>
<div class="resources-application" style="position: relative;">
    <nav-bar :nav-list="navlist" ></nav-bar>
    <ad-tabs :tabs="tabs" :current-tab-name="activeTabId" style="height:800px;">
        <div name="waitingOper" id="waitingOper" >
            <div class="chorus-grid">
                <table class="admin-table admin-striped">
                    <thead>
                    <tr>
                        <th>申请项目</th>
                        <th>申请人</th>
                        <th>申请时间</th>
                        <th>申请资源明细</th>
                        <th>用途说明</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="item in pendingDataList.list">
                        <td>{{item.projectName}}</td>
                        <td>{{item.createUserName}}</td>
                        <td>{{item.createTime}}</td>
                        <td>CPU:{{item.cpu}}C 内存:{{item.memory}}G 存储:{{item.storage}}G</td>
                        <td>{{item.reason}}</td>
                        <td style="text-align: center;">
                            <button class="chorus-button admin-small" @click="manageShow(item.operationId)">处理</button>
                        </td>
                    </tr>
                    <tr v-if="pendingDataList.list && pendingDataList.list.length === 0"><td colspan="6" style="text-align: center;">暂无数据</td></tr>
                    </tbody>
                    <tfoot>

                    </tfoot>
                </table>
            </div>
            <div  style="text-align: right;">
                <ad-paginator :total-count="pendingPager.totalCount" :page-size="pendingPager.pageSize" :current-page="pendingPager.currentPage"  @toggle-page="pendingTogglePage($event)"></ad-paginator>
            </div>
        </div>
        <div name="hasOper" id="hasOper" >
            <div class="chorus-grid">
                <table class="admin-table admin-striped">
                    <thead>
                    <tr>
                        <th>申请项目</th>
                        <th>申请人</th>
                        <th>申请时间</th>
                        <th>申请资源</th>
                        <th>申请原因</th>
                        <th>处理时间</th>
                        <th>处理人</th>
                        <th>备注</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="item in approvedDataList.list">
                        <td>{{item.projectName}}</td>
                        <td>{{item.createUserName}}</td>
                        <td>{{item.createTime}}</td>
                        <td>CPU:{{item.cpu}}C 内存:{{item.memory}}G 存储:{{item.storage}}G</td>
                        <td>{{item.reason}}</td>
                        <td>{{item.updateTime}}</td>
                        <td>{{item.updateUserName}}</td>
                        <td>{{item.notes}}</td>
                    </tr>
                    <tr v-if="approvedDataList.list && approvedDataList.list.length === 0"><td colspan="8" style="text-align: center;">暂无数据</td></tr>
                    </tbody>

                </table>
            </div>
            <div  style="text-align: right;">
                <ad-paginator :total-count="approvedPager.totalCount" :page-size="approvedPager.pageSize" :current-page="approvedPager.currentPage"  @toggle-page="approvedTogglePage($event)"></ad-paginator>
            </div>
        </div>
        <div name="hasCommit" id="hasCommit">
            <div class="chorus-grid">
                <table class="admin-table admin-striped">
                    <thead>
                    <tr>
                        <th>申请项目</th>
                        <th>申请人</th>
                        <th>申请时间</th>
                        <th>申请资源</th>
                        <th>申请原因</th>
                        <th>处理时间</th>
                        <th>处理人</th>
                        <th>备注</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="item in deniedDataList.list">
                        <td>{{item.projectName}}</td>
                        <td>{{item.createUserName}}</td>
                        <td>{{item.createTime}}</td>
                        <td>CPU:{{item.cpu}}C 内存:{{item.memory}}G 存储:{{item.storage}}G</td>
                        <td>{{item.reason}}</td>
                        <td>{{item.updateTime}}</td>
                        <td>{{item.updateUserName}}</td>
                        <td>{{item.notes}}</td>
                    </tr>
                    <tr v-if="deniedDataList.list && deniedDataList.list.length === 0"><td colspan="8" style="text-align: center;">暂无数据</td></tr>
                    </tbody>
                </table>
            </div>
            <div  style="text-align: right;">
                <ad-paginator :total-count="deniedPager.totalCount" :page-size="deniedPager.pageSize" :current-page="deniedPager.currentPage"  @toggle-page="deniedTogglePage($event)"></ad-paginator>
            </div>
        </div>


    </ad-tabs>
    <div style="position: absolute;top: 65px;right: 0px;font-size: 14px;">
        <span>剩余</span>
        <span>CPU:<span style="color: green;font-size: 16px;">{{leftresouce.cpu}}</span>个</span>
        <span>内存：<span style="color: green;font-size: 16px;">{{leftresouce.memory}}</span> GB</span>
        <span>存储：<span style="color: green;font-size: 16px;">{{leftresouce.storage}}</span> GB</span>
    </div>
    <admin-modal
        title="资源申请处理"
        :display="isShowManageDialog"
        width="540px"
        height="380px"
        :buttons="[
            {
                    text: '取消',
                    name: 'cancel',
                    buttonClass:'admin-small',
                    handler: 'closeDialog'
             },
            {
                text: '通过',
                name: 'approved',
                buttonClass:'admin-small',
                handler: approved
            },
            {
                text: '不通过',
                name: 'reject',
                buttonClass:'admin-small',
                handler: reject
            }]"
        @admin-modal-off="closeDialog">
        <div style="padding: 10px;">
              <div  style="padding: 10px;">
                <div style="padding-bottom:10px;">处理说明：</div>
                <div style="padding:0px;">
                    <ad-input
                        type="textarea"
                        label=""
                        v-model="showManageData.description"
                        :warnings="warningsMap['description']"
                        @keyup="validateNotEmpty"
                        placeholder="">
                        </ad-input>
                </div>
                  <div style="padding-top: 10px; line-height: 1.4em;color: red;">
                    1、创建文件系统目录，添加磁盘配额。<br/>
                    2、创建队列，分配资源百分比。
                  </div>
            </div>

        </div>
    </admin-modal>

</div>
</template>
<script>
import navBar  from '../../admin-ui-extend/components/admin-navbar.vue';
import adTabs from '../../admin-ui/components/admin-tabs'
import adminModal from '../../admin-ui/components/admin-modal'
import AdInput from '../../admin-ui/components/admin-input'
import toast from '../../admin-ui/components/admin-toast'
import adPaginator from '../../admin-ui/components/admin-paginator';
import msgBox from '../../admin-ui/components/admin-message-box/index.js'
import CONSTANT from '../../js/utils/constant.js'


export default{
    name:"dataAccess",
    data (){
        return {
            navlist:[{id:1,text:'平台管理',url:''},{id:2,text:'申请资源处理',url:''}],
            project:{},
            leftresouce:{"cpu":0,"memory":0,"storage":0},
            isShowManageDialog:false,
            showManageData:{
                operationId:"",
                description:""
            },
            warningsMap:{},
            showHasOperData:{},
            showHasCommitData:{},
            activeTabId: 'waitingOper',
            tabs: [
                {
                    name: 'waitingOper',
                    text: '待审批资源申请'
                },
                {
                    name: 'hasOper',
                    text: '已通过资源申请'
                },
                 {
                    name: 'hasCommit',
                    text: '已拒绝资源申请'
                }
            ],
            pendingDataList:{},
            approvedDataList:{},
            deniedDataList:{},

            pendingPager:{
                totalCount:0,
                pageSize:CONSTANT.pageSize,
                currentPage:1
            },
            approvedPager:{
                totalCount:0,
                pageSize:CONSTANT.pageSize,
                currentPage:1,
            },
            deniedPager:{
                totalCount:0,
                pageSize:CONSTANT.pageSize,
                currentPage:1
            }
        }
    },
    mounted: function () {
        this.iniProject();
    },
    components:{
        adTabs,
        adminModal,
        AdInput,
        adPaginator,
        navBar,
        toast
    },
    methods:{
        validateNotEmpty:function (v) {
            if(v.length>100){
                this.$set(this.warningsMap, "description", ['长度不能超过100个汉字'])
            }else {
                this.$set(this.warningsMap, "description", null)
            }
        },
        closeDialog:function () {
            this.isShowManageDialog = false;
            this.showManageData.description =""
        },
        //初始化项目
        iniProject:function () {
            this.pendingList();
            this.approvedList();
            this.deniedList();
            this.leftResouce();
        },
        leftResouce:function(){

            let that = this;
            _.ajax({
                url:'/api/resourcesapplication/left',
                method:'post',

                success:function(res){
                    if(res.code ==="0") {
                        that.leftresouce =res.data;
                    }
                }
            })

        },
        pendingList:function(pageIndex){
            if (!/^[0-9]+$/.test(pageIndex)){
                pageIndex=1;
            }else {
                pageIndex = pageIndex < 1 ? 1 : pageIndex;
            }
            let that = this;
            _.ajax({
                url:'/api/resourcesapplication/pending',
                method:'post',
                data:{
                    url:'/'+pageIndex+'/'+that.pendingPager.pageSize
                },
                success:function(res){
                    if(res.code ==="0"){

                        res.data.list.forEach((m)=>{
                            m.createTime = _.date2String(new Date(m.createTime),'yyyy-MM-dd hh:mm:ss');
                            m.updateTime =m.updateTime? _.date2String(new Date(m.updateTime),'yyyy-MM-dd hh:mm:ss'):'';
                        });
                        that.pendingDataList = res.data;
                        that.pendingPager.totalCount = res.data.total;
                        that.pendingPager.currentPage = res.data.pageNum;
                    }
                }
            })

        },
        approvedList:function(pageIndex){
            if (!/^[0-9]+$/.test(pageIndex)){
                pageIndex=1;
            }else {
                pageIndex = pageIndex < 1 ? 1 : pageIndex;
            }
            let that = this;
            _.ajax({
                url:'/api/resourcesapplication/approved',
                method:'post',
                data:{
                    url:'/'+pageIndex+'/'+that.approvedPager.pageSize
                },
                success:function(res){
                    //console.log("approved",res.data.list);
                    if(res.code ==="0"){
                        res.data.list.forEach((m)=>{
                            m.createTime = _.date2String(new Date(m.createTime),'yyyy-MM-dd hh:mm:ss');
                            m.updateTime =m.updateTime? _.date2String(new Date(m.updateTime),'yyyy-MM-dd hh:mm:ss'):'';
                        });
                        that.approvedDataList = res.data;
                        that.approvedPager.totalCount = res.data.total;
                        that.approvedPager.currentPage = res.data.pageNum;
                    }
                }
            })

        },
        deniedList:function(pageIndex){
            if (!/^[0-9]+$/.test(pageIndex)){
                pageIndex=1;
            }else {
                pageIndex = pageIndex < 1 ? 1 : pageIndex;
            }
            let that = this;
            _.ajax({
                url:'/api/resourcesapplication/denied',
                method:'post',
                data:{
                    url:'/'+pageIndex+'/'+that.deniedPager.pageSize
                },
                success:function(res){
                    if(res.code ==="0"){
                        res.data.list.forEach((m)=>{
                            m.createTime = _.date2String(new Date(m.createTime),'yyyy-MM-dd hh:mm:ss');
                            m.updateTime =m.updateTime? _.date2String(new Date(m.updateTime),'yyyy-MM-dd hh:mm:ss'):'';
                        });
                        that.deniedDataList = res.data;
                        that.deniedPager.totalCount = res.data.total;
                        that.deniedPager.currentPage = res.data.pageNum;
                    }
                }
            })

        },
        pendingTogglePage:function (pIndex) {
            this.pendingList(pIndex);
        },
        approvedTogglePage:function (pIndex) {
            this.approvedList(pIndex);
        },
        deniedTogglePage:function (pIndex) {
            this.deniedList(pIndex)
        },
        manageShow:function(operationId){
            this.showManageData.operationId = operationId;
            this.isShowManageDialog = true;
        },
        approved:function(){
            this.validateNotEmpty(this.showManageData.description);

            if(!_.validate(this.warningsMap)){
                return true;
            }

            // 审核通过
            msgBox({
                message: "确认通过？",
                type: 'confirm',
                confirm: function (){
                    _.ajax({
                        url:'/api/resourcesapplication/approve',
                        method:'post',
                        data:{
                            operationId:this.showManageData.operationId,
                            approve:true,
                            projectCode:_.currentProjectCode.get(),
                            notes:this.showManageData.description
                        },
                        success:function(res){
                            if(res.code ==="0"){
                                this.pendingList();
                                this.approvedList();
                                this.deniedList();
                                toast({
                                    duration: 1000,
                                    message:'审核成功'
                                })
                            }else {
                                msgBox({
                                    message:res.msg,
                                    type:'alert',
                                    confirm:function () {}
                                })
                            }
                            this.isShowManageDialog = false;
                        }.bind(this)
                    })


                }.bind(this)
            });

            return true;
        },
        reject:function(){
            // 审核不通过
            this.validateNotEmpty(this.showManageData.description);
            if(!_.validate(this.warningsMap)){
                return true;
            }

            msgBox({
                message:"确认不通过？",
                type:'confirm',
                confirm:function(){
                    _.ajax({
                        url:'/api/resourcesapplication/approve',
                        method:'post',
                        data:{
                            operationId:this.showManageData.operationId,
                            approve:false,
                            notes:this.showManageData.description
                        },
                        success:function(res){
                            if(res.code ==="0"){
                                this.pendingList();
                                this.approvedList();
                                this.deniedList();
                            }else {
                                msgBox({
                                    message:"审批失败",
                                    type:'alert',
                                    confirm:function () {}
                                })
                            }
                        }.bind(this)
                    });
                    this.isShowManageDialog=false;
                }.bind(this)
            })

            return true;
        }

    },
    watch:{

    }
}
</script>