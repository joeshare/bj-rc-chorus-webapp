<template>
<div class="chorus-grid  chorus-grid">
        <!-- 字段信息-->
        <span class="admin-grid-cell-12 admin-small" style="margin-top: 20px; padding-left:10px;  position: relative; height: 20px;">
                    <span style="display: inline-block;position: absolute;top:0px; background-color: white;z-index: 100;">字段信息&nbsp;</span>
                    <span style="border-bottom: 1px solid #ccc;width: 100%;top:8px;position: absolute;">
                    </span>
                </span>
                <div style="padding:10px;">
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
                                <tr v-for="entry in data" v-show="entry.isPartitionKey !=1" >
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
        <!-- 分区字段-->
        <div v-show="data.length>0" style="margin-top: 15px;">
             <span class="admin-grid-cell-12 admin-small" style="margin-top: 20px;padding-left:10px;   position: relative; height: 20px;">
                      <span style="display: inline-block;position: absolute;top:0px; background-color: white;z-index: 100;">分区信息&nbsp;</span>
                      <span style="border-bottom: 1px solid #ccc;width: 100%;top:8px;position: absolute;"></span>
             </span>
             <div style="padding:10px;">
                        <table class="admin-table admin-stripedd"  style="min-width:653px;">
                            <thead>
                            <tr>
                                <th>字段名称</th>
                                <th>字段类型</th>
                                <th>字段说明</th>
                                <th style="text-align:left !important">分区类型</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="field in data"  v-show="field.isPartitionKey ==1">
                                <td  style="max-width: 200px; overflow: hidden;">
                                    {{field.columnName}}
                                </td>
                                <td>
                                    {{field.columnType}}
                                </td>
                                <td  style="max-width: 200px; overflow: hidden;">
                                    {{field.columnType}}
                                </td>
                                <td v-if="field.columnName=='p_date'">
                                    静态分区
                                </td>
                                <td v-else>
                                    动态分区
                                </td>
                            </tr>
                            </tbody>
                        </table>
             </div>
        </div>
    </div>
</template>
<script>
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
    mounted(){
        if(this.tableId){ this.fetchData(this.tableId);  }
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