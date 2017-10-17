/**
 * Created by AnThen on 2017-4-14.
 */
import AdminInput from 'adminUI/components/admin-input.vue';
import adSelect from 'adminUI/components/admin-select.vue';
import adSelectAsync from '../../../../admin-ui-extend/components/admin-select-async.vue';
import Variable from '../variable/index.vue';
import dataUtils from '../../utils/dataUtils.js';
import ModulePropertyFetchModel from '../../models/modulePropertyFetchModel.js';
import Mock from '../../mock.js';

const TYPE_MAPS='Maps';
const TYPE_DROPDOWN='DropDown';
function compareProperty(propertyName) {
    
        return function (object1, object2) {
            var value1 = object1[propertyName];
            var value2 = object2[propertyName];
            if (value1 < value2) {
                return -1;
            } else if (value1 > value2) {
                return 1;
            } else {
                return 0;
            }
        };
    }
/**
 *模块通用页面后端设计 wiki
 * http://wiki.dataengine.com/pages/viewpage.action?pageId=13246985
 */
export default {
    components: {
        AdminInput,
        adSelect,
        adSelectAsync,
        Variable
    },

    props: ['propertyData','editable','workflowType'],
    watch: {
        propertyData (v) {
            this.modulePropertyData = this.transformerDisplayData(this.propertyData);
            ModulePropertyFetchModel.setCurrentModuleData(this.modulePropertyData)
            this.initvarables();
            if(this.modulePropertyData&&this.modulePropertyData.moduleName){
                this.moduleName=v.moduleName;
            }
            this.modulePropertyData&&this.initGroup(this.modulePropertyData)
        },
        editable (v) {
            this.isEditable=this.editable;
        },
        moduleName(v){
            this.moduleName=v;
        }
    },
    data () {
        let _this=this;
        return {
            groupData:[],
            // 1.RETRY（重试），默认值，相当于任务失败，走重试逻辑。 2.TIME_OUT_WF（工作流超时）
            timeoutPolicyOptions:[{value:"RETRY",text:"重试"},{value:"TIME_OUT_WF",text:"工作流超时"}],
            modulePropertyData:this.transformerDisplayData(this.propertyData),
            moduleNodeTaskData:{},
            isEditable:true,
            variableslist:[],
            moduleName:'',
            hastigger:false
        }
    },
    created(){
       //this.initvarables();
        //this.modulePropertyData.variables =[];
    },
    mounted(){


        this.isEditable=this.editable;//variable
        let _this=this;
        this.initvarables();

        //this.inputEventvar('','')
        /*setTimeout(function () {
            _this.inputEventvar('','');
        },2000);*/

        //this.initvarables();
    },
    methods: {
        clone(data){
            return JSON.parse(JSON.stringify(data))
        },
        initGroup(modulePropertyData){
           var cloneGroupData=[],cloneGroupMaps={};
           _.isArray(modulePropertyData.options)&&modulePropertyData.options.forEach(opt=>{
              if(!cloneGroupMaps[opt.group]){
                cloneGroupMaps[opt.group]={};
                cloneGroupMaps[opt.group]['name']=opt.groupDesc;
                cloneGroupMaps[opt.group]['id']=opt.group;
                cloneGroupMaps[opt.group]['children']=[];
                cloneGroupMaps[opt.group]['children'].push(opt)
              }else{
                cloneGroupMaps[opt.group]['children'].push(opt)
              }
           })
           //group:"2"groupDesc:"目标表"hidden
           for(let groupId in cloneGroupMaps){
             cloneGroupData.push(cloneGroupMaps[groupId]);
           }
           cloneGroupData.sort(compareProperty('group'));
           this.groupData=cloneGroupData;
        },
        initvarables(){
            var sVarables="";
            var oVarables=[];
            let omodeul =this.modulePropertyData;
            let _this=this;
            if(omodeul&&omodeul.options&&omodeul.options.length>0){
                omodeul.options.forEach((m)=>{
                    if(m&&m.variable&&m.variable.length>0){
                        let liVar = JSON.parse(m.variable);
                        liVar.forEach((ms)=>{
                            let sValue ='';
                            if(omodeul.variables) {
                                let objvariables ={}
                                if(typeof omodeul.variables=='string')
                                {
                                    objvariables= JSON.parse(omodeul.variables);
                                }
                                else {
                                    objvariables=omodeul.variables;
                                }
                                for(let mkey in objvariables)
                                {
                                       if(ms.name==mkey){
                                           sValue=objvariables[mkey]
                                       }
                                }
                            }
                            oVarables.push({key:ms.name,value:sValue});
                        })
                    }
                })
            }
            let sVarablesObj={};
            let jsonvar=JSON.parse(`{${sVarables}}`);
            if(jsonvar&&this.modulePropertyData){
                this.variableslist=oVarables;

                this.variableslist.forEach((ms)=>{
                    ////ms.value=_this.variablesMatch(ms.value)
                    sVarablesObj[ms.key]=ms.value
                    //sVarables=sVarables?sVarables+`,"${ms.key}":"${ms.value}"`:sVarables+`"${ms.key}":"${ms.value}"`;
                })
                //let modifyData=JSON.parse(`{${sVarables}}`);
                omodeul.variables =sVarablesObj;
            }

        },
        pageElement2Type(type){
            return type.toLowerCase();
        },
        variablesMatch(value){
            let str="";
            str=value.replace(/\*"/g,'\\"');
            str=value.replace(/\*{/g,'\{');
            str=value.replace(/\*}}/g,'\}');
            return str;
        },

        transformerDisplayData(propertyData){
            if(propertyData&&propertyData.options&&propertyData.options.length){
                propertyData.options.forEach(entry=>{
                    //console.log('entry.name',entry.name)
                    if(entry.name=='hdfsFileFolderPath'){
                        var tmpStr=entry.value;
                       // console.log('this.getHdfsFileFolderPathPrefix()',this.getHdfsFileFolderPathPrefix())
                        var index=tmpStr.indexOf(this.getHdfsFileFolderPathPrefix())>-1?this.getHdfsFileFolderPathPrefix().length:0;

                        entry.value=entry.value.substring(index);
                       // console.log('entry.value',entry.value)
                    }
                })
            }
            return propertyData;
        },
        getHdfsFileFolderPathPrefix(){
            return `/chorus/project/${_.currentProjectCode.get()}`
        },
        displayLabelText(entry){
            if(entry.name=='hdfsFileFolderPath'){
                //return entry.notNull?`${entry.name} (必填项,系统会自动添加前缀${this.getHdfsFileFolderPathPrefix()})`:entry.name;
               return entry.notNull?`${entry.label} (必填项,系统会自动添加前缀${this.getHdfsFileFolderPathPrefix()})`:entry.label;
            }else{
               // return entry.notNull?entry.name+" (必填项)":entry.name;
                return entry.notNull?entry.label+" (必填项)":entry.label;
            }

        },
        displaySelectValue(v){
            return v?`${v}`:"";
        },
        displayOptions(options){
            if(!_.isArray(options)){
                return [];
            }else{
                options.forEach(o=>{o.value+=""})
            }
            return options
        },
        //是否有变量
        hasVariable(entry){
           return !!entry.variable;
        },
        validateRule(arg,name){
            arg.retryCountWarnings=null;
            arg.timeoutSecondsWarnings=null;
            if(name=="retryCount"){
                var v=$.trim(arg.retryCount);
               // console.log(v,name)
                if(v*1!=0){
                    if(!/^\+?[1-9][0-9]*$/.test(v)){
                        arg.retryCountWarnings=["必须是正整数，建议值是3"];
                    }
                }
            }
            if(name=="timeoutSeconds"){
                var v=$.trim(arg.timeoutSeconds);
                if(v*1!=0){
                    if(!/^\+?[1-9][0-9]*$/.test(v)){
                        arg.timeoutSecondsWarnings=["必须是正整数，建议值是3600"];
                    }
                }
            }
       },
        //增加MultiPairTable 数据
        addMapTableRec(name){
            this.$emit('add-multipairtable-map', this.modulePropertyData.nodePrefix,name)
        },
        removeMapTableRec(name,i){
            this.$emit('remove-multipairtable-map', this.modulePropertyData.nodePrefix,name,i)
        },
        //增加MultiPairInputText 数据
        addMapRec(name){
            this.$emit('add-multipair-map', this.modulePropertyData.nodePrefix,name)
        },
        removeMapRec(name,i){
            this.$emit('remove-multipair-map', this.modulePropertyData.nodePrefix,name,i)
        },
        transformOptionList(arr){
            if(!_.isArray(arr)){
                return [];
            }
            arr.forEach((rec)=>{
                rec.text=rec.name;
                rec.value+="";
            })
            return arr;
        },
        modifyPropertyMapsData(arg,name){
            var modifyData=null;
            let {maps,tableKeyOptions,sizeMax}=arg;
            this.modulePropertyData.options.every((r,i)=>{
                if(r.name==name){
                    r.maps=maps;
                    r.tableKeyOptions=tableKeyOptions;
                    r['sizeMax']=sizeMax;
                    modifyData=r;
                    return false;
                }
                return true;
            })
            var nodePrefix=this.modulePropertyData.nodePrefix;
            this.emitModifyPropertyData({name,modifyData,nodePrefix})
        },
        modifyPropertyOptionsData(options,name){
            var modifyData=null;
            this.modulePropertyData.options.every((r,i)=>{
                if(r.name==name){
                    r.options=options;
                    modifyData=r;
                    return false;
                }
                return true;
            })
            var nodePrefix=this.modulePropertyData.nodePrefix;
            this.emitModifyPropertyData({name,modifyData,nodePrefix})

        },
        modifyPropertyHiddenData(controlType,name){
            var modifyData=null;
            this.modulePropertyData.options.every((r,i)=>{
                if(r.name==name){
                    r.hidden=controlType=='hidden';
                    modifyData=r;
                    return false;
                }
                return true;
            })
            //console.log('modifyPropertyHiddenData',modifyData)
            var nodePrefix=this.modulePropertyData.nodePrefix;
            //console.log('modifyPropertyHiddenData',name,modifyData,nodePrefix)
            this.emitModifyPropertyData({name,modifyData,nodePrefix})
        },
        modifyPropertyData(v,name){
            var modifyData=null;
            this.modulePropertyData.options.every((r,i)=>{
                if(r.name==name){
                    r.value=$.trim(v)
                    modifyData=r;
                    return false;
                }
                return true;
            })
            var nodePrefix=this.modulePropertyData.nodePrefix;
            this.emitModifyPropertyData({name,modifyData,nodePrefix})

        },
        getDefaultSelectValue(options,name){
            let isInclude=false,el=null,v="";
            for(let element of this.modulePropertyData.options){
                if(element.name==name){
                    el=element;
                    v=element.value;
                    break;
                }
            }
            if(el){
                for(let o of el.options){
                    if(o.value==v){
                        isInclude=true;
                        break;
                    }
                }
            }
            return isInclude?v:(options.length>0?options[0].value:"");
        },
        propertyControlHandler(controlType,names){
            if(names&&names.length>0){
                names.forEach(function(name){
                    this.modifyPropertyHiddenData(controlType,name);
                }.bind(this))
            }
        },
        propertyBroadcastHandler(arr){
            if(arr&&arr.length>0&&arr[0].code==0){
                for(let source of arr){
                    if(source.type==TYPE_DROPDOWN){
                        try{
                            console.log(this.modulePropertyData)
                            //TODO::
                            //当模块加载没有完成是点上线会报空指针 下个迭代修改
                            let options=ModulePropertyFetchModel.transformSelectData(this.modulePropertyData.moduleName,source.name,source.data,1);
                            this.modifyPropertyOptionsData(options,source.name);
                            this.modifyPropertyData(this.getDefaultSelectValue(options,source.name),source.name);
                        }catch (e){
                            console.log("error",e)
                        }

                    }else if(source.type==TYPE_MAPS){
                        let [maps,tableKeyOptions,sizeMax]=[null,null,0];
                        try{

                            maps=ModulePropertyFetchModel.transformMapsData(this.modulePropertyData.moduleName,source.name,source.data,0)

                            tableKeyOptions=ModulePropertyFetchModel.transformSelectData(this.modulePropertyData.moduleName,source.name,source.data,1);
                            sizeMax=source.data&&source.data.length?source.data.length:maps.length;


                            maps.forEach(m=>{
                                tableKeyOptions.forEach(im=>{
                                    if(im.value.toLocaleLowerCase() == m.keyName.toLocaleLowerCase()){
                                        m.keyValue = im.value;
                                    }
                                })

                            })
                        }catch (e){
                            console.log("error",e)
                        }

                        this.modifyPropertyMapsData({maps,tableKeyOptions,sizeMax},source.name);
                    }
                }
            }
        },
        propertyAssignHandler(v,name){
           this.modifyPropertyData(v,name)

        },
        selectEvent(v,name){
            this.modifyPropertyData(v,name);
            try{
            ModulePropertyFetchModel.propertyActionHandler(name,
                this.modulePropertyData.moduleName,
                    this.propertyAssignHandler.bind(this),
                    this.propertyBroadcastHandler.bind(this),
                    this.propertyControlHandler.bind(this)
            )
            }catch (e){
                console.log(e)
            }
        },
        paramsInputEvent(v,name){
            var _this=this;
            var paramsName=name;
            var paramsValue=$.trim(v);
            var nodePrefix=this.modulePropertyData.nodePrefix;
            this.validateRule(this.modulePropertyData,name)
            _this.$emit('modify-params-data',{paramsName,paramsValue,nodePrefix});
        },
        inputEvent(v,name){
            dataUtils.validateModuleOptions(this.modulePropertyData,name)
            this.modifyPropertyData($.trim(v),name)
            ModulePropertyFetchModel.propertyActionHandler(name,
                this.modulePropertyData.moduleName,
                this.propertyAssignHandler.bind(this),
                this.propertyBroadcastHandler.bind(this),
                this.propertyControlHandler.bind(this)
            )
        },
        inputEventvar(v,name)
        {
            var sVarables="",_this=this;
            let modifyData={};

            this.variableslist.forEach((ms)=>{
                if(ms.key==v)
                {
                    ms.value=name;
                }
                //ms.value=_this.variablesMatch(ms.value)
                //sVarables=sVarables?sVarables+`,"${ms.key}":"${ms.value}"`:sVarables+`"${ms.key}":"${ms.value}"`;
                modifyData[ms.key]=ms.value;
            })

            //let modifyData=JSON.parse(`{${sVarables}}`);

            //let modifyData=sVarablesObj;
            var nodePrefix=this.modulePropertyData.nodePrefix;
            name = 'variables';
            this.emitModifyPropertyData({name,modifyData,nodePrefix})
        },
        emitModifyPropertyData(arg){
            this.$emit('modify-property-data',arg);
        }
    }

}