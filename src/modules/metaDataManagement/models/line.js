/**
 * Created by AnThen on 2017-3-21.
 */
import {angle,getPosByRad,distance} from './utils.js';
function drawLine(ctx){
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = '#3498db';
    ctx.lineWidth = 3;
    ctx.moveTo(this.start.x, this.start.y);
    ctx.lineTo(this.end.x, this.end.y);
    ctx.lineJoin = 'miter';
    ctx.stroke();
    ctx.restore();

}
exports.createLine=(opt)=>{
    var rad=angle(opt.end.x,opt.end.y,opt.start.x,opt.start.y);
    var dis=distance(opt.start.x,opt.start.y,opt.end.x,opt.end.y);
    var pos=getPosByRad({x:opt.end.x,y:opt.end.y},rad,dis-12);
    var line=new createjs.Brush({
        id:opt.id,
        name:opt.name,
        start:{
            x:pos.x,
            y:pos.y
        },
        end:opt.end,
        cursor:"pointer",
        strokeStyle:'#e64646',
        fillStyle:'#ffe1e1',
        draw:drawLine
    });
    return line;
};