/**
 * Created by AnThen on 2017-3-3.
 */
import AdInput from 'adminUI/components/admin-input.vue';
import adSelect from 'adminUI/components/admin-select.vue';
import AdModal from 'adminUI/components/admin-modal.vue';
import Paginator from 'adminUI/components/admin-paginator.vue';
import Toast from 'adminUI/components/admin-toast/index';
import navBar  from '../../admin-ui-extend/components/admin-navbar.vue';
import echarts from 'echarts';
import adTabs from '../../admin-ui-extend/components/admin-tabs.vue'
import CONSTANT from 'Utils/constant';
import startsrc from '../../images/fep.jpg';
import batchcom from './components/batch.vue'
import flowcom from './components/flow.vue'

export default {
    components: {
        AdInput,
        AdModal,
        Paginator,
        adSelect,
        Toast,
        navBar,
        adTabs,
        batchcom,
        flowcom,
        adTabs
    },
    data () {
        let _this=this;
        return {
            mapdataAjaxId:null,
            mapuseAjaxId:null,
            mapsuccessAjaxId:null,
            topdata:{
                "memory":0,
                "cpu":0,
                "storage":0,
                "project_num": 0,
                "total_data": 0,
                "data_daily_incr": 0,
                "task_success_rate": 0
            },
            navlist:[{id:1,text:'平台管理',url:''},{id:2,text:'Dashboard',url:'#/admindashboard'}],
            datalist:[],
            pageSize:10,
            totalCount: 0,
            currentPage: 1,
            startphone:startsrc,

            currenttag:'batchtag',
            batchcount:0,
            flowcount:0,
            tabs: [
                {
                    name: 'batchtag',
                    text: ''
                },
                {
                    name: 'flowtag',
                    text: ''
                },
            ],
            orderType:1,
            orderBy:1
        }
    },
    created() {
        this.inittop();
        this.fetchData(1,1);
    },
    mounted(){
        this.inituser();
        this.initdata();
        this.initsuccess();
    },
    destroyed() {
        if(this.mapdataAjaxId){this.mapdataAjaxId.abort()}
        if(this.mapuseAjaxId){this.mapuseAjaxId.abort()}
        if(this.mapsuccessAjaxId){this.mapsuccessAjaxId.abort()}
    },
    methods: {
        inittop(){
            let _this=this;
            _.ajax({
                url:'/api/admindashboard/top',
                method:'POST',
                data:{},
                success:function(res){
                    if(res.code=="0"){
                        res.data.total_data = _.transferbetye(res.data.total_data,0);
                        res.data.data_daily_incr = _.transferbetye(res.data.data_daily_incr,0);
                        _this.topdata = res.data;
                    }
                },
                error:function (err) {
                }
            })
        },
        inituser(){
         let  option = {

             tooltip: {
                 trigger: 'axis',
                 extraCssText: 'text-align:left;'
             },
             legend: {
                 data:['CPU(%)','内存(%)','存储(%)']
             },
             grid: {
                 left: '3%',
                 right: '4%',
                 bottom: '3%',
                 containLabel: true
             },
             toolbox: {
                 feature: {
                     saveAsImage: {show:false}
                 }
             },
             xAxis: {
                 type: 'category',
                 boundaryGap: false,
                 data: []
             },
             yAxis: {
                 type: 'value'
             },
             series: [
                 {
                     name:'CPU(%)',
                     type:'line',
                     data:[]
                 },
                 {
                     name:'内存(%)',
                     type:'line',
                     data:[]
                 },
                 {
                     name:'存储(%)',
                     type:'line',
                     data:[]
                 }
             ]
         };


            let _this=this;
            this.mapuseAjaxId= _.ajax({
                url:'/api/admindashboard/userate',
                method:'POST',
                data:{},
                success:function(res){
                    let mapuseDom=document.getElementById('mapuse')
                    if(!mapuseDom){  return ; }
                    var myChart = echarts.init(mapuseDom);
                    if(res.code=="0"){
                        //执行
                        if(res.data)
                        {
                            let titelist =[];
                            res.data.forEach(m=>{
                                option.series[0].data.push(m.cpuUseRate);
                                option.series[1].data.push(m.memoryUseRate);
                                option.series[2].data.push(m.storageUseRate);
                                titelist.push(m.date);
                            })
                            option.xAxis.data = titelist
                        }
                        else {
                            option.series[0].data.push({value:0, name:'无角色'});
                        }
                    }
                    else{
                        option.series[0].data.push({value:0, name:'无角色'});
                    }
                    myChart.setOption(option);
                },
                error:function (err) {
                }
            })


        },
        initdata(){
            let  option = {
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data:['日增数据量(B)']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                toolbox: {
                    feature: {
                        saveAsImage: {show:false}
                    }
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: []
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        name:'日增数据量(B)',
                        type:'line',
                        data:[]
                    }
                ]
            };

            let _this=this;
            this.mapdataAjaxId=  _.ajax({
                url:'/api/admindashboard/datasize',
                method:'POST',
                data:{},
                success:function(res){
                    let mapdataDom=document.getElementById('mapdata')
                    if(!mapdataDom){  return ; }
                    var myChart = echarts.init(mapdataDom);
                    if(res.data)
                    {
                        let titelist =[];
                        res.data.forEach(m=>{
                            option.series[0].data.push(m.dataDailyIncrTotal);

                            titelist.push(m.date);
                        })
                        option.xAxis.data = titelist


                    }
                    myChart.setOption(option);
                },
                error:function (err) {
                }
            })
        },
        initsuccess(){
            let  option = {
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data:['成功率(%)']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                toolbox: {
                    feature: {
                        saveAsImage: {show:false}
                    }
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: []
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        name:'成功率(%)',
                        type:'line',
                        data:[]
                    }
                ]
            };

            let _this=this;
            this.mapsuccessAjaxId= _.ajax({
                url:'/api/admindashboard/successrate',
                method:'POST',
                data:{},
                success:function(res)
                {
                    let mapsuccessDom=document.getElementById('mapsuccess')
                    if(!mapsuccessDom){  return ; }
                    var myChart = echarts.init(mapsuccessDom);
                    if(res.data)
                    {
                        let titelist =[];
                        res.data.forEach(m=>{
                            option.series[0].data.push(m.taskSuccessRate);

                            titelist.push(m.date);
                        })
                        option.xAxis.data = titelist
                    }
                    myChart.setOption(option);

                },
                error:function (err) {
                }
            })

        },

        //分页相应事件
        togglePage(indexPage){
            this.fetchData(indexPage,this.orderType,'page')
        },
        getcurrentdate(backdate){
                var date = new Date(new Date()-24*60*60*1000*backdate);
                var seperator1 = "-";
                var seperator2 = ":";
                var strDate = date.getDate();
                var month = date.getMonth() + 1;
                if (month >= 1 && month <= 9) {
                    month = "0" + month;
                }
                if (strDate >= 0 && strDate <= 9) {
                    strDate = "0" + strDate;
                }
                var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
                   // + " " + date.getHours() + seperator2 + date.getMinutes()
                   // + seperator2 + date.getSeconds();
                return currentdate;

        },
        //查询列表数据
        fetchData(curPage,type,page){

            let _this=this;
            if(this.orderType == type&&page=='order'){
                this.orderBy =  this.orderBy==1?0:1;
                this.currentPage =curPage;


            }else if(this.orderType == type&&page=='page'){
                this.orderType = type;
                //this.currentPage =1;
                //console.log('this.currentPage',this.currentPage)
                this.currentPage = curPage;
            }else{

                this.currentPage =curPage;
                this.orderType = type;
                this.orderBy =1;
            }

            //数据类型
            _.ajax({
                url:'/api/admindashboard/kpi',
                method:'POST',
                data:{
                    pageNum:curPage,
                    pageSize:this.pageSize,
                    orderType:type,
                    orderBy:this.orderBy
                },
                success:function(res){
                    if(res.code =='0')
                    {
                        res.data.list.forEach((m)=>{

                            m.storageUsed =_.transferbetye(m.storageUsed,0);
                            m.dataDailyIncr = _.transferbetye(m.dataDailyIncr,0);
                        })
                        _this.datalist = res.data;
                        _this.totalCount=res.data.total;
                    }
                },
                error:function (err) {
                }
            })

        },
        getclass(type){
            return type==1?'ion-android-arrow-dropdown':'ion-android-arrow-dropup'
        }
    }
}