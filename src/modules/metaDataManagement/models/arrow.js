/**
 * Created by AnThen on 2017-3-21.
 */
import {angle,getPosByRad,distance} from './utils.js';
function drawArrow (context){
    context.save();
    context.fillStyle=this.fillStyle;
    context.beginPath();
    context.moveTo(0,0);
    context.lineTo(4,10);
    context.lineTo(-4,10);
    context.closePath();
    context.fill();
    context.restore();
}
exports.createArrow= (opt)=>{

    var rad=angle(opt.end.x,opt.end.y,opt.start.x,opt.start.y);
    var dis=distance(opt.start.x,opt.start.y,opt.end.x,opt.end.y);
    var pos=getPosByRad({x:opt.end.x,y:opt.end.y},rad,dis-8);
    var arrow=new createjs.Brush({
        id:opt.id,
        name:opt.name,
        start:opt.start,
        end:opt.end,
        x:pos.x,//opt.start.x,
        y:pos.y,//opt.start.y,
        cursor:"pointer",
        strokeStyle:'#e64646',
        fillStyle:'#3498db',
        rotation:(rad+Math.PI/2)*180/Math.PI,
        draw:drawArrow
    });
    return arrow;
};