<template>
    <div class=" admin-grid-container "  >
        <table class="admin-table admin-striped data-table-list"  style="width:100%;">
            <thead>
            <tr>
                <th>任务名称</th>
                <th>任务描述</th>
                <th>任务实例ID</th>
                <th>任务执行ID</th>
                <th>所属项目</th>
                <th>任务负责人</th>
                <th>执行开始时间</th>
            </tr>
            </thead>
            <tbody>
            <tr v-if="datalist&&datalist.length==0">
                <td  :colspan="7" style="height: 30px;line-height: 30px;text-align: center">暂无数据</td>
            </tr>
            <tr v-for="entry in datalist" v-else >
                <td style="max-width: 300px; overflow: hidden;" title="entry.jobName">{{entry.jobName}}</td>
                <td>{{entry.description}}</td>
                <td>{{entry.jobInstanceId}}</td>
                <td>{{entry.jobExecutionId}}</td>
                <td>{{entry.projectName}}</td>
                <td>{{entry.createUserName}}</td>
                <td>{{entry.jobStartTime}}</td>
            </tr>
            </tbody>
        </table>
        <div  style="text-align: right;width: 100%;">
            <paginator :total-count="totalCount" :page-size="pageSize" :current-page="currentPage"  @toggle-page="togglePage"></paginator>
        </div>
    </div>
</template>
<script>
import AdInput from 'adminUI/components/admin-input';
import Paginator from 'adminUI/components/admin-paginator.vue';
export default {
    components:{
        Paginator,
        AdInput
    },
    data(){
       return {
          data:[],
           datalist:[],
           pageSize:10,
           totalCount: 0,
           currentPage: 1,
       }
    },
    created() {
        this.fetchData(1);
    },
    props: {
    },
    watch: {
    },
    methods:{
       fetchData(v){

           let _this =this;
           _.ajax({
               url:'/api/admindashboard/exectags',
               method:'POST',
               data:{
                   jobType:2,
                   pageNum:v,
                   pageSize:this.pageSize
               },
               success:function(res){
                    if(res.code=="0"){
                        var _data=res.data.data;

                        //m.jobStartTime 返回的是年月入时分秒
                        _this.totalCount = res.data.totalNum;
                        let bratch = `批量任务(${_this.totalCount})`

                        _this.$parent.tabs.forEach((m)=>{
                            if(m.name =='batchtag'){
                            if(!m.text) m.text = bratch;
                            }
                        })
                        _this.datalist=_data;
                    }
               },
               error:function(res){
               }
           })

       },
        //分页相应事件
        togglePage(indexPage){
            this.fetchData(indexPage)
        },
    }
}
</script>
