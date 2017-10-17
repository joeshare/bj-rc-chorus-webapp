/**
 * Created by AnThen on 2017-3-21.
 */
import modelUtil from './utils.js';
function shadow(ctx,shadowColor){
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.shadowColor = shadowColor||'rgba(100,100,100,0.3)';
    ctx.shadowBlur = 7;

}
function drawText(ctx,txt,w,h1,h2){
    var str = txt,str1,str2;
    var isDouble=false;
    if (txt.length <= 6) {
        str = txt;
    }else if(txt.length>6){
        isDouble=true;
        str1 = txt.substr(0,6);
        str2 = txt.substr(6,6);
    }
    if(txt.length>12){
        str2=txt.substr(6, 4)+'...';
    }

    if(isDouble){
        ctx.textAlign="left";
        ctx.fillText(str1,w-47,-6);
        ctx.fillText(str2,w-47,6);
    }else{
        ctx.textAlign="center";
        ctx.fillText(str,w-25,0);
    }
}

function circleDraw(ctx) {
    ctx.save();
    shadow(ctx,this.shadowColor)
    createjs.brushUtils.drawCircle(ctx,this);
    ctx.restore();
    ctx.beginPath();
    ctx.fillStyle="#3c3c3c";
    ctx.font="normal bolder 10px icon";
    ctx.textBaseline="middle"
    drawText(ctx,this.nodeName,this.radius,15,35);
    ctx.restore();
}
exports.createNode=(id,x,y,opt)=>{
    var circle=new createjs.Brush({
        name:id,
        id:id,
        x:x,
        y:y,
        radius:opt.radius,
        cursor:"pointer",
        fillStyle:opt.fillStyle,
        strokeStyle:opt.strokeStyle,
        objType:"point",
        nodeType:opt.nodeType,
        nodeName:opt.nodeName,
        draw:circleDraw,
        properts:opt.properts,
        listeners:{
            'pressmove':function(e){
                this.x = e.stageX + this.offset.x;
                this.y = e.stageY + this.offset.y;
                modelUtil.resetNodePosition({
                    id:this.id,
                    x:this.x,
                    y:this.y
                })
                //console.log(this.parent)
                modelUtil.setUpdateStatus(true);
            },
            'mousedown':function(e){
                this.offset = {x: this.x - e.stageX, y: this.y - e.stageY};
                modelUtil.setActiveNodeShadow(this.id);
                modelUtil.setPropertyList(this.properts);
                modelUtil.setNodeMaxZ(this)
                modelUtil.setUpdateStatus(true);
            }

        }
    });
    return circle;
}