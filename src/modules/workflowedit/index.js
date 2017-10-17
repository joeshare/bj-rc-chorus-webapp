/**
 * Created by AnThen on 2017-3-3.
 */
import MessageBox from 'adminUI/components/admin-message-box/index'
import AdminInput from 'adminUI/components/admin-input.vue';
import adSelect from 'adminUI/components/admin-select.vue';
import AdminCheckbox from 'adminUI/components/admin-checkbox.vue';
import AdModal from 'adminUI/components/admin-modal.vue';
import Paginator from 'adminUI/components/admin-paginator.vue';
import Toast from 'adminUI/components/admin-toast/index';
import navBar  from '../../admin-ui-extend/components/admin-navbar.vue';
import CONSTANT  from 'Utils/constant';
import regex  from 'Utils/regex';
import {queryTableData as queryMockTableData}  from './mock.js';
import adSpinner from 'adminUI/components/admin-spinner'

import {tabs, activeTabId} from  './tabs.js';
import DragModel from  './models/dragModel.js';
import {canvas as CanvasModel} from  './models/canvasModel.js';
import ModulePropertyFetchModel from  './models/modulePropertyFetchModel.js';
import nodeDataModel from  './models/nodeDataModel.js';
import canvasUtils from  './utils/canvasUtils.js';
import fetchAgent from  './utils/fetchAgent.js';
import dataUtils from './utils/dataUtils.js';
import ModuleProperty from  './components/moduleProperty/index.vue';
import lineModel from  './models/lineModel.js';
import Maps from  './components/maps/index.vue';
import Mock from  './mock.js';
//variable : "[{'name':'executionDate', 'desc':'任务执行日期'}]"
//批量类型
const BATCHTPYE = "2";
/**
 * 本期写死，下期正式成数据库配置
 * @param o
 */
function setDefault4ModuleProperty(o) {
    var projectCode = _.currentProjectCode.get(),
        dwUserName = _.currentProjectOwner.get(),
        userName = dwUserName,
        queueName = projectCode,
        projectId = _.currentProjectId.get();
    var maps = {
        projectId,
        projectCode,
        'dwConnectUrl': CONSTANT.dwConnectUrl,
        'dwDbName': `chorus_${projectCode}`,
        'dwLocation': `/chorus/project/${projectCode}/tmp/`,
        dwUserName,
        'serverUrl': `${CONSTANT.serverUrl}/chorus_${projectCode}`,
        userName,
        queueName
    };
    var defaultV = maps[o.name]
    if (o.name == "directory") {
        o.value = `/chorus/project/${projectCode}${o.value}`;
    } else if (defaultV) {
        o.value = defaultV;
    }
}
export default {
    components: {
        AdminInput,
        AdModal,
        AdminCheckbox,
        adSelect,
        Toast,
        Maps,
        ModuleProperty,
        adSpinner,
        //'adTabs':resolve => require(['adminUI/components/admin-tabs.vue'], resolve)
        'adTabs': resolve => require(['../../admin-ui-extend/components/admin-tabs-vertical.vue'], resolve)
    },
    data() {
        let _this = this;
        return {
            getJobinfoAjaxId:null,
            fetchTabsAjaxId:null,
            fetchXdModulesAjaxId:null,
            tabsWidth: 300,
            projectId: _.currentProjectInfo.get() && _.currentProjectInfo.get().projectId,
            isShowMarkLoading: false,
            data: [],
            jobId: "",//_.uuid(108),
            jobType: "",
            tabs,
            currentjobId: '',
            //任务名称
            jobAliasName: "",
            jobAliasNameWarnings: null,
            jobDescriptionWarnings: null,
            workFlowDSLName: "",
            //任务名称
            jobDescription: "",
            instanceOptions: [],
            scheduleTypeOptions: [],
            //容器ID
            instanceId: '',
            instanceWarnings: null,
            points: [],
            lineData: [],
            tabSelectData: [],
            //调度规则
            "schedule": {
                "scheduleId": "",// 调度ID （创建是不传，修改是要回传）
                "scheduleType": 1,// 任务类型(1:一次性;2:周期)
                "scheduleTypeOptions": dataUtils.scheduleTypeOptions,
                "cronExpression": ""// CRON表达式 注：类型为2时有效 "* 0/2 * * * ?"
            },
            scheduleTypeEditAble: true,
            excuteErrorFlgCheckBox: false,
            timeOutFlgCheckBox: false,
            //告警规则
            "warningConfig": {
                "excuteErrorFlg": 1, // 任务执行出现异常(0:否，1:是) 默认是1
                "timeOutFlg": 1, // 任务执行时间超过(0:否，1:是) 默认是1
                "timeOutInterval": "120" // 任务执行超过时间(单位:分钟) 默认是120
            },
            timeOutIntervalWarnings: null,
            modulesBatchDealTypeContentVisible: true,
            modulesFlowTypeContentVisible: true,
            modulesOutputTypeContentVisible: true,
            modulesInputTypeContentVisible: true,
            dragable: true,
            compontentEditAble: true,
            workflowStatus: '',
            workflowStatusText: '',
            workflowType: "2",//2 是批量 1 流式
            workflowTypeText: 'batch',
            compontentSearchValue: '',
            modulesDealTypeArr: [],
            modulesBatchDealTypeArr: [],
            modulesInputTypeArr: [],
            modulesOutputTypeArr: [],
            modulesFlowTypeArr: [],
            //模块属性数据
            modulePropertyData: {
                "noShowTaskReferenceName": true,
                "options": []
            },
            taskList: [],
            workFlowDSL: [],
            saveBtnDisabled: false,
            deployBtnDisabled: false,
            unDeployBtnDisabled: false,
            excuteBtnDisabled: false,
            mapsModalDisplay: false,
            //模块任务数据
            nodeTaskData: {
                "name": "deploy",
                "taskReferenceName": "d1",
                "type": "SIMPLE",//SIMPLE，其他系统任务暂定为DECITION（决定任务），FORK（并行任务），JOIN（
                "inputParameters": {
                    "fileLocation": "${e1.output.encodeLocation}"
                },
                //定义worker类型，本期只有XD，所以类型只有一个为CHORUS，type类型为SIMPLE时必填
                "workerType": "CHORUS",
                "workerParams": {
                    //根据worker类型不同，传不同的参数，比如本期只有CHORUS类型，CHORUS类型对应的必要属性是moduleName和containerId
                    "moduleName": "RDB2Hive",
                    "containerId": "aaaaaaaa111111"
                }
            },
            workflowEditTaskLeftanelPanlStyle: {},
            workflowEditTaskCanvasTabsPanelStyle: {},
            isCanvasActive: false,
            activeTabId,
            options: [],
            currentDragData: null,
            canvasWith: 600,
            canvasHeight: 500,
            cronExpressionWarnings: null,
            searchKey: '',
            excuteMaps: [],
            dataInput: null,
            dataInputWarnings: null,
            dataOutput: null,
            dataOutputWarnings: null,
            mapsModalButtons: [{
                text: '取消',
                buttonClass: 'ad-auxiliary admin-small',
                name: 'cancel'
            }, {
                text: '确定',
                buttonClass: 'ad-auxiliary admin-small',
                name: 'ok',
                handler() {
                    var jobId = _this.jobId;
                    var params = _this.getJobParameters();
                    var arg = {jobId};
                    var isEmpty = true;
                    for (var k in params) {
                        isEmpty = false;
                        break;
                    }
                    if (!isEmpty) {
                        arg['jobParameters'] = JSON.stringify(_this.getJobParameters())
                    }
                    fetchAgent.excuteJob(arg, function (res) {
                        if (res && res.code == 0) {
                            Toast({
                                message: '提交成功！',
                                duration: 2000
                            })
                        } else {
                            _this.messageAlert('提交失败！');
                        }
                        _this.setSaveDeployDisabled(false);
                    })
                }
            }]
        }
    },
    created() {
        this.createModalBtns = this.firststep;
        this.workflowStatus = this.$route.params.status;
        this.jobType = this.workflowType = this.$route.params.type + "";
        var _tmpTabs = JSON.parse(JSON.stringify(tabs));
        this.tabs = _tmpTabs;
        //只有批量有血缘关系
        if (this.workflowType == 1) {
            this.tabs.splice(3, 1);
        }
        this.jobId = this.$route.params.jobId;
        this.workflowStatusText = dataUtils.status2Text(this.workflowStatus);
        _.registerAppResizeHandler("workfloweidt", this.appResize)
        nodeDataModel.deleteAllNode();
        //CanvasModel.init([],[],this.workflowType);

    },

    mounted() {
        var _this = this;
        this.instanceId=null;
        this.getJobinfoAjaxId=null;
        this.fetchXdModulesAjaxId=fetchAgent.fetchXdModules("", this.projectId, this.fetchXdModulesCallBack.bind(this, ""))

        this.setStyle();
        DragModel.setView(this);
        //this.DragModel= new DragModel(this)
        canvasUtils.setView(this)
        this.nodeDataModel = nodeDataModel;
        _this.workFlowDSL = [];
        _this.taskList = [];
        var _positionArr = [];
        this.fetchIntance();
        this.fetchTabsAjaxId=this.fetchTabs(function () {
            //当jobId 有数据时
            if (this.jobId !== 'create') {
                this.initCanvasDataByJobId(this.jobId)
            } else {
                this.jobId = "";
                CanvasModel.init(_this.points ? _this.points : [], _this.lineData ? _this.lineData : [], this.workflowType, "", this.workflowStatus == "DEPLOY");
            }

        }.bind(this));
    },
    destroyed() {
        if(this.getJobinfoAjaxId){ this.getJobinfoAjaxId.abort(); }
        if(this.fetchXdModulesAjaxId){ this.fetchXdModulesAjaxId.abort(); }
        if(this.fetchTabsAjaxId){ this.fetchTabsAjaxId.abort(); }
        DragModel.unBindAllEvent();
    },
    watch: {

        excuteErrorFlgCheckBox(v) {
            this.warningConfig.excuteErrorFlg = v ? 1 : 0;
        },
        timeOutFlgCheckBox(v) {
            this.warningConfig.timeOutFlg = v ? 1 : 0;
        },
        workflowStatus(v) {
            console.log('workflowStatus',!(v == "DEPLOY"))
            this.setCompontentDrag(!(v == "DEPLOY"));
            this.setCompontentEdit(!(v == "DEPLOY"));
            CanvasModel.setChidlrenDisabled(v == "DEPLOY");
        }

    },
    methods: {
        showModulesContent(key, e) {
            var panel = e.target.parentNode.parentNode;
            if (this[key]) {
                this[key] = false;
                panel.style.minHeight = '30px';
                if (key != 'modulesFlowTypeContentVisible') {
                    panel.style.flex = 'none';
                } else {
                    panel.style.height = '30px';
                }
            } else {
                this[key] = true;
                panel.style.minHeight = 0;
                if (key != 'modulesFlowTypeContentVisible') {
                    panel.style.flex = 1;
                } else {
                    panel.style.height = '105px';
                    panel.style.minHeight = '60px';
                }

            }
        },
        setStyle() {
            this.setCanvasStyle();
            this.setModulePanelStyle();
            this.setCanvasTabsPanelStyle();
        },
        getContentMainHeight() {
            let $div = $('.admin-page-content-main');
            return $div.height() - 32 - 24;
        },
        setModulePanelStyle() {
            this.workflowEditTaskLeftanelPanlStyle = {height: (this.getContentMainHeight() - 44 - 15 - 3) + 'px'};

        },
        setCanvasTabsPanelStyle() {
            let height = this.getContentMainHeight();
            this.workflowEditTaskCanvasTabsPanelStyle = {height: (height - 44 - 15 - 3) + 'px'};
            $('.admin-tabs-wrapper').height(height)
            $('.admin-pannel-content').height(height)
        },
        fetchTabs(cb) {
            var _this = this;
           return fetchAgent.fetchProjectTables(function (res) {
                if (res && res.code == 0) {
                    _this.tabSelectData = res.data;
                    var rec = _this.tabSelectData[0];
                    if (!_this.dataInput) {
                        _this.dataInput = rec ? rec.value : null;
                    }
                    if (!_this.dataOutput) {
                        _this.dataOutput = rec ? rec.value : null;
                    }
                }
                cb && cb();
            })
        },
        changeTabSelect() {
            this.validateBlood();
        },
        changeScheduleTypeOptions() {
            if (this.schedule.scheduleType == 1) {
                this.schedule.cronExpression = "";
                this.cronExpressionWarnings = null;
            }
        },
        //清空点数据
        emptyPoints() {
            while (this.points.length) {
                this.points.splice(0, 1);
            }
        },
        //清空线数据
        emptyLines() {
            while (this.lineData.length) {
                this.lineData.splice(0, 1);
            }
        },
        //清空全部数据
        emptyAll() {
            this.setActiveTabId('baseInfo');
            this.emptyLines();
            this.emptyPoints();
            nodeDataModel.deleteAllNode();
            this.jobId = "";
            this.schedule.scheduleId = "";
            this.modulePropertyData = null;
            while (this.taskList.length) {
                this.taskList.splice(0, 1)
            }
            this.workFlowDSLName = null;
        },
        //初始化canvas 数据
        initCanvasDataByJobId(jobId, cb) {
            var _this = this;
            var _positionArr = [];
            this.getJobinfoAjaxId=fetchAgent.getJobinfo(jobId, function (res) {
                _this.emptyAll();
                if (res.code == 0) {
                    _this.jobId = jobId;
                    var data = res.data;
                    data = res.data;
                    dataUtils.setJobData(_this, data)
                    dataUtils.setPositionArr(_this.workFlowDSL.tasks, 0, _positionArr)
                } else {
                    _this.messageAlert("数据失败，请返回重新进入！")
                    CanvasModel.init([], [], _this.workflowType, "", _this.workflowStatus == "DEPLOY");
                }
            })
            //如果没有表示失败
            if (!_this.jobId) {
                _this.isShowMarkLoading = false;
                return;
            }

            if ((this.jobType + "") == BATCHTPYE) {
                _positionArr.unshift([{
                    name: 'start',
                    taskReferenceName: "Start",
                    type: "START",
                    edgeData: [_positionArr[0][0].name]
                }]);
                _positionArr[_positionArr.length - 1][0].edgeData = ['end'];
                _positionArr.push([{name: 'end', taskReferenceName: "End", type: "END", edgeData: []}]);
            }
            dataUtils.setNodePositionByTwoDimension(_positionArr, this.canvasWith, this.canvasHeight, this.workflowStatus);
            var dataMaps = dataUtils.getPonitLineArr(_positionArr, _this.taskList);
            if (!dataMaps) {
                _this.messageAlert("数据失败，请返回重新进入！")
                _this.emptyAll();
                CanvasModel.init([], [], _this.workflowType, "", _this.workflowStatus == "DEPLOY");
                _this.isShowMarkLoading = false;
                return;
            }
            var lineData = dataUtils.getLineDataByCanvasData(dataMaps.lineMaps);
            if (dataMaps.nodeData) {
                dataMaps.nodeData.forEach((opt, i)=> {
                    _this.fetchSetNodeProperty(opt)
                })
            }
            _this.points = dataMaps.points ? dataMaps.points : [];
            _this.lineData = lineData;
            CanvasModel.init(_this.points ? _this.points : [], _this.lineData ? _this.lineData : [], _this.workflowType, "", _this.workflowStatus == "DEPLOY");
            cb && cb();
        },
        addData2Points(d) {
            this.points.push(d);
        },
        deleteDataInPoints(id) {
            var index = -1;
            this.points.every((l, i)=> {
                if (l.id == id) {
                    index = i;
                    return false;
                }
                return true;
            })
            if (index > -1) {
                this.points.splice(index, 1);
            }
        },
        addData2Lines(d) {
            this.lineData.push(d);
        },
        deleteDataInLines(id) {
            var index = -1;
            this.lineData.every((l, i)=> {
                if (l.id == id) {
                    index = i;
                    return false;
                }
                return true;
            })
            if (index > -1) {
                this.lineData.splice(index, 1);
            }
        },
        validateTaskName(arg, cb) {
            fetchAgent.validateTaskName(arg, cb)
        },
        fetchSetNodeProperty(node) {
            var _this = this;
            var moduleType = node.propertyData.moduleType, moduleName = node.propertyData.moduleName;
            var staticParams = node.propertyData.taskDSL.staticParams;
            if (moduleType == 'start' || moduleType == 'end') {
                node.propertyData.options = [];
                nodeDataModel.setNodeData(node)
            } else {
                this.fetchModuleProperty(moduleType, moduleName, function (res) {

                    var options = [];
                    if (res.code == 0) {
                        options = _this.setfetchModulePropertyData(res.data.options, staticParams)
                    }
                    node.propertyData.options = options;
                    nodeDataModel.setNodeData(node)

                })
            }

        },
        fetchIntance() {
            var _this = this,isHas=false;
            _this.instanceOptions = [];
            var projectId = this.projectId;
            fetchAgent.fetchInstance(projectId, function (res) {
                if (res && res.code == 0 && res.data.length) {
                    res.data.forEach((instance)=> {
                        if (instance.commonStatus.statusCode == "2102") {
                            _this.instanceOptions.push({
                                text: instance.groupName,
                                value: instance.instanceId
                            })
                        }
                    })
                    if (!_this.instanceId) {
                        _this.instanceId = res.data[0] ? res.data[0].instanceId : null;
                    }
                }
            })
        },
        deleteNode(nodePrefix) {
            nodeDataModel.deleteNode(nodePrefix);
            if (this.modulePropertyData && this.modulePropertyData.nodePrefix == nodePrefix) {
                this.modulePropertyData = null;
                this.setActiveTabId('baseInfo');
            }
        },
        messageAlert(msg, handler) {
            MessageBox({
                message: msg,
                type: 'alert',
                confirm() {
                    handler && handler();
                }
            })
        },
        messageConfirm(msg, handler) {
            MessageBox({
                message: msg,
                type: 'confirm',
                confirm() {
                    handler && handler();
                }
            })
        },
        setSaveDeployDisabled(v) {
            this.saveBtnDisabled = v;
            this.deployBtnDisabled = v;
            this.unDeployBtnDisabled = v;
            this.excuteBtnDisabled = v;
        },
        /**
         * 保存验证及信息显示
         * @returns {boolean}
         */
        validateSaveDataDisplayMsg() {
            var _this = this;
            //this.setSaveDeployDisabled(true);
            var validate = true;
            if (this.workflowType !== BATCHTPYE) {//流式
                validate = dataUtils.immediatelyWorkFlowRule({
                    children: canvasUtils.getContainer().children
                }, nodeDataModel)
                if (!validate.success) {
                    _this.messageAlert(validate.msg);
                    this.setSaveDeployDisabled(false);
                    return;
                }
            } else {
                validate = dataUtils.batchWorkFlowRule({
                    children: canvasUtils.getContainer().children
                }, nodeDataModel)
                if (!validate.success) {
                    _this.messageAlert(validate.msg)
                    this.setSaveDeployDisabled(false);
                    return;
                }
            }
            if (!this.validateJobAliasName(_this.jobAliasName)) {
                _this.messageAlert("请填写表名")
                this.setActiveTabId('baseInfo');
                this.setSaveDeployDisabled(false);
                return
            }
            return true;
        },
        //保存
        saveBtnClick(cb) {
            var _this = this;
            //this.setSaveDeployDisabled(true);
            if(!this.validateSaveDataDisplayMsg()){return ;}
            console.log("----------------------saveBtnClick----------------------", nodeDataModel.getAllData())
            var data = dataUtils.transform2SubmitSaveData({
                "jobType": _this.workflowType,//"任务类型(1:实时 2:定期)",
                "projectId": "",//node 服务中获取,
                "jobId": _this.jobId,//"xxxxx",// 编辑时传递
                "jobAliasName": _this.jobAliasName,//任务名称
                "description": _this.jobDescription,//"任务描述信息",// 描述信息
                nodes: nodeDataModel.getAllData(),
                children: canvasUtils.getContainer().children,
                "status": _this.workflowStatus,//"发布状态(UNDEPLOY:未发布 DEPLOY:已发布 DELETE:删除)",
                "instanceId": _this.instanceId, // 容器ID
                "schedule": _this.schedule,
                "warningConfig": _this.warningConfig,
                "dataInput": _this.dataInput,
                "dataOutput": _this.dataOutput,
                "workFlowDSLName": _this.workFlowDSLName
            });
            if (data.isForkTasksRelate) {
                _this.messageAlert("分支之间不能有关系");
                this.setSaveDeployDisabled(false);
                return;
            }
            _this.workFlowDSLName = data.workFlowDSLName;
            delete data.workFlowDSLName;
            _this.isShowMarkLoading = true;
            data.projectId = this.projectId;//
            fetchAgent.jobSave(data, function (res) {
                if (res.code == 0) {
                    //必须再查一次，否子taskID没有，（回报已存在错误）
                    _this.setHashJobId(res.data.jobId)
                    _this.initCanvasDataByJobId(res.data.jobId, function () {
                        if (cb) {
                            cb(res);
                        } else {
                            _this.isShowMarkLoading = false;
                            Toast({
                                message: '保存成功！',
                                duration: 2000
                            })
                            _this.setSaveDeployDisabled(false);
                        }

                    })
                } else if (res.code) {
                    _this.isShowMarkLoading = false;
                    var obj = dataUtils.setWarningsByCode(res.code, _this);
                    if (!obj.success) {
                        _this.messageAlert(obj.msg)
                        obj.tabName && _this.setActiveTabId(obj.tabName);
                    }
                    _this.setSaveDeployDisabled(false);
                } else {
                    _this.isShowMarkLoading = false;
                    _this.messageAlert("保存失败！")
                    _this.setSaveDeployDisabled(false);

                }

            });
        },
        clone(v) {
            return JSON.parse(JSON.stringify(v));
        },
        setActiveTabId(v) {
            this.activeTabId = v;
        },
        validateJobDescription(v) {
            this.jobDescriptionWarnings = null;
            var f = true;
            if (v && v.length > 120) {
                f = false;
                this.jobDescriptionWarnings = ["字符长度不能超过120"];
            }
            return f;
        },
        validateJobAliasName(v) {
            this.jobAliasNameWarnings = null;
            var _this = this;
            var name = $.trim(v);
            var res = dataUtils.validatejobAliasNameTaskName(name);
            if (!res.success) {
                this.jobAliasNameWarnings = res.warnings;
            }
            var flag = res.success;
            if (flag) {
                var arg = {
                    projectId: _this.projectId,
                    "jobId": _this.jobId,
                    "jobType": _this.jobType,
                    "jobAliasName": v
                };
                fetchAgent.jobValidJobaliaSname(arg, function (res) {
                    /*4001：projectId不能为空
                     4002：jobType不能为空
                     4020：jobAliasName(任务名)不能为空
                     4021：jobAliasName(任务名)已经存在
                     */
                    var errMsgs = {
                        4001: '项目不能为空',
                        4002: '任务类型不能为空',
                        4020: '任务名不能为空',
                        4021: '任务名已经存在',
                        4030: 'CRON表达式错误'
                    };
                    if (res && res.code) {
                        flag = false;
                        _this.jobAliasNameWarnings = [errMsgs[res.code]];
                    }
                });
            }
            return flag;
        },
        //验证血缘关系
        validateBlood() {
            if (this.workflowType != BATCHTPYE) {
                return true;
            }
            var flag = true;
            this.dataInputWarnings = null;
            this.dataOutputWarnings = null;
            //如果Input 或者Output中的一个被选中 则另一个也必须选中
            if (this.dataInput && !this.dataOutput) {
                this.dataOutputWarnings = ['必填项'];
                flag = false;
            }
            if (this.dataOutput && !this.dataInput) {
                this.dataInputWarnings = ['必填项'];
                flag = false;
            }
            if (this.dataInput && this.dataOutput && this.dataInput == this.dataOutput) {
                this.dataInputWarnings = this.dataInputWarnings = ['输入表与输出表不能是同一张表'];
                flag = false;
            }
            return flag;
        },
        validateDeployInfo() {
            var flag1 = this.validateInstance(this.instanceId);
            var flag2 = this.inputCronExpression(this.schedule.cronExpression);
            var flag3 = this.validateTimeOutInterval(this.warningConfig.timeOutInterval);
            return flag1 && flag2 && flag3;
        },
        validateTimeOutInterval(v) {
            var _this = this;
            this.timeOutIntervalWarnings = null;
            var tmp = $.trim(v);
            var nres = regex.numberLong(tmp);
            var flag = true;
            if (!tmp) {
                this.timeOutIntervalWarnings = "必填项";
                flag = false;
            } else if (!nres.success) {
                flag = false;
                this.timeOutIntervalWarnings = "必须是正整数，不能含有非数字字符";
            } else if (tmp * 1 <= 0) {
                flag = false;
                this.timeOutIntervalWarnings = "请输入大于0的数字";

            }
            //admin-form-warning
            return flag;
        },
        validateInstance(v) {
            this.instanceWarnings = null;
            var flag = !!$.trim(v);
            var isHas=false
            for(let opt of this.instanceOptions){
                if(`${opt.value}`==`${v}`){
                    isHas=true;
                    break;
                }
            }
            if (!flag||!isHas) {
                this.instanceWarnings = ["必填项"]
            }
            return flag&&isHas;
        },
        inputJobAliasName(v) {
            this.validateJobAliasName(v)
        },
        inputJobDescription() {
            this.validateJobDescription(this.jobDescription)
        },
        inputCronExpression(v) {
            var _this = this, flag = true;
            if ((this.workflowType + "") != BATCHTPYE) {
                return true;
            }
            if (this.schedule.scheduleType == 1) {
                return true;
            }
            _this.cronExpressionWarnings = null;
            if ($.trim(v) !== "") {
                fetchAgent.jobValidCronWithInterval(v, function (res) {
                    if (res.code) {
                        _this.cronExpressionWarnings = [res.msg];
                        flag = false;
                        _this.setActiveTabId('deployInfo');
                    }
                })
            } else {
                _this.cronExpressionWarnings = ["必填项"];
                flag = false;
            }
            return flag;

        },
        appResize() {
            let has = window.location.hash;
            if (has.indexOf('#/taskdevelopment/workflowedit') == 0) {
                this.resetAllNodePosByCanvasWith(this.canvasWith, this.getCanvasWidthByResize())
                this.setCanvasStyle();
                this.setModulePanelStyle();
                this.setCanvasTabsPanelStyle();
            }
        },
        //绑定在template.html
        beforeDrag(rec) {
            this.currentDragData = rec;
        },
        //返回
        pageBackBtnClick() {

            this.$router.push({name:'/taskdevelopment'})
            //window.history.back(-1)
        },
        toggleTab(currentTadId) {
            this.activeTabId = currentTadId;
        },
        //校验组件名称
        validateTaskReferenceName(node) {
            return dataUtils.modifyTaskReferenceName(node, nodeDataModel)
        },
        /**
         * 查询组件属性
         * @param moduleType
         * @param moduleName
         */
        fetchModuleProperty(moduleType, moduleName, cb) {
            fetchAgent.fetchModuleProperty({moduleType, moduleName}, function (res) {
                cb && cb(res);
            })
        },
        getHdfsFileFolderPathPrefix() {
            return `/chorus/project/${_.currentProjectCode.get()}`
        },
        /**
         * 设置属性
         * @param options
         * @param staticParams
         */
        setfetchModulePropertyData(options, staticParams) {
            options && options.forEach((opt, i)=> {
                var params = staticParams[opt.name];
                if (opt.pageElement == 'MultiPairInputText' || opt.pageElement == 'MultiPairTable') {
                    opt.maps = [];
                    var values = params ? JSON.parse(params) : {};
                    for (var v in values) {
                        opt.maps.push({keyName: v, keyValue: values[v]});
                    }
                    //MultiPairInputText 、MultiPairTable 不能添加空开数据
                    //opt.maps.push({keyName:"",keyValue:""});
                } else {
                    opt.value = params ? params : "";
                }
                //去掉hdfsFileFolderPath前缀
                if (opt.name == 'hdfsFileFolderPath') {
                    var tmpStr = opt.value;
                    var index = tmpStr.indexOf(this.getHdfsFileFolderPathPrefix()) > -1 ? this.getHdfsFileFolderPathPrefix().length : 0;
                    opt.value = opt.value.substring(index);
                }

            })
            return options;
        },
        showModuleProperty(res) {
            var result = res;
            if (res && res.code * 1 == 0 && res.data) {
                if ($.isArray(result.data.options)) {
                    result.data.options.forEach((o)=> {
                        if (!o.value) {
                            o.value = o.defaultValue;
                            setDefault4ModuleProperty(o);
                        }
                        if (o.pageElement == 'Radio') {
                            if (!o.value) {
                                o.value = o.pageOptionList[0].value;
                            } else {//将下拉框的value和选中的value 都改成string
                                o.pageOptionList.forEach(opt=> {
                                    opt.value += "";
                                })
                                o.value += "";
                            }
                        }
                        //默认不展示
                        o['isShowVariable'] = false;
                    })
                }
                result.data.jobAliasNameWarnings = null;
                result.data.timeoutPolicyOptions = dataUtils.timeoutPolicyOptions;
                if (!result.data.timeoutPolicy) {
                    result.data.timeoutPolicy = result.data.timeoutPolicyOptions[0].value;
                }
                this.modulePropertyData = result.data;
            } else {
                this.modulePropertyData = {
                    noShowTaskReferenceName: true
                };
            }

        },
        modifyParamsData(arg) {
            var tmpPData = this.clone(this.modulePropertyData);
            /**
             * nodePrefix
             paramsName-"taskReferenceName"
             paramsValue-"1"
             */

            var v = arg.paramsValue;
            if (arg.paramsName == 'taskReferenceName') {
                var v = $.trim(arg.paramsValue);
                canvasUtils.modifyChildName(arg.nodePrefix, v);
            }
            tmpPData[arg.paramsName] = v ? v : "";
            dataUtils.modifyTaskReferenceName(tmpPData, nodeDataModel);
            nodeDataModel.modifyNodeData({
                id: arg.nodePrefix,
                propertyData: tmpPData
            })
            this.modulePropertyData = tmpPData;
        },
        modifyModulePropertyData(arg) {
            if (!arg.nodePrefix) {
                return;
            }
            var tmpPData = this.clone(this.modulePropertyData);

            tmpPData = dataUtils.modifyModulePropertyData(arg.name, tmpPData, arg.modifyData)
            if (arg.name == 'variables') {
                tmpPData.variables = arg.modifyData;
            }
            nodeDataModel.modifyNodeData({
                id: arg.nodePrefix,
                propertyData: tmpPData
            })
            this.modulePropertyData = tmpPData;
        },
        removeModulePropertyMultiPairTableMap(nodePrefix, modulePropertyName, index) {
            var tmpPData = this.clone(this.modulePropertyData);
            var modifyData = null;
            tmpPData.options.every((r, i)=> {
                if (r.name == modulePropertyName) {
                    modifyData = r;
                    modifyData.maps.splice(index, 1);
                    return false;
                }
                return true;
            })
            tmpPData = dataUtils.modifyModulePropertyData(modulePropertyName, tmpPData, modifyData)
            nodeDataModel.modifyNodeData({
                id: nodePrefix,
                propertyData: tmpPData
            })
            this.modulePropertyData = tmpPData;
        },
        //增加模块类型是MultiPairTable map 数据
        addModulePropertyMultiPairTableMap(nodePrefix, modulePropertyName) {
            var tmpPData = this.clone(this.modulePropertyData);
            var modifyData = null;
            tmpPData.options.every((r, i)=> {
                if (r.name == modulePropertyName) {
                    modifyData = r;
                    modifyData.maps.push({keyName: "", keyValue: ""});
                    return false;
                }
                return true;
            })
            tmpPData = dataUtils.modifyModulePropertyData(modulePropertyName, tmpPData, modifyData)
            nodeDataModel.modifyNodeData({
                id: nodePrefix,
                propertyData: tmpPData
            })
            this.modulePropertyData = tmpPData;
        },
        removeModulePropertyMultiPairInputTextMap(nodePrefix, modulePropertyName, index) {
            var tmpPData = this.clone(this.modulePropertyData);
            var modifyData = null;
            tmpPData.options.every((r, i)=> {
                if (r.name == modulePropertyName) {
                    modifyData = r;
                    modifyData.maps.splice(index, 1);
                    return false;
                }
                return true;
            })
            tmpPData = dataUtils.modifyModulePropertyData(modulePropertyName, tmpPData, modifyData)
            nodeDataModel.modifyNodeData({
                id: nodePrefix,
                propertyData: tmpPData
            })
            this.modulePropertyData = tmpPData;
        },

        //增加模块类型是MultiPairInputText map 数据
        addModulePropertyMultiPairInputTextMap(nodePrefix, modulePropertyName) {
            var tmpPData = this.clone(this.modulePropertyData);
            var modifyData = null;
            tmpPData.options.every((r, i)=> {
                if (r.name == modulePropertyName) {
                    modifyData = r;
                    modifyData.maps.push({keyName: "", keyValue: ""});
                    return false;
                }
                return true;
            })
            tmpPData = dataUtils.modifyModulePropertyData(modulePropertyName, tmpPData, modifyData)
            nodeDataModel.modifyNodeData({
                id: nodePrefix,
                propertyData: tmpPData
            })
            this.modulePropertyData = tmpPData;
        },
        fetchXdModulesCallBack(searchkey, res) {
            var _this = this;
            var modulesMap = {};
            if (res && !res.code && res.data && res.data.length > 0) {
                modulesMap = dataUtils.xdModules2showData(res.data)
            } else {
                modulesMap = dataUtils.xdModules2showData([])
            }
            _this.modulesDealTypeArr = modulesMap.dealTypeArr;
            _this.modulesInputTypeArr = modulesMap.inputTypeArr;
            _this.modulesOutputTypeArr = modulesMap.outputTypeArr;
            _this.modulesFlowTypeArr = modulesMap.flowTypeArr.filter(o=> {
                let tmp = $.trim(searchkey);
                return !tmp ? true : o.moduleAliasName.toLowerCase().indexOf(tmp.toLowerCase()) > -1
            });

            _this.modulesBatchDealTypeArr = modulesMap.batchDealTypeArr;
        },
        setCompontentDrag(v) {
            this.dragable = v
        },
        setCompontentEdit(v) {
            console.log('setCompontentEdit',v)
            this.compontentEditAble = v
        },
        compontentSearch(v) {
            fetchAgent.fetchXdModules(v, this.projectId, this.fetchXdModulesCallBack.bind(this, v))
        },
        getCanvasWidthByResize() {
            $('.chorus-main').width()
            $('.admin-page-sidebar').width()
            return document.body.clientWidth - $('.admin-page-sidebar').width() - 32 - 48 - 162 - 30 - this.tabsWidth;
        },
        setCanvasStyle() {
            if (this.$refs && this.$refs.canvas) {
                var w = this.getCanvasWidthByResize();
                this.canvasWith = this.$refs.canvas.width = w;
                this.canvasHeight = this.$refs.canvas.height = 850;
            }

        },
        //创建批量任务btn,创建流式任务btn
        createWorkflowBtnClick(type) {
            type == 'batch'
        },
        createAction() {
        },
        /**
         * 发布验证及展示信息
         */
        validateDeployDataDisplayMsg() {
            var _this = this;
            //this.setSaveDeployDisabled(true);
            var nodes = nodeDataModel.getAllData();
            var isValidateModuleOptions = true,
                isValidateModuleRule = true,
                validate = true,
                node = null;
            if (!this.validateJobAliasName(_this.jobAliasName) || !_this.validateJobDescription(_this.jobDescription)) {
                _this.messageAlert("基础信息错误")
                this.setActiveTabId('baseInfo');
                this.setSaveDeployDisabled(false);
                return
            }
            if (!this.validateDeployInfo()) {
                _this.messageAlert("部署信息错误")
                this.setActiveTabId('deployInfo');
                this.setSaveDeployDisabled(false);
                return
            }
            //暂时注销
            //if(!this.validateBlood()){
            //    _this.messageAlert("血缘关系错误")
            //    this.setActiveTabId('blood');
            //    this.setSaveDeployDisabled(false);
            //    return
            //}
            for (var key in nodes) {
                node = nodes[key];
                var moduleType = node.propertyData.moduleType;
                if (moduleType == "start" || moduleType == "end" || moduleType == "fork" || moduleType == "join") {
                    continue;
                }
                isValidateModuleOptions = dataUtils.validateModuleOptions(node.propertyData);
                isValidateModuleRule = dataUtils.validateModuleRule(node.propertyData, nodeDataModel);
                if (!isValidateModuleOptions || !isValidateModuleRule || !isValidateModuleRule) {
                    canvasUtils.setActiveNodeShadow(node.propertyData.nodePrefix);
                    canvasUtils.setUpdateStatus(true)
                    break;
                }

            }
            if (!isValidateModuleOptions || !isValidateModuleRule) {
                _this.messageAlert("组件属性错误")
            }
            if (!isValidateModuleOptions) {
                this.showModuleProperty({
                    code: 0,
                    data: node.propertyData
                })
                nodeDataModel.setNodeData({
                    id: node.propertyData.nodePrefix,
                    propertyData: node.propertyData
                })

                this.setActiveTabId('componentInfo');
                this.setSaveDeployDisabled(false);
                return;
            }
            if (!isValidateModuleRule) {
                this.showModuleProperty({
                    code: 0,
                    data: node.propertyData
                })
                nodeDataModel.setNodeData({
                    id: node.propertyData.nodePrefix,
                    propertyData: node.propertyData
                })
                this.setActiveTabId('componentInfo');
                this.setSaveDeployDisabled(false);
                return;
            }
            return true;
        },
        undeployBtnClick() {
            var _this = this;
            this.messageConfirm('将会中断当前任务实例,确定要下线吗？', function () {
                _this.setSaveDeployDisabled(true);
                _this.isShowMarkLoading = true;
                fetchAgent.jobUndeploy({jobId: _this.jobId}, function (res) {
                    if (res.code == 0) {
                        Toast({
                            message: '下线成功！',
                            duration: 2000
                        })
                        _this.setHashStatus("UNDEPLOY")
                    } else {
                        _this.messageAlert("下线失败！")
                    }
                    _this.isShowMarkLoading = false;
                    _this.setSaveDeployDisabled(false);
                })
            })
        },
        deployBtnClick() {
            var _this = this;
            //_this.setSaveDeployDisabled(true);
            if(!this.validateDeployDataDisplayMsg()){return ;}
            this.saveBtnClick(function (res) {
                if (res.code == 0) {
                    _this.isShowMarkLoading = true;
                    _this.setHashJobId(res.data.jobId);
                    fetchAgent.jobDeploy({
                        jobId: _this.jobId,
                        instanceId: _this.instanceId,
                        warningConfig: JSON.stringify(_this.warningConfig),
                        schedule: JSON.stringify(_this.schedule)
                    }, function (res) {
                        if (res.code == 0) {
                            Toast({
                                message: '上线成功！',
                                duration: 2000
                            })
                            _this.setHashStatus("DEPLOY")
                        } else {
                            _this.messageAlert("上线失败！")
                        }
                        _this.setSaveDeployDisabled(false);
                        _this.isShowMarkLoading = false;
                    })
                } else {
                    _this.messageAlert("发布失败！")
                    _this.isShowMarkLoading = false;
                }
            })
        },
        setFetchModulePropertySourceData() {
            try {
                ModulePropertyFetchModel.setVM(this);
                let cloneModuleData = JSON.parse(JSON.stringify(this.modulePropertyData));
                ModulePropertyFetchModel.setCurrentModuleData(cloneModuleData);
                ModulePropertyFetchModel.setModulePropertyData(cloneModuleData)
                ModulePropertyFetchModel.fetchSequenceModulePropertySource(cloneModuleData.moduleName, function (res) {
                    this.modulePropertyData = ModulePropertyFetchModel.setModulePropertySourceData(cloneModuleData, cloneModuleData.moduleName, res);
                    ModulePropertyFetchModel.setVM(this);
                }.bind(this), ()=> {
                })
            } catch (e) {
                console.log(e)
            }
        },
        setHashStatus(status) {
            var _this = this;
            _this.workflowStatus = status;
            var hash = window.location.hash;
            var arr = hash.split("/");
            arr.splice(4, 1, status);
            _this.workflowStatusText = dataUtils.status2Text(_this.workflowStatus);
            window.location.hash = arr.join("/");
        },
        setHashJobId(jobId) {
            var _this = this;
            _this.jobId = jobId;
            var hash = window.location.hash;
            var arr = hash.split("/");
            arr.splice(5, 1, _this.jobId);
            window.location.hash = arr.join("/");
        },
        excuteBtnClick(jobId) {
            var _this = this;
            this.mapsModalDisplay = true;
            //console.log('jobId1',jobId);
            _this.currentjobId = jobId;
        },
        getJobParameters() {
            var rootres = {};
            this.excuteMaps.forEach((exemap)=> {
                var res = {};
                exemap.value.forEach((map, i)=> {
                    if (map.keyName) {
                        res[map.keyName] = map.keyValue;
                    }
                })
                rootres[exemap.id] = res;
            })
            return rootres;
        },
        mapsToggle(maps) {
            this.excuteMaps = maps;
        },
        resetAllNodePosByCanvasWith(oldCanvasWith, newCanvasWith) {
            let getContainer=canvasUtils.getContainer();
            if(!getContainer){ return; }
            let children = getContainer.children;
            for (let c of children) {
                if (c.objType == 'point') {
                    let scale = c.groupX / oldCanvasWith;
                    c.groupX = scale * newCanvasWith;
                    if ((c.groupX + c.roundedRect.width) > newCanvasWith) {
                        c.groupX = newCanvasWith - c.roundedRect.width - 5;
                    }
                    canvasUtils.resetAllLinePosition(c)
                    // canvasUtils.setUpdateStatus(true);
                }
            }
            canvasUtils.setUpdateStatus(true);
        },
        //右侧属性Panel展开收起函数
        changeTabsSpread(type, w) {
            //tabsWidth must before getCanvasWidthByResize()
            this.tabsWidth = w;
            let newCanvasWidth = this.getCanvasWidthByResize();
            this.resetAllNodePosByCanvasWith(this.canvasWith, newCanvasWidth);
            this.setCanvasStyle()

        }
    }
}