/**
 * Created by AnThen on 2017-4-12.
 */
var iconObj=null;
import canvasUtils from  '../utils/canvasUtils.js';

exports.model=(id,x,y,opt,imageBitmap)=>{
    var prefix=id="end";
    opt.moduleData={
        moduleType:"end"
    };
    opt.edgeData=opt.edgeData||[];
    var node=canvasUtils.createBrushBox(opt);
    var roundedRect=canvasUtils.createRoundedRect(opt,imageBitmap);
    var input=canvasUtils.createInput(opt);
    node.addChild(roundedRect,input);
    return node;

};