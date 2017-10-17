/**
 * Created by AnThen on 2017-4-12.
 */
var iconObj=null;
import canvasUtils from  '../utils/canvasUtils.js';
import {model as lineModel} from './lineModel.js';
exports.model=(id,x,y,opt,imageBitmap)=>{
    iconObj=imageBitmap;
    var prefix=id;
    var node=canvasUtils.createBrushBox(opt);
    var roundedRect=canvasUtils.createRoundedRect(opt,imageBitmap);
    var groupX=opt.roundedRect.width-18;
    var closeBtn=canvasUtils.createCloseBtn({id,groupX});
    var output=canvasUtils.createOutput(opt,lineModel);
    node.addChild(roundedRect,output,closeBtn);
    return node;

};