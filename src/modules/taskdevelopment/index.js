/**
 * Created by AnThen on 2017-3-3.
 */
import AdInput from 'adminUI/components/admin-input.vue';
import adSelect from 'adminUI/components/admin-select.vue';
import AdModal from 'adminUI/components/admin-modal.vue';
import Paginator from 'adminUI/components/admin-paginator.vue';
import Toast from 'adminUI/components/admin-toast/index';
import navBar from '../../admin-ui-extend/components/admin-navbar.vue';
import CONSTANT from 'Utils/constant';
import {queryTableData as queryMockTableData} from './mock.js';
import {result2Table} from './utils/dataUtils.js';
import MessageBox from 'adminUI/components/admin-message-box'
import fetchAgent from './utils/fetchAgent.js'
import Maps from '../workflowedit/components/maps/index.vue';
export default {
    components : {
        AdInput,
        AdModal,
        Paginator,
        adSelect,
        Toast,
        Maps,
        navBar,
        'adTabs': resolve => require(['adminUI/components/admin-tabs.vue'], resolve)
    },
    data() {
        let _this = this;
        return {
            navlist: [
                {
                    id: 1,
                    text: '数据开发',
                    url: ''
                }, {
                    id: 2,
                    text: '任务开发',
                    url: ''
                }
            ],
            data: [],
            options: [],
            selectValue: 'ccp_2636',
            totalCount: 0,
            pageSize: CONSTANT.pageSize,
            currentPage: 1,
            jobAliasName: "",
            searchKey: '',
            excuteBtnDisabled: false,
            deleteBtnDisabled: false,
            unDeployBtnDisabled: false,
            deployBtnDisabled: false,
            currentJobId: "",
            excuteMaps: [],
            mapsModalDisplay: false,
            mapsModalButtons: [
                {
                    text: '取消',
                    buttonClass: 'ad-auxiliary admin-small',
                    name: 'cancel'
                }, {
                    text: '确定',
                    buttonClass: 'ad-auxiliary admin-small',
                    name: 'ok',
                    handler() {
                        if (!_this.currentJobId) {
                            return;
                        }
                        var jobId = _this.currentJobId;
                        var params = _this.getJobParameters();
                        var arg = {
                            jobId
                        };
                        var isEmpty = true;
                        for (var k in params) {
                            isEmpty = false;
                            break;
                        }
                        if (!isEmpty) {
                            arg['jobParameters'] = JSON.stringify(_this.getJobParameters())
                        }
                        fetchAgent
                            .excuteJob(arg, function (res) {
                                if (res && res.code == 0) {
                                    Toast({message: '提交成功！', duration: 2000})
                                    _this.fetchData(1);
                                } else {
                                    _this.messageAlert('提交失败！');
                                }
                            })
                    }
                }
            ]
        }
    },
    created() {
        this.createModalBtns = this.firststep;
        this.fetchData(1);
    },
    computed : {},
    methods : {
        messageAlert(msg, handler) {
            MessageBox({
                message: msg,
                type: 'alert',
                confirm() {
                    handler && handler();
                }
            })
        },
        //分页相应事件
        togglePage(indexPage) {
            this.fetchData(indexPage)
        },
        //搜索
        onsearchClick() {
            this.fetchData(1);
        },
        //创建批量任务btn,创建流式任务btn
        createWorkflowBtnClick(type) {
            //type=='batch' type 2 定期（批量），1 实时（流式）
            window.location.hash = `taskdevelopment/workflowedit/${type}/UNDEPLOY/create`;
        },
        /**
         * 上线
         * @param {*} rec
         */
        deployBtnClick(rec) {
            var _this = this;
            _this.deployBtnDisabled = true;
            new Promise(function (resolve, reject) {
                fetchAgent.getJobinfo(rec.jobId, function (res) {
                     if(res&&res.code == 0){
                        resolve(res.data);
                     }else{
                        reject(res)
                     }
                })
                
            }).then(function (value) {
                console.log({
                    jobId: value.jobId,
                    instanceId: value.instanceId,
                    warningConfig: value.warningConfig,
                    schedule: JSON.stringify(value.schedule)
                })
               fetchAgent.jobDeploy({
                     jobId: value.jobId,
                     instanceId: value.instanceId,
                     warningConfig: value.warningConfig,
                     schedule: JSON.stringify(value.schedule)
                 }, function (res) {
                    if (res && res.code == 0) {
                        Toast({message: '上线成功！', duration: 2000})
                        _this.fetchData(1)
                    } else {
                        _this.messageAlert('上线失败！');
                    }
                    _this.deployBtnDisabled = false;
                })
            }).catch(ex => {
               _this.deployBtnDisabled = false;
               _this.messageAlert('上线失败！');
            })
        },
        undeployBtnClick(rec) {
            var _this = this;
            MessageBox({
                message: '将会中断当前任务实例,确定要下线吗？',
                type: 'confirm',
                confirm() {
                    _this.unDeployBtnDisabled = true;
                    fetchAgent.jobUndeploy(rec.jobId, function (res) {
                        if (res && res.code == 0) {
                            Toast({message: '下线成功！', duration: 2000})
                            _this.fetchData(1)
                        } else {
                            _this.messageAlert('下线失败！');
                        }
                        _this.unDeployBtnDisabled = false;
                    })
                }
            })
        },
        //删除项目
        delProjectBtnClick(rec) {
            var _this = this;

            MessageBox({
                message: '确定要删除该任务吗？',
                type: 'confirm',
                confirm() {
                    _this.deleteBtnDisabled = true;
                    // console.log('confirm confirm button clicked')
                    fetchAgent.jobDelJob(rec.jobId, function (res) {
                        if (res && res.code == 0) {
                            Toast({message: '操作成功！', duration: 2000})

                            _this.fetchData(1)
                        } else {
                            _this.messageAlert(res.msg || '操作失败！');
                        }
                        _this.deleteBtnDisabled = false;
                    })
                }
            })
        },
        editWorkflowBatchBtnClick(res) {
            this.$router.push({
                    name: '/taskdevelopment/workflowedit',
                    params: {
                        type: res.jobType,
                        status: res.status,
                        jobId: res.jobId
                    }
                })
            //window.location.hash=`taskdevelopment/workflowedit/${res.jobType}/${res.status
            //}/${res.jobId}`;
        },
        //查询列表数据
        fetchData(curPage) {
            let _this = this;
            let projectId = _.currentProjectInfo.get().projectId;
            fetchAgent.getProjectJobs({
                projectId,
                pageNum: curPage,
                pageSize: _this.pageSize,
                jobAliasName: _this.jobAliasName
            }, function (res) {
                if (res.code == 0) {
                    _this.data = result2Table(res.data.list);
                    _this.totalCount = res.data.total;
                    _this.currentPage = res.data.pageNum;
                }
            })
        },
        excuteBtnClick(rec) {
            var _this = this;
            this.currentJobId = rec.jobId;
            this.mapsModalDisplay = true;
        },
        getJobParameters() {
            var rootres = {};
            this.excuteMaps.forEach((exemap) => {
                    var res = {};
                    exemap.value.forEach((map, i) => {
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
        }
    }
}