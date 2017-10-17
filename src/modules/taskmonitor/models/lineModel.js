/**
 * Created by AnThen on 2017-4-12.
 */
var iconObj=null;
import canvasUtils from  '../utils/canvasUtils.js';
var _strokeStyle='#d98d4f';
function shadow(ctx,arg){
    ctx.shadowOffsetX =0;
    ctx.shadowOffsetY = 0;
    ctx.shadowColor ='rgba(239,239,239,0.4)';//'rgba(239,239,239,0.2)';
    ctx.shadowBlur =3;

}
function drawArrow (context,fillStyle,opt){
    var rad=canvasUtils.angle(opt.end.x,opt.end.y,opt.start.x,opt.start.y);
    var dis=canvasUtils.distance(opt.start.x,opt.start.y,opt.end.x,opt.end.y);
    var pos=canvasUtils.getPosByRad({x:opt.end.x,y:opt.end.y},rad,10);
    var angle=rad-Math.PI/2;
    context.fillStyle=fillStyle;
    //先移动位置在旋转
    context.translate(pos.x,pos.y);
    context.save();
    context.rotate(angle);
    context.moveTo(0,-7);
    context.lineTo(4,7);
    context.lineTo(-4,7);
    context.closePath();
    context.fill();
    context.restore();
}

exports.model=(opt)=>{
    var endPos={x:opt.end.x-opt.start.x,y:opt.end.y-opt.start.y};
    var pos=canvasUtils.getBetweenPosition({x:0,y:0},endPos);
    opt.x=opt.start.x;
    opt.y=opt.start.y;
    opt.objType="line";
    var closeBtn=null;
    var line=null;
    var node=new createjs.BrushBox({
        id:opt.id+'_line',
        prefix:opt.id,
        name:opt.id+'_line',
        moduleData:opt.moduleData,
        start:opt.start,
        end:opt.end,
        edgeData:opt.edgeData,
        objType:opt.objType,
        groupX:opt.x,
        groupY:opt.y,
        setChildPosition(){
            var endPos={x:this.end.x-this.start.x,y:this.end.y-this.start.y};
            var newPos=canvasUtils.getBetweenPosition({x:0,y:0},endPos);
            closeBtn.groupX=newPos.x;
            closeBtn.groupY=newPos.y;
            //line.start=this.start;
            var rad=canvasUtils.angle(0,0,endPos.x,endPos.y);
            var dis=canvasUtils.distance(0,0,endPos.x,endPos.y);
            var pos=canvasUtils.getPosByRad({x:0,y:0},rad,dis);
            line.end=pos;
            line.rotateRad=(rad+Math.PI/2)*180/Math.PI;
            //arrow.groupX=pos.x;//opt.start.x,
            //arrow.groupY=pos.y;//opt.start.y,
            //arrow.rotation=(rad+Math.PI/2)*180/Math.PI;
           // canvasUtils.getStage().update();
        }
    })
    var id=opt.id;
    var groupX=pos.x;
    var groupY=pos.y;
    closeBtn=new createjs.Brush({
        id:opt.id+'_closeBtn',
        name:opt.id+'_closeBtn',
        groupX:groupX,
        groupY:groupY,
        radius:9,
        fillStyle:'#d9e6f3',
        draw:function(ctx){
            ctx.save();
            ctx.beginPath();
            ctx.arc(0,0,this.radius,0*Math.PI,2*Math.PI)
            ctx.closePath();
            ctx.fillStyle = this.fillStyle;//'#f4f4f4';
            ctx.fill();
            ctx.strokeStyle = '#ccc';
            ctx.stroke();
            ctx.restore();
            ctx.save();
            ctx.fillStyle="#d98d4f";
            ctx.font="normal bolder 10px icon";
            ctx.textBaseline="middle"
            ctx.textAlign="center";
            ctx.fillText('×',0,0);
            ctx.restore();
        },
        visible:false,
        cursor:'pointer',
        listeners:{
            'rollover':function(e){
                this.visible=true;
                canvasUtils.setUpdateStatus(true);

            },
            'rollout':function(e){
                this.visible=false;
                canvasUtils.setUpdateStatus(true);
                //  stage.render();
            },
            'click':function(e){
                var outId=this.parent.edgeData[1];
                canvasUtils.getContainer().children.forEach((kid)=>{
                    if(kid.objType=='point'){
                        var index=kid.edgeData.indexOf(outId);
                        if(index>-1){
                            kid.edgeData.splice(index,1)
                        }
                    }
                })
                canvasUtils.getContainer().removeChild(this.parent)
                canvasUtils.setUpdateStatus(true);
            }
        }
    });
    var arrowStart={x:0,y:0};
    var rad=canvasUtils.angle(0,0,endPos.x,endPos.y);
    var dis=canvasUtils.distance(0,0,endPos.x,endPos.y);
    var pos=canvasUtils.getPosByRad({x:0,y:0},rad,dis);
    var rotateRad=(rad+Math.PI/2)*180/Math.PI;
    var arrow=new createjs.Brush({
        id:opt.id+"_arrow",
        prefix:id,
        name:opt.id+"_arrow",
        start:pos,
        groupX:pos.x,//opt.start.x,
        groupY:pos.y,//opt.start.y,
        cursor:"pointer",
        strokeStyle:_strokeStyle,
        fillStyle:_strokeStyle,
        rotation:(rad+Math.PI/2)*180/Math.PI,
        //draw:drawArrow,
        draw:function  (context){
            context.save();
            context.fillStyle=this.fillStyle;
            context.beginPath();
            context.moveTo(0,-8);
            context.lineTo(6,8);
            context.lineTo(-6,8);
            context.closePath();
            context.fill();
            context.restore();
        },
        listeners:{
            click:function(e){
            },
            'rollover':function(e){
                this.cursor="pointer";
                this.parent.findChildByName(this.parent.prefix + '_closeBtn').visible = true;
                canvasUtils.setUpdateStatus(true);
                //  this.getChild(this.id+'_closeBtn').visible=true;
            },
            'rollout':function(e){
                this.cursor="auto";
                this.parent.findChildByName(this.parent.prefix + '_closeBtn').visible = false;
                // this.parent.findChildByName(this.parent.prefix+'_closeBtn').visible=false;
                canvasUtils.setUpdateStatus(true);
            }
        }
    });
    line=new createjs.Brush({
        id:opt.id+"_line",
        prefix:id,
        groupX:0,
        groupY:0,
        name:opt.id+"_line",
        start:{x:0,y:0},
        end:pos,
        cursor:"pointer",
        strokeStyle:opt.lineStrokeStyle,
        globalCompositeOperation:'destination-over',
        lineJoin : 'miter',
        objType:"line",
        lineWidth:2.5,
        rotateRad:rotateRad,
        draw:function(ctx){
            var p=this.parent;
            shadow(ctx,this);
            ctx.save();
            ctx.beginPath();
            ctx.globalCompositeOperation=this.globalCompositeOperation;
            ctx.strokeStyle = this.strokeStyle||createjs.brushDefault.strokeStyle;
            ctx.lineWidth = this.lineWidth||createjs.brushDefault.lineWidth;
            ctx.moveTo(0,0);
            ctx.lineTo(this.end.x,this.end.y);
            ctx.lineJoin =this.lineJoin||createjs.brushDefault.lineJoin;
            ctx.stroke();
            ctx.restore();
            var end=this.end;
            var parent=this.parent;
            drawArrow(ctx,this.strokeStyle,{start:{x:0,y:0},end,parent})
        }

    });
    node.addChild(line,closeBtn);
    return node;

};