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
    'join':joinNodeModel
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
            strokeStyle:'rgb(171,108,225)',
            fillStyle:'#fafafa',
            moduleType:arg.moduleType,
            moduleName:arg.moduleName,
            height:35,
            width:120,
            objType:'point',
            nodeName:arg.nodeName
        }
    };
   return modelsMap[arg.moduleType]?modelsMap[arg.moduleType](arg.id,arg.x,arg.y,opt,img):"";
};