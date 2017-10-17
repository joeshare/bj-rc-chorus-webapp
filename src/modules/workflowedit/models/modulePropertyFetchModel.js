/**
 * Author LLJ
 * Date 2016-4-26 9:42
 */
import fetchAgent from  '../utils/fetchAgent.js';
const TYPE_MAPS='Maps';
const TYPE_DROPDOWN='DropDown';
class model {
    constructor() {
        this.modulePropertyMap={};
    }
    get modulePropertyMap() {
        return this._modulePropertyMap;
    }
    set modulePropertyMap(o) {
        this._modulePropertyMap = o;
    }
    get vm(){
        return this._vm;
    }
    set vm(v){
        this._vm=v;
    }
    setVM(vm){
        this.vm=vm;
    }
    isArray(o){
        return Object.prototype.toString.call(o)=='[object Array]';
    }
    getURL(url,data,elementName,type) {
        const _this=this;
        return new Promise(function (resolve, reject) {

            fetchAgent.sourcesFetch(url,data,"POST",(res )=>{
                let result=[];
                if(res&&res.code*1==0&&_this.isArray(res.data)){
                    result=res.data;
                }
                resolve({name:elementName,data:result,code:0,type})
            })
        });
    }
    getOptByName(name){
        let moduleProperty=this.currentModuleData;
        let res=null;
        if(moduleProperty&&moduleProperty.options){
            for(let opt of moduleProperty.options){
                if(opt.name==name){
                    res=opt;
                    break;
                }
            }
        }
        return res;
    }
    getValueByName(name){
        if(!name){ return; }
        let value='';
        let opt=this.getOptByName(name);
        opt&&( value=opt.value);
        return value;

    }
    getOptionsObjByValue(options,value){
        let obj=null;
        if(this.isArray(options)){
            for(let o of options){
                if(`${o.value}`==`${value}`){
                    obj=Object.assign({},o);
                    break;
                }
            }
        }
        return obj;
    }
    //元素控制
    propertyControlHandler(opt,controlCb){
        let control=opt.action.CONTROL;
        let conMap=control[opt.value];
        if(conMap){
            for(let controlType in conMap){
                controlCb&&controlCb(controlType,conMap[controlType]);
            }
        }

    }
    //广播操作
    propertyBroadcastHandler(opt,moduleName,broadcastCb){
        //"BROADCAST":["externalResourceB"],//通知子级
        let broadcast=opt.action.BROADCAST;
        for(let bcName of broadcast){
            let tarElement=this.getOptByName(bcName);
                if(!tarElement) return;
                let moduleObj=this.modulePropertyMap[moduleName];
                if(!moduleObj) return;
                let mapFetch=moduleObj['mapFetch'];
                if(!mapFetch) return;
                if(tarElement.pageElement==TYPE_DROPDOWN){
                    let fetchFun=mapFetch[bcName];
                    fetchFun&&this.sequenceTasks([fetchFun]).then(function (value) {
                        broadcastCb&&broadcastCb(value)
                    }).catch(function(value){
                        broadcastCb&&broadcastCb(value)
                    });
                }else if(tarElement.pageElement=='MultiPairTable'||tarElement.pageElement=='MultiPairInputText'){
                    let fetchFun1=mapFetch[`${bcName}0`];
                    let fetchFun2=mapFetch[`${bcName}1`];
                    //注意：fetchFun2  可能为空，这里不用判断fetchFun1，fetchFun2是否有内容
                    //直接使用，不会有问题，如果判断就会有问题
                    console.log('fetchFun1',fetchFun1,fetchFun2)
                        this.sequenceTasks([fetchFun1,fetchFun2]).then(function (value) {
                            broadcastCb&&broadcastCb(value)
                        }).catch(function(value){
                            broadcastCb&&broadcastCb(value)
                        });

                }

        }
    }
    //赋值操作
    propertyAssignHandler(opt,setPropertyDataFun){
        /**
        "ASSIGN":{//赋值操作
            "valAValue":"valA"//将数据源返回数据中的valA值赋予valAValue
        },
        */
        let assign=opt.action.ASSIGN;
        for(let elementName in assign){
            let tarElement=this.getOptByName(elementName);
            if(tarElement){
                let tarName=assign[tarElement.name];
                let valObj=this.getOptionsObjByValue(opt.options,opt.value);
                valObj&&valObj[tarName]&&setPropertyDataFun&&setPropertyDataFun(valObj[tarName],elementName)
            }
        }

    }
    //联动handler
    propertyActionHandler(elementName,moduleName,assignCb,broadcastCb,controlCb){

       /* console.log('--------------------handler',elementName)
        console.log('--------------------handler',moduleName)
        console.log('--------------------handler',assignCb)
        console.log('--------------------handler',broadcastCb)
        console.log('--------------------handler',controlCb)*/

        let opt=this.getOptByName(elementName)
        if(opt&&opt.action){
                opt.action.ASSIGN&&this.propertyAssignHandler(opt,assignCb);
                opt.action.BROADCAST&&this.propertyBroadcastHandler(opt,moduleName,broadcastCb);
                opt.action.CONTROL&&this.propertyControlHandler(opt,controlCb);
        }
    }
    setCurrentModuleData(data){
        this.currentModuleData=data;
    }
    setModulePropertyData(obj){
        this.modulePropertyMap[obj.moduleName]=obj;
        let fetchArr=[];
        let mapFetch={};
        for(let opt of obj.options){
            let fetchFun=function(element,moduleName,source,type){
                let url='/api/taskdevelopment/getsourcedata';
                let server=source.server;
                let data={__url:source.url,server};
                let tmpData={};
                if(source&&source.param){

                    for(let k in source.param){
                        let name= source.param[k];
                        let v=this.getValueByName(name);
                        if(v){ tmpData[k]=v;}

                    }
                    data=Object.assign({},data,tmpData)
                }
                return this.getURL(url,data,element.name,type);
            }
            //下拉框形式
            if(opt.pageElement==TYPE_DROPDOWN){
                let fun=fetchFun.bind(this,opt,obj.moduleName,opt.source,TYPE_DROPDOWN)
                mapFetch[opt.name]=fun;
                fetchArr.push(fun)
                //有映射关系table 形式
            }else if(opt.pageElement=='MultiPairTable'||opt.pageElement=='MultiPairInputText'){

                for(let i=0,len=opt.sources.length;i<len;i++){
                        let fun=fetchFun.bind(this,opt,obj.moduleName,opt.sources[i],i==0?TYPE_MAPS:TYPE_DROPDOWN)
                        mapFetch[`${opt.name}${i}`]=fun;
                        fetchArr.push(fun)
                }
            }
        }
        this.modulePropertyMap[obj.moduleName]['fetchArr']=fetchArr;
        this.modulePropertyMap[obj.moduleName]['mapFetch']=mapFetch;
    }
    clone(d){
        return JSON.parse(JSON.stringify(d));
    }
    getDefaultSelectValue(opt){
        let isInclude=false;
        for(let o of opt.options){
            if(o.value==opt.value){
                isInclude=true;
                break;
            }
        }
        return isInclude?opt.value:( opt.options.length>0? opt.options[0].value:"");
    }
    //设置下拉框option 数据
    setModulePropertySourceData(modulePropertyData,moduleName,sources){
        let moduleProperty=this.clone(modulePropertyData);
        if(moduleProperty&&moduleProperty.options&&sources){
            for(let source of sources){
                for(let opt of moduleProperty.options){
                    if(opt.name==source.name){
                        try{
                            if(opt.pageElement==TYPE_DROPDOWN){
                                opt.options=this.transformSelectData(moduleName,source.name,source.data);
                                opt.value=this.getDefaultSelectValue(opt);
                            }else if(opt.pageElement=='MultiPairTable'||opt.pageElement=='MultiPairInputText'){
                                if(source.type==TYPE_MAPS){
                                    opt.maps=this.transformMapsData(moduleName,source.name,source.data)
                                    opt.tableKeyOptions=this.transformSelectData(moduleName,source.name,source.data,0);
                                    opt.sizeMax= source.data&&source.data.length?source.data.length:opt.maps.length;
                                }else if(source.type==TYPE_DROPDOWN){
                                    opt.options=this.transformSelectData(moduleName,source.name,source.data,1);
                                }
                            }
                        }catch (e){ console.log(e)}

                        break;
                    }
                }
            }
        }
        return moduleProperty;
    }

    //新的数组是否包含原数组(只比对keyName)
    isMapsDataInClude(originalMaps,newMaps){
        if(!originalMaps||originalMaps.length>newMaps.length){
            return false;
        }
        var isInclude=true;
        for(let o of originalMaps){
            let isKeySame=false;
            for(let n of newMaps){
                if(n.keyName==o.keyName){
                    isKeySame=true;
                    break;
                }
            }
            if(!isKeySame){
                isInclude=isKeySame;
                break;
            }
        }
        return isInclude;

    }
    suorceData2MapData(opt,data){
        let [arr,metaData]=[[],null];
        if(opt.source){
            metaData=opt.source.metaData
        }else{
            metaData=opt.sources[0].metaData
        }
        data&&data.length&&data.forEach(d=>{
            let keyName=d[metaData.displayValue];
            let keyValue="";
            let original=true;
            arr.push({keyName,keyValue,original})
        })
        return arr;
    }
    transformMapsData(moduleName,elementName,data){
        let arr=[];
        for(let opt of this.modulePropertyMap[moduleName].options){
            if(opt.name==elementName){
                //如果有数据就不原来的数据
                let newMaps=this.suorceData2MapData(opt,data);
                try{
                    if(this.isMapsDataInClude(opt.maps,newMaps)){
                        opt.maps.forEach(o=>{o.original=true;})
                        arr=this.clone(opt.maps)
                        break;
                    }
                }catch (e){

                }
                arr=newMaps;
                break;
            }
        }
        return arr;
    }
    /**
     *
     * @param moduleName 模块名称
     * @param elementName 元素名称
     * @param data 数据
     * @returns {Array}
     */
    transformSelectData(moduleName,elementName,data,sourceIndex){
        /**
         * 转换规则
         "metaData":{//表示返回数据的元信息
              	"name":"valA",//可以不要
                "value":"valB",//实际的取值，valB代表数据源api返回数据中的key
                "displayValue":"valC" //显示的值，valC代表数据源api返回数据中的key
              }
         */
        let arr=[];
        for(let opt of this.modulePropertyMap[moduleName].options){
            if(opt.name==elementName){
                let metaData=null;
                if(opt.pageElemt==TYPE_DROPDOWN){
                    metaData=opt.source.metaData;
                }else{
                    if(opt.source){
                        metaData=opt.source.metaData;
                    }else{
                        metaData=opt.sources[sourceIndex]?opt.sources[sourceIndex].metaData:null;
                    }
                }
                data&&data.length&&metaData&&data.forEach(d=>{
                    let value=`${d[metaData.value]}`;
                    let text=d[metaData.displayValue];
                    arr.push(Object.assign({value,text },d))
                })
                break;
            }
        }

        return arr;
    }
    //任务队列
    sequenceTasks(tasks) {
        function recordValue(results, value) {
            results.push(value);
            return results;
        }
        var pushValue = recordValue.bind(null, []);
        return tasks.reduce(function (promise, task) {
            return promise.then(task).then(pushValue);
        }, Promise.resolve());
    }
    //设置请求参数
    setFetchParam(){

    }
    //按顺序请求Source
    fetchSequenceModulePropertySource(moduleName,success,error){
        this.sequenceTasks(this.modulePropertyMap[moduleName]['fetchArr']).then(function (value) {
            success&&success(value);
        }).catch(function(value){
            error&&error(value);
        });
    }

}
export default new model();
