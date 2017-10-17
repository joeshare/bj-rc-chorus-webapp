<style  lang="scss" >
.meta-data-page-powerapply{
    padding:0 10px;
    thead tr th:last-child{
        text-align:left !important;
        min-width:140px;
    }
    thead tr th{
           text-align:left;
           width:auto;
    }
    tbody tr td:last-child{
            text-align:left !important;
    }
    table th{
        min-width:90px;
    }
    div.col_title{
        display:inline;
        min-width:76px;
        width:76px;
        text-align:right;
        font-size:12px;
        padding-right:10px;
        padding-left:0px;
        float:left;
        line-height:30px;
    }
    div.col_content{
        display:inline;
        font-size:12px;
        padding-right:10px;
        padding-left:0px;
        line-height:30px;
    }
}
    .powerapply .ad-input-core{width:320px !important;}
    .powerapply textarea.ad-input-core{width:100% !important;}
    .powerapply .ad-checkbox{width: 14px !important;}

</style>
<template>
<div class="meta-data-page-powerapply powerapply">
    <p>
        <div class="col_title">表名：</div>
        <div class="col_content">{{tableName}}</div>
    </p>
    <p>
        <div class="col_title">申请字段：</div>
    <table class="admin-table  admin-striped chorus-grid" style="width:532px;">

        <thead>
            <tr>
                <th style="min-width:20px;width:20px"><ad-checkbox v-model="checkAll"   @change="changecheckAll"></ad-checkbox></th>
                <th>字段名称</th>
                <th>字段说明</th>
                <th>安全等级</th>
            </tr>
        </thead>
        <tbody>
            <tr v-if="data.length==0">
                <td  :colspan="4" style="height: 30px;line-height: 30px;text-align: center">{{nodatatip}}</td>
            </tr>
            <tr v-for="entry in data.columnList" v-else >
                <td style="text-align: center;" v-if="entry.hasauth">
                    <ad-checkbox v-model="entry.authorized" :disabled="true" @change="checkboxchange"></ad-checkbox>
                </td>
                <td  style="text-align: center;"  v-else>
                    <ad-checkbox v-model="entry.authorized" @change="checkboxchange" ></ad-checkbox>
                </td>
                <td :title="entry.columnName">{{entry.columnName}} </td>
                <td :title="entry.columnDesc">{{entry.columnDesc}}</td>
                <td :title="entry.securityLevel">{{entry.securityLevel}}</td>
            </tr>
        </tbody>

    </table>
    <div  v-show="showwaringNochoose"  class="ad-input warning " value="" style=" margin-left:80px;width: 532px;"><div class="ad-input-warning">最少需要选择一个申请字段！</div> </div>

    </p>
    <p style="display: none;">
        <div style="display: none;">


        <div class="col_title">申请时限：</div>
        <ad-input label="" @input="clearwarnings" :warnings="timesizeWarnings" v-model="timesize" placeholder="" value=""></ad-input>
        <div  class="col_content" style="float: inherit;margin-left: 130px;">注：时限单位为天不写默认永远有效</div>
        </div>
    </p>
    <p>
         <div class="col_title">申请理由：</div>
        <ad-input style="width:532px" label=""  @input="clearwarnings"  :warnings="applyresonWarnings" v-model="applyreson"  type="textarea" placeholder="" value=""></ad-input>
    </p>
</div>
</template>
<script>
    import AdInput from 'adminUI/components/admin-input';
    import AdCheckbox from 'adminUI/components/admin-checkbox'
    import Toast from 'adminUI/components/admin-toast/index.js'
    import {querypowerapply as qdata} from '../../mock';
    export default {
        components: {
            AdInput,
            AdCheckbox,
            Toast
        },
        data(){
            return {
                data:[],
                appplydata:{
                    "columnList": [
                        0
                    ],
                    "duration": 0,
                    "reason": "string",
                    "tableInfoId": 0,
                    "userId": "string"
                },
                tableName:"",
                timesize:10000,
                applyreson:"",
                timesizeWarnings:null,
                applyresonWarnings:null,
                showwaringNochoose:false,
                nodatatip:"请稍后。。",
                checkAll:false
            }
        },
        created() {
            this.fetchData();
        },
        props: {
            tableId: {
                default: ""
            }
        },
        watch: {
            tableId (v) {
             //this.fetchData(v);
            }
        },
        methods:{
            fetchData(tableid){
            if(!tableid){
               return;
            }
                this.data = [];
                let _this=this;
                _this.timesize='';
                this.applyreson='';
                this.showwaringNochoose = false;
                _.ajax({
                    url:'/api/metadatamanagement/querypowerlist',
                    method:'POST',
                    data:{
                        tableid:tableid
                    },
                    success:function(res){
                        if(res.code =='0')
                        {
                            _this.data=res.data;
                            _this.data.columnList.forEach((m)=>{
                                if(m.authorized) {m.hasauth =true}else{m.hasauth =false}
                            });
                            if(_this.data.columnList.length==0)
                            {_this.nodatatip ="暂无数据"}
                            _this.tableName  = _this.data.tableInfo.tableName;
                        }
                    },
                    error:function (err) {
                        console.log(err);
                    }
                })


            }
            ,verificate(){
                let _this =this;
               return  this.clearwarnings(function () {
                    if(/^\s+$/.test(_this.applyreson) || _this.applyreson == ''||typeof(_this.applyreson)=="undefined")
                    {
                      _this.applyresonWarnings=['申请理由是必填项'];
                      return false;
                    }else if(_this.applyreson.length>120){
                      _this.applyresonWarnings=['字符长度不能超过120'];
                       return false;
                    }

                    if(_this.timesize!= '')
                    {
                        if(!/^\d+$/.test(_this.timesize)) {
                            _this.timesizeWarnings=['申请时限只能为天数']; return false}
                    }
                    let haschoose = false;

                   _this.data.columnList.forEach((m)=>{
                       if(!m.hasauth&&m.authorized) haschoose = true;
                    });

                    if(!haschoose)
                    {
                        _this.showwaringNochoose =true;
                        return false;
                    }

                   var intarray = [];
                   _this.data.columnList.forEach((mm)=>{
                       if(!mm.hasauth&&mm.authorized){
                       intarray.push(mm.columnInfoId);
                       mm.hasauth=true;
                   }
                   });

                   _this.data.columnList.unshift({});
                   _this.data.columnList.shift();
                   _this.applydata ={
                       "tableInfoId":_this.tableId,
                       "duration":_this.timesize,
                       "reason":_this.applyreson,
                       "columnList" : intarray
                   };

                   _.ajax({
                       url:'/api/metadatamanagement/querypowerapply',
                       method:'POST',
                       data:{
                           objectval:JSON.stringify(_this.applydata)
                       },
                       success:function(res){
                           if(res.code =='0')
                           {
                               Toast({
                                   message: '提交成功！'
                               });
                           }else {
                               Toast({
                                   message: '提交失败！'
                               });
                           }
                       },
                       error:function (err) {
                           Toast({
                               message: '提交失败！'
                           });
                       }
                   })

                    return true;
                });
            }
            ,clearwarnings(callback){
                this.applyresonWarnings=null;
                this.timesizeWarnings=null;
                this.showwaringNochoose =false;
                if(Object.prototype.toString.call(callback)=== '[object Function]')
                {
                 return  callback&&callback();
                }
            },checkboxchange()
            {
                this.showwaringNochoose =false;

                this.$nextTick(function () {
                    let haschoose = 0;
                    let haschoosecount = 0;
                    this.data.columnList.forEach(m=>{
                        if(!m.hasauth&&m.authorized){
                        haschoose +=1;
                    }
                    if(!m.hasauth){
                        haschoosecount+=1
                    }
                });


                    if(haschoose==haschoosecount){
                        this.checkAll =true;
                    }
                    else{
                        this.checkAll =false;
                    }
                })

            },
            changecheckAll(){
                if(!this.checkAll){
                    this.data.columnList.forEach(m=>{
                        if(!m.hasauth){
                        m.authorized =true;
                    }

                    });
                }
                else{
                    this.data.columnList.forEach(m=>{
                        if(!m.hasauth){
                        m.authorized =false;}
                });
                }
            }
        }
    }
</script>
