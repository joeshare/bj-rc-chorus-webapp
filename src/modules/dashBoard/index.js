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

            resoucedata:{
                "AllCPU": 0,
                "Allmemery": 0,
                "Alldisk": 0,
                "AcitveCPU": 0,
                "Activememery": 0,
                "Activedisk": 0,
                "ContentUsed": 0,
                "ContentActive": 0
            },//资源数据
            tabledata:{
                "attention": [],
                "used": [],
                "record":[],
                "storage": [],
                "tablecount": 0,
                "storagecount": 0
            },
            exedata:null,
            memberdistributedata:null,
            taskdistributedata:null,
            batchTaskdata:null,
            shownotask:false,
            streamTaskdata:null,
            membercount:0,
            navlist:[{id:1,text:'项目管理',url:''},{id:2,text:'监控面板',url:'#/dashboard'}],
            data:[]
        }
    },
    created() {

        this.initressouce();
        this.inittabledata();
        this.initexedata();
    },
    mounted(){
        this.memberdistribute();
        this.taskdistribute();
        this.batchTask();
        this.streamTask();
    },

    watch: {
        "$route": "refreach"
    },
    methods: {
        refreach(){

            this.initressouce();
            this.inittabledata();
            this.initexedata();

            this.memberdistribute();
            this.taskdistribute();
            this.batchTask();
            this.streamTask();
        },
        initressouce(){
            let _this=this;
            let projectid =_.currentProjectInfo.get().projectId;
            _.ajax({
                url:'/api/dashboard/resource',
                method:'POST',
                data:{
                    projectId:projectid
                },
                success:function(res){
                    if(res.code=="0"){
                        res.data.Activedisk = _.transferbetye(res.data.Activedisk,3);
                        res.data.Alldisk = _.transferbetye(res.data.Alldisk,3);
                        _this.resoucedata = res.data;
                    }
                },
                error:function (err) {
                }
            })
        },
        inittabledata(){
            let _this=this;
            let projectid =_.currentProjectInfo.get().projectId;
            _.ajax({
                url:'/api/dashboard/data',
                method:'POST',
                data:{
                    projectId:projectid
                },
                success:function(res){
                    if(res.code=="0"){
                        _this.tabledata = res.data;

                        if(_this.tabledata){

                            if(_this.tabledata.storagecount){
                                let Tstoragecount =_this.tabledata.storagecount;
                                _this.tabledata.storagecount = _.transferbetye(Tstoragecount,0);
                            }

                            if(_this.tabledata.storage&&Object.prototype.toString.call((_this.tabledata.storage)) == '[object Array]'){
                                _this.tabledata.storage.forEach(m=>{
                                    m.storageSize =_.transferbetye(m.storageSize,0);
                                });
                            }

                            if(_this.tabledata.record&&Object.prototype.toString.call((_this.tabledata.record)) == '[object Array]'){
                                _this.tabledata.record.forEach((m)=>{
                                    m.rows =_.formatNum(m.rows);
                                })
                            }

                            if(_this.tabledata.attention&&Object.prototype.toString.call((_this.tabledata.attention)) == '[object Array]') {
                                _this.tabledata.attention.forEach((m)=>{
                                m.attCount =_.formatNum(m.attCount);
                            })}
                        }

                    }
                },
                error:function (err) {
                }
            })
        },
        initexedata(){
            let _this=this;
            let projectid =_.currentProjectInfo.get().projectId;
            _.ajax({
                url:'/api/dashboard/exectime',
                method:'POST',
                data:{
                    projectId:projectid
                },
                success:function(res){
                    if(res.code=="0"){

                        res.data.forEach(m=>{

                           m.seconds = _.transfertime(m.seconds,0);
                        });
                        _this.exedata = res.data;
                    }
                },
                error:function (err) {
                }
            })
        },
        memberdistribute(){
         let  option= {

             tooltip : {
                 trigger: 'item',
                 formatter: "{a} <br/>{b} : {c} ({d}%)"
             },
             series : [
                 {
                     name: '数量',
                     type: 'pie',
                     radius : '55%',
                     center: ['50%', '60%'],
                     data:[

                     ],
                     itemStyle: {
                         emphasis: {
                             shadowBlur: 10,
                             shadowOffsetX: 0,
                             shadowColor: 'rgba(0, 0, 0, 0.5)'
                         }
                     }
                 }
             ]
         };


            let _this=this;
            let projectid =_.currentProjectInfo.get().projectId;
            _.ajax({
                url:'/api/dashboard/member',
                method:'POST',
                data:{
                    projectId:projectid
                },
                success:function(res){
                    var myChart = echarts.init(document.getElementById('member'));
                    if(res.code=="0"){
                        //执行
                        if(res.data.datas)
                        {
                            res.data.datas.forEach(m=>{
                                option.series[0].data.push({value:m.count, name:m.roleName});
                            })
                            _this.membercount = res.data.total;

                        }
                        else {
                            option.series[0].data.push({value:0, name:'无角色'});
                            _this.membercount = 0;
                        }
                    }
                    else{
                        option.series[0].data.push({value:0, name:'无角色'});
                        _this.membercount = 0;
                    }
                    myChart.setOption(option);
                },
                error:function (err) {
                }
            })


        },
        taskdistribute(){
           let  option = {
                title : {
                    text: '任务分布',
                    subtext: '',
                    x:'center'
                },
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    data: ['发布','未发布']
                },
                series : [
                    {
                        name: '数量',
                        type: 'pie',
                        radius : '55%',
                        center: ['50%', '60%'],
                        data:[

                        ],
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };
            let _this=this;
            let projectid =_.currentProjectInfo.get().projectId;
            _.ajax({
                url:'/api/dashboard/task',
                method:'POST',
                data:{
                    projectId:projectid
                },
                success:function(res){
                    var myChart = echarts.init(document.getElementById('taskdisbute'));
                    if(res.code=="0"){

                        if(res.data)
                        {
                            _this.shownotask =false;

                            option.series[0].data.push({value:res.data.DEPLOY, name:'发布'});
                            option.series[0].data.push({value:res.data.UNDEPLOY, name:'未发布'});
                            /*res.data.forEach(m=>{
                             })*/
                        }
                        else {
                            _this.shownotask =true;
                         //   option.series[0].data.push({value:0, name:'发布'});
                          //  option.series[0].data.push({value:0, name:'未发布'});
                        }

                        //执行

                        myChart.setOption(option);
                    }
                    else{
                        _this.shownotask =true;
                      //  option.series[0].data.push({value:0, name:'发布'});
                      //  option.series[0].data.push({value:0, name:'未发布'});
                      //  myChart.setOption(option);
                    }
                },
                error:function (err) {
                }
            })
        },
        batchTask(){
            let  option = {

                title : {
                    text: '批量任务执行分布',
                    x:'left'
                },
                color:['#3CB371','#f36a5a','#5C9BD1'],
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                legend: {
                    data:[]
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis : [
                    {
                        type : 'category',
                        data : []
                    }
                ],
                yAxis : [
                    {
                        type : 'value'
                    }
                ],
                series : []
            };

            let _this=this;
            let projectid =_.currentProjectInfo.get().projectId;
            _.ajax({
                url:'/api/dashboard/batchtask',
                method:'POST',
                data:{
                    projectId:projectid
                },
                success:function(res){
                    if(res.code=="0"){

                        let toolbar = [];
                        let legendbar =['执行完成数量','执行失败数量','正在执行数量'];
                        let data =[{
                                name:'执行完成数量',
                                type:'bar',
                                data:[]
                            },
                            {
                                name:'执行失败数量',
                                type:'bar',
                                data:[]
                            },
                            {
                                name:'正在执行数量',
                                type:'bar',
                                data:[]
                            }];
                        if(res.data)
                        {
                            res.data.forEach(m=>{
                                toolbar.push(m.date);
                                data[0].data.push(m.completedNum);
                                data[1].data.push(m.failedNum);
                                data[2].data.push(m.runningNum);
                            })
                        }

                        option.legend.data = legendbar;
                        option.xAxis[0].data =toolbar;
                        option.series = data;
                        //执行
                        var myChart = echarts.init(document.getElementById('batchtask'));
                        myChart.setOption(option);
                    }
                },
                error:function (err) {
                }
            })

        },
        streamTask(){


            let  option = {

                title : {
                    text: '流式任务执行分布',
                    x:'left'
                },
                color:['#5C9BD1','#f36a5a','#8877a9'],
                tooltip : {
                    trigger: 'axis',
                    axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                        type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                legend: {
                    data:[]
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis : [
                    {
                        type : 'category',
                        data : []
                    }
                ],
                yAxis : [
                    {
                        type : 'value'
                    }
                ],
                series : [

                ]
            };



            let _this=this;
            let projectid =_.currentProjectInfo.get().projectId;
            _.ajax({
                url:'/api/dashboard/streamtask',
                method:'POST',
                data:{
                    projectId:projectid
                },
                success:function(res){
                    if(res.code=="0"){


                        let toolbar =[];
                        let legendbar =['正在执行数量','执行失败数量','未启动执行数量'];
                        let data =[{
                            name:'正在执行数量',
                            type:'bar',
                            data:[]
                        },
                            {
                                name:'执行失败数量',
                                type:'bar',
                                data:[]
                            },
                            {
                                name:'未启动执行数量',
                                type:'bar',
                                data:[]
                            }];

                        if(res.data)
                        {
                            res.data.forEach(m=>{
                                toolbar.push(m.date);
                                data[0].data.push(m.runningNum);
                                data[1].data.push(m.failedNum);
                                data[2].data.push(m.noExecNum);
                            })
                        }

                        option.legend.data = legendbar;
                        option.xAxis[0].data =toolbar;
                        option.series = data;

                        //执行
                        var myChart = echarts.init(document.getElementById('streamtask'));
                        myChart.setOption(option);
                    }
                },
                error:function (err) {
                }
            })

        }
    }
}