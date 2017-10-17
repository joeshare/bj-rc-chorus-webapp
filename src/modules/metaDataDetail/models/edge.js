/**
 * Created by AnThen on 2017-3-21.
 */

function drawArrow ({ctx,fillStyle,pos,angle}){
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle=fillStyle;
    //先移动位置在旋转
    ctx.translate(pos.x,pos.y);
    ctx.rotate(angle);
    ctx.moveTo(0,-7);
    ctx.lineTo(4,7);
    ctx.lineTo(-4,7);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

function draw(ctx){
    let [p1,p2,p3,p4]=[
        {x:this.bezierPos[0].x,y:this.bezierPos[0].y},
        {x:this.bezierPos[1].x,y:this.bezierPos[1].y},
        {x:this.bezierPos[2].x,y:this.bezierPos[2].y},
        {x:this.bezierPos[3].x,y:this.bezierPos[3].y}
    ]
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = this.strokeStyle;
    ctx.lineWidth = 1;
    ctx.moveTo(p1.x,p1.y);
    ctx.bezierCurveTo(p2.x,p2.y,p3.x,p3.y,p4.x,p4.y)
    ctx.stroke();
    ctx.restore();
    ctx.save();
    drawArrow({ctx,fillStyle:this.strokeStyle,pos:this.isReverse?p1:p4,angle:this.angle})
    ctx.restore();
}
exports.createEdge=({id,bezierPos,angle,isReverse})=>{
    var line=new createjs.Brush({
        id:`${id}_edge`,
        name:id,
        bezierPos,
        angle,
        isReverse,
        strokeStyle:'#ccc',
        fillStyle:'#ccc',
        draw
    });
    return line;
};