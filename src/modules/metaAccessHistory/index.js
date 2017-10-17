import CONSTANT from '../../js/utils/constant.js'
import adTabs from 'adminUI/components/admin-tabs'
import adModal from 'adminUI/components/admin-modal'
import AdInput from 'adminUI/components/admin-input'
import navBar  from '../../admin-ui-extend/components/admin-navbar.vue';
import Toast from 'adminUI/components/admin-toast/index';
import MetaDataManagement from './components/metadatamanagement/index.vue';
import history from './components/history/index.vue';
export default{
    name:"metaDataHistory",
    data (){
        return {
            tabStyle:{ minHeight:"400px",height:'400px'},
            activeTabId: 'metaData',
            tabs: [
                {
                    name: 'metaData',
                    text: '元数据查询'
                },

                {
                    name: 'hasCommit',
                    text: '数据申请历史'
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
        MetaDataManagement,
        history
    },
    created() {

    },
    mounted() {
        this.setStyle();
    },
    methods:{
        setStyle(){
            var $main=$('.chorus-main');
            this.tabStyle.height=($main.height()-20)+"px";
        }
    },
    watch:{

    }
}