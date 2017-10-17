/**
 * Created by AnThen on 2017-4-10.
 */
/**
 * Created by AnThen on 2017-3-6.
 */
const BATCH=2;

//=======================================
function getOutputPos(pos){
    var x=pos.x+120/2,y=pos.y+35;
    return {x,y}
}
function getInputPos(pos){
    var x=pos.x+120/2,y=pos.y;
    return {x,y}
}

/*
 {
 "jobId": "",
 "jobExecutionId": 2380,
 "jobInstanceId": 2372,
 "jobName": "chorus_9c3d82e5-89bf-4f12-8d60-c069e32b5ee4",
 "jobAliasName": "RDB2Hive",
 "jobDescription": "",
 "jobExecuteStatus": "FAILED",
 "jobStatus": "",
 "jobStartTime": "2017-02-08 14:29:30",
 "jobStopTime": "2017-02-08 14:31:10"
 }
 */
function getTaskList(task){
    task.name=task.jobName;
    task.taskName=task.jobName;
    return task;
}
/**
 * 转换任务数据
 * @param view
 * @param data
 */
function transformJobData(view,data){
    view.workFlowDSL=data.workFlowDSL?JSON.parse(data.workFlowDSL):[];
    if(data.list){
        data.list.forEach((t)=>{
            view.taskList.push(getTaskList(t))
        })
    }else{
        view.taskList=[];
    }
    if(data.recordCount){

    }

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
            if(workflowType!=BATCH&&m==0&&n==0){
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
function getPropertyData(dsl,taskList,workflowStatus){
    //var dsl=task.taskDSL?JSON.parse(task.taskDSL):null;
    var propertyData={};
    if(dsl.type=="FORK"||dsl.type=="JOIN"||dsl.type=="START"||dsl.type=="END"){
        var type=dsl.type.toLowerCase();
        propertyData={
            moduleName:type,
            moduleType:type ,
            taskId:"",
            taskReferenceNameWarnings:null,
            hiddenTaskParams:false,
            isShowModuleProperty:isShowModuleProperty(type),
            options:[],
            jobExecuteStatus:"COMPLETED",
            "retryCount":"",
            "timeoutSeconds":"",
            "timeoutPolicy":"",
            taskType:dsl.type,
            nodePrefix:dsl.name,
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
                    jobExecutionId:task.jobExecutionId,
                    texts:[task.jobStartTime,task.jobStopTime],
                    jobExecuteStatus:task.jobExecuteStatus,
                    "timeoutSeconds":task.taskDSL?task.taskDSL.timeoutSeconds:"",
                    "timeoutPolicy":task.taskDSL?task.taskDSL.timeoutPolicy:"",
                    taskType:dsl.type,
                    nodePrefix:dsl.name,
                    taskReferenceName:dsl.taskReferenceName
                };
                break;
            }
        }
    }
    return $.extend(true,{
        moduleName:"",
        moduleType:"" ,
        taskId:"" ,
        taskReferenceNameWarnings:null,
        hiddenTaskParams:false,
        isShowModuleProperty:"",
        options:[],
        jobExecuteStatus:workflowStatus!==BATCH?"COMPLETED":"",
        "timeoutSeconds":"",
        "timeoutPolicy":"",
        texts:"",
        taskType:dsl.type,
        nodePrefix:dsl.name,
        taskReferenceName:dsl.taskReferenceName
    },propertyData);
}
/**
 * 获取点线数组
 * @param positionArr
 * @param taskList
 * @returns {{points: Array, lines: Array}}
 */
function getPonitLineArr(positionArr,taskList,workflowStatus){
    var points=[],nodeData=[],lineMaps={};
    for(var m=0,len=positionArr.length;m<len;m++){
        var subArr=positionArr[m];
        for(var n=0,mun=subArr.length;n<mun;n++){
            var son=subArr[n];
            var propertyData=getPropertyData(son,taskList,workflowStatus);
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
            lineMaps[id]={id,x,y,edgeData,propertyData};
            points.push($.extend(true,{id,x,y,objType,nodeName,moduleData,edgeData},propertyData));
        }
    }
    return {
        nodeData,
        points,
        lineMaps
    };
}

function getColorLineByExecuteStatus(startStatus,endStatus){
    var arr=[startStatus,endStatus];
    var maps={
        COMPLETED:"#0e9ee2",
        FAILED:"#dfe1e5",
        STARTED:"#0e9ee2"
    };
    var clr="#0e9ee2";
    if(startStatus=="COMPLETED"&&endStatus=="COMPLETED"){
        clr= maps["COMPLETED"];
    }else if(startStatus=="COMPLETED"&&endStatus=="FAILED"){
        clr= maps["COMPLETED"];
    }else{
        clr= maps["FAILED"];
    }
    return  clr;
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
            var clr=getColorLineByExecuteStatus(start.propertyData.jobExecuteStatus,end.propertyData.jobExecuteStatus)
            res.push({
                start:getOutputPos({x:start.x,y:start.y}),
                end:getInputPos({x:end.x,y:end.y}),
                id:`${start.id}_${end.id}`,
                edgeData:[start.id,end.id],
                lineStrokeStyle:clr
            })

        }

    }
    return res;
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
export default  {
    transformJobData,
    setNodePositionByTwoDimension,
    getPonitLineArr,
    getLineDataByCanvasData,
    setPositionArr
};