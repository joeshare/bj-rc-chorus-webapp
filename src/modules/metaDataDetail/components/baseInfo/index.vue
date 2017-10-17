<style>

    .chorus-data-meta-detail .ad-input-core{width:100% !important;}
    .chorus-data-meta-detail .admin-input{width:100% !important;}
</style>
<template>
<div class="admin-grid-container matebaseinfo">
    <div class="admin-grid-cell-8">
        <div  style="padding: 10px;">
            <ad-input class=" "
                      label="项目资源："
                      v-model="data.projectName"
                      placeholder=""
                      :disabled="true"
            ></ad-input>
        </div>
    </div>
    <div class="admin-grid-cell-8">
        <div  style="padding: 10px;">
            <ad-input class=" "
                      label="数据域："
                      v-model="data.dataField"
                      placeholder=""
                      :disabled="true"
            ></ad-input>
        </div>
    </div>
    <div class="admin-grid-cell-8">
        <div  style="padding: 10px;">
            <ad-input class=" "
                      label="表类型："
                      v-model="data.tableType"
                      placeholder=""
                      :disabled="true"
            ></ad-input>
        </div>
    </div>
    <div class="admin-grid-cell-8">
        <div  style="padding: 10px;">
            <ad-input class=" "
                      label="时效性："
                      v-model="data.updateFrequence"
                      placeholder=""
                      :disabled="true"
            ></ad-input>
        </div>
    </div>
    <div class="admin-grid-cell-8">
        <div  style="padding: 10px;">
            <ad-input class=" "
                      label="SLA："
                      v-model="data.sla"
                      placeholder=""
                      :disabled="true"
            ></ad-input>
        </div>
    </div>
    <div class="admin-grid-cell-8">
        <div  style="padding: 10px;">
            <ad-input class=" "
                      label="安全等级："
                      v-model="data.securityLevel"
                      placeholder=""
                      :disabled="true"
            ></ad-input>
        </div>
    </div>
    <div class="admin-grid-cell-8">
      <div  style="padding: 10px;">
       <span style="font-size: 14px;"><span style="font-size: 12px;">是否支持快照：</span>{{data.isSnapshotText}}</span>
       </div>
    </div>
    <div class="admin-grid-cell-8">
       <div  style="padding: 10px;">
         <span  style="font-size: 14px;"><span style="font-size: 12px;">是否对外开放：</span>{{data.isOpenText}}</span>
       </div>
    </div>
</div>
</template>
<script>
    import AdInput from 'adminUI/components/admin-input';
    export default {
        components: {
            AdInput
        },
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
        watch: { },
        mounted(){
              if(this.tableId){
                 this.fetchData(this.tableId);
              }
              var h=$('.admin-page-content-main').height();
              $('.chorus-data-meta-detail .admin-tabs-wrapper').height(h-180)

        },
        methods:{
            fetchData(tableid){
                this.data =[];
                let _this=this;
                _.ajax({
                    url:'/api/metadatamanagement/querymatedatatable',
                    method:'POST',
                    data:{
                        tableid:tableid
                    },
                    success:function(res){
                        if(res.code =='0')
                        {
                            _this.data=res.data;
                            _this.data.isSnapshotText = `${_this.data.isSnapshot}`=='0'?'否':'是';
                            _this.data.isOpenText =`${_this.data.isOpen}`=='0'?'否':'是';
                            _this.$emit('call-back', _this.data)
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