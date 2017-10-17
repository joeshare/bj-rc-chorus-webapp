<template>
<div class="chorus-grid ">
        <table class="admin-table admin-striped">
            <thead>
            <tr>
                <th  style="text-align:left !important" v-for="enthead in data.headerSet">{{enthead}}</th>
            </tr>
            </thead>

            <tbody>
            <tr v-if="data.data.length==0">
                <td  :colspan="data.headerSet.length" style="height: 30px;line-height: 30px;text-align: center">暂无数据</td>
            </tr>
            <tr v-for="entry in data.data" v-else >
                    <td v-for="clum in entry">
                        {{clum}}
                    </td>
            </tr>
            </tbody>
        </table>
    </div>
</template>
<script>
//import {querymatesampledata as qdata} from '../../mock';
export default {
    data(){
       return {
          data:{'headerSet':[],'data':[]}
       }
    },
    props: {
        tableId: {
            default: ""
        }
    },
    created() {
        // this.fetchData();
    },
    watch: {
        tableId (v) {
            //this.fetchData(v);
        }
    },
    methods:{
       fetchData(tableid){
           ///api/metadatamanagement/querymatesampledata
            this.data = {'headerSet':[],'data':[]};
           let _this=this;
           _.ajax({
               url:'/api/metadatamanagement/querymatesampledata',
               method:'POST',
               data:{
                   tableid:tableid
               },
               success:function(res){
                   if(res.code =='0')
                   {
                       var _data=res.data;
                       _this.data=_data;
                   }
               },
               error:function (err) {
                    console.log(err);
               }
           })

          //this.data=qdata().data;
       }
    }
}
</script>
