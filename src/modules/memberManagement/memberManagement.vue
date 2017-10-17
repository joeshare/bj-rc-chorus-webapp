<style lang="scss">
.memberMangement{
    tbody tr td:last-child{
        text-align:center;
        min-width:140px;
    }
    input.admin-input-core{
        width:360px;
    }
    .admin-radio .admin-radio-label{
        margin-right:24px;
        margin-bottom:12px;
    }
}
</style>
<template>
<div class="memberMangement">
    <div  class="chorus-mark-loading" v-show="isShowMarkLoading">
        <ad-spinner type="circle" color="#0e9ee2;" size="50px"></ad-spinner>
    </div>
    <nav-bar :nav-list="navlist" ></nav-bar>
    <div class="chorus-toolbar">
        <div class="toolbar-r">
            <button class="chorus-button admin-small" @click="openAddDialog">增加成员</button>
        </div>
    </div>
    <div class="chorus-grid chorus-grid-wrapper">
        <table class="admin-table admin-striped">
            <thead>
            <tr>
                <th>用户名</th>
                <th>邮箱</th>
                <th>角色</th>
                <th>操作时间</th>
                <th>操作</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in dataList">
                <td>{{item.name}}</td>
                <td>{{item.email}}</td>
                <td>{{item.roleName}}</td>
                <td>{{item.updateTime}}</td>
                <td>
                    <button class="chorus-button admin-small" :disabled="item.roleName ==='项目Owner'" @click="update(item.code,item.name,item.roleCode,item.roleName)">调整角色</button>
                    <button class="chorus-button admin-small" :disabled="item.roleName ==='项目Owner'" @click="del(item.code,item.name,item.roleCode)">删除成员</button>
                </td>
            </tr>
            <tr v-if="dataList && dataList.length === 0"><td colspan="5" style="text-align: center;">暂无数据</td></tr>
            </tbody>
            <tfoot>
            </tfoot>
        </table>
    </div>
    <div  style="text-align: right; display: none;">
        <ad-paginator :total-count="pager.totalCount" :page-size="pager.pageSize" :current-page="pager.currentPage"  @toggle-page="togglePage($event)"></ad-paginator>
    </div>

    <ad-modal
            title="调整角色"
            :display="dataUpdate"
            width="440px"
            height="380px"
            :buttons="[
                    {
                        text: '取消',
                        name: 'cancel',
                        buttonClass:'admin-small',
                        handler: 'closeUpdateDialog'
                    },{
                        text: '确定',
                        name: 'update',
                        buttonClass:'admin-small',
                        handler: updateDataRole
                    }]"
            @admin-modal-off="closeUpdateDialog">
        <div class="memberMangement" style="padding: 10px;">
            <div  style="padding: 10px;" >
                <ad-input
                    label="成员："
                    placeholder=""
                    disabled="disabled"
                    v-model="updateData.name"
                    value=""></ad-input>
            </div>

            <div  style="padding: 10px;">
                <ad-radio
                        label="角色："
                        :radios="radios"
                        :warnings="warningsMapRole"
                        v-model="updateData.role"
                        >
                </ad-radio>
            </div>

        </div>
    </ad-modal>

    <ad-modal
            title="添加成员"
            :display="addMember"
            width="440px"
            height="380px"
            :buttons="[
                    {
                        text: '取消',
                        name: 'cancel',
                        buttonClass:'admin-small',
                        handler: 'closeAddDialog'
                    },
                    {
                        text: '确定',
                        name: 'add',
                        buttonClass:'admin-small',
                        handler: addData
                    }]"
            @admin-modal-off="closeAddDialog">
        <div class="memberMangement" style="padding: 10px;">
            <div  style="padding: 10px;" >
                <admin-input-custom
                    v-model="addModel.name"
                    :associations="associations"
                    :small="true"
                    :warnings="warningsMap['name']"
                    placeholder=""
                    @click="userClick"
                    @toggle-select="userSelected"
                    @input="userChangeInput"
                >
                </admin-input-custom>
            </div>
            <div  style="padding: 10px;">
                <ad-radio
                    label="角色："
                    :radios="radios"
                    v-model="addModel.role"
                    >
                </ad-radio>
            </div>
        </div>
    </ad-modal>

</div>
</template>
<script>
    import adSpinner from 'adminUI/components/admin-spinner'
    import navBar  from '../../admin-ui-extend/components/admin-navbar.vue';
    import CONSTANT from '../../js/utils/constant.js'
    import adPaginator from '../../admin-ui/components/admin-paginator'
    import adSelect from '../../admin-ui/components/admin-select'
    import adModal from '../../admin-ui/components/admin-modal'
    import adInput from '../../admin-ui/components/admin-input'
    import adRadio from '../../admin-ui/components/admin-radio'
    import msgBox from '../../admin-ui/components/admin-message-box/index.js'
    import toast from '../../admin-ui/components/admin-toast'
    import adminInputCustom from '../../admin-ui-extend/components/admin-input-custom.vue';

export default{
    name:"memberMangement",
    data () {
        return {
            isShowMarkLoading: false,
            hasAddClicked:false,
            hasUpdateClicked:false,
            associations:[],
            navlist:[{id:1,text:'项目管理',url:''},{id:2,text:'成员管理',url:''}],
            deleteId:'',
            okDelete:false,
            confirmDelete:false,
            addMember:false,
            projectId:'',
            projectName:'',
            caasTopicId:'',//主题ID
            options:[],
            dataList:[],
            updateData:{},
            _role:'',
            addModel:{                
                userName:"",
                name:"",
                role:""
            },
            dataUpdate:false,
            warningsMapRole:null,
            value: '',//单选按钮 - 角色
            radios: [],
            curProjectRoles:[],
            warningsMap:{},
            allUsersArr:[],
            addUserInfo:null,
            chorusRoles:{},
            pager:{
                totalCount:0,
                pageSize:CONSTANT.pageSize,
                currentPage:1,
            }
        }
    },
    components:{
        adSelect,
        adModal,
        adInput,
        adPaginator,
        adRadio,
        navBar,
        toast,
        adminInputCustom,
        adSpinner
    },
    mounted: function () {
        this.iniProject();
        this.iniChorusRoles();
    },
    methods:{
        userClick:function () {
            //console.log('userClick')
        },
        userSelected:function (v) {
            //console.log('userSelected',v)
            this.$set(this.warningsMap, "name",null);
            this.addUserInfo = v.value;
        },
        userChangeInput:function (name) {
            this.getUsersByName(name);

        },
        closeAddDialog:function () {
            this.addMember = false;
            this.warningsMap={};
        },
        closeUpdateDialog:function () {
            this.dataUpdate = false;
        },
        openAddDialog:function () {
            this.addMember=true
        },
        togglePage:function(pIndex){
        },
        getUsersByName:function (name) {
            var that = this;
            _.ajax({
                url: '/api/membermanagement/getuserinfobyname',
                method: 'post',
                data: {
                    "pageNo":"1",
                    "pageSize":"10",
                    "name":name
                },
                success: function (res) {
                    that.associations = [];
                    for(let t=0;t<res.records.length;t++){
                        that.associations.push({
                            "text":res.records[t].name,
                            "value":{
                                "code":res.records[t].code,
                                "name":res.records[t].name,
                                "email":res.records[t].email
                            }
                        })
                    }
                }
            });

        },
        iniChorusRoles:function () {
            let that = this;
            _.ajax({
                url: '/api/membermanagement/getchorusroles',
                method: 'post',
                data: {},
                success: function (res) {
                    if(res && res.data){
                        for(var t =0;t<res.data.length;t++){
                            that.chorusRoles[res.data[t].roleName] = res.data[t].roleId; //
                        }
                    }

                }
            });
        },
        //初始化项目        
        iniProject:function () {
            let that = this;
            let projectInfo=_.currentProjectInfo.get();
            that.projectId = projectInfo.projectId;
            that.caasTopicId = projectInfo.caasTopicId;
            that.projectName = projectInfo.projectName;
            that.getRoleList();
        },
        getRoleList:function () {
            let that = this;
            _.ajax({
                url: '/api/membermanagement/role/list',
                method: 'post',
                data: {
                    caasTopicId:this.caasTopicId
                },
                success: function (roles) {
                    that.radios =[];
                    for(var r=0;r<roles.length;r++){
                        that.curProjectRoles.push({
                            name: roles[r].name.replace(that.projectName+'_',''),
                            code: roles[r].code
                        });
                        if(roles[r].name.indexOf('项目Owner')>=0){
                            continue;
                        }
                        that.radios.push({
                            text:roles[r].name.replace(that.projectName+'_',''),
                            value: roles[r].code+'|'+ roles[r].name.replace(that.projectName+'_','')
                        });
                        that._role=that.radios[0].value;
                        that.addModel.role = that.radios[0].value;
                    }
                    if(roles.length ===0){
                        console.log("该项目没有角色");
                        that.dataList=[];
                        that.curProjectRoles  = [];
                    }else {
                        that.getPagerData(1);
                    }
                }
            })
        },
        getPagerData:function (pageIndex) {
            if (!/^[0-9]+$/.test(pageIndex)){
                pageIndex=1;
            }else {
                pageIndex = pageIndex < 1 ? 1 : pageIndex;
            }
            let that = this;
            _.ajax({
                url:'/api/membermanagement/list',
                method:'post',
                data:{
                    curProjectRoles:JSON.stringify(that.curProjectRoles)
                },
                success:function(res){
                    if(res.errorCode  && res.errorCode !=="0"){
                        that.dataList=[];
                    }else {
//                        if(res instanceof Array) {
//                            res.forEach((m) => {
//                                console.log(m.updateTime);
//                                m.updateTime = _.date2String(new Date(m.updateTime), 'yyyy-MM-dd hh:mm:ss');
//                            });
//                        }
                        that.dataList = res;
                    }

                }
            })
        },
        validateNotEmpty:function(v, key){            
            if(/^\s+$/.test(v) || v.length ==0){
                this.$set(this.warningsMap, key, ['不能为空'])             
            }else{
                this.$set(this.warningsMap, key, null)  
            }            
        },
        addData:function(){
            let that = this;
            var roleCodes=this.addModel.role.split('|');
            let _userInfo =this.addUserInfo;
            let caasTopicId = this.caasTopicId;
            if(!_userInfo){
                that.$set(that.warningsMap, "name", ['输入并选择用户']);
            }else {
                that.$set(that.warningsMap, "name",null);
                that.closeAddDialog();
                that.addModel.name="";
                that.addModel.role=that._role;
                that.isShowMarkLoading=true;
                isHas(caasTopicId,_userInfo.code);
                /*防连击方式由蒙罩方式替换
                if(!this.hasAddClicked){
                    this.hasAddClicked = true;

                }else {
                    console.log('请不要重复点击')
                }*/
            }
            
            function isHas(subjectCode, userCode) {
                _.ajax({
                    url: '/api/membermanagement/project/user',
                    method: 'post',
                    data: {
                        subjectCode:subjectCode,
                        userCode:userCode
                    },
                    success: function (res) {
                        //console.log("userIsInProject:",res);
                        if(res.length === 0){
                            add();
                        }else {
                            that.isShowMarkLoading=false;
                            that.hasAddClicked = false;
                            msgBox({
                                message: "已经存在的用户",
                                type: 'alert',
                                confirm: function (){
                                }
                            });
                        }
                    },
                    error:function(){
                       that.isShowMarkLoading=false;
                       msgBox({
                                message: "操作失败",
                                type: 'alert',
                                confirm: function (){}
                              });
                    }
                });
            }

            function add() {
                _.ajax({
                    url: '/api/membermanagement/add',
                    method: 'post',
                    data: {
                        projectId:that.projectId,
                        userCode:_userInfo.code,
                        userName:_userInfo.name,
                        userEmail:_userInfo.email,
                        roleCode:roleCodes[0],
                        chorusRoleCode:that.chorusRoles[roleCodes[1]]
                    },
                    success: function (res) {
                        that.isShowMarkLoading=false;
                        that.hasAddClicked = false;
                        if(res.code =="0"){
                            that.closeAddDialog();
                            that.addModel.name="";
                            that.addModel.role=that._role;
                            that.$set(that.warningsMap, "name",null);
                            toast({
                                message:'添加成功',
                                duration: 1000
                            })
                            that.getPagerData(1);
                        }else{
                            if(res.code >=400 && res.code<500){
                                msgBox({
                                    message: "操作失败",
                                    type: 'alert',
                                    confirm: function (){
                                    }
                                });
                            }
                            console.log(res.msg);
                        }
                    },
                    error:function(){
                       that.isShowMarkLoading=false;
                       msgBox({
                                                           message: "操作失败",
                                                           type: 'alert',
                                                           confirm: function (){
                                                           }
                                                       });
                    }
                });
            }

            return true
        },
        del:function (_code,_name,_role) {
            var that = this;
            msgBox({
                message: "确认删除？",
                type: 'confirm',
                confirm: function (){
                    that.deleteData(_code,_name,_role);
                   // that.getPagerData(1);
                }
            });
        },
        deleteData:function (_code,_name,_role) {
            var that = this;
             that.isShowMarkLoading=true;
            _.ajax({
                url: '/api/membermanagement/del',
                method: 'post',
                data: {
                    projectId:that.projectId,
                    userCode:_code,
                    userName:_name,
                    roleCode:_role
                },
                success:function(res){
                    console.log(res);
                    that.isShowMarkLoading=false;
                    if(res.errorCode*1 ==0){
                        toast({  message:'调整成功',  duration: 1000 })
                        that.getPagerData(1);
                    }else if(res.errorCode && res.errorCode !=="0"){
                        msgBox({
                            message: "删除失败",
                            type: 'alert',
                            confirm: function (){
                            }
                        });
                    } else {
                        if(res.code >=400 && res.code<500){
                            msgBox({
                                message: "操作失败",
                                type: 'alert',
                                confirm: function (){
                                }
                            });
                        }else {
                            msgBox({
                                message: "删除失败",
                                type: 'alert',
                                 confirm: function (){}
                            });
                            that.getPagerData(1);
                        }
                    }
                },error:function(){
                  that.isShowMarkLoading=false;
                  msgBox({
                                                  message: "删除失败",
                                                  type: 'alert',
                                                   confirm: function (){}
                                              });
                }
            })
        },
        //调整角色
        update:function (_uerCode,_name,_role,_roleName) {
            this.updateData.code = _uerCode;
            this.updateData.name = _name;
            this.updateData.role = _role + "|"+_roleName;
            this.updateData.roleCodeOld = _role;
            this.dataUpdate = true;
        },
        updateDataRole:function () {
//            if(!this.updateData.role || this.updateData.role ===""){
//                this.warningsMapRole =["请选择角色"];
//                return true;
//            }else {
//                this.warningsMapRole = null;
//            }
            var that = this;
            var roleCodes=this.updateData.role.split('|');
             that.isShowMarkLoading=true;
             that.closeUpdateDialog();
                _.ajax({
                    url: '/api/membermanagement/adjust',
                    method: 'post',
                    data: {
                        projectId:this.projectId,
                        userCode:this.updateData.code,
                        userName:this.updateData.name,
                        roleCodeOld:this.updateData.roleCodeOld,
                        roleCodeNew:roleCodes[0],
                        chorusRoleCode:that.chorusRoles[roleCodes[1]]
                    },
                    success: function (res) {
                        that.isShowMarkLoading=false;
                        if(res.code =="0"){
                            that.closeUpdateDialog();
                            toast({
                                message:'调整成功',
                                duration: 1000
                            })
                            that.getPagerData(1);
                        }else{
                            console.log(res)
                            if(res.code >=400 && res.code<500){
                                msgBox({
                                    message: "操作失败",
                                    type: 'alert',
                                    confirm: function (){
                                    }
                                });
                            }else{
                                console.log(res);
                                msgBox({
                                    message: res.msg,
                                    type: 'alert',
                                    confirm: function (){
                                    }
                                });
                            }
                        }
                    },
                    error:function(){
                       msgBox({
                                                        message: "操作失败",
                                                        type: 'alert',
                                                        confirm: function (){
                                                        }
                                                    });
                       that.isShowMarkLoading=false;
                    }
                });


            return true;
        }
    }

}
</script>