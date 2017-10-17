import adSelect from 'adminUI/components/admin-select'
import adRadio from 'adminUI/components/admin-radio'
import adInput from 'adminUI/components/admin-input'
import paginator from 'adminUI/components/admin-paginator'
import adModal from 'adminUI/components/admin-modal'
import adToast from 'adminUI/components/admin-toast/index'
import navBar  from '../../admin-ui-extend/components/admin-navbar.vue';
import fetchAgent  from './utils/fetchAgent';
import MessageBox from 'adminUI/components/admin-message-box/index'
import CONSTANT from 'Utils/constant'
import adSpinner from 'adminUI/components/admin-spinner';
import adTabs from 'adminUI/components/admin-tabs'

import {tabs, activeTabId} from  './tabs.js';
import BaseInfo from './components/baseInfo/index.vue';
import ExampleData from './components/exampleData/index.vue';
import FieldInfo from './components/fieldInfo/index.vue';
import PowerApply from './components/powerApply/index.vue';
import {blood as Blood } from  './models/bloodModel.js';
export default {
    name: 'chorus-meta-data-detail',
    components: {
        adTabs,
        adSelect,
        adRadio,
        adInput,
        adModal,
        navBar,
        paginator,
        adSpinner,
        BaseInfo,
        ExampleData,
        FieldInfo,
        PowerApply
    },
    data () {
        let _this =this;
        return {
            tabs,
            activeTabId,
            navlist:[{id:1,text:'数据管理',url:''},{id:2,text:'元数据查询',url:''}],
            isShowMarkLoading:false,
            currentRecorder:{
                tableName:'...',
                tableDesc:'...'
            },
            isHiddenLoading:false,
            tableId:""
        }
    },
    methods: {
        returnBack(){
            window.location.href=`/#/metadatamanagement/list/${this.$route.params.origin}?${Math.random()*10000}`
        },
        tableInfoCallBack(data){
            this.currentRecorder=data;
        },
        toggleTab(tabName){
        },
        appResize(){
            this.setCanvasStyle();
            this.updateCanvas();
        },
        updateCanvas(){
            Blood&& Blood.update();
        },
        setCanvasStyle(){
            if(!Blood){
                return;
            }
            var $main=$('.admin-page-content-main'),
                h=$main.height(),
                w=$main.width();
            Blood.setWidthHeight(w-70,h-210)
            $('.chorus-data-meta-detail .admin-tabs-wrapper').css({minHeight:h-180})
            //$('.chorus-data-meta-detail').height(h-48)
        }

    },
    mounted(){
        this.isHiddenLoading=false;
        this.setCanvasStyle();
        Blood.init(this);
        Blood.fetch(this.tableId,this);
    },
    created() {
        this.tableId =this.$route.params.id;
        _.registerAppResizeHandler("metaDataDetail",this.appResize)
    }
}