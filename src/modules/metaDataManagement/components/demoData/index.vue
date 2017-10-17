<template>
<div class="chorus-grid  chorus-grid">
        <table class="admin-table  admin-striped chorus-grid">
            <thead>
            <tr>
                <th >字段名称</th>
                <th>字段描述</th>
                <th>字段类型</th>
                <th>字段长度</th>
                <th>是否主健</th>
                <th>是否外建</th>
                <th>是否索引</th>
                <th>是否可空</th>
                <th style="text-align:left !important">安全等级</th>
            </tr>
            </thead>
            <tbody>
            <tr v-if="data.length==0">
                <td  :colspan="9" style="height: 30px;line-height: 30px;text-align: center">暂无数据</td>
            </tr>
            <tr v-for="entry in data" v-else >
                <td :title="entry.columnName">{{entry.columnName}}</td>
                <td :title="entry.columnDesc">{{entry.columnDesc}} </td>
                <td :title="entry.columnType">{{entry.columnType}}</td>
                <td :title="entry.columnLength">{{entry.columnLength}}</td>
                <td :title="entry.isKey">{{entry.isKey}}</td>
                <td :title="entry.isRefKey">{{entry.isRefKey}}</td>
                <td :title="entry.isIndex">{{entry.isIndex}}</td>
                <td :title="entry.isNull">{{entry.isNull}}</td>
                <td :title="entry.securityLevel">{{entry.securityLevel}}</td>
            </tr>
            </tbody>
        </table>
    </div>
</template>
<script>
import {querymatedatacolumninfo as qdata} from '../../mock';
export default {
    data(){
       return {
          data:[]
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
            this.data=[];
           let _this=this;
           _.ajax({
               url:'/api/metadatamanagement/querymatedatacolumninfo',
               method:'POST',
               data:{
                   tableid:tableid
               },
               success:function(res){
                   if(res.code =='0')
                   {
                       var _data=res.data;
                       _data.forEach((rec,i)=>{
                           rec.isKey=rec.isKey==1?"是":"否";
                       rec.isRefKey=rec.isRefKey==1?"是":"否";
                       rec.isIndex=rec.isIndex==1?"是":"否";
                       rec.isNull=rec.isNull==1?"是":"否";
                   })
                       _this.data=_data;
                   }
               },
               error:function (err) {
                   adToast({
                       message: '请求失败！'
                   });
               }
           })
       }
    }
}
</script>
<style lang="scss"></style>