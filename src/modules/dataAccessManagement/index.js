import CONSTANT from '../../js/utils/constant.js'
import adTabs from 'adminUI/components/admin-tabs'
import adModal from 'adminUI/components/admin-modal'
import AdInput from 'adminUI/components/admin-input'
import navBar  from '../../admin-ui-extend/components/admin-navbar.vue';
import Toast from 'adminUI/components/admin-toast/index';

export default{
    name:"dataAccess",
    data (){
        return {
            navlist:[{id:1,text:'数据管理',url:''},{id:2,text:'数据权限管理',url:''}],
            isShowManageDialog:false,
            isShowHasOperDetailDialog:false,
            isShowHasCommitDetailDialog:false,
            showManageData:{},
            showHasOperData:{},
            showHasCommitData:{},
            activeTabId: 'waitingOper',
            tabs: [
                {
                    name: 'waitingOper',
                    text: '待处理申请'
                },
                {
                    name: 'hasOper',
                    text: '已处理申请'
                },
                {
                    name: 'hasCommit',
                    text: '已提交申请'
                }
            ],
            pageSize:CONSTANT.pageSize,
            waitHandleApplicant:{},
            hasHandleApplicant:{},
            myHandleApplicant:{}
        }
    },
    components:{
        adTabs,
        adModal,
        AdInput,
        navBar,
        Toast
    },
    created() {
        this.getwaitHandleApplicant(1);
        this.gethasHandleApplicant(1);
        this.getmyHandleApplicant(1);

    },
    methods:{
        manageShow:function(id){


            let _this =this;
            _.ajax({
                url:'/api/dataaccessmanagement/application_detail',
                method:'POST',
                data:{
                    applyFormId:id
                },
                success:function(res){
                    if(res.code=="0"){
                        _this.showManageData.description ="";
                        _this.showManageData.list =res.data;
                        _this.showManageData.id =id;
                        _this.isShowManageDialog = true;


                        if(_this.showManageData.list&&_this.showManageData.list.length>0)
                        {
                            _this.showManageData.reason  =  _this.showManageData.list[0].reason;
                        }

                    }
                },
                error:function(res){
                }
            })

        },
        deepCopy: function(source) {
            var result={};
            for (var key in source) {
                result[key] = typeof source[key]==='object'? this.deepCopy(source[key]): source[key];
            }
            return result;
        },
        hasOperDetail:function(id){

            let _this =this;
            _.ajax({
                url:'/api/dataaccessmanagement/application_detail',
                method:'POST',
                data:{
                    applyFormId:id
                },
                success:function(res){
                    if(res.code=="0"){

                        _this.showHasOperData.list =res.data;

                        if(_this.showHasOperData.list&&_this.showHasOperData.list.length>0)
                        {
                            _this.showHasOperData.description  =  _this.showHasOperData.list[0].dealInstruction;

                            _this.showHasOperData.reason  =  _this.showHasOperData.list[0].reason;
                        }

                        _this.isShowHasOperDetailDialog = true;
                    }else{
                        _this.showHasOperData=[];
                    }
                },
                error:function(res){
                }
            })
        },
        hasCommitDetail:function(id){

            let _this =this;
            _.ajax({
                url:'/api/dataaccessmanagement/application_detail',
                method:'POST',
                data:{
                    applyFormId:id
                },
                success:function(res){
                    if(res.code=="0"){
                        _this.showHasCommitData.list =res.data;

                        if(_this.showHasCommitData.list&&_this.showHasCommitData.list.length>0)
                        {
                            _this.showHasCommitData.description  =  _this.showHasCommitData.list[0].dealInstruction;
                            _this.showHasCommitData.reason  =  _this.showHasCommitData.list[0].reason;
                        }

                        _this.isShowHasCommitDetailDialog = true;
                    }else{
                        _this.showHasCommitData=[];
                    }
                },
                error:function(res){
                }
            })


        },
        manage:function(){
        },
        approved:function(){
            // 审核通过
            let _this =this;
            _.ajax({
                url:'/api/dataaccessmanagement/approve',
                method:'POST',
                data:{applyFormId:this.showManageData.id,dealInstruction:this.showManageData.description,dealUserId:"",statusCode:"1502"},
                success:function(res){
                    if(res.code=="0"){
                        Toast({
                            message: '审核成功'
                        })
                        _this.getwaitHandleApplicant(1);
                        _this.gethasHandleApplicant(1);
                        _this.getmyHandleApplicant(1);
                    }else{
                        Toast({
                            message: '审核失败:'+res.msg
                        })
                    }
                },
                error:function(res){
                    Toast({
                        message: '审核失败'
                    })
                }
            })
            this.showManageData ={};
        },
        reject:function(){
            // 审核不通过
            let _this =this;
            _.ajax({
                url:'/api/dataaccessmanagement/approve',
                method:'POST',
                data:{applyFormId:this.showManageData.id,dealInstruction:this.showManageData.description,dealUserId:"",statusCode:"1503"},
                success:function(res){
                    if(res.code=="0"){
                        Toast({
                            message: '审核成功'
                        })
                        _this.getwaitHandleApplicant(1);
                        _this.gethasHandleApplicant(1);
                        _this.getmyHandleApplicant(1);
                    }else{
                        Toast({
                            message: '审核失败:'+res.msg
                        })
                    }
                },
                error:function(res){
                    Toast({
                        message: '审核失败'
                    })
                }
            })
            this.showManageData ={};
        },

        getwaitHandleApplicant:function (curPage) {
            let _this =this;
            _.ajax({
                url:'/api/dataaccessmanagement/select_application',
                method:'POST',
                data:{
                    pageNum:curPage,
                    pageSize:_this.pageSize,
                    approved:0
                },
                success:function(res){
                    if(res.code=="0"){
                        _this.waitHandleApplicant=res.data;
                        _this.waitHandleApplicant.list.forEach((m)=>{
                            m.applyTime = _.date2String(new Date(m.applyTime),'yyyy-MM-dd hh:mm:ss');
                        })
                    }else{
                        _this.data=[];
                    }
                },
                error:function(res){

                }
            })
        },

        gethasHandleApplicant:function (curPage) {
            let _this =this;
            _.ajax({
                url:'/api/dataaccessmanagement/select_application',
                method:'POST',
                data:{
                    pageNum:curPage,
                    pageSize:_this.pageSize,
                    approved:1
                },
                success:function(res){
                    if(res.code=="0"){
                        _this.hasHandleApplicant=res.data;
                        _this.hasHandleApplicant.list.forEach((m)=>{
                            m.applyTime = _.date2String(new Date(m.applyTime),'yyyy-MM-dd hh:mm:ss');
                            m.dealTime=_.date2String(new Date(m.dealTime),'yyyy-MM-dd hh:mm:ss');
                        })
                    }else{
                        _this.hasHandleApplicant=[];
                    }
                },
                error:function(res){

                }
            })
        }
        ,
        getmyHandleApplicant:function (curPage) {
            let _this =this;
            _.ajax({
                url:'/api/dataaccessmanagement/select_application',
                method:'POST',
                data:{
                    pageNum:curPage,
                    pageSize:_this.pageSize
                },
                success:function(res){
                    if(res.code=="0"){
                        _this.myHandleApplicant=res.data;
                        _this.myHandleApplicant.list.forEach((m)=>{
                            m.applyTime = _.date2String(new Date(m.applyTime),'yyyy-MM-dd hh:mm:ss');
                            // m.dealTime=_.date2String(new Date(m.dealTime),'yyyy-MM-dd hh:mm:ss');
                        })

                    }else{
                        _this.myHandleApplicant=[];
                    }
                },
                error:function(res){
                }
            })
        }
    },
    watch:{

    }
}