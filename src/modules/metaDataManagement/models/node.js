/**
 * Created by AnThen on 2017-3-21.
 */
var iconObj=null;
function shadow(ctx){
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.shadowColor = 'rgba(100,100,100,0.2)';
    ctx.shadowBlur = 3;

}
function drawText(ctx,txt,w,h1,h2){
    var str = txt,str1,str2;
    var isDouble=false;
    if (txt.length <= 11) {
        str = txt;
    }else if(txt.length>11){
        isDouble=true;
        str1 = txt.substr(0,11);
        str2 = txt.substr(11, 11);
    }
    if(txt.length>22){
        str2=txt.substr(11, 10)+'...';
    }

    if(isDouble){
        ctx.textAlign="left";
        ctx.fillText(str1,w-50,h1);
        ctx.fillText(str2,w-50,h2);
    }else{
        ctx.textAlign="left";
        ctx.fillText(str,w-50,h1);
    }
}
function drawCircle(ctx){
    //
    //console.log('drawCircle ',this.fillStyle)
    ctx.save();
    ctx.beginPath();
    //ctx.setTransform(1, 0, 0, 1, 0, 0);
    //ctx.translate(this.x,this.y);
    ctx.arc(0,0,this.radius,0*Math.PI,2*Math.PI)
    ctx.fillStyle = this.fillStyle;
    ctx.fill();
    ctx.strokeStyle =this.strokeStyle;
    ctx.stroke();
    ctx.restore();
}
function drawRoundedRect(ctx) {
    ctx.save();
    shadow(ctx)
    ctx.fillStyle = this.fillStyle;
    ctx.strokeStyle = this.strokeStyle;//'#d98d4f';
    ctx.strokeRect(0,0, this.width,this.height);
    ctx.fillRect(0,0, this.width,this.height);
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = this.strokeStyle;
    ctx.lineWidth = 4;
    ctx.moveTo(0, 0);
    ctx.lineTo(0, this.height);
    ctx.lineJoin = 'miter';
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.fillStyle="#3c3c3c";
    ctx.font="normal bolder 10px icon";
    ctx.textBaseline="middle"
    // ctx.textAlign="center";
    // ctx.fillText('是否订阅公众号',this.width/2,15);
    drawText(ctx,this.nodeName,this.width/2,15,35);
    ctx.restore();

    //ctx.save();
    //ctx.beginPath();
    //ctx.fillStyle="#c8c8c8";
    //ctx.font="normal bolder 10px icon";
    //ctx.textBaseline="middle"
    //ctx.textAlign="center";
    //ctx.fillText('请双击开始设置',this.width/2,35);
    //ctx.restore();

    ctx.save();
    ctx.scale(this.scaleX,this.scaleY);
    if(this.nodeType){
        ctx.drawImage(iconObj,0,0,32,25,5,10,32,26);
    }else{
        ctx.drawImage(iconObj,0,26,32,25,5,10,32,26);
    }
    ctx.restore();
    //console.log('-------------------drawRoundedRect',this.name+' '+this.x+' '+this.y)
}
exports.createNode=(id,x,y,opt,imageBitmap)=>{
    iconObj=imageBitmap;
    var prefix=id;
    var node=new createjs.BrushBox({
        id:prefix+'_node',
        prefix:prefix,
        name:prefix+'_node',
        groupX:x,
        groupY:y
    });
    var roundedRect=new createjs.Brush({
        name:prefix+'_roundedRect_node',
        id:prefix+'_roundedRect_node',
        groupX:0,
        groupY:0,
        z:prefix,
        //scaleX:.9,
        //scaleY:.9,
        width:170,
        height:50,
        fillStyle:opt.roundedRect.fillStyle,
        strokeStyle:opt.roundedRect.strokeStyle,
        nodeType:opt.roundedRect.nodeType,
        nodeName:opt.roundedRect.nodeName,
        draw:drawRoundedRect
    });
    var input=new createjs.Brush({
        id:prefix+'_input',
        name:prefix+'_input',
        groupX:85,
        groupY:0,
        radius:6.5,
        strokeStyle:'#d8d8d8',
        fillStyle:'#fafafa',
        draw:drawCircle
    });
    var output=new createjs.Brush({
        id:prefix+'_output',
        name:prefix+'_output',
        groupX:85,
        groupY:50,
        radius:6.5,
        strokeStyle:'#d8d8d8',
        fillStyle:'#fafafa',
        //strokeStyle:'#65bb43',
        //fillStyle:'#dcffce',
        draw:drawCircle
    });
    node.addChild(roundedRect,input,input,output);
    return node;

}