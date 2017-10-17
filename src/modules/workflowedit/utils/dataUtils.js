/**
 * Created by AnThen on 2017-4-10.
 */
/**
 * Created by AnThen on 2017-3-6.
 */
    import {numberLong} from 'Utils/regex';
const BATCH="2";
//分支之间是否有联系
var isForkTasksRelate=false;
var statusMap={
    "UNDEPLOY":'线下',
    "DEPLOY":'线上',
    "DELETE":'删除'
};
var jobTypeMap={
    "1":'实时',
    2:'定期'
};
function result2Table(data) {
    data.forEach((r,i)=>{
          r['statusText']= statusMap[r.status];
          r['jobTypeText']= jobTypeMap[r.jobType];
    })
    return data;
}
//调度类型
var scheduleTypeOptions=[{
    value:1,
    text:"一次性"
},{ value:2,
    text:"周期"}]
function status2Text(v){
   return  statusMap[v];
}
/*
 冷阳 2017-4-10 10:55:01
 //----批处理---
 1、默认JOB
 2、用户自定义批处理
 //---流式---
 3:默认Stream source
 4:用户自定义Stream source
 5:默认Stream processor
 6:用自定义Stream processor
 7:默认Stream sink
 8:用户自定义Stream sink
 ---------------------
 3,4应该代表输入
 5,6代表处理
 7,8代表输出
 */
function xdModules2showData(d){
    //{"moduleId":"xxxxxx","moduleType":"3","moduleName":"source3","xdModuleTypeName":"xxxxxx","moduleAliasName":"xxxxxx"}
    //处理类
    var dealTypeArr=[] ,//流式
        //批处理
        batchDealTypeArr=[] ,
        //出入类
        inputTypeArr=[],
        //输出类
        outputTypeArr=[],
        //流程类
        flowTypeArr=[
            {"moduleId":"fork","moduleType":"fork","moduleName":"Fork",icon:'ion-merge',moduleAliasName:"Fork"},
            {"moduleId":"join","moduleType":"join","moduleName":"Join",icon:'ion-network',moduleAliasName:"Join"}
        ];
    var types=[];
    //3,4应该代表输入
    //5,6代表处理
    //7,8代表输出
    types[1]=batchDealTypeArr;
    types[2]=batchDealTypeArr;
    types[3]=inputTypeArr;
    types[4]=inputTypeArr;
    types[5]=dealTypeArr;
    types[6]=dealTypeArr;
    types[7]=outputTypeArr;
    types[8]=outputTypeArr;
  d.forEach((rec,i)=>{
      if(types[rec.moduleType*1]){
          types[rec.moduleType*1].push(rec)
      }

  })
    return {
        dealTypeArr,
        inputTypeArr,
        outputTypeArr,
        flowTypeArr,
        batchDealTypeArr
    };
}
/**
 * 根据模块类型获取任务类型
 * @param moduleType
 */
function getTaskType(moduleType){
    var taskTypeMaps={
        '1':'SIMPLE',
        '2':'SIMPLE',
        '3':'SIMPLE',
        '4':'SIMPLE',
        '5':'SIMPLE',
        '6':'SIMPLE',
        '7':'SIMPLE',
        '8':'SIMPLE',
        'decition':'DECITION',
        'fork':'FORK',
        'join':'JOIN'
    };
    return taskTypeMaps[moduleType+""];
    //3,4应该代表输入
    //5,6代表处理
    //7,8代表输出
    //任务类型，用户自定义的需要远程执行的任务为SIMPLE，其他系统任务暂定为DECITION（决定任务），FORK（并行任务），JOIN（并行后再串行）等，系统任务需要其他参数支
}
/**
 *
 * @param moduleType
 * @returns {boolean}
 */
function isShowModuleProperty(moduleType){
   return (moduleType=='fork'||moduleType=='join'||moduleType=='start'||moduleType=='end')?false:true;
}
/**
 * 获取PropertyData
 * @param task
 * @returns {{moduleId: string, moduleType: *, moduleName: (string|moduleName|opt.roundedRect.moduleName|ar.moduleName|propertyData.moduleName|.data.nodeTaskData.workerParams.moduleName|*), xdModuleTypeName: string, moduleAliasName: string}}
 */
function getModuleDataByTask(task){
    return {"moduleId":"","moduleType":task.moduleType,"moduleName":task.moduleName,"xdModuleTypeName":"","moduleAliasName":""};
}
/**
 * 获取PropertyData
 * @param dsl
 * @param taskList
 * @returns {{moduleName: (string|moduleName|opt.roundedRect.moduleName|ar.moduleName|propertyData.moduleName|.data.nodeTaskData.workerParams.moduleName|*), moduleType: *, taskReferenceNameWarnings: null, timeoutPolicy: string, hiddenTaskParams: boolean, isShowModuleProperty: *, options: Array}}
 */
function getPropertyData(dsl,taskList){
    //var dsl=task.taskDSL?JSON.parse(task.taskDSL):null;
    var propertyData={};
    if(dsl.type=="FORK"||dsl.type=="JOIN"||dsl.type=="START"||dsl.type=="END"){
        var type=dsl.type.toLowerCase();

        propertyData={
            moduleName:type,
            moduleType:type ,
            taskId:dsl.taskId||"",
            taskReferenceNameWarnings:null,
            hiddenTaskParams:false,
            isShowModuleProperty:isShowModuleProperty(type),
            options:[],
            "retryCount":"",
            "timeoutSeconds":"",
            "timeoutPolicy":"",
            taskType:dsl.type,
            nodePrefix:dsl.name,
            taskDSL:{},
            taskReferenceName:dsl.taskReferenceName||type
        };
    }else{
        for(var i=0,len=taskList.length;i<len;i++){
            var task= taskList[i];

            if(dsl.name==task.taskName){
                propertyData={
                    moduleName:task.moduleName,
                    moduleType:task.moduleType ,
                    taskId:task.taskId ,
                    taskReferenceNameWarnings:null,
                    hiddenTaskParams:false,
                    isShowModuleProperty:isShowModuleProperty(task.moduleType),
                    options:[],
                    "retryCount":task.taskDSL.retryCount,
                    "timeoutSeconds":task.taskDSL.timeoutSeconds,
                    "timeoutPolicy":task.taskDSL.timeoutPolicy,
                    taskType:dsl.type,
                    nodePrefix:dsl.name,
                    taskDSL:task.taskDSL,
                    taskReferenceName:dsl.taskReferenceName,
                    variables:task.variable
                };
                break;
            }
        }
    }
    return propertyData;
}
/**
 * 设置2维数forkTasks 数组
 * @param forkTasks
 * @param path 层级
 * @param positionArr
 * @returns {*[]}
 */
function iteraterTwoDimensionForkTasks(forkTasks,path,positionArr){
    for(var i=0,len=forkTasks.length;i<len;i++){
        var subForkTasks=forkTasks[i];
        //setPositionArr(subForkTasks,path,positionArr)
        //return;
        for(var m=0,num=forkTasks[i].length;m<num;m++){

            var dsl=subForkTasks[m];
            var nextDsl=subForkTasks[m+1];
            if(nextDsl){
                //加入连线的结束点
                dsl.edgeData=[nextDsl.name];
            }
            if(dsl.type=="FORK"){
                setSimpleTypeDSL(dsl,path+m,positionArr);
               // setSimpleTypeDSL(dsl,path+m,positionArr);
                dsl.edgeData=[];
                for(var n=0,t=dsl.forkTasks.length;n<t;n++){
                    var grandsonForkTasks= dsl.forkTasks[n];
                    //加入连线的结束点 数组的第一个放入到fork 的edgeData中
                    dsl.edgeData.push(grandsonForkTasks[0].name);
                    //加入连线的结束点 数组的最后 的edgeData放入join 点
                    grandsonForkTasks[grandsonForkTasks.length-1].edgeData=[nextDsl.name];
                }

                var _tmp=path+m+1;
                positionArr[_tmp]=[];
                iteraterTwoDimensionForkTasks(dsl.forkTasks,_tmp,positionArr)
            }else if(dsl.type=="SIMPLE"){
               setSimpleTypeDSL(dsl,path+m,positionArr);
            }else if(dsl.type=="JOIN"){
                var _tmpPath=path+m;
                while(positionArr[_tmpPath]){
                    _tmpPath++;
                }
                setSimpleTypeDSL(dsl,_tmpPath,positionArr);
            }


        }
    }
    return path;
}
/**
 * 在二维坐标数组中设置 simple dsl
 * @param dsl
 * @param path
 * @param positionArr
 */
function setSimpleTypeDSL(dsl,path,positionArr){
    if(!positionArr[path]){
        positionArr[path]=[];
    }
    positionArr[path].push(dsl)
}
/**
 * 计算坐标
 * @param arg
 * @returns {{}}
 */
function calculatePost(arg){
    var x=0;
    if(arg.parent._columnTotal){
        var edgeData=arg.parent.edgeData;
        var parentChildren=edgeData.length;
        var parentWitdth=arg.totalWidth/(arg.parent._columnTotal);
        var columnChild=parentWitdth/(parentChildren+1);
        var ranX=arg.parent._position.x-parentWitdth/2;
        var columIndex=edgeData.indexOf(arg.id);
        x=ranX+columnChild*(columIndex+1);
    }
    return {x};
}
function getParentBy2DArr(child,parents){
    var pArr=[];
    var res={};
    parents.every((subArr,i)=>{
        return subArr.every((p,m)=>{
            if(p.edgeData.indexOf(child.name)>-1){
               var parent=$.extend({},p);
                parent._column=m;
                parent._columnTotal=subArr.length;
                parent._rowTotal=parents.length;
                parent._path=i;
                pArr.push(parent)
                return true;
            }
            return true;
        });
    });
    var _m=0,num=pArr.length;
    if(num % 2){//奇数
        _m=num+1;
    }else{
        _m=num;
    }
    res=pArr[_m/2-1];
    return res;
}
/**
 * 设置坐标
 * @param positionArr 二维数组
 * @param totalWidth 画布宽度
 * @param totalHeight 画布高度
 */
function setNodePositionByTwoDimension(positionArr,totalWidth,totalHeight,workflowType){
    var minCellSpace=120,minRowSpace=35;
   for(var m=0,maxRow=positionArr.length;m<maxRow;m++){
       var subPosArr=positionArr[m];
       for(var n=0,maxColumn=subPosArr.length;n<maxColumn;n++){
           var son=subPosArr[n];
           if(!son){ continue; }
           var _totalWidth=totalWidth;
           var pos={x:0,y:0};
           var parent={};
           var _offsetx=0;
           parent=getParentBy2DArr(son,positionArr);
           if(son.name=="start") {
               parent={
                   _position:{x:totalWidth/2-60,y:0},
                   edgeData:['start'],
                   _column:0,
                   _columnTotal:1,
                   _rowTotal:1,
                   _path:-1
               };
           }
           if((workflowType+"")!=BATCH&&m==0&&n==0){
               parent={
                   _position:{x:totalWidth/2-60,y:0},
                   edgeData:[son.name],
                   _column:0,
                   _columnTotal:1,
                   _rowTotal:1,
                   _path:-1
               };
           }
           _offsetx= calculatePost({
               id:son.name,
               taskReferenceName:son.taskReferenceName,
               parent,
               totalWidth,
               positionArr
           }).x;
           var _c=_totalWidth/(maxColumn+1);
           var _r=totalHeight/(maxRow+1);
           var _cellSpace=minCellSpace<_c?_c:minCellSpace;
           var _rawSpace=minRowSpace<_r?_r:minRowSpace;
           var x=_offsetx;//+_cellSpace*(n+1)-60;//
           var y=_rawSpace*(m+1)+20-18;
           son._position={x,y};
       }
   }
}
/**
 * 获取点线数组
 * @param positionArr
 * @param taskList
 * @returns {{points: Array, lines: Array}}
 */
function getPonitLineArr(positionArr,taskList){
    var points=[],nodeData=[],lineMaps={};
    if(!positionArr.length){
        return;
    }
    for(var m=0,len=positionArr.length;m<len;m++){
        var subArr=positionArr[m];
        if(!subArr.length){
           continue;
        }
        for(var n=0,mun=subArr.length;n<mun;n++){
            var son=subArr[n];
            var propertyData=getPropertyData(son,taskList);
            var moduleData=getModuleDataByTask(propertyData);
            var edgeData=son.edgeData;
            var objType="point",
                id=propertyData.nodePrefix,
                nodeName=propertyData.taskReferenceName,
                x=son._position.x,
                y=son._position.y;
            nodeData.push({
                id,
                edgeData,
                propertyData
            })
            lineMaps[id]={id,x,y,edgeData};
            points.push($.extend(true,{id,x,y,objType,nodeName,moduleData,edgeData},propertyData));
        }
    }
 return {
     nodeData,
     points,
     lineMaps
 }
}
/**
 * 设置二维坐标数组
 * @param dslTasks (是 workFLowDSL中的tasks数组)
 * @param taskList
 * @param path 层级
 * @param positionArr  二维坐标数组
 * @returns {*[]}
 */
function setPositionArr(dslTasks,path,positionArr){
    for(var i=0,len=dslTasks.length;i<len;i++){
        var dsl=dslTasks[i];
        if(dsl.noAdd){//不加入
            continue;
        }
        var _tmpPath=path+i;
        while(positionArr[_tmpPath]){
            _tmpPath++;
        }
        var nextDsl=dslTasks[i+1];
        dsl.edgeData=[];
        if(nextDsl){
            //加入连线的结束点
            dsl.edgeData.push(nextDsl.name);
        }
        setSimpleTypeDSL(dsl,_tmpPath,positionArr);
        if(dsl.type=="FORK"){
            var join=dslTasks[i+1];
            dsl.edgeData=[];
           for(var m=0,t=dsl.forkTasks.length;m<t;m++){
              var subforkTasks= dsl.forkTasks[m];
               //加入连线的结束点
               dsl.edgeData.push(subforkTasks[0].name);
               subforkTasks[subforkTasks.length-1].edgeData=[nextDsl.name];
           }
            positionArr[_tmpPath+1]=[];
           iteraterTwoDimensionForkTasks(dsl.forkTasks,_tmpPath+1,positionArr)
        }
    }
}

function getOutputPos(pos){
    var x=pos.x+120/2,y=pos.y+35;
    return {x,y}
}
function getInputPos(pos){
    var x=pos.x+120/2,y=pos.y;
    return {x,y}
}
/**
 * 获取画线数据
 * @param arr
 * @returns {Array}
 */
function getLineDataByCanvasData(maps){
    var res=[];
    for(var id in maps){
      var start=maps[id];
      if(!start.edgeData||!start.edgeData.length){
            continue;
      }
      for(var i=0,len=start.edgeData.length;i<len;i++){
           var endId=start.edgeData[i];
           var end=maps[endId];
           res.push({
              start:getOutputPos({x:start.x,y:start.y}),
              end:getInputPos({x:end.x,y:end.y}),
              id:`${start.id}_${end.id}`,
              edgeData:[start.id,end.id]
          })

      }

    }
    return res;
}
function transform2ModulePropertyData(data){
    if(data&&data.options){
        data.options.forEach((d,i)=>{
            d.value&&(d.value+="");
            if(d.pageElement=='MultiPairInputText'||d.pageElement=='MultiPairTable'){
                if(!d.maps) d.maps=[{keyName:"",keyValue:""}];
            }
        })
    }

}
/**
 * 修改ModulePropertyData
 * @param name 模块属性名称
 * @param data  PropertyData
 * @param modufyData 修改数据
 */
function modifyModulePropertyData(name,data,modufyData){
    let index=-1;
    data.options.every((d,i)=>{
        if(d.name==name){
            index=i;
            return false;
        }
        return true;
    })
    let opt=data.options[index];
    opt=$.extend(opt,modufyData)
    return data;
}
function getNodeTaskData(node,nodes){
    var result={
        "name": node.propertyData.nodePrefix,
        //taskReferenceName	string	任务别名，在后续任务中如果使用当前任务输出时，通过别名指定，工作流内唯一，所有类型任务必填
        "taskReferenceName":node.propertyData.taskReferenceName,
        //type	string	任务类型，用户自定义的需要远程执行的任务为SIMPLE，其他系统任务暂定为DECITION（决定任务），FORK（并行任务），JOIN（并行后再串行）等，系统任务需要其他参数支持，所有类型任务必填
        "type":node.propertyData.taskType //"SIMPLE"
        //inputParameters	object	任务的输入，可以通过表达式指定工作流的输入或者其他任务的输出，非必填项
        //"inputParameters": {
        //    "fileLocation":"${e1.output.encodeLocation}"
        //},
        // workerType	string	定义worker类型，本期只有XD，所以类型只有一个为CHORUS，type类型为SIMPLE时必填
        //"workerType": "CHORUS",
        //workerParams	object	根据worker类型不同，传不同的参数，比如本期只有CHORUS类型，CHORUS类型对应的必要属性是moduleName和containerId
        //"workerParams": {
        //    "moduleName": "RDB2Hive",
        //    "containerId": "aaaaaaaa111111"
        //}
    };
    if(node.forkTasks){
        var arr=[];
        for(var i=0,len=node.forkTasks.length;i<len;i++){
            var forkTask=node.forkTasks[i];
            arr[i]=[];
            for(var m=0,num=forkTask.length;m<num;m++){
               var task= forkTask[m];
                if(!task.propertyData){
                    task= nodes[task.name]
                }
                arr[i].push(getNodeTaskData(task,nodes));
            }
        }
        result.forkTasks=arr;
    }
    return result;
}
function transform2TaskDSL(modulePropertyData){
    var staticParams={};
    if(modulePropertyData&&modulePropertyData.options){
        modulePropertyData.options.forEach((o,i)=>{
            if(o.pageElement=="MultiPairInputText"||o.pageElement=="MultiPairTable"){
                var tmps={};
                o.maps.forEach((m,n)=>{
                    if(m.keyName){
                        if(!o.notNull){
                            return;
                        }
                        tmps[m.keyName]=m.keyValue?$.trim(m.keyValue):"";
                    }

                })
                staticParams[o.name]=JSON.stringify(tmps);
            }else if(o.name=="hdfsFileFolderPath"){
                staticParams[o.name]=`/chorus/project/${_.currentProjectCode.get()}`+$.trim(o.value);
            }else{
                if(!o.notNull&&!o.value){
                    return;
                }
                staticParams[o.name]=$.trim(o.value);
            }

        })
    }
    //本期 只传name 和 staticParams，其他都使用默认值
    /**
     {
       "name": "test_task",
       "retryCount": 3,
       "timeoutSeconds": 3600,
       "inputKeys": [
         "sourceRequestId",
         "qcElementType"
       ],
       "outputKeys": [
         "state",
         "skipped",
         "result"
       ],
       "staticParams": {
         "args": "aaa123",
         "command": "import"
       },
       "timeoutPolicy": "RETRY",
       "retryLogic": "FIXED",
       "retryDelaySeconds": 10
     }
     */
    return {
        "name": modulePropertyData.nodePrefix,
        taskId:modulePropertyData.taskId,
        staticParams,
        retryCount:modulePropertyData.retryCount,
        "timeoutSeconds":modulePropertyData.timeoutSeconds,
        "timeoutPolicy": modulePropertyData.timeoutPolicy
    };
}

//迭代
function iteratorNode2workflow(nodes,nextNode,workflow){
    workflow.push(getNodeTaskData(nextNode,nodes));
    if(nextNode.edgeData.length>0){
        nextNode.edgeData.forEach((n,i)=>{
            var newNode=nodes[n];
            iteratorNode2workflow(nodes,newNode,workflow)
        })
    }
}
//获取第一个fork 组件
function getFirstFork(nodes,startNode){
    if(startNode.moduleData.moduleType=="fork"){
        return startNode;
    }else{
        if(startNode.edgeData.length>0){
            for(var i=0,len=startNode.edgeData.length;i<len;i++){
                var newNode=nodes[startNode.edgeData[i]];
                var node= getFirstFork(nodes,newNode)
                if(node){
                    return node;
                }
            }
        }
    }

}
//根据fork点获取下一个点 (必须是join 点)
function getNextNodeByFork(nodes,fork){
   var end="",flag=true;
    if(fork.forkTasks&&fork.forkTasks.length){
          for(var i=0,len=fork.forkTasks.length;i<len;i++){
             var tasks=fork.forkTasks[i];
              var temp=tasks[tasks.length-1];
              if(typeof temp =='object'){
                  if(temp.name){
                      temp=nodes[temp.name];
                  }
                  if(temp.moduleData.moduleType=='fork'){
                      temp=getNextNodeByFork(nodes,temp)?getNextNodeByFork(nodes,temp).propertyData.prefix:null;
                  }else{
                      temp=temp.edgeData[0];
                  }
              }
              if(i==0){ end=temp; }
              if(end!==temp){
                  flag=false;
                  break;
              }
          }

    }
    return flag?((nodes[end].moduleData&&nodes[end].moduleData.moduleType=="join")?nodes[end]:null):null;

}
function iteratorNotFork2workflow(nodes,nextNode,workflow){
    if(nextNode.moduleData.moduleType!="fork"&&nextNode.moduleData.moduleType!="end"){
        workflow.push(getNodeTaskData(nextNode,nodes));
        if(nextNode.edgeData.length>0){
            var newNode=nodes[nextNode.edgeData[0]];
            if(newNode.moduleData.moduleType!="end"){
                iteratorBatchNode2workflow(nodes,newNode,workflow)
            }
        }
    }else{
        iteratorBatchNode2workflow(nodes,nextNode,workflow)
    }
}
//批量迭代
function iteratorBatchNode2workflow(nodes,nextNode,workflow){
    if(nextNode.moduleData.moduleType=="fork"){
        if(nextNode.edgeData.length>0){
            nextNode.forkTasks=[];
            var len=nextNode.edgeData.length;
            while(len--){
                nextNode.forkTasks[len]=[];
            }
            //fork 点的分支点遍历
            nextNode.edgeData.forEach((f,i)=>{
                var fNode=nodes[f];
                if(fNode){
                    //fork 点不能直接和end 和 join 点连接
                    if(fNode.moduleData.moduleType!="end"&&fNode.moduleData.moduleType!="join"){
                        if(fNode.moduleData.moduleType=="fork"){
                            iteratorBatchNode2workflow(nodes,fNode,nextNode.forkTasks[i])
                            return;
                        }
                        if(fNode.edgeData.length>0){
                            var en=nodes[fNode.edgeData[0]];
                            //如果分支点的下一个连接点是join 就不再循环了
                            if(en.moduleData.moduleType=="join"){
                                nextNode.forkTasks[i].push(fNode)
                            }else {
                                iteratorBatchNode2workflow(nodes,fNode,nextNode.forkTasks[i])
                            }
                        }
                    }
                }
            })
            delete nextNode.taskList;
            workflow.push(getNodeTaskData(nextNode,nodes));
            var joinNode=getNextNodeByFork(nodes,nextNode);
            if(joinNode){
                iteratorNotFork2workflow(nodes,joinNode,workflow)
            }else{
                isForkTasksRelate=true;
            }
        }
    }else if(nextNode.moduleData.moduleType!="end"&&nextNode.moduleData.moduleType!="join"){
        workflow.push(getNodeTaskData(nextNode,nodes));
        if(nextNode.edgeData.length>0){
            var newNode=nodes[nextNode.edgeData[0]];
            if(newNode.moduleData.moduleType!="end"){
                iteratorBatchNode2workflow(nodes,newNode,workflow)
            }
        }
    }
}

//组织WorkFlow DSL 数据
function transform2WorkflowDSL(arg){
    var nodes=arg.nodes;
    var start=null,workflow=[];
    if((arg.jobType+"")==BATCH){//批量（定时）
        arg.children.forEach((c,i)=>{
            if(c.objType=='line'){
                return ;
            }
            //输入类
            if(c.moduleData.moduleType=='start'){
                start=c;
            }
            if(c.moduleData.moduleType=='fork'){
                nodes[c.prefix].edgeData=c.edgeData;
            }
            nodes[c.prefix].edgeData=c.edgeData;
            nodes[c.prefix].moduleData=c.moduleData;
        })
        workflow=[];
        iteratorBatchNode2workflow(nodes,nodes[nodes["start"].edgeData[0]],workflow,workflow)
    }else{//流式（实时）
        arg.children.forEach((c,i)=>{
            if(c.objType=='line'){
                return ;
            }
            //输入类
            if(c.moduleData.moduleType==3||c.moduleData.moduleType==4){
                start=c;
            }
            nodes[c.prefix].edgeData=c.edgeData
            ;
        })
         workflow=[];
        iteratorNode2workflow(nodes,nodes[start.prefix],workflow,workflow);
    }

    var result={
        "name": arg.workFlowDSLName||`chorus_${_.uuid(20)}${new Date().getTime()}`,
        "description": arg.description,
        "version": 1,
        "tasks":workflow
    };
    return result;

}
/*
 "4001","项目ID不能为空"
 "4005","任务不存在"
 "4006","任务类型错误"
 "4004"："创建人用户ID不能为空"
 "4007"："创建人用户名不能为空"
 "4010"："更新人用户ID不能为空"
 "4011"："更新人用户名不能为空"
 "4012","XD任务名不能为空"
 "4040","工作流DSL不能为空"
 "4041","工作流中节点不能为空"
 "4042","执行容器ID不能为空"
 "4900","调度类型错误"
 "4902","调度信息不能为空"
 "4903","调度方式不能为空"
 */
function setWarningsByCode(code,view){
    var res={success:true};
    var jobAliasNameMsgs={
        4001:{msg:'项目不能为空',tabName:"baseInfo"},
        4002:{msg:'任务类型不能为空',tabName:"baseInfo"},
        4020:{msg:'任务名不能为空',tabName:"baseInfo"},
        4021:{msg:'任务名已经存在',tabName:"baseInfo"},
        4001:{msg:'项目ID不能为空',tabName:"baseInfo"},
        4005:{msg:'任务不存在',tabName:"baseInfo"},
        4006:{msg:'任务类型错误',tabName:"baseInfo"}
    };
    var deployMsgs={
        4030:{msg:'CRON表达式错误',tabName:"deployInfo"},
        4042:{msg:'执行容器ID不能为空',tabName:"deployInfo"},
        4900:{msg:'调度类型错误',tabName:"deployInfo"},
        4902:{msg:'调度信息不能为空',tabName:"deployInfo"},
        4903:{msg:'调度方式不能为空',tabName:"deployInfo"},
        "4042":{msg:'执行容器ID不能为空',tabName:"deployInfo"}
    }
    var otherMsgs={
         4004:{msg:'创建人用户ID不能为空',tabName:"baseInfo"},
        "4007":{msg:'创建人用户名不能为空',tabName:"baseInfo"},
        "4010":{msg:'更新人用户ID不能为空',tabName:"baseInfo"},
        "4011":{msg:'更新人用户名不能为空',tabName:"baseInfo"},
        "4040":{msg:'工作流DSL不能为空',tabName:"baseInfo"},
        "4041":{msg:'工作流中节点不能为空',tabName:"baseInfo"}

    };
    var jobAlias=jobAliasNameMsgs[code];
    var deploy=deployMsgs[code];
    var other=otherMsgs[code];
    if(jobAlias){
        res=Object.assign({},jobAlias);
        res.success=false;
        view.jobAliasNameWarnings=[jobAlias.msg]
    }else if(deploy){
        res=Object.assign({},deploy);
        res.success=false;
        view.cronExpressionWarnings=[deploy.msg]
    }else if(other){
        res=Object.assign({},deploy);
        res.success=false;
    }else{
        res.success=false;
        res.msg="操作失败！"
    }
    return res;
}
function transform2SubmitSaveData(arg){
    var taskList=[],workFlowDSL=null,nodes=arg.nodes;
    //分支之间是否有联系
    isForkTasksRelate=false;
    workFlowDSL=transform2WorkflowDSL(arg);
    var workFlowDSLName=workFlowDSL.name;
    for(var k in nodes){
        var node=nodes[k];
        if(k=="start"||k=="end"){
            continue;
        }
        let sVariables ="";

        if(typeof node.propertyData.variables!='string')
        {
            sVariables=  JSON.stringify(node.propertyData.variables)
        }
        else {
            sVariables =node.propertyData.variables
        }
        //分支和合并不放到这里来
        if(node.propertyData.moduleType!=="fork"&&node.propertyData.moduleType!=="join"){
            taskList.push({
                "taskName":node.propertyData.nodePrefix,
                "moduleName":node.propertyData.moduleName,
                "moduleType":node.propertyData.moduleType,
                "taskId":node.propertyData.taskId,
                "taskDSL":JSON.stringify(transform2TaskDSL(node.propertyData)),
                "variable":sVariables
            })
        }

    }
    var reData=Object.assign({},arg,{
        "taskList":JSON.stringify(taskList),
        "schedule": JSON.stringify(arg.schedule),
        "warningConfig":JSON.stringify(arg.warningConfig),
        workFlowDSL:JSON.stringify(workFlowDSL),
        isForkTasksRelate,
        workFlowDSLName
    });
    delete reData.children;
    delete reData.nodes;
   return reData;
}
/**
 * 设置任务数据
 * @param view
 * @param data
 */
function setJobData(view,data){
    view.jobId=data.jobId+"";
   // view.jobName=data.jobName;
    view.jobAliasName=data.jobAliasName;
    view.jobType=data.jobType;
    view.jobDescription=data.description;
    view.instanceId=data.instanceId*1;
    view.dataInput=data.dataInput*1;
    view.dataOutput=data.dataOutput*1;
    view.schedule=$.extend({},view.schedule,data.schedule);
    view.workFlowDSL=data.workFlowDSL?JSON.parse(data.workFlowDSL):[];
    data.taskList.forEach((t)=>{
        view.taskList.push($.extend({},t,{taskDSL:JSON.parse(t.taskDSL)}))
    })
    view.warningConfig=data.warningConfig?JSON.parse(data.warningConfig):{};
    view.excuteErrorFlgCheckBox=!!view.warningConfig.excuteErrorFlg;
    view.timeOutFlgCheckBox=!!view.warningConfig.timeOutFlg;
    view.workFlowDSLName=view.workFlowDSL.name;
}
function validateModuleOptions(arg,name){
    var flag=true,opts=arg.options;
    if(opts){
        opts.every((o,i)=>{
            if(name?o.name==name:true){
                var v=$.trim(o.value),notNull=o.notNull;
                o.warnings=null;
                if(o.type=='Map'&&notNull){
                    var vls=[];
                    o.maps.forEach((m,i)=>{
                        ($.trim(m.keyName)&&$.trim(m.keyValue))&&vls.push(m)
                    })
                    if(!vls.length){
                        o.warnings=["至少有一行完整填写"];
                        return flag=false;
                    }
                }else if(notNull&&!v){
                    o.warnings=["必填项"];
                    return flag=false;
                }
                if(!v){
                    return flag=true;
                }
                if(o.type=='Long'){
                    var vlong=numberLong(v)
                    if(!vlong.success){
                        flag=false;
                        o.warnings=[vlong.msg];
                    }
                    if(o.min!=""){
                        if(v<o.min){
                            flag=false;
                            o.warnings=[`不能小于${o.min}`];
                        }
                    }
                    if(o.max){
                        if(v>o.max){
                            flag=false;
                            o.warnings=[`不能大于${o.max}`];
                        }
                    }
                }else if(o.type=='String'){
                    if(o.sizeMin){
                        if(v.length<o.sizeMin){
                            flag=false;
                            o.warnings=[`长度不能小于${o.sizeMin}`];
                        }
                    }
                    if(o.sizeMax){
                        if(v.length>o.sizeMax){
                            flag=false;
                            o.warnings=[`长度不能大于${o.sizeMax}`];
                        }
                    }
                }else if(o.type=='Map'){
                    if(o.maps.length<o.sizeMin&&o.maps.length>o.sizeMax){
                        flag=false;
                        o.warnings=[`数量是在${o.sizeMin}至${o.sizeMax}之间`];
                    }
                }
            }

            return flag;

        })
    }
    return flag;

}
function modifyTaskReferenceName(arg,nodeDataModel){
    arg.taskReferenceNameWarnings=null;
    var v=$.trim(arg.taskReferenceName),flag=true,flag1=true;

    var res=validatejobAliasNameTaskName(v)
    if(!res.success){
        arg.taskReferenceNameWarnings=res.warnings;
        return res.success;
    }
    flag=res.success
    var nodes = nodeDataModel.getAllData();
    var isFirst=true;
    //是组件名称就要检查是否重名
    for (var k in nodes) {
        if(isFirst){
            isFirst=false;
            continue;
        }

        if (k == arg.nodePrefix) {
            continue;
        }
        var node = nodes[k];
        if (node.propertyData.taskReferenceName == v) {
            flag1=false;
            arg.taskReferenceNameWarnings=["名称重复，请修改"];
            break;
        }
    }
    return flag&&flag1;
}
function validateModuleRule(arg,nodeDataModel){
    var flag=true;
    arg.retryCountWarnings=null;
    arg.timeoutSecondsWarnings=null;
    arg.taskReferenceNameWarnings=null;
    var v=$.trim(arg.retryCount);
    flag=modifyTaskReferenceName(arg,nodeDataModel);
    if(v*1!=0){
        if(!/^\+?[1-9][0-9]*$/.test(v)){
            flag=false;
            arg.retryCountWarnings=["必须是正整数，建议值是3"];
        }
    }
    var v=$.trim(arg.timeoutSeconds);
    if(v*1!=0){
        if(!/^\+?[1-9][0-9]*$/.test(v)){
            flag=false;
            arg.timeoutSecondsWarnings=["必须是正整数，建议值是3600"];
        }
    }
    return flag;
}
var timeoutPolicyOptions=[{value:"RETRY",text:"重试"},{value:"TIME_OUT_WF",text:"工作流超时"}];
//批量验证规则
function batchWorkFlowRule(arg){
    var children=arg.children;
    var forkNum=0,joinNum=0,taskNum=0;
    var errMsg="",success=true;
    children.forEach((child,i)=>{
        if(child.objType=='line'){
            return;
        }
        var moduleType=child.moduleData.moduleType;
        if(moduleType=="fork"){
            taskNum++;
            forkNum++;
        }
        if(moduleType=="join"){
            taskNum++;
            joinNum++;
        }
        if(moduleType=='1'||moduleType=='2'){
            taskNum++;
        }
    })
    if(forkNum>joinNum){
        success=false;
        errMsg=`合并类组件少${forkNum-joinNum}个`;
    }else if(forkNum<joinNum){
        success=false;
        errMsg=`分支类组件少${joinNum-forkNum}个`;
    }else if(!taskNum){
        success=false;
        errMsg="至少要一个组件才可以保存";
    }
    if(!success){
        return {
            success,
            msg:errMsg
        }
    }
    for(var i=0,len=children.length;i<len;i++){
        var child=children[i]
        if(child.objType=='line'){
            continue;
        }
        var moduleType=child.moduleData.moduleType;
        if(moduleType!=="end"&&child.edgeData.length<1){
            success=false;
            errMsg="有组件没有输出连接";
            return {
                success,
                msg:errMsg
            }
        }

        //1,2代表处理类
        if(moduleType=="fork"||moduleType=="1"||moduleType=="2"||moduleType=="join"){
            children.every((c,n)=>{
                if(c.objType=='line'){
                    return true;
                }
                if( c.edgeData.indexOf(child.prefix)>-1){
                    success=true;
                    errMsg="";
                    return false;
                }
                success=false;
                errMsg="有组件没有输入连接";
                return true;
            })

        }
        if(!success){
            return {
                success,
                msg:errMsg
            }
        }
    }

    return {
        success,
        msg:errMsg
    }

}
function validatejobAliasNameTaskName(v){
    var flag=/^[a-zA-Z][a-zA-Z0-9]*$/.test(v),flag1=true;
    var warnings="";
    if(!flag){
        warnings=["必须是字母和数字，且以字母开头"]
    }
    if(!v){
        warnings=["必填项"]
        flag1=false;
    }else if(v.length>64){
        warnings=["名称长度不能超过64个字符"]
        flag1=false;
    }
    return {
        success:flag1&&flag,
        warnings
    }
}
//流式验证规则
function immediatelyWorkFlowRule(arg,nodeDataModel){
    var taskList=[],workflowDSL=null,children=arg.children;

    /**
     //3,4应该代表输入
     //5,6代表处理
     //7,8代表输出
     */
    var inputNum=0,ouputs=0;
    var errMsg="",success=true;
    children.forEach((child,i)=>{
        if(child.objType=='line'){
            return;
        }
        var moduleType=child.moduleData.moduleType*1;
        //3,4应该代表输入
        if(moduleType==3||moduleType==4){
            inputNum++;
            if(child.edgeData.length<1){
                success=false;
                errMsg="输入类组件必与其他组件连接";
            }
        }
        //7,8代表输出
        if(moduleType==7||moduleType==8){
            ouputs++;
        }
        //处理
        if(moduleType==5||moduleType==6){
            if(child.edgeData.length<1){
                success=false;
                errMsg="处理类组件输出必与其他组件连接";
            }
        }
    })
    if(inputNum>1){
        success=false;
        errMsg="输入类组件只能有一个";
    }else if(inputNum<1){
        success=false;
        errMsg="缺少输入类组件";
    }else if(ouputs>1){
        success=false;
        errMsg="输出类组件只能有一个";
    }else if(ouputs<1){
        success=false;
        errMsg="缺少输出类组件";
    }
    if(!success){
        return {
            success,
            msg:errMsg
        }
    }
    children.forEach((child,i)=>{
        if(child.objType=='line'){
            return;
        }
        var moduleType=child.moduleData.moduleType*1;
        //7,8代表输出
        if(moduleType==7||moduleType==8||moduleType==5||moduleType==6){
            children.every((c,n)=>{
                if(c.objType=='line'){
                    return true;
                }
                if( c.edgeData.indexOf(child.prefix)>-1){
                    success=true;
                    errMsg="";
                    return false;
                }
                success=false;
                errMsg="组件的输入必与其他组件连接";
                return true;
            })

        }
    })
    return {
        success,
        msg:errMsg
    }
}
export default  {
    result2Table,
    status2Text,
    xdModules2showData,
    transform2ModulePropertyData,
    transform2SubmitSaveData,
    getNodeTaskData,
    modifyModulePropertyData,
    getTaskType,
    isShowModuleProperty,
    timeoutPolicyOptions,
    validateModuleOptions,
    validateModuleRule,
    immediatelyWorkFlowRule,
    batchWorkFlowRule,
    scheduleTypeOptions,
    modifyTaskReferenceName,
    setWarningsByCode,
    setJobData,
    getLineDataByCanvasData,
    setPositionArr,
    setNodePositionByTwoDimension,
    getPonitLineArr,
    validatejobAliasNameTaskName
};