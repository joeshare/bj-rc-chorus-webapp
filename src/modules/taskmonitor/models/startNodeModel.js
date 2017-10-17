/**
 * Created by AnThen on 2017-4-12.
 */
var iconObj=null;
import canvasUtils from  '../utils/canvasUtils.js';
import {model as lineModel} from './lineModel.js';
exports.model=(id,x,y,opt,imageBitmap)=>{
    var prefix="start";
    opt.moduleData={
        moduleType:"start"
    };
    opt.edgeData=opt.edgeData||[];
    var node=canvasUtils.createBrushBox(opt);
    var roundedRect=canvasUtils.createRoundedRect(opt,imageBitmap);

    var output=canvasUtils.createOutput(opt,lineModel);
    node.addChild(roundedRect,output);
    return node;

};