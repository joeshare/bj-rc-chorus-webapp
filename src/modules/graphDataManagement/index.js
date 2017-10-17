/**
 * Created by AnThen on 2017-3-3.
 */
import AdInput from 'adminUI/components/admin-input.vue';
import adSelect from 'adminUI/components/admin-select.vue';
import AdModal from 'adminUI/components/admin-modal.vue';
import Paginator from 'adminUI/components/admin-paginator.vue';
import Toast from 'adminUI/components/admin-toast/index';
import navBar  from '../../admin-ui-extend/components/admin-navbar.vue';
import CONSTANT from 'Utils/constant'
import {tabs, activeTabId} from  './tabs.js';
const hasReg=/^\s+$/;
export default {
    components: {
        AdInput,
        AdModal,
        Paginator,
        adSelect,
        Toast,
        navBar,
        'adTabs':resolve => require(['adminUI/components/admin-tabs.vue'], resolve)
    },
    data () {
        let _this=this;
        return {
            navlist:[{id:1,text:'数据管理',url:''},{id:2,text:'图数据管理',url:''}],
            isfirstsetp:true,
            data:[],
            options: [],
            nameWarnings:null,
            codeWarnings:null,
            selectValue:'ccp_2636',
            optionsgraphdatatype: [{'value':0,'text':'点'},{'value':1,'text':'边'}],
            optionsrelation1: [],
            optionsrelation2: [],
            optionssecuritylevel:[{'value':'A','text':'A'},{'value':'B','text':'B'},{'value':'C','text':'C'}],
            optionsproptype:[],
            optionsissearch:[{'value':"1",'text':'否'},{'value':"0",'text':'是'}],
            totalCount: 0,
            pageSize: CONSTANT.pageSize,
            currentPage: 1,
            tabs,
            activeTabval:'baseInfo',
            searchKey:'',
            detailstype:0,
            createtype:0,
            detailsdata:'',
            detailsDisplay: false,
            createdata:'',
            createDisplay: false,
            detailsModalBtns:[{
                text: '取消',
                buttonClass:'admin-small ad-auxiliary',
                name: 'cancel'
            }],
            firststep:[{
                text: '取消',
                buttonClass:'admin-small ad-auxiliary',
                name: 'cancel'
            },{
                text: '下一步',
                name: 'ok',
                buttonClass:'admin-small',
                handler(){
                    if(/^\s+$/.test(_this.createdata.dataName) || _this.createdata.dataName == ''||typeof(_this.createdata.dataName)=="undefined")
                    {
                        _this.nameWarnings =['名称不能为空！'];
                        return true;
                    }
                    if(!/^\w+$/.test(_this.createdata.dataCode))
                    {
                        _this.codeWarnings =['编码必须为英文！'];
                        return true;
                    }

                    _.ajax({
                        url: '/api/graphdatamanagement/verifydatacode',
                        method: 'POST',
                        data:{
                            "dataCode": _this.createdata.dataCode,
                            "dataType":_this.createdata.dataType,
                          //  "projectCode": _this.selectValuea
                        },
                        success: function (res) {
                            if (res.code == "0") {
                                if(!res.data.status)
                                {
                                    _this.codeWarnings =['编码重复！'];
                                }
                                else {
                                    _this.createModalBtns= _this.laststep;
                                    _this.isfirstsetp=false;
                                }
                            }
                        }
                    });
                    return true;
                }
            }],
            laststep:[{
                text: '上一步',
                name: 'ok',
                buttonClass:'admin-small',
                handler(){
                    _this.isfirstsetp=true;
                    _this.createModalBtns= _this.firststep;
                    return true;
                }
            },{
                text: '确定',
                buttonClass:'admin-small',
                name: 'comfirm',
                handler(){
                        let returnvalue = false;
                        if(_this.createdata.propertyList.length==0){
                            Toast({
                                message: '最少需要保留一个属性字段！',
                                duration: 1000,
                                iconClass: 'ion-alert-circled',
                                iconColor: '#f63'
                            })
                            return true;
                        }
                       _this.createdata.propertyList.forEach((m)=>{

                        if(/^\s+$/.test(m.propertyName) || m.propertyName == ''||typeof(m.propertyName)=="undefined")
                        {
                            m.nameWarnings=['名称不能为空！'];
                            returnvalue =true;
                        }
                        else {
                            m.nameWarnings=null;
                        }
                        if(!/^\w+$/.test(m.propertyCode))
                        {
                            m.codeWarnings=['编码必须为英文！'];
                            returnvalue =true;
                        }
                        else {
                            m.codeWarnings=null;
                        }
                        if(!/^\d+$/.test(m.propertyLength))
                        {
                            m.lengthWarnings=['长度必须为数字！'];
                            returnvalue =true;
                        }
                        else{
                            m.lengthWarnings=null;
                        }
                    });
                    _this.updatewaring();
                    if(returnvalue)
                    {
                        return returnvalue;
                    }

                    _this.createdata.projectCode = _this.selectValue;
                    if(_this.createdata.dataType==0)
                    {
                        delete _this.createdata.relatedVertex1Id;
                        delete _this.createdata.relatedVertex2Id;
                    }
                    _this.createdata.propertyList.forEach((m)=>{
                        delete m.nameWarnings;
                        delete m.codeWarnings;
                        delete m.lengthWarnings;
                    });
                    Toast({
                        message: '提交成功！',
                        duration: 1500,
                        iconClass: 'ion-checkmark-round',
                        iconColor: '#43bf81'
                    });
                _.ajax({
                        url: '/api/graphdatamanagement/graphinfocreate',
                        method: 'POST',
                        data: {'object':JSON.stringify(_this.createdata)},
                        success: function (res) {
                            if (res.code == "0") {
                                _this.fetchData(1);
                                _this.currentPage = 1;
                            }else {
                                Toast({
                                    message: '添加失败！',
                                    duration: 1500,
                                    iconClass: 'ion-alert',
                                    iconColor: '#e5af51'
                                })
                            }
                        }
                    });
                    return returnvalue;
                }
            }],
            createModalBtns:_this.firststep
        }
    },
    created() {
        this.initItem();
        this.createModalBtns= this.firststep;
    },
    computed:{

    },
    watch:{
        resFlag(v){
            if(!v){

            }
        }
    },
    methods: {
        toggleTab (currentTadId) {
            this.activeTabval=currentTadId;
        },
        updatewaring(){
            this.createdata.propertyList.unshift({});
            this.createdata.propertyList.shift({});
        },
        //分页相应事件
        togglePage(indexPage){
            this.fetchData(indexPage)
        },
        //详情弹窗
        detailsBtnClick (rec) {
            this.modalTitle='详情';
            this.activeTabval ="baseInfo";// 'baseInfo';

            let _this =this;
            _this.detailsDisplay=true;
            _.ajax({
                url: '/api/graphdatamanagement/getgraphinfodetails',
                method: 'POST',
                data: {
                    dataid: rec.id
                },
                success: function (res) {
                    if (res.code == "0") {
                        _this.detailsdata=res.data;
                        _this.detailsdata.createTime= _.date2String(new Date(_this.detailsdata.createTime),'yyyy-MM-dd hh:mm:ss');
                        _this.detailsdata.propertyList.forEach((m)=>{
                            m.status = status==1?"否":"是";
                            if(m.createTime){
                                m.createTime= _.date2String(new Date(m.createTime),'yyyy-MM-dd hh:mm:ss');
                            }
                            else {
                                m.createTime= "";
                            }

                        });
                        _this.detailstype =_this.detailsdata.dataType;
                    }
                }
            })
        },
        //添加新属性
        addNewProperty(){
           // console.log('0000000000',this.createdata.propertyList);
            this.createdata.propertyList.push({
                "propertyName": "",
                "propertyCode": "",
                "propertyDatatype": "Long",
                "propertyLength": 0,
                "propertyDesc": "",
                "status": "1",
                "securityLevel": "A"
            });
        },
        //详情弹窗on事件监听
        detailsModalOn(){

        },
        //搜索
        onsearchClick(){
            this.fetchData(1);
        },
        //创建弹窗
        createBtnClick (rec) {
            this.modalTitle='新建图数据库';
            this.createdata ={
                "dataType": 0,
                "dataName": "",
                "dataCode": "",
                "dataDesc": "",
                "projectCode": 0,
                "securityLevel": "A",
                "relatedVertex2Id":"",
                "relatedVertex1Id":"",
                "propertyList": [
                    {
                        "propertyName": "",
                        "propertyCode": "",
                        "propertyDatatype": "Long",
                        "propertyLength": 0,
                        "propertyDesc": "",
                        "status": "1",
                        "securityLevel": "A"
                    }
                ]
            };
            let _this =this;
            _this.isfirstsetp=true;
            _this.createModalBtns= _this.firststep;
          // if(_this.optionsrelation1.length==0) {
               //点列表
               _.ajax({
                   url: '/api/graphdatamanagement/getallvertex',
                   method: 'POST',
                   data: {
                       //projectCode: _this.selectValue
                   },
                   success: function (res) {
                       if (res.code == "0") {
                           if(res.data.length==0)
                           {
                               _this.optionsgraphdatatype= [{'value':0,'text':'点'}];
                           }
                           else {
                               _this.optionsrelation1=[];
                               res.data.forEach((m1)=> {
                                   _this.optionsrelation1.push({'text': m1.vertexName, 'value':  m1.vertexId});
                               })
                               _this.optionsrelation2 = _this.optionsrelation1;
                               _this.createdata.relatedVertex1Id = _this.createdata.relatedVertex2Id = _this.optionsrelation2[0].value;
                           }

                       }
                   }
               })
         //  }
            this.createDisplay=true;
        },
        //创建弹窗on事件监听
        createModalOn(){

        },
        createAction(){
        },
        //删除属性
        createDelete(rec){
            let newarray =[];
            this.createdata.propertyList.forEach((m)=>{
                if(m!=rec) {newarray.push(m)}
            });
            this.createdata.propertyList =newarray;
        },
       fetchInfo(rec){
        },
        //初始化项目下拉
        initItem(){
            this.fetchData(1);
            let _this =this;
            //数据类型
            _.ajax({
                url:'/api/graphdatamanagement/getdatatypelist',
                method:'POST',
                data:{
                    pageNum:1,
                    pageSize:_this.pageSize
                },
                success:function(res){
                    if(res.code=="0"){
                        res.data.forEach((m)=>{
                            _this.optionsproptype.push({'text':m.typeName,'value':m.typeCode});
                        })
                    }
                }
            })
        },
        changeoption(){
            let _this = this;

            setTimeout(function () {
                _this.fetchData(1);
            },10)
        },
        changeCreateoption(){
            let _this = this;
            setTimeout(function () {
                _this.createtype =_this.createdata.dataType;
            },10)
        },
        //查询列表数据
        fetchData(curPage){
            let _this=this;
            //TODO::
            //数据类型
            _.ajax({
                url:'/api/graphdatamanagement/getgraphinfolist',
                method:'POST',
                data:{
                    pageNum:curPage,
                    pageSize:_this.pageSize,
                    dataName: _this.searchKey
                    //projectCode:_this.selectValue
                },
                success:function(res){
                    if(res.code=="0"){
                        res.data.list.forEach((m)=>{
                            m.dataType= m.dataType==0?"点":"边";
                            m.createTime = _.date2String(new Date(m.createTime),'yyyy-MM-dd hh:mm:ss');
                        });
                        _this.data = res.data;
                        _this.totalCount =res.data.total;
                        _this.currentPage = curPage;
                    }
                }
            })
            return;
        }
    }
}