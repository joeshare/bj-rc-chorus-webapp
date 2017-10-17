<style>
</style>
<template>
 <div class="external-resource">
    <div style="padding:10px;">
    <div class="col_title">数据源名称</div>
    <ad-input
        label=""            
        placeholder=""
        :disabled="disabled"
        v-model="detailData.resourceName"
        value=""></ad-input>   
    </div>
    <div style="padding:10px;"> 
    <div class="col_title">数据源类型</div>
        <ad-select
            v-model="sourceType"
            :options="dataSourceTypeList"
            placeholder=""
            :small="true"
            disabled="disabled"
            label="">
        </ad-select>
    </div>
    <div style="padding:10px;">     
    <div class="col_title"  style="display: table-cell;vertical-align: top;">数据源备注</div>
        <ad-input
                style="display: table-cell;"
            type="textarea"
            label=""    
            placeholder=""
            :disabled="disabled"
            v-model="detailData.resourceDesc"
            value=""></ad-input>
    </div>
    <div style="padding:10px;">
        <p>数据源属性</p>
        <div class="div-area">                        
                
            <div class="mysql" v-show="sourceType=='1'">
                <div style="padding:10px;">
                    <span class="proTitle">服务器地址</span>
                    <ad-input label=""
                        value=""
                        :disabled="disabled"
                        v-model="detailData.connHost"
                        placeholder=""
                        type="text">
                    </ad-input>
                </div>
                <div style="padding:10px;">
                    <span class="proTitle">服务器端口</span>
                    <ad-input label=""
                        value=""
                        :disabled="disabled"
                        v-model="detailData.connPort"
                        placeholder=""
                        type="text">
                    </ad-input>
                </div>
                <div style="padding:10px;">
                    <span class="proTitle">用户名</span>
                    <ad-input label=""
                        value=""
                        :disabled="disabled"
                        v-model="detailData.connUser"
                        placeholder=""
                        type="text">
                    </ad-input>
                </div>            
                <div style="padding:10px;">
                    <span class="proTitle">数据库</span>
                    <ad-input label=""
                        value=""
                        :disabled="disabled"
                        placeholder=""
                        v-model="detailData.databaseName"
                        type="text">
                    </ad-input>
                </div>
            </div>

            <div class ="ftp" v-show="sourceType=='2'">
                <div>
                    <span class="proTitle">服务器地址</span>
                    <ad-input label=""
                              value=""
                              :disabled="disabled"
                              v-model="detailData.connUrl"
                              type="text">
                    </ad-input>
                </div>
                <div>
                    <span class="proTitle">服务器端口</span>
                    <ad-input label=""
                              value=""
                              :disabled="disabled"
                              v-model="detailData.connPort"
                              type="text">
                    </ad-input>
                </div>
                <div>
                    <span class="proTitle">用户名</span>
                    <ad-input label=""
                              value=""
                              :disabled="disabled"
                              v-model="detailData.connUser"
                              type="text">
                    </ad-input>
                </div>
                <div>
                    <span class="proTitle">密 码</span>
                    <ad-input label=""
                              value=""
                              :disabled="disabled"
                              v-model="detailData.connUser"
                              type="password">
                    </ad-input>
                </div>
                <div>
                    <span class="proTitle">链接模式</span>

                    <ad-select
                            v-model="detailData.connectMode"
                            :options="connectedModeOptions"
                            placeholder=""
                            :small="true"
                            label="">
                    </ad-select>
                </div>
                <div>
                    <span class="proTitle">目录路径</span>
                    <ad-input label=""
                              value=""
                              :disabled="disabled"
                              v-model="detailData.path"
                              type="text">
                    </ad-input>
                </div>
            </div>
            
          <!--  <div class="Kafka" v-show="sourceType=='kafka'">
                <div>
                    <span class="proTitle">zk服务器地址</span>
                    <ad-input label=""
                        value=""
                        :disabled="disabled"
                        v-model="detailData.zkServerAddress"
                        type="text">
                    </ad-input>
                </div>
                <div>
                    <span class="proTitle">Broker列表</span>
                    <ad-input label=""
                        value=""
                        :disabled="disabled"
                        v-model="detailData.brokerList"
                        type="text">
                    </ad-input>
                </div>
                <div>
                    <span class="proTitle">Topic名称</span>
                    <ad-input label=""
                        value=""
                        :disabled="disabled"
                        v-model="detailData.topicName"
                        type="text">
                    </ad-input>
                </div>
            </div>

            <div class="HDFS" v-show="sourceType=='hdfs'">
                <div>
                    <span class="proTitle">NameNode地址</span>
                    <ad-input label=""
                        value=""
                        :disabled="disabled"
                        v-model="detailData.nameNodeAddress"
                        type="text">
                    </ad-input>
                </div>
                <div>
                    <span class="proTitle">用户名</span>
                    <ad-input label=""
                        value=""
                        :disabled="disabled"
                        v-model="detailData.HDFSName"
                        type="text">
                    </ad-input>
                </div>
            </div>



            <div class="vertica" v-show="sourceType=='2'">
                <div style="padding:10px;">
                    <span class="proTitle">服务器地址</span>
                    <ad-input label=""
                              value=""
                              :disabled="disabled"
                              v-model="detailData.connHost"
                              placeholder=""
                              type="text">
                    </ad-input>
                </div>
                <div style="padding:10px;">
                    <span class="proTitle">服务器端口</span>
                    <ad-input label=""
                              value=""
                              :disabled="disabled"
                              v-model="detailData.connPort"
                              placeholder=""
                              type="text">
                    </ad-input>
                </div>
                <div style="padding:10px;">
                    <span class="proTitle">用户名</span>
                    <ad-input label=""
                              value=""
                              :disabled="disabled"
                              v-model="detailData.connUser"
                              placeholder=""
                              type="text">
                    </ad-input>
                </div>
                <div style="padding:10px;">
                    <span class="proTitle">数据库</span>
                    <ad-input label=""
                              value=""
                              :disabled="disabled"
                              placeholder=""
                              v-model="detailData.databaseName"
                              type="text">
                    </ad-input>
                </div>
            </div>-->
        </div>
    </div>                
</div>
</template>
<script>
import adSelect from '../../admin-ui/components/admin-select'
import adModal from '../../admin-ui/components/admin-modal'
import adInput from '../../admin-ui/components/admin-input'
export default{
    name:"detail",
    data (){
        return {
            sourceType:this.dst,
            disabled:"disabled",
        connectedModeOptions: [{text:"主动",value:"2"},{text:"被动",value:"1"}],
        }
    },
    props:["detailData","dataSourceTypeList","dst"],
    components:{
        adSelect,
        adModal,
        adInput
    },
    methods:{        
    },
    mounted:function(){        
    },
    computed:{
        
    },
    watch:{
        dst(v){      
            this.sourceType = v;            
        }
    }
}
</script>