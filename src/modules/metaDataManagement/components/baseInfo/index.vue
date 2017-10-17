<style>

    .matebaseinfo textarea.ad-input-core{width:100% !important;}
</style>
<template>
<div class="admin-grid-container matebaseinfo">
    <div class="admin-grid-cell-6">
        <div  style="padding: 10px;">
            <ad-input class="project-manage-ad-input"
                      label="表名："
                      v-model="data.tableName"
                      placeholder=""
                      :disabled="true"
            ></ad-input>
        </div>
    </div>
   <!-- <div class="admin-grid-cell-6">
        <div  style="padding: 10px;">
            <ad-input class="project-manage-ad-input"
                      label="表编码："
                      v-model="data.tableCode"
                      placeholder=""
                      :disabled="true"
            ></ad-input>
        </div>
    </div>-->
    <div class="admin-grid-cell-6">
        <div  style="padding: 10px;">
            <ad-input class="project-manage-ad-input"
                      label="项目资源："
                      v-model="data.projectName"
                      placeholder=""
                      :disabled="true"
            ></ad-input>
        </div>
    </div>
    <div class="admin-grid-cell-6">
        <div  style="padding: 10px;">
            <ad-input class="project-manage-ad-input"
                      label="数据域："
                      v-model="data.dataField"
                      placeholder=""
                      :disabled="true"
            ></ad-input>
        </div>
    </div>
    <div class="admin-grid-cell-6">
        <div  style="padding: 10px;">
            <ad-input class="project-manage-ad-input"
                      label="表类型："
                      v-model="data.tableType"
                      placeholder=""
                      :disabled="true"
            ></ad-input>
        </div>
    </div>
    <div class="admin-grid-cell-6">
        <div  style="padding: 10px;">
            <ad-input class="project-manage-ad-input"
                      label="是否支持快照："
                      v-model="data.isSnapshot"
                      placeholder=""
                      :disabled="true"
            ></ad-input>
        </div>
    </div>
    <div class="admin-grid-cell-6">
        <div  style="padding: 10px;">
            <ad-input class="project-manage-ad-input"
                      label="时效性："
                      v-model="data.updateFrequence"
                      placeholder=""
                      :disabled="true"
            ></ad-input>
        </div>
    </div>
    <div class="admin-grid-cell-6">
        <div  style="padding: 10px;">
            <ad-input class="project-manage-ad-input"
                      label="SLA："
                      v-model="data.sla"
                      placeholder=""
                      :disabled="true"
            ></ad-input>
        </div>
    </div>
    <div class="admin-grid-cell-6">
        <div  style="padding: 10px;">
            <ad-input class="project-manage-ad-input"
                      label="安全等级："
                      v-model="data.securityLevel"
                      placeholder=""
                      :disabled="true"
            ></ad-input>
        </div>
    </div>
    <div class="admin-grid-cell-6">
        <div  style="padding: 10px;">
            <ad-input class="project-manage-ad-input"
                      label="是否对外开放："
                      v-model="data.isOpen"
                      placeholder=""
                      :disabled="true"
            ></ad-input>
        </div>
    </div>
    <div class="admin-grid-cell-12">
        <div  style="padding: 10px;">
            <ad-input class="project-manage-ad-input"
                      label="表描述："
                      type="textarea"
                      v-model="data.tableDes"
                      placeholder=""
                      :disabled="true"
            ></ad-input>
        </div>
    </div>
</div>
</template>
<script>
    import AdInput from 'adminUI/components/admin-input';
    import {querymatedatatable as qdata} from '../../mock';
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
        watch: {
            tableId (v) {
                //this.fetchData(v);
            }
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
                            _this.data.isSnapshot = _this.data.isSnapshot==0?'否':'是';
                            _this.data.isOpen = _this.data.isOpen==0?'否':'是';
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