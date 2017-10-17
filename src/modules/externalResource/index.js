/**
 * Created by Administrator on 2017-9-20.
 */
import navBar  from '../../admin-ui-extend/components/admin-navbar.vue';
import CONSTANT from '../../js/utils/constant.js'
import adPaginator from '../../admin-ui/components/admin-paginator';
import adSelect from '../../admin-ui/components/admin-select'
import adModal from '../../admin-ui/components/admin-modal'
import adInput from '../../admin-ui/components/admin-input'
import detail from './detail'
import update from './update'
import AdSpinner from '../../admin-ui/components/admin-spinner'
import msgBox from '../../admin-ui/components/admin-message-box/index.js'
import toast from '../../admin-ui/components/admin-toast'

export default{
    name:'externalResource',
    data(){
        return {
            navlist:[{id:1,text:'项目管理',url:''},{id:2,text:'外部资源配置',url:''}],
            deleteId:'',
            okDelete:false,
            confirmDelete:false,
            projectId:'',
            options:[],
            curConnectedMode:"2",
            connectedModeOptions: [{text:"主动",value:"2"},{text:"被动",value:"1"}],
            dataSourceTypeList:[{text:"mysql",value:"1"},{text:"ftp",value:"2"}],//{text:"mysql",value:"1"},{text:"vertica",value:"2"}
            addDataSource:false,
            dataSourceDetail:false,
            dataSourceUpdate:false,
            theDataSourceType:"1",
            createData:{
                dataSourceName:"",
                dataSourceType:"1",
                DataSourceDescription:"",

                serverAddress:"",
                serverPort:"",
                userName:"",
                userPassword:"",
                database:"",

                zkServerAddress:"",
                brokerList:"",
                topicName:"",

                nameNodeAddress:"",
                HDFSName:"",

                ftpServerAddress:"",
                ftpServerPort:"",
                ftpUserName:"",
                ftpUserPassword:"",
                path:"",
                connectMode:"1"
            },
            notEmpty:null,
            warningsMap: {},
            warningMap:{},
            detailDataSourceType:"mysql",
            detailData:{},
            iniData:{},
            iniType:"mysql",
            pager:{
                totalCount:0,
                pageSize:CONSTANT.pageSize,
                currentPage:1,
            },
            dataList:[]
        }
    },
    components:{
        adSelect,
        adModal,
        adInput,
        detail,
        update,
        adPaginator,
        navBar,
        AdSpinner,
        toast
    },
    mounted: function () {
        this.iniProject()
    },
    methods:{
        showCreateDialog:function () {
            this.addDataSource = true;
        },
        closeCreateDialog:function () {
            this.iniCreateData();
            this.addDataSource = false;
        },
        closeDetailDialog:function () {
            this.dataSourceDetail = false;
        },
        iniProject:function () {
            let that = this;
            _.ajax({
                url:'/api/datalaboratory/datalab/projectlist',
                method:'post',
                data:{},
                success:function(res){
                    that.projectId = res.projectId;
                    that.list();
                }
            })
        },
        list:function(pageIndex){
            let that = this;
            getList();
            function getList() {
                if (!/^[0-9]+$/.test(pageIndex)) {
                    pageIndex = 1;
                } else {
                    pageIndex = pageIndex < 1 ? 1 : pageIndex;
                }
                _.ajax({
                    url: '/api/externalresource/pagelist',
                    method: 'post',
                    data: {
                        "url": '/get/n/' + pageIndex + '/' + that.pager.pageSize,
                        "projectId": that.projectId,
                        "isAccurate": true
                    },
                    success: function (res) {
                        if (res.code === "0") {
                            res.data.list.forEach((m) => {
                                m.createTime = m.createTime ? _.date2String(new Date(m.createTime), 'yyyy-MM-dd hh:mm:ss') : "";
                            });
                            that.dataList = res.data.list;
                            that.pager.totalCount = res.data.total;
                            that.pager.currentPage = res.data.pageNum;
                        }
                    }
                })
            }
        },
        detail:function(id){
            let that=this;
            _.ajax({
                url:'/api/externalresource/detail',
                method:'post',
                data:{
                    url:id
                },
                success:function(res){
                    if(res.code =="0"){
                        that.detailData = res.data;
                        that.detailDataSourceType = that.detailData.storageType;
                        that.dataSourceDetail = true;
                    }
                }
            })
        },
        update:function(id){
            let that=this;
            _.ajax({
                url:'/api/externalresource/detail',
                method:'post',
                data:{
                    url:id
                },
                success:function(res){
                    if(res.code =="0"){
                        that.iniData = res.data;
                        that.iniType = that.iniData.storageType;
                        that.dataSourceUpdate= true;
                    }
                }
            })

        },
        del:function(id){
            let that = this;
            msgBox({
                message:"确认删除该外部资源吗？",
                type:'confirm',
                confirm(){
                    _.ajax({
                        url:'/api/externalresource/delete',
                        method:'post',
                        data:{
                            url:id
                        },
                        success:function(res){
                            if(res.code =="0"){
                                that.list();
                            }else{
                                msgBox({
                                    message:"删除异常",
                                    type:'alert',
                                    confirm(){}
                                })
                            }
                        }
                    })
                }
            })
        },
        //分页页码切换
        togglePage:function(pIndex){
            this.list(pIndex);
        },
        updateCancel:function(){
            this.dataSourceUpdate=false;
            this.warningMap={};
        },
        updateDataSource:function(){
            let isOk=false;
            if(this.iniDataIsEmpty("resourceName")){
                this.$set(this.warningMap, "resourceName", ['不能为空'])
                return !isOk;
            }

            switch(this.iniData.dataSourceType){
                case 'mysql':
                    if(this.iniDataIsEmpty("connHost")){
                        this.$set(this.warningMap, "connHost", ['不能为空'])
                        return !isOk;
                    }
                    if(this.iniDataIsEmpty("connPort")){
                        this.$set(this.warningMap, "connPort", ['不能为空'])
                        return !isOk;
                    }else if(!this.iniDataIsNumber("connPort")){
                        this.$set(this.warningMap, "connPort", ['必须为数字'])
                        return !isOk;
                    }
                    if(this.iniDataIsEmpty("connUser")){
                        this.$set(this.warningMap, "connUser", ['不能为空'])
                        return !isOk;
                    }
                    if(this.iniDataIsEmpty("connPass")){
                        this.$set(this.warningMap, "connPass", ['不能为空'])
                        return !isOk;
                    }
                    if(this.iniDataIsEmpty("databaseName")){
                        this.$set(this.warningMap, "databaseName", ['不能为空'])
                        return !isOk;
                    }
                    break;
                case 'ftp':
                    if(this.iniDataIsEmpty("ftpServerAddress")){
                        this.$set(this.warningMap, "ftpServerAddress", ['不能为空'])
                        return !isOk;
                    }
                    if(this.iniDataIsEmpty("ftpServerPort")){
                        this.$set(this.warningMap, "ftpServerPort", ['不能为空'])
                        return !isOk;
                    }else if(!this.iniDataIsNumber("ftpServerPort")){
                        this.$set(this.warningMap, "ftpServerPort", ['必须为数字'])
                        return !isOk;
                    }
                    if(this.iniDataIsEmpty("ftpUserName")){
                        this.$set(this.warningMap, "ftpUserName", ['不能为空'])
                        return !isOk;
                    }
                    if(this.iniDataIsEmpty("ftpUserPassword")){
                        this.$set(this.warningMap, "ftpUserPassword", ['不能为空'])
                        return !isOk;
                    }
                    if(this.iniDataIsEmpty("path")){
                        this.$set(this.warningMap, "path", ['不能为空'])
                        return !isOk;
                    }
                    break;

              /*  case 'vertica':
                    if(this.iniDataIsEmpty("connHost")){
                        this.$set(this.warningMap, "connHost", ['不能为空'])
                        return !isOk;
                    }
                    if(this.iniDataIsEmpty("connPort")){
                        this.$set(this.warningMap, "connPort", ['不能为空'])
                        return !isOk;
                    }else if(!this.iniDataIsNumber("connPort")){
                        this.$set(this.warningMap, "connPort", ['必须为数字'])
                        return !isOk;
                    }
                    if(this.iniDataIsEmpty("connUser")){
                        this.$set(this.warningMap, "connUser", ['不能为空'])
                        return !isOk;
                    }
                    if(this.iniDataIsEmpty("connPass")){
                        this.$set(this.warningMap, "connPass", ['不能为空'])
                        return !isOk;
                    }
                    if(this.iniDataIsEmpty("databaseName")){
                        this.$set(this.warningMap, "databaseName", ['不能为空'])
                        return !isOk;
                    }
                    break;

                case 'kafka':
                    if(this.iniDataIsEmpty("zkServerAddress")){
                        this.$set(this.warningMap, "zkServerAddress", ['不能为空'])
                        return !isOk;
                    }
                    if(this.iniDataIsEmpty("brokerList")){
                        this.$set(this.warningMap, "brokerList", ['不能为空'])
                        return !isOk;
                    }
                    if(this.iniDataIsEmpty("topicName")){
                        this.$set(this.warningMap, "topicName", ['不能为空'])
                        return !isOk;
                    }
                    break;
                case 'hdfs':
                    if(this.iniDataIsEmpty("nameNodeAddress")){
                        this.$set(this.warningMap, "nameNodeAddress", ['不能为空'])
                        return !isOk;
                    }
                    if(this.iniDataIsEmpty("HDFSName")){
                        this.$set(this.warningMap, "HDFSName", ['不能为空'])
                        return !isOk;
                    }
                    break;
                */

            }

            let that=this;


            var updateObj ={
                "databaseName": that.iniData.databaseName,
                "description": that.iniData.resourceDesc,
                "host": that.iniData.connHost,
                "port": that.iniData.connPort,
                "projectId": that.projectId,
                "resourceName": that.iniData.resourceName,
                "resourceOutId": that.iniData.resourceOutId,
                "type": that.iniData.storageType,
                "userName": that.iniData.connUser,
                "userPassword": that.iniData.connPass,
                "connectMode": that.iniData.connectMode,
                "path": that.iniData.path
            };
            _.ajax({
                url:'/api/externalresource/update',
                method:'post',
                data:updateObj,
                success:function(res){
                    if(res.code =="0"){
                        that.list();
                        toast({
                            duration: 1000,
                            message:'修改成功'
                        })
                    }else{
                        msgBox({
                            message:"修改异常",
                            type:'alert',
                            confirm(){}
                        })
                    }
                }
            })
            //关闭窗口

            return false;
        },
        iniDataIsNumber:function(key){
            return /^[0-9]+$/g.test(this.iniData[key]);
        },
        iniDataIsEmpty:function(key){
            return /^\s+$/g.test(this.iniData[key]) ||this.iniData[key] =='';
        },
        //测试数据库连接-add
        testDataSourceAdd:function(){

            if(this.theDataSourceType==1){
                let databaseName = this.createData.database;
                let host = this.createData.serverAddress;
                let password = this.createData.userPassword;
                let port = this.createData.serverPort;
                let userName = this.createData.userName;
                this.testDataConnection(databaseName,host,password,port,userName);
            }else{
                let host = this.createData.ftpServerAddress;
                let password = this.createData.ftpUserPassword;
                let port = this.createData.ftpServerPort;
                let userName = this.createData.ftpUserName;
                let path = this.createData.path;
                this.testDataConnection(false,host,password,port,userName,path);
            }

            return true;
        },
        //测试数据库连接-update
        testDataSourceUpdate:function(){
            let databaseName = this.iniData.databaseName;
            let host = this.iniData.connHost;
            let password = this.iniData.connPass;
            let port = this.iniData.connPort;
            let userName = this.iniData.connUser;
            if(this.theDataSourceType==1){

            this.testDataConnection(databaseName,host,password,port,userName);
            }else{
                let path = this.iniData.path;
                this.testDataConnection(false,host,password,port,userName,path);
            }
            return true;
        },
        testDataConnection:function (databaseName, host, password, port, userName,path) {
            let that = this;
            $("body").prepend($("#external-resource-spinner"));
            $("#external-resource-spinner:first").show();

            let postobje ={
                "databaseName": databaseName,
                "host": host,
                "password": password,
                "port": port,
                "userName": userName,
                "type":"1"
            };

            if(!databaseName){
                postobje ={
                    "host": host,
                    "password": password,
                    "port": port,
                    "userName": userName,
                    "path":path,
                    "type":"2"
                };
            }
            _.ajax({
                url: '/api/externalresource/testconnection',
                method: 'post',
                data: postobje,
                success: function (res) {
                    $("#external-resource-spinner:first").hide();
                    msgBox({
                        message: res.msg,
                        type: 'alert',
                        confirm(){}
                    });

                }
            });

        },
        createDataSource:function(){
            let isOk=false;
            if(this.isEmpty("dataSourceName")){
                this.$set(this.warningsMap, "dataSourceName", ['不能为空'])
                return !isOk;
            }

            this.validateNotEmpty(this.createData.DataSourceDescription,"DataSourceDescription");

       /*     if(!_.validate(this.warningsMap)){
                return true;
            }
       */
            switch(this.theDataSourceType){
                case '1': //1 ==》mysql
                    if(this.isEmpty("serverAddress")){
                        this.$set(this.warningsMap, "serverAddress", ['不能为空'])
                        return !isOk;
                    }
                    if(this.isEmpty("serverPort")){
                        this.$set(this.warningsMap, "serverPort", ['不能为空'])
                        return !isOk;
                    }else if(!this.isNumber("serverPort")){
                        this.$set(this.warningsMap, "serverPort", ['必须为数字'])
                        return !isOk;
                    }
                    if(this.isEmpty("userName")){
                        this.$set(this.warningsMap, "userName", ['不能为空'])
                        return !isOk;
                    }
                    if(this.isEmpty("userPassword")){
                        this.$set(this.warningsMap, "userPassword", ['不能为空'])
                        return !isOk;
                    }
                    if(this.isEmpty("database")){
                        this.$set(this.warningsMap, "database", ['不能为空'])
                        return !isOk;
                    }
                    break;
                case '2': //2
                    if(this.isEmpty("ftpServerAddress")){
                        this.$set(this.warningsMap, "ftpServerAddress", ['不能为空'])
                        return !isOk;
                    }
                    if(this.isEmpty("ftpServerPort")){
                        this.$set(this.warningsMap, "ftpServerPort", ['不能为空'])
                        return !isOk;
                    }else if(!this.isNumber("ftpServerPort")){
                        this.$set(this.warningsMap, "ftpServerPort", ['必须为数字'])
                        return !isOk;
                    }

                    if(this.isEmpty("ftpUserName")){
                        this.$set(this.warningsMap, "ftpUserName", ['不能为空'])
                        return !isOk;
                    }
                    if(this.isEmpty("ftpUserPassword")){
                        this.$set(this.warningsMap, "ftpUserPassword", ['不能为空'])
                        return !isOk;
                    }
                    if(this.isEmpty("path")){
                        this.$set(this.warningsMap, "path", ['不能为空'])
                        return !isOk;
                    }
                    break;
          /*      case 'kafka':
                    if(this.isEmpty("zkServerAddress")){
                        this.$set(this.warningsMap, "zkServerAddress", ['不能为空'])
                        return !isOk;
                    }
                    if(this.isEmpty("brokerList")){
                        this.$set(this.warningsMap, "brokerList", ['不能为空'])
                        return !isOk;
                    }
                    if(this.isEmpty("topicName")){
                        this.$set(this.warningsMap, "topicName", ['不能为空'])
                        return !isOk;
                    }
                    break;
                case 'hdfs':
                    if(this.isEmpty("nameNodeAddress")){
                        this.$set(this.warningsMap, "nameNodeAddress", ['不能为空'])
                        return !isOk;
                    }
                    if(this.isEmpty("HDFSName")){
                        this.$set(this.warningsMap, "HDFSName", ['不能为空'])
                        return !isOk;
                    }
                    break;
                case 'ftp':
                    if(this.isEmpty("ftpServerAddress")){
                        this.$set(this.warningsMap, "ftpServerAddress", ['不能为空'])
                        return !isOk;
                    }
                    if(this.isEmpty("ftpServerPort")){
                        this.$set(this.warningsMap, "ftpServerPort", ['不能为空'])
                        return !isOk;
                    }else if(!this.isNumber("ftpServerPort")){
                        this.$set(this.warningsMap, "ftpServerPort", ['必须为数字'])
                        return !isOk;
                    }

                    if(this.isEmpty("ftpUserName")){
                        this.$set(this.warningsMap, "ftpUserName", ['不能为空'])
                        return !isOk;
                    }
                    if(this.isEmpty("ftpUserPassword")){
                        this.$set(this.warningsMap, "ftpUserPassword", ['不能为空'])
                        return !isOk;
                    }
                    break;*/

            }
            let postdata = {};
            let that = this;
            switch(this.theDataSourceType){
                case "1":
                    postdata = {
                        "databaseName":that.createData.database,
                        "description": that.createData.DataSourceDescription,
                        "host": that.createData.serverAddress,
                        "port": that.createData.serverPort,
                        "projectId": that.projectId,
                        "resourceName": that.createData.dataSourceName,
                        "type": that.theDataSourceType,
                        "userName": that.createData.userName,
                        "path": that.createData.path,
                        "userPassword": that.createData.userPassword
                    };
                    break;
                case "2":
                    postdata = {
                        "description": that.createData.DataSourceDescription,
                        "host": that.createData.ftpServerAddress,
                        "port": that.createData.ftpServerPort,
                        "projectId": that.projectId,
                        "resourceName": that.createData.dataSourceName,
                        "type": that.theDataSourceType,
                        "userName": that.createData.ftpUserName,
                        "path": that.createData.path,
                        "userPassword": that.createData.ftpUserPassword,
                        "connectMode":that.createData.connectMode
                    };
                    break;
            }
            _.ajax({
                url: '/api/externalresource/add',
                method: 'post',
                data: postdata,
                success: function (res) {
                    if(!res.error && res.code && res.code =="0"){
                        that.list();
                        toast({
                            duration: 1000,
                            message:'增加成功'
                        })
                    }else {
                        if(res.error){
                            msgBox({
                                message: "操作异常",
                                type: 'alert',
                                confirm(){}
                            })
                        }else {
                            msgBox({
                                message: res.msg,
                                type: 'alert',
                                confirm(){}
                            })
                        }

                    }
                }
            });

            //关闭窗口
            return false;
        },
        iniCreateData:function(){

            this.createData.dataSourceName="";
            this.createData.dataSourceType="1";
            this.createData.DataSourceDescription="";
            this.createData.serverAddress="";
            this.createData.serverPort="";
            this.createData.userName="";
            this.createData.userPassword="";
            this.createData.database="";
            this.createData.zkServerAddress="";
            this.createData.brokerList="";
            this.createData.topicName="";
            this.createData.nameNodeAddress="";
            this.createData.HDFSName="";
            this.createData.ftpServerAddress="";
            this.createData.ftpServerPort="";
            this.createData.ftpUserName="";
            this.createData.path="";
            this.createData.ftpUserPassword="";
            this.createData.connectedMode="1";
            this.theDataSourceType="1";

            this.warningsMap ={};
        },
        validateNotEmpty:function(v, key){
            if(/^\s+$/.test(v) || v.length ==0){
                this.$set(this.warningsMap, key, ['不能为空'])
            }else if(key.indexOf('Port')>0 && !/^[0-9]+$/g.test(v)){
                this.$set(this.warningsMap, key, ['必须为数字'])
            }else if (key ==="DataSourceDescription" && v.length > 100){
                this.$set(this.warningsMap, key, ['长度不能大于100'])
            }else {
                this.$set(this.warningsMap, key, null)
            }
        },
        isNumber:function(key){
            return /^[0-9]+$/g.test(this.createData[key]);
        },
        isEmpty:function(key){
            return /^\s+$/g.test(this.createData[key]) ||this.createData[key] =='';
        }
    },
    computed:{

    },
    watch:{
        theDataSourceType(v){
            this.createData.dataSourceType = v;
            switch(v){

                case '1':
                    this.createData.serverAddress="";
                    this.createData.serverPort="";
                    this.createData.userName="";
                    this.createData.userPassword="";
                    this.createData.database="";
                    break;
                case '2':
                    this.createData.ftpServerAddress="";
                    this.createData.ftpServerPort="";
                    this.createData.ftpUserName="";
                    this.createData.ftpUserPassword="";
                    this.createData.path="";
                    this.createData.connectedMode="1";
                    break;
             /*   case 'kafka':
                    this.createData.zkServerAddress="";
                    this.createData.brokerList="";
                    this.createData.topicName="";
                    break;
                case 'hdfs':
                    this.createData.nameNodeAddress="";
                    this.createData.HDFSName="";
                    break;
                case 'ftp':
                    this.createData.ftpServerAddress="";
                    this.createData.ftpServerPort="";
                    this.createData.ftpUserName="";
                    this.createData.ftpUserPassword="";
                    this.createData.connectedMode="被动";
                    break;*/


            }
        }
    }

}