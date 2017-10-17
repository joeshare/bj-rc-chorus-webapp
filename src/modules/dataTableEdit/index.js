import adSelect from 'adminUI/components/admin-select'
import adRadio from 'adminUI/components/admin-radio'
import adInput from 'adminUI/components/admin-input'
import paginator from 'adminUI/components/admin-paginator'
import adModal from 'adminUI/components/admin-modal'
import adToast from 'adminUI/components/admin-toast/index'
import navBar  from '../../admin-ui-extend/components/admin-navbar.vue';
import fetchAgent  from './utils/fetchAgent';
import {alphaNumericUnderline}  from '../../js/utils/regex';
import MessageBox from 'adminUI/components/admin-message-box/index'
import CONSTANT from 'Utils/constant'
import adSpinner from 'adminUI/components/admin-spinner';
import AdSugInput from '../../admin-ui-extend/components/admin-input-custom.vue';
export default {
    name: 'chorus-data-table-management',
    components: {
        adSelect,
        adRadio,
        adInput,
        adModal,
        navBar,
        paginator,
        adSpinner,
        AdSugInput
    },
    data () {
        let _this =this;
        return {
            showmodel:null,
            showCreateFormBtnDisabled:false,
            navlist:[{id:1,text:'数据管理',url:''},{id:2,text:'数据表管理',url:''}],
            tablenameWarnings:'',
            datalist:[],
            pageSize:CONSTANT.pageSize,
            totalCount: 0,
            currentPage: 1,
            needpot:0,
            createFormShow: false,
            dataTableDetailShow: false,
            showfengqu:false,
            project: 'x',
            projectSelectOptions: [
                {
                    value: 'x',
                    text: 'Project X'
                },
                {
                    value: 'y',
                    text: 'Project Y'
                },
                {
                    value: 'z',
                    text: 'Project Z'
                }
            ],
            createType:'x',
            createTypeOptions: [
                {
                    text: '手工创建',
                    value: 'x'
                },
                {
                    text: '基于mysql表创建',
                    value: 'y'
                }
            ],
            createType_RDB:null,
            createType_RDB_V:null,
            createTypeOptions_RDB: [

            ],
            createType_Table:null,
            createTypeOptions_Table: [

            ],
            createDataTableQuerys: {
                "columnInfoList": [
                    {
                        "columnDesc": "",
                        "columnLength": 10,
                        "columnName": "",
                        "columnType": "STRING",
                        "isIndex": 0,
                        "isKey": 0,
                        "isNull": 0,
                        "isRefKey": 0,
                        "isPartitionKey": 0,
                        "securityLevel": "A",
                        "nameWarnings":null,
                        "lengthWarnings":null,
                        "desWarnings":null
                    }
                ],
                "dataField": "用户域",
                "isOpen": 0,
                "isSnapshot": 0,
                "securityLevel": "A",
                "sla": "",
                "tableDes": "",
                "tableName": "",
                "tableType": "基础表",
                "updateFrequence": "实时",
                "tablenameWarnings":null,
                "desWarnings":null,
                "slaWarnings":null
            },
            tableDesWarning:null,
            dataTableDetail: {
                "columnInfoList": [
                    {
                        "columnDesc": "...",
                        "columnLength": 10,
                        "columnName": "...",
                        "columnType": "string",
                        "createTime": "2017-04-13T04:36:19.625Z",
                        "isIndex": 0,
                        "isKey": 0,
                        "isNull": 0,
                        "isRefKey": 0,
                        "isPartitionKey": 0,
                        "securityLevel": "A",
                        "updateTime": "2017-04-13T04:36:19.625Z"
                    }
                ],
                "createTime": "2017-04-13T04:36:19.625Z",
                "dataField": "...",
                "isOpen": 0,
                "isSnapshot": 0,
                "projectId": 0,
                "securityLevel": "A",
                "sla": "...",
                "tableDes": "...",
                "tableInfoId": 0,
                "tableName": "...",
                "tableCode": "...",
                "tableType": "基本表",
                "updateFrequence": "实时"
            },
            createDataTableOptions: { // 新建数据表弹出表单中的各种选项
                projectResourceOptions: [], // 项目资源选项
                dataAreaOptions: [ // 数据域选项
                    {
                        text: '用户域',
                        value: '用户域'
                    },
                    {
                        text: '订单域',
                        value: '订单域'
                    },
                    {
                        text: '贷款域',
                        value: '贷款域'
                    },
                ],
                tableTypeOptions: [ // 表类型选项
                    {
                        text: '基础表',
                        value: '基础表'
                    },
                    {
                        text: '维度表',
                        value:'维度表'
                    },
                    {
                        text: '实时表',
                        value: '实时表'
                    }
                ],
                timelinessOptions: [
                    {
                        text: '天',
                        value: '天'
                    },
                    {
                        text: '实时',
                        value: '实时'
                    }
                ],
                securityGradeOptions: [
                    {
                        text: 'A',
                        value: 'A'
                    },
                    {
                        text: 'B',
                        value: 'B'
                    },
                    {
                        text: 'C',
                        value: 'C'
                    }
                ],
                fieldType: [
                    {
                        text: 'STRING',
                        value: 'STRING'
                    },
                    {
                        text: 'BIGINT',
                        value: 'BIGINT'
                    },
                    {
                        text: 'DOUBLE',
                        value: 'DOUBLE'
                    },
                    {
                        text: 'DATETIME',
                        value: 'DATETIME'
                    }
                ]
            },
            createFormStep: 1,
            isShowMarkLoading:false,
            associations_RDB:[],
            associations_Table:[]
        }
    },
    methods: {
        validateTableDes(v){
            var f=true;
            this.createDataTableQuerys.desWarnings=null;
            if(v&&v.length>120){
                   f=false;
                this.createDataTableQuerys.desWarnings=["不能超过120字符！"];
            }
            return f;
        },
        inputTableDes(){
            this.validateTableDes(this.createDataTableQuerys.tableDes);
        },
        //分页相应事件
        togglePage(indexPage){
            this.fetchData(indexPage)
        },
        clearwarnings(eveobje){
            this.createDataTableQuerys.tablenameWarnings=null;
            this.createDataTableQuerys.slaWarnings=null;
            this.createDataTableQuerys.desWarnings=null;
            this.createDataTableQuerys.columnInfoList.forEach((colm)=>{
                colm.nameWarnings =null;
                colm.lengthWarnings =null;
                colm.desWarnings =null;
            });
        },
        showCreateForm () {
            this.showCreateFormBtnDisabled=true;
            this.createFormStep = 1;
            this.createDataTableQuerys= {
                "columnInfoList": [
                    {
                        "columnDesc": "日期",
                        "columnLength": 10,
                        "columnName": "p_date",
                        "columnType": "STRING",
                        "isIndex": 0,
                        "isKey": 0,
                        "isNull": 0,
                        "isRefKey": 0,
                        "isPartitionKey": 1,
                        "securityLevel": "A",
                        "nameWarnings":null,
                        "lengthWarnings":null,
                        "desWarnings":null
                    },
                    {
                        "columnDesc": "",
                        "columnLength": 10,
                        "columnName": "",
                        "columnType": "STRING",
                        "isIndex": 0,
                        "isKey": 0,
                        "isNull": 0,
                        "isRefKey": 0,
                        "isPartitionKey": 0,
                        "securityLevel": "A",
                        "nameWarnings":null,
                        "lengthWarnings":null,
                        "desWarnings":null
                    }
                ],
                "dataField": "用户域",
                "isOpen": 0,
                "isSnapshot": 0,
                "securityLevel": "A",
                "sla": "",
                "tableDes": "",
                "tableName": "",
                "tableType": "基础表",
                "updateFrequence": "实时",
                "tablenameWarnings":null,
                "slaWarnings":null,
                "desWarnings":null
            }

            this.createFormShow = true
        },
        updatewaring(){
            this.createDataTableQuerys.columnInfoList.unshift({});
            this.createDataTableQuerys.columnInfoList.shift({});
        },
        insertNewField (type) {
            let newlist ={
                "columnDesc": "",
                "columnLength": 10,
                "columnName": "",
                "columnType": "STRING",
                "isIndex": 0,
                "isKey": 0,
                "isNull": 0,
                "isRefKey": 0,
                "isPartitionKey": 0,
                "securityLevel": "A",
                "nameWarnings":null,
                "lengthWarnings":null,
                "desWarnings":null
            };
            if(type=='yes')
            {
                newlist.isPartitionKey = 1;
                this.createDataTableQuerys.columnInfoList.push(newlist)
            }
            else
            {
                newlist.isPartitionKey = 0;
                this.createDataTableQuerys.columnInfoList.push(newlist)
            }
        },
        deleteField (type,index) {
            let newarray = [];
            this.createDataTableQuerys.columnInfoList.forEach((m)=>{
                if(m!=index)
                {
                    newarray.push(m);
                }
            })

            this.createDataTableQuerys.columnInfoList = newarray;

            if (this.createDataTableQuerys.columnInfoList.length < 1) {
                adToast({
                    message: '至少需要有一条字段'
                })
            }
        },
        showDataTable (entery,types) {
            let _this=this;
            //数据类型
            _.ajax({
                url:'/api/datatablemanagement/baseinfo',
                method:'POST',
                data:{
                    tableInfoId:entery
                },
                success:function(res){
                    if(res.code =='0')
                    {
                        if(types=='detail'){ _this.dataTableDetail = res.data;  }
                        if(types=='update'){
                            res.data.columnInfoList.forEach(m=>{
                                m.isOlddate=true;
                            })
                            _this.createDataTableQuerys = res.data;
                        }
                        if(res.data.columnInfoList.filter(function (mi) {
                                return mi.isPartitionKey ==1;
                            }).length>0)
                        {
                            _this.showfengqu = true;
                        }else {
                            _this.showfengqu = false;
                        }
                    }
                },
                error:function (err) { }
            })
            this.dataTableDetailShow = true;
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
        returnback(){

            _.urltransfer(this.$router,"/datatablemanagement"+'?'+Math.random()*10000);

        },
        createdata(){
            let _this =this;
            _.needFilterTransfer.set(false);
            var valideTableName=alphaNumericUnderline(_this.createDataTableQuerys.tableName)
            if(!valideTableName.success)
            { _this.createDataTableQuerys.tablenameWarnings =[valideTableName.msg];
                return true;
            }else if(_this.createDataTableQuerys.tableName.length>50)
            {
                _this.createDataTableQuerys.tablenameWarnings =['不能超过50字符！'];
                return true;
            }else {
                _this.createDataTableQuerys.tablenameWarnings =null;
            }

            if(!this.validateTableDes(_this.createDataTableQuerys.tableDes)){
                return true;
            }

            if(_this.createDataTableQuerys.sla.length>50)
            {
                _this.createDataTableQuerys.slaWarnings =['不能超过50字符！'];
                return true;
            }else {
                _this.createDataTableQuerys.slaWarnings =null;
            }
            if(_this.createDataTableQuerys.tableDes.length>150)
            {
                _this.createDataTableQuerys.desWarnings =['不能超过150字符！'];
                return true;
            }else {
                _this.createDataTableQuerys.desWarnings =null;
            }


            let  returnvalue =false;

            _this.createDataTableQuerys.columnInfoList.forEach((m)=> {
                var valideColumnName=alphaNumericUnderline(m.columnName)
                if (!valideColumnName.success) {
                    m.nameWarnings = [valideColumnName.msg];
                    returnvalue = true;
                } else if(m.columnName.length>50)
                {
                    m.nameWarnings = ['不能超过50字符！'];
                    returnvalue = true;
                }
                else {
                    m.nameWarnings = null;
                }
                if (!/^(\d+|(\d+,\d+))$/.test(m.columnLength)) {
                    m.lengthWarnings = ['长度必须为数字！'];
                    returnvalue = true;
                }else if(m.columnLength.length>50)
                {
                    m.lengthWarnings = ['不能超过50字符！'];
                    returnvalue = true;
                }
                else {
                    m.lengthWarnings = null;
                }

                if(m.columnDesc.length>150)
                {
                    m.desWarnings = ['不能超过150字符！'];
                    returnvalue = true;
                }
                else {
                    m.desWarnings = null;
                }
            })
            _this.updatewaring();

            if(returnvalue){
                return true
            }
            if (_this.createDataTableQuerys.columnInfoList.length < 1) {
                adToast({
                    message: '至少需要有一条字段'
                })
                return true
            }

            let colstring = "";
            _this.createDataTableQuerys.columnInfoList.forEach((colnam)=>{
                if(colstring.indexOf('_space_'+colnam.columnName+'_space_')>-1)
                {
                    adToast({
                        message: '字段名不能重复'
                    })
                    returnvalue = true;
                    return true
                }
                else{
                    colstring+= '_space_'+colnam.columnName+'_space_';
                }
            });

            if(returnvalue){
                return true
            }

            delete   _this.createDataTableQuerys.tablenameWarnings;
            delete   _this.createDataTableQuerys.slaWarnings;
            delete   _this.createDataTableQuerys.desWarnings;

            _this.createDataTableQuerys.columnInfoList.forEach((colm)=>{
                delete colm.nameWarnings;
                delete colm.lengthWarnings;
                delete colm.desWarnings;
            });
            _this.showCreateFormBtnDisabled=true;


            var concatarray =_this.createDataTableQuerys.columnInfoList.filter((conlist)=>{
                return conlist.isPartitionKey ==0;
            });

            var concatarr =_this.createDataTableQuerys.columnInfoList.filter((conlist)=>{
                return conlist.isPartitionKey ==1;
            });
            _this.createDataTableQuerys.columnInfoList=concatarray.concat(concatarr);
            var projectId=_.currentProjectId.get();
            this.isShowMarkLoading =true;


            if(this.showmodel=='create'){


                fetchAgent.add({
                    projectId,
                    objectval:JSON.stringify(_this.createDataTableQuerys)
                },function(res){
                    _this.isShowMarkLoading =false;
                    if(res.code =='0') {
                        adToast({  message: '添加成功'  });

                        _this.returnback();

                    }else{
                        _this.messageAlert('添加失败:'+res.msg);

                    }
                })

            }else{
                fetchAgent.update({
                    projectId,
                    objectval:JSON.stringify(_this.createDataTableQuerys)
                },function(res){
                    _this.isShowMarkLoading =false;
                    if(res.code =='0') {
                        adToast({  message: '修改成功'  });
                        _this.returnback();
                    }else{
                        _this.messageAlert('修改失败:'+res.msg);

                    }
                })

            }

        },
        importdata(){
            let _this =this;
            console.log('90999')
            _.ajax({
                url:'/api/datatablemanagement/external_datasource/field',
                method:'POST',
                data:{
                    url:_this.createType_RDB.connUrl,
                    userName:_this.createType_RDB.connUser,
                    password:_this.createType_RDB.connPass,
                    table:_this.createType_Table
                },
                success:function(res){
                    if(res.code =='0')
                    {
                        if(res.data.length>0)
                        {
                        let addlist =[];
                        res.data.forEach(m=>{
                            m.type.toLocaleUpperCase()=="TEXT"?m.type="STRING":m.type;
                            m.type.toLocaleUpperCase()=="DATETIME"?m.type="DATE":m.type;
                            addlist.push({
                                "columnDesc": "",
                                "columnLength": m.length,
                                "columnName": m.name,
                                "columnType": m.type,
                                "isIndex": 0,
                                "isKey": 0,
                                "isNull": 0,
                                "isRefKey": 0,
                                "isPartitionKey": 0,
                                "securityLevel": "A",
                                "nameWarnings":null,
                                "lengthWarnings":null,
                                "desWarnings":null
                            });
                        })

                        _this.createDataTableQuerys.columnInfoList.forEach(m=>{
                            if(m.isPartitionKey==1){

                                addlist.push(m);
                            }
                        })

                        _this.createDataTableQuerys.columnInfoList = addlist;
                        }
                    }
                    else{
                        _this.messageAlert('请选择数据表')
                    }
                },
                error:function (err) { }
            })
        },
        initRDB(){
            let _this =this;
            let projectId=_.currentProjectId.get();
            _.ajax({
                url:'/api/datatablemanagement/external_datasource/rdb',
                method:'POST',
                data:{
                    projectId:projectId
                },
                success:function(res){
                    if(res.code =='0')
                    {
                        let reslist  = [];
                        _.isArray(res.data)&&res.data.forEach(m=>{
                            reslist.push({value:m,text:m.name})
                        })
                        _this.createTypeOptions_RDB = reslist;
                    }
                },
                error:function (err) { }
            })
        },
/*        changeRDB(rdb){
            this.createType_RDB =rdb;
            this.createType_Table="";
            let _this =this;
            _.ajax({
                url:'/api/datatablemanagement/external_datasource/table',
                method:'POST',
                data:{
                    url:rdb.connUrl,
                    userName:rdb.connUser,
                    password:rdb.connPass
                },
                success:function(res){
                    let tablelist  = [];
                    if(res.code=='0'&&_.isArray(res.data)){
                        res.data.forEach(m=>{
                            tablelist.push({text:m.name,value:m.name});
                        })
                    }
                    _this.createTypeOptions_Table  = tablelist;
                    tablelist[0]&&(_this.createType_Table=tablelist[0].value)
                },
                error:function (err) {
                    _this.createTypeOptions_Table  = [];
                    _this.createType_Table="";
                }
            })

        },
        changeTable(table){
            this.createType_Table =table;
        },*/
        forbidback(event){
            //防止页面后退
            if(_.needFilterTransfer.get()){
                event.returnValue=false;
                _.urltransfer(this.$router,"/datatablemanagement"+'?'+Math.random()*10000);
            }
            else{
                event.returnValue=false;
            }
            history.pushState(null, null, document.URL);
        },
        forbidrefresh(event){
            if(_.needFilterTransfer.get()){
                event.returnValue=false;
            }
        },
        sugSelectClick(rdb,type){
            if(type=='rdb'){
                rdb=rdb.value;
                this.createType_RDB =rdb;
                this.createType_Table="";
                let _this =this;
                _.ajax({
                    url:'/api/datatablemanagement/external_datasource/table',
                    method:'POST',
                    data:{
                        url:rdb.connUrl,
                        userName:rdb.connUser,
                        password:rdb.connPass
                    },
                    success:function(res){
                        let tablelist  = [];
                        if(res.code=='0'&&_.isArray(res.data)){
                            res.data.forEach(m=>{
                                tablelist.push({text:m.name,value:m.name});
                            })
                        }
                        _this.createTypeOptions_Table  = tablelist;
                       // tablelist[0]&&(_this.createType_Table=tablelist[0].value)
                    },
                    error:function (err) {
                        _this.createTypeOptions_Table  = [];
                        _this.createType_Table="";
                    }
                })
            }else{

                this.createType_Table  = rdb.value;
            }
        },
        sugChangeInput(v,type){
            var subobj = null;
            var showobj =[];
            if(type=='rdb'){
                 subobj =  this.createTypeOptions_RDB.filter((fliter)=>
                {
                    return  fliter.text.indexOf(v)>-1
                });
                subobj.forEach((substr,i)=>{
                    if(i<11)
                    {
                        showobj.push(substr);
                    }
                });
                this.associations_RDB=JSON.parse(JSON.stringify(showobj));
            }else{
                 subobj =  this.createTypeOptions_Table.filter((fliter)=>
                {
                    return  fliter.text.indexOf(v)>-1
                });
                subobj.forEach((substr,i)=>{
                    if(i<11)
                    {
                        showobj.push(substr);
                    }
                });
                this.associations_Table=JSON.parse(JSON.stringify(showobj));
            }
        }
    },
    created() {
        var _this=this;
        fetchAgent.fetchFieldType(function(res){
           if(res&&res.code==0){
               _this.createDataTableOptions.fieldType=res.data;
           }
        })
        this.showmodel =this.$route.params.type;

        if(this.showmodel=='create'){
            this.showCreateForm();
            this.initRDB();
        }else if(this.showmodel=='detail'||this.showmodel=='update'){
            this.showDataTable(this.$route.params.Id,this.showmodel);
        }
        if(this.showmodel=='create'||this.showmodel=='update') {
            _.needFilterTransfer.set(true);
        }
        history.pushState(null, null, document.URL);
        window.addEventListener('popstate', this.forbidback);
        window.addEventListener('beforeunload',this.forbidrefresh);
    },
    destroyed() {
        window.removeEventListener('popstate', this.forbidback);
        window.removeEventListener('beforeunload',this.forbidrefresh);
        _.needFilterTransfer.set(false);
    }
}