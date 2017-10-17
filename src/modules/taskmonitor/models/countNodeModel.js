/**
 * Created by AnThen on 2017-4-12.
 */
var iconObj=null;
import canvasUtils from  '../utils/canvasUtils.js';
import {model as lineModel} from './lineModel.js';
exports.model=(id,x,y,opt,imageBitmap)=>{
    var node=canvasUtils.createBrushBox(opt);
    var roundedRect=canvasUtils.createRoundedRect(opt,imageBitmap);
    node.addChild(roundedRect);
    return node;

};