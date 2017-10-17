/**
 * Created by AnThen on 2017-5-3.
 */
/**
 * Created by AnThen on 2017-3-3.
 */
import adSelect from 'adminUI/components/admin-select'
import adRadio from 'adminUI/components/admin-radio'
import adInput from 'adminUI/components/admin-input'
import paginator from 'adminUI/components/admin-paginator'
import adModal from 'adminUI/components/admin-modal'
import Toast from 'adminUI/components/admin-toast/index'
import navBar  from '../../admin-ui-extend/components/admin-navbar.vue';
import fetchAgent  from './utils/fetchAgent';
import {alphaNumericUnderline}  from '../../js/utils/regex';
import MessageBox from 'adminUI/components/admin-message-box/index'
import CONSTANT from 'Utils/constant'
export default {
    name: 'chorus-data-table-management',
    components: {
        adSelect,
        adRadio,
        adInput,
        adModal,
        navBar,
        paginator,
        Toast
    },
    data () {
        let _this =this;
        return {
            showCreateFormBtnDisabled:false,
            navlist:[{id:1,text:'数据管理',url:''},{id:2,text:'数据表管理',url:''}],
            datalist:[],
            pageSize:CONSTANT.pageSize,
            totalCount: 0,
            currentPage: 1
        }
    },
    methods: {
        //分页相应事件
        togglePage(indexPage){
            this.fetchData(indexPage)
        },
        showCreateForm () {
            window.location.hash=`datatablemanagement/edit/create/0`;
            return;
        },
        showDataTableDetail (entery) {
            window.location.hash=`datatablemanagement/edit/detail/${entery.tableInfoId}`;
            return;
        },
        showDataTableUpdate (entery) {
            window.location.hash=`datatablemanagement/edit/update/${entery.tableInfoId}`;
            return;
        },
        showDataTableDelete (entery) {
            let _this =this;


            MessageBox({
                message: "删除后将无法恢复，确定要执行此操作？",
                type: 'confirm',
                confirm: function (){
                    _.ajax({
                        url:'/api/datatablemanagement/delete',
                        method:'POST',
                        data:{
                            tableInfoId:entery.tableInfoId
                        },
                        success:function(res){
                            if(res.code =='0')
                            {
                                _this.fetchData(1);
                                Toast({
                                    message:'删除成功！',
                                    duration: 1000
                                })
                            }
                            else{
                                Toast({
                                    message:'删除失败：'+res.msg,
                                    duration: 5000
                                })
                            }
                        },
                        error:function (err) {
                        }
                    })
                }
            });


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
        //查询列表数据
        fetchData(curPage){
            let _this=this;
            let projectId=_.currentProjectId.get();
            //数据类型
            _.ajax({
                url:'/api/datatablemanagement/list',
                method:'POST',
                data:{
                    projectId,
                    pageNum:curPage,
                    pageSize:this.pageSize
                },
                success:function(res){
                    if(res.code =='0')
                    {
                        _this.datalist = res.data;
                        _this.totalCount= res.data.total;
                        _this.currentPage= curPage;
                    }
                },
                error:function (err) {
                }
            })
        }
    },
    created() {
        this.fetchData(1);

    }
}