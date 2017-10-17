/**
 * Created by AnThen on 2017-3-3.
 */
import AdPaginator from 'adminUI/components/admin-paginator.vue';
import navBar from '../../admin-ui-extend/components/admin-navbar.vue';
import CONSTANT from 'Utils/constant';
import adSpinner from 'adminUI/components/admin-spinner';
import MessageBox from 'adminUI/components/admin-message-box/index'
import Toast from 'adminUI/components/admin-toast/index';
export default {
    components : {
        Toast,
        adSpinner,
        AdPaginator,
        navBar
    },

    data() {
        return {
            isShowMarkLoading:false,
            navlist: [
                {
                    id: 1,
                    text: '平台管理',
                    url: ''
                }, {
                    id: 2,
                    text: '运维管理',
                    url: ''
                }
            ],
            data: [],
            totalCount: 0,
            pageSize: CONSTANT.pageSize,
            currentPage: 1,
            operationStatusBtnText: [
                '进入维护模式', '结束维护模式'
            ],
            operationStatusBtnVal: 0
        }
    },
    created() {
        this.fetchOperationStatus();
        this.fetchData(1);
    },
    computed : {},
    methods : {
        togglePage(indexPage) {
            //打印出当前页数
            this.fetchData(indexPage)
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
        fetchOperationStatus() {
            let _this=this;
            _.ajax({
                url: '/api/operationmanagement/fetchstatus',
                method: 'POST',
                success: function (res) {
                    console.log(res)
                    if(res&&res.code==0){
                       _this.operationStatusBtnVal=`${res.data.value}`=='1'?1:0
                    }
                },
                error: function (res) {

                }
            }) 
        },
        changeOperationStatus() {
            var status=this.operationStatusBtnVal = !!this.operationStatusBtnVal? 0: 1;
            let _this=this;
            this.isShowMarkLoading=true;
            _.ajax({
                url: '/api/operationmanagement/changestatus',
                method: 'POST',
                data: {  status },
                success: function (res) {
                    if(res&&res.code==0){
                        Toast({
                            message: '操作成功,正在切换模式',
                            duration: 1000
                        })
                        setTimeout(()=>{
                            //_this.$router.push(`/operationmanagement?t=${new Date().getTime()}`)
                            history.go(0)
                            //window.location.reload(`/#/operationmanagement?t=${new Date().getTime()}`)
                        }, 1000)
                       
                     }else{
                        _this.operationStatusBtnVal = !!_this.operationStatusBtnVal? 0: 1
                        _this.messageAlert('操作失败');
                     }
                     _this.isShowMarkLoading=false;
                },
                error: function (res) {
                    _this.messageAlert('操作失败');
                    _this.isShowMarkLoading=false;
                }
            }) 
        },
        fetchData(curPage) {
            let _this = this;
            _.ajax({
                url: '/api/operationmanagement/fetchpendingjob',
                method: 'POST',
                data: {
                    pageNum: curPage,
                    pageSize: _this.pageSize
                },
                success: function (res) {
                    if (res.code == "0") {
                        _this.data = res.data.list
                        _this.totalCount = res.data.total;
                        _this.currentPage = curPage;
                    } else {
                        _this.data = [];
                        _this.totalCount = 0;
                        _this.currentPage = 1;
                    }
                },
                error: function (res) {}
            })
        }
    }

}
