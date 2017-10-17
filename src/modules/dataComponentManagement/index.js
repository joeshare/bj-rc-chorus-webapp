/**
 * Created by AnThen on 2017-3-3.
 */
import AdInput from 'adminUI/components/admin-input';
import AdModal from 'adminUI/components/admin-modal';
import Paginator from 'adminUI/components/admin-paginator.vue';
import CONSTANT from 'Utils/constant';
import navBar  from '../../admin-ui-extend/components/admin-navbar.vue';
import adSpinner from 'adminUI/components/admin-spinner';
import MessageBox from 'adminUI/components/admin-message-box/index';
import Toast from 'adminUI/components/admin-toast/index';
import adSelect from 'adminUI/components/admin-select.vue';
import adminFileUpload from 'adminUI/components/admin-file-upload';
import {fetchList,getProjects,upload} from './utils/fetchAgent.js';
import AdSugInput from '../../admin-ui-extend/components/admin-input-custom.vue';
import {validateModuleName,
        validateModuleAliasName,
        validateModuleDesc,
        validateProjectId,
        validateFileName} from './utils/validate.js';
const validateMap={"moduleViewName":validateModuleName,"moduleAliasName":validateModuleAliasName,"remark":validateModuleDesc,"projectName":validateProjectId,"fileName":validateFileName};
export default {
    components: {
        AdSugInput,
        adSpinner,
        AdInput,
        AdModal,
        Paginator,
        navBar,
        adSelect,
        adminFileUpload,
        'adTabs':resolve => require(['adminUI/components/admin-tabs.vue'], resolve)
    },
    data () {
        let _this=this;
        return {
            navlist: [{id: 1, text: '平台管理', url: ''}, {id: 2, text: '数据组件管理', url: ''}],
            data: [],
            totalCount: 0,
            pageSize: CONSTANT.pageSize,
            currentPage: 1,
            searchKey: '',
            uploadDisplay: false,
            uploadModalBtns: [{
                text: '取消',
                buttonClass: 'admin-small ad-auxiliary',
                name: 'cancel'
            }, {
                text: '上传',
                buttonClass: 'admin-small ad-auxiliary',
                name: 'upload',
                handler(){
                   var b= _this.validateForm();
                   if(b){
                       _this.submit();
                       _this.isShowMarkLoading=true;
                   }

                   return !b;
                }
            }],
            levelOption: [{value: 0, text: '平台级别'}, {value: 1, text: '项目级别'}],
            typeOption: [{value: 0, text: '批量组件'}, {value: 1, text: '流式组件'}],
            classOption: [{value: 3, text: 'source'}, {value: 5, text: 'processor'},{value: 7, text: 'sink'}],
            file:null,
            fileWarnings:null,
            //组件名称最长20字符
            moduleViewName:"",
            moduleViewNameWarnings:null,
            //组件别名 最长20字符
            moduleAliasName:'',
            moduleAliasNameWarnings:null,
            //组件级别，0：平台级别，1：项目级别
            moduleLevel:0,
            //组件所属项目ID,如果属于平台的话，该值为0
            projectId:0,
            projectNameWarnings:null,
            projectSelectDisabled:true,
            //组件类别，0：批量，1：流式
            moduleCategory:0,
            moduleCategoryWarnings:null,
            //组件类型，1:Job 3:Stream source 5:Stream processor 7:Stream sink
            moduleType:3,
            moduleTypeWarnings:null,
            moduleTypeDisabled:true,
            //组件描述 最长128
            remark:"",
            remarkWarnings:null,
            //上传文件名称
            fileName:'',
            fileNameWarnings:null,
            projectSelectOptions:[],
            projectName:"",
            isShowMarkLoading:false,
            isEdit:false,
            moduleId:''
        }
    },
    created() {
        this.fetchData(1);
    },
    mounted(){
   },
    computed:{

    },
    watch:{
        moduleLevel(v){
            this.projectSelectDisabled=v==0;
            this.projectName="";
            this.projectId=0;
        },
        moduleCategory(v){
            this.moduleTypeDisabled=v==0;
        }
    },
    methods: {
        submit(){
            let _this=this;
            var $file=$('#data-component-file');
            var fileStr=$file.val();
            var pos=fileStr.lastIndexOf("\\");
            var strFileName=fileStr.substring(pos+1);
            let formdata = new FormData();
            let userInfo=_.currentUserInfo.get();

            if(this.moduleCategory==0)
            {
                this.moduleType=1;
            }


            formdata.append('file',$file[0].files[0],encodeURI(strFileName));

            formdata.append("moduleId", this.moduleId);
            formdata.append("moduleViewName", this.moduleViewName);
            formdata.append("moduleAliasName", this.moduleAliasName);
            formdata.append("moduleLevel", this.moduleLevel);
            formdata.append("projectId", this.projectId);
            formdata.append("moduleCategory", this.moduleCategory);
            formdata.append("moduleType", this.moduleType);
            formdata.append("remark", this.remark);
            formdata.append("userName", userInfo.name);
            formdata.append("userId", userInfo.id);
            upload(formdata,function(res){
                _this.isShowMarkLoading=false;
                if(res.code==0){
                    Toast({
                        message: '上传成功！',
                        duration: 2000
                    })
                    _this.fetchData(1);
                }else{
                    _this.messageAlert(res.msg);
                }
            })
        },
        transform2SelectOptions(data){
            var arr=[];
          data.forEach((d)=>{
              arr.push({text:d.projectName,value:d.projectId,code:d.projectCode})
          })
            return arr;
        },
        clickInput(){
            var projectName=this.projectName;
            var _this=this;
            var errorcode =0;
            //console.log('-----------',projectName);
            getProjects({
                projectName
            },function(rec){
               if(rec.code==errorcode){
                   _this.projectSelectOptions=_this.transform2SelectOptions(rec.data)
               }else{
                   _this.projectSelectOptions=[];
               }
            })
        },
        inputSugChangeInput(v)
        {
            var projectName=this.projectName=v;
            var _this=this;

            var errorcode =0;
            getProjects({
                projectName
            },function(rec){
                if(rec.code==errorcode){
                    _this.projectSelectOptions=_this.transform2SelectOptions(rec.data)
                }else{
                    _this.projectSelectOptions=[];
                }
            })
        },
        sugSelectClick(rec){
            let _this = this;
            this.projectId=rec.value;
            this.clearvalidate();

        },
        changeFile(e){
            //data-component-fileupload-form
            var fileStr=$(e.target).val();
            var pos=fileStr.lastIndexOf("\\");
            var strFileName=fileStr.substring(pos+1);


            this.fileName=strFileName;
            if( this.fileName){
                this.fileNameWarnings=null;
            }
        },
        clearvalidate(){
            var flag=true
            for(var k in validateMap){

                this[`${k}Warnings`]=null;
            }
        },
        validateForm(){
            var flag=true
            for(var k in validateMap){
                var res=null;
                if(k=="projectName"){
                   res=validateMap[k](this[k],this.moduleLevel);
                }else{
                   res=validateMap[k](this[k]);
                }
              this[`${k}Warnings`]=null;
              if(!res.success){
                  flag=res.success;
                  this[`${k}Warnings`]=res.msg;
              }
           }
            return flag;
        },
        messageAlert(msg,handler){
            MessageBox({
                message:msg,
                type: 'alert',
                confirm () {
                    handler&&handler();
                }
            })
        },
        //分页相应事件
        togglePage(indexPage){
            this.fetchData(indexPage)
        },
        //上传弹窗
        uploadBtnClick (entry) {
            if(entry)
            {
                this.uploadDisplay=true;
                this.isEdit =true;
                this.moduleId = entry.moduleId;
                this.moduleViewName=entry.moduleViewName;
                this.moduleAliasName=entry.moduleAliasName;
                this.remark=entry.remark;

                this.moduleLevel =entry.moduleLevelpt;
                this.moduleCategory=entry.moduleCategory;
                this.moduleType=entry.moduleTypept;
                let _this=this;
                setTimeout(function () {

                    _this.projectName =entry.projectNamept;
                    _this.projectId =entry.projectId;
                },20);

            }
            else{
                this.isEdit =false;
                this.moduleId='';
                this.uploadDisplay=true;
                this.moduleViewName="";
                this.moduleAliasName="";
                this.remark="";
                this.projectName ="";
                this.projectId =0;
            }

        },
        //查询列表数据
        fetchData(curPage){
            let _this=this;
            fetchList({
                pageNum:curPage,
                pageSize:_this.pageSize,
                moduleAliasName:_this.searchKey
            },function(res){
                if(res.code =='0')
                {
                    var _data=res.data.list;
                    _data.forEach((rec,i)=>{
                        rec.userNameManagerTelephone= rec.userName+"/"+ rec.managerTelephone;
                        rec.projectNamept= rec.projectName;
                        rec.projectName= rec.projectName.length==0?"无":rec.projectName;
                        rec.moduleTypeTextpt =rec.moduleTypeText;
                        rec.moduleTypeText =rec.moduleCategory==0?"批量组件":"流式组件";
                        rec.updateTime = _.date2String(new Date(rec.updateTime ),'yyyy-MM-dd hh:mm:ss');
                        var categorytext ="无分类";

                        rec.moduleTypept= rec.moduleType;
                        switch(rec.moduleType){
                            case 1:
                                categorytext="Job";
                                break;
                            case 3:
                                categorytext="source";
                                break;
                            case 5:
                                categorytext="processor";
                                break;
                            case 7:
                                categorytext="sink";
                                break;
                        }
                        rec.moduleType= categorytext;

                        rec.moduleLevelpt=rec.moduleLevel;
                        rec.moduleLevel = rec.moduleLevel==0?"平台级别":"项目级别";
                    })
                    _this.data=_data;
                    _this.totalCount=res.data.total;
                    _this.currentPage=curPage;
                }
            })
        }
    }

}
