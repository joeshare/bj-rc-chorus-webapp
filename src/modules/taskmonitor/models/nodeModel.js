/**
 * Created by AnThen on 2017-4-12.
 */

import {model as dealModel} from './dealNodeModel.js';
import {model as forkNodeModel} from './forkNodeModel.js';
import {model as inputNodeModel} from './inputNodeModel.js';
import {model as outputNodeModel} from './outputNodeModel.js';
import {model as joinNodeModel} from './joinNodeModel.js';
import {model as startNodeModel} from './startNodeModel.js';
import {model as endNodeModel} from './endNodeModel.js';
import {model as labelNodeModel} from './labelNodeModel.js';
import {model as countNodeModel} from './countNodeModel.js';
let modelsMap={
    1:dealModel,
    2:dealModel,
    3:inputNodeModel,
    4:inputNodeModel,
    5:dealModel,
    6:dealModel,
    7:outputNodeModel,
    8:outputNodeModel,
    'start':startNodeModel,
    'end':endNodeModel,
    'fork':forkNodeModel,
    'join':joinNodeModel,
    'label':labelNodeModel,
    'count':countNodeModel
};
exports.createNode=(arg,img)=>{
    let opt={
        id:arg.id,
        x:arg.x,
        y:arg.y,
        moduleData:arg.moduleData,
        objType:'point',
        shadowOffsetX:2,
        shadowOffsetY:2,
        shadowColor:'rgba(100,100,100,0.2)',
        shadowBlur:3,
        edgeData:arg.edgeData||[],
        roundedRect:{
            tipsPosition:{
                x:(arg.width||120)/2,
                y:(arg.height||35)
            },
            noTips:arg.noTips,
            strokeStyle:arg.strokeStyle||"RGBA(151,151,151,1)"||"RGBA(153,153,153,0.7)",//"RGBA(151,151,151,1)"
            fillStyle:arg.fillStyle||"RGBA(153,153,153,0.7)",
            moduleType:arg.moduleType,
            moduleName:arg.moduleName,
            height:arg.height||35,
            width:arg.width||120,
            texts:arg.texts,
            objType:'point',
            jobExecutionId:arg.jobExecutionId,
            jobExecuteStatus:arg.jobExecuteStatus,
            nodeName:arg.nodeName
        }
    };
   return modelsMap[arg.moduleType]?modelsMap[arg.moduleType](arg.id,arg.x,arg.y,opt,img):modelsMap[1](arg.id,arg.x,arg.y,opt,img);
};