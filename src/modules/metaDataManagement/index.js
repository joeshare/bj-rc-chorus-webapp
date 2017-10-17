/**
 * Created by AnThen on 2017-3-3.
 */
import AdInput from 'adminUI/components/admin-input';
import AdModal from 'adminUI/components/admin-modal';
import Paginator from 'adminUI/components/admin-paginator.vue';
import BaseInfo from './components/baseInfo/index.vue';
import DemoData from './components/demoData/index.vue';
import FieldInfo from './components/fieldInfo/index.vue';
import CONSTANT from 'Utils/constant';
import PowerApply from './components/powerApply/index.vue';
import {queryTableData as queryMockTableData } from  './mock.js';
import navBar  from '../../admin-ui-extend/components/admin-navbar.vue';
import AdSugInput from '../../admin-ui-extend/components/admin-input-custom.vue';
import {tabs, activeTabId} from  './tabs.js';
//==
import adSpinner from 'adminUI/components/admin-spinner';

const hasReg=/^\s+$/;
export default {
    name: 'meta-data-management',
    components: {
        adSpinner,
        AdInput,
        AdModal,
        Paginator,
        BaseInfo,
        DemoData,
        FieldInfo,
        PowerApply,
        navBar,
        AdSugInput,
        'adTabs':resolve => require(['adminUI/components/admin-tabs.vue'], resolve)
    },
    data () {
        let columns=[
            {code:'tableName',text:'表名称'},
            {code:'tableInfoId',text:'表编码'},
            {code:'tableDes',text:'表说明'},
            {code:'describe',text:'数据域'},
            {code:'securityLevel',text:'安全等级'},//securityLevel
            {code:'projectName',text:'项目资源'}
        ];
        let _this=this;
        return {
            tableSelectOptions: [],
            tableSelectOptionsInit: [],
            isHiddenLoading:false,
            navlist:[{id:1,text:'数据管理',url:''},{id:2,text:'元数据查询',url:''}],
            data:[],
            totalCount: 0,
            pageSize:CONSTANT.pageSize,
            currentPage: 1,
            resFlag:true,
            validateResult:true,
            tabs,
            activeTabId,
            searchKey:'',
            columns,
            triggerValue: false,
            currentRecoder:{
                "tableInfoId": 0,
                "projectId": "",
                "projectCode": "",
                "projectName": "",
                "tableName": "",
                "securityLevel": "",
                "tableDes": ""
            },
            currentRecoderpower:{
                "tableInfoId": 0,
                "projectId": "",
                "projectCode": "",
                "projectName": "",
                "tableName": "",
                "securityLevel": "",
                "tableDes": ""
            },
            detailsDisplay: false,
            authDisplay: false,
            detailsModalBtns:[{
                text: '取消',
                buttonClass:'admin-small ad-auxiliary',
                name: 'cancel'
            }],
            authModalBtns:[{
                text: '取消',
                buttonClass:'admin-small ad-auxiliary',
                name: 'cancel'
            },{
                text: '确定',
                name: 'ok',
                buttonClass:'admin-small',
                handler(){
                   return  !_this.$refs.powerapp.verificate();
                }
            }]
        }
    },
    created() {
        this.fetchData(1);
        this.initdrop();
    },
    mounted(){
    },
    computed:{
        validateName() {
            let _this = this;
            return [{
                validator(v) {
                    return !/^\s+$/.test(v) && v !== ''
                },
                warning: '名称为必填'

            }]
        },
        validateCode() {
            let _this = this;
            return [{
                validator(v) {
                    return !hasReg.test(v) && v !== ''
                },
                warning: '编码为必填'
            }]
        }
    },
    watch:{
        resFlag(v){
            if(!v){

            }
        }
    },
    methods: {
        //初始化下拉
        initdrop(){
            let _this=this;
            _.ajax({
                url:'/api/metadatamanagement/alltable',
                method:'POST',
                data:{
                },
                success:function(res){
                    if(res.code =='0')
                    {
                        let templist =[];
                        var _data=res.data;
                        _data.forEach((rec,i)=>{
                            templist.push({'text':rec,'value':rec});
                        })
                        _this.tableSelectOptionsInit = templist;
                    }
                },
                error:function (err) {
                }
            })
        },
        //分页相应事件
        togglePage(indexPage){
            //打印出当前页数
            this.fetchData(indexPage)
        },
        //清空当前数据
        clearCurrentRecoder(){
            for(var k in this.currentRecoder){
                this.currentRecoder[k]="";
            }
        },
        //详情弹窗
        detailsBtnClick (rec) {
            $.extend(this.currentRecoder,rec);
            let origin=this.$route.params.origin||window.location.hash.split("/")[1];
            this.$router.push(`/metadatamanagement/info/detail/${origin}/${rec.tableInfoId}`)
        },
        //权限弹窗
        authBtnClick (rec) {
            this.modalTitle='申请权限';
            this.$refs.powerapp.applyresonWarnings=null;
            this.$refs.powerapp.timesizeWarnings=null;
            this.$refs.powerapp.tableName ="...";
            this.$refs.powerapp.data =[];

            this.authDisplay=true;
            $.extend(this.currentRecoderpower,rec);

            this.$refs.powerapp.fetchData(this.currentRecoderpower.tableInfoId);
        },
        //查询列表数据
        fetchData(curPage){
            let _this=this;
            _.ajax({
                url:'/api/metadatamanagement/list',
                method:'POST',
                data:{
                    pageNum:curPage,
                    pageSize:_this.pageSize,
                    q:_this.searchKey
                },
                success:function(res){
                    if(res.code =='0')
                    {
                        var _data=res.data.list;
                        _data.forEach((rec,i)=>{
                            rec.userNameManagerTelephone= rec.userName+"/"+ rec.managerTelephone;
                        })
                        _this.data=_data;
                        _this.totalCount=res.data.total;
                        _this.currentPage=curPage;
                    }
                },
                error:function (err) {
                }
            })


        },
        sugChangeInput(v)
        {
            var subobj =  this.tableSelectOptionsInit.filter((fliter)=>
            {
                return  fliter.text.indexOf(v)>-1
            });
            var showobj =[];
            subobj.forEach((substr,i)=>{
                if(i<11)
                {
                    showobj.push(substr);
                }
            });
            this.tableSelectOptions=JSON.parse(JSON.stringify(showobj));
        },
        sugSelectClick(rec){
            this.searchKey = rec.value;
        },
        sugclick(){
            var showobj =[];
            this.tableSelectOptionsInit.forEach((substr,i)=>{
                if(i<11)
                {
                    showobj.push(substr);
                }
            });
            this.tableSelectOptions=JSON.parse(JSON.stringify(showobj));
        }
    }

}
