<style>
</style>
<template>
<div class="external-resource">
    <div class="clims">
    <div class="col_title">数据源名称</div>
    <ad-input
        label=""            
        placeholder=""
        :warnings="warningMap['resourceName']"
        @blur="valiNotEmpty(iniData.resourceName, 'resourceName')"
        v-model="iniData.resourceName"
        value=""></ad-input>   
    </div>
    <div style="padding:10px 0;margin-top: 10px;">
    <div class="col_title">数据源类型</div> 
        <ad-select
            v-model="iniType"
            :options="iniTypeList"
            placeholder=""
            :small="true"
            disabled="disabled"
            label="">
        </ad-select>
    </div>
        <div class="clims" style="margin-top: 10px;">
        <div class="col_title" style="display: table-cell;vertical-align: top;"><span>数据源备注</span></div>
        <ad-input
                style="display: table-cell;"
            type="textarea"
            label=""    
            v-model="iniData.resourceDesc"
            placeholder=""
            value=""></ad-input>
    </div>
    <div class="clims" style="margin-top: 40px;font-size: 14px;">
        <div style="line-height: 40px;">数据源属性</div>
        <div class="div-area">
            <div class="mysql" v-show="iniType=='1'">
                <div style="padding:10px;">
                    <span class="proTitle">服务器地址</span>
                    <ad-input label=""
                        placeholder=""
                        value=""
                        :warnings="warningMap['connHost']"
                        @blur="valiNotEmpty(iniData.connHost, 'connHost')"
                        v-model="iniData.connHost"
                        type="text">
                    </ad-input>
                </div>
                <div style="padding:10px;">
                    <span class="proTitle">服务器端口</span>
                    <ad-input label=""
                        placeholder=""
                        value=""
                        :warnings="warningMap['connPort']"
                        @blur="valiNotEmpty(iniData.connPort, 'connPort')"
                        v-model="iniData.connPort"
                        type="text">
                    </ad-input>
                </div>
                <div style="padding:10px;">
                    <span class="proTitle">用户名</span>
                    <ad-input label=""
                        placeholder=""
                        value=""
                        :warnings="warningMap['connUser']"
                        @blur="valiNotEmpty(iniData.connUser, 'connUser')"
                        v-model="iniData.connUser"
                        type="text">
                    </ad-input>
                </div>
                <div style="padding:10px;">
                    <span class="proTitle">密 码</span>
                        <ad-input label=""
                        placeholder=""
                        value=""
                        :warnings="warningMap['connPass']"
                        @blur="valiNotEmpty(iniData.connPass, 'connPass')"
                        v-model="iniData.connPass"
                        type="password">
                    </ad-input>

                </div>
                <div style="padding:10px;">
                    <span class="proTitle">数据库</span>
                    <ad-input label=""
                        placeholder=""
                        value=""
                        :warnings="warningMap['databaseName']"
                        @blur="valiNotEmpty(iniData.databaseName, 'databaseName')"
                        v-model="iniData.databaseName"
                        type="text">
                    </ad-input>
                </div>
            </div>
            <div class ="ftp" v-show="iniType=='2'">
                <div style="padding:10px;">
                    <span class="proTitle">服务器地址</span>
                    <ad-input label=""
                              placeholder=""
                              value=""
                              :warnings="warningMap['connHost']"
                              @blur="valiNotEmpty(iniData.connHost, 'connHost')"
                              v-model="iniData.connHost"
                              type="text">
                    </ad-input>
                </div>
                <div style="padding:10px;">
                    <span class="proTitle">服务器端口</span>
                    <ad-input label=""
                              placeholder=""
                              value=""
                              :warnings="warningMap['connPort']"
                              @blur="valiNotEmpty(iniData.connPort, 'connPort')"
                              v-model="iniData.connPort"
                              type="text">
                    </ad-input>
                </div>
                <div style="padding:10px;">
                    <span class="proTitle">用户名</span>
                    <ad-input label=""
                              placeholder=""
                              value=""
                              :warnings="warningMap['connUser']"
                              @blur="valiNotEmpty(iniData.connUser, 'connUser')"
                              v-model="iniData.connUser"
                              type="text">
                    </ad-input>
                </div>
                <div style="padding:10px;">
                    <span class="proTitle">密 码</span>
                    <ad-input label=""
                              placeholder=""
                              value=""
                              :warnings="warningMap['connPass']"
                              @blur="valiNotEmpty(iniData.connPass, 'connPass')"
                              v-model="iniData.connPass"
                              type="password">
                    </ad-input>

                </div>

                <div style="padding:10px;">
                    <span class="proTitle">链接模式</span>

                    <ad-select
                            v-model="iniData.connectMode"
                            :options="connectedModeOptions"
                            placeholder=""
                            :small="true"
                            label="">
                    </ad-select>
                </div>
                <div style="padding:10px;">
                    <span class="proTitle">目录路径</span>
                    <ad-input label=""
                              placeholder=""
                              value=""
                              :warnings="warningMap['path']"
                              @blur="valiNotEmpty(iniData.path, 'path')"
                              v-model="iniData.path"
                              type="text">
                    </ad-input>
                </div>
            </div>
           <!-- <div class="vertica" v-show="iniType=='2'">
            <div style="padding:10px;">
                <span class="proTitle">服务器地址</span>
                <ad-input label=""
                          placeholder=""
                          value=""
                          :warnings="warningMap['connHost']"
                          @blur="valiNotEmpty(iniData.connHost, 'connHost')"
                          v-model="iniData.connHost"
                          type="text">
                </ad-input>
            </div>
            <div style="padding:10px;">
                <span class="proTitle">服务器端口</span>
                <ad-input label=""
                          placeholder=""
                          value=""
                          :warnings="warningMap['connPort']"
                          @blur="valiNotEmpty(iniData.connPort, 'connPort')"
                          v-model="iniData.connPort"
                          type="text">
                </ad-input>
            </div>
            <div style="padding:10px;">
                <span class="proTitle">用户名</span>
                <ad-input label=""
                          placeholder=""
                          value=""
                          :warnings="warningMap['connUser']"
                          @blur="valiNotEmpty(iniData.connUser, 'connUser')"
                          v-model="iniData.connUser"
                          type="text">
                </ad-input>
            </div>
            <div style="padding:10px;">
                <span class="proTitle">密 码</span>
                <ad-input label=""
                          placeholder=""
                          value=""
                          :warnings="warningMap['connPass']"
                          @blur="valiNotEmpty(iniData.connPass, 'connPass')"
                          v-model="iniData.connPass"
                          type="password">
                </ad-input>

            </div>
            <div style="padding:10px;">
                <span class="proTitle">数据库</span>
                <ad-input label=""
                          placeholder=""
                          value=""
                          :warnings="warningMap['databaseName']"
                          @blur="valiNotEmpty(iniData.databaseName, 'databaseName')"
                          v-model="iniData.databaseName"
                          type="text">
                </ad-input>
            </div>
        </div>

            <div class="Kafka" v-show="iniData.dataSourceType=='kafka'">
                <div>
                    <span class="proTitle">zk服务器地址</span>
                    <ad-input label=""
                        placeholder=""
                        value=""
                        :warnings="warningMap['zkServerAddress']"
                        @blur="valiNotEmpty(iniData.zkServerAddress, 'zkServerAddress')"
                        v-model="iniData.zkServerAddress"
                        type="text">
                    </ad-input>
                </div>
                <div>
                    <span class="proTitle">Broker列表</span>
                    <ad-input label=""
                        placeholder=""
                        value=""
                        :warnings="warningMap['brokerList']"
                        @blur="valiNotEmpty(iniData.brokerList, 'brokerList')"
                        v-model="iniData.brokerList"
                        type="text">
                    </ad-input>
                </div>
                <div>
                    <span class="proTitle">Topic名称</span>
                    <ad-input label=""
                        placeholder=""
                        value=""
                        :warnings="warningMap['topicName']"
                        @blur="valiNotEmpty(iniData.topicName, 'topicName')"
                        v-model="iniData.topicName"
                        type="text">
                    </ad-input>
                </div>
            </div>

            <div class="HDFS" v-show="iniData.dataSourceType=='hdfs'">
                <div>
                    <span class="proTitle">NameNode地址</span>
                    <ad-input label=""
                        placeholder=""
                        value=""
                        :warnings="warningMap['nameNodeAddress']"
                        @blur="valiNotEmpty(iniData.nameNodeAddress, 'nameNodeAddress')"
                        v-model="iniData.nameNodeAddress"
                        type="text">
                    </ad-input>
                </div>
                <div>
                    <span class="proTitle">用户名</span>
                    <ad-input label=""
                        placeholder=""
                        value=""
                        :warnings="warningMap['HDFSName']"
                        @blur="valiNotEmpty(iniData.HDFSName, 'HDFSName')"
                        v-model="iniData.HDFSName"
                        type="text">
                    </ad-input>
                </div>
            </div>
-->

        </div>
    </div>
</div>
</template>
<script>
import adSelect from '../../admin-ui/components/admin-select'
import adModal from '../../admin-ui/components/admin-modal'
import adInput from '../../admin-ui/components/admin-input'
export default{
    name:"update",
    data (){
        return {
            connectedModeOptions: [{text:"主动",value:"2"},{text:"被动",value:"1"}],
        }
    },
    props:["iniTypeList","iniData","iniType","warningMap"],
    components:{
        adSelect,
        adModal,
        adInput
    },
    methods:{        
          valiNotEmpty:function(v, key){               
            if(/^\s+$/.test(v) || v.length ==0){
                this.$set(this.warningMap, key, ['不能为空'])             
            }else if(key.indexOf('Port')>0 && !/^[0-9]+$/g.test(v)){
                this.$set(this.warningMap, key, ['必须为数字'])  
            }else{                            
                this.$set(this.warningMap, key, null)  
            }
            
        },
    },
    mounted:function(){        
    },
    computed:{
        
    },
    watch:{        
    }
}
</script>