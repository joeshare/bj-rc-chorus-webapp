/**
 * Created by AnThen on 2017-3-21.
 */
var _container=null;
//主vue 对象
var _vm=null;
var _update=false;
var _imgObj=null;
var _shadowNodeColor = 'rgba(100,100,100,0.2)';
var _activeNodeShodowClr = 'rgba(171,108,225,0.8)';
var _lineEndName = null;
var _lineEndModuleType = null;
var _stage=null;
var _isDrawLineMoving=false;
var labelArr=[{nodeName:'执行完成',fillStyle:"RGBA(51,204,0,0.7)",strokeStyle:"RGBA(51,204,0,0.7)",x:20,y:660},
    {nodeName:'执行中',fillStyle:"RGBA(255,255,0,0.7)",strokeStyle:"RGBA(255,255,0,0.7)",x:105,y:660},
    {nodeName:'执行异常',fillStyle:"RGBA(255,0,0,0.7)",strokeStyle:"RGBA(255,0,0,0.7)",x:200,y:660},
    {nodeName:'未执行',fillStyle:"RGBA(153,153,153,0.7)",strokeStyle:"RGBA(153,153,153,0.7)",x:295,y:660}];
var colorMaps={
    "COMPLETED":"RGBA(51,204,0,0.7)",
    "FAILED":"RGBA(255,0,0,0.7)",
    "STARTED":"RGBA(255,255,0,0.7)"
}
const CANVASWITH=830;
const CANVASHEIGHT=700;
/**
 * 获取指定点的夹角弧度
 * @param originalX  原点x
 * @param originalY 原点y
 * @param pointX 某点x
 * @param pointY 某点y
 * @returns {number} 弧度
 */
function angle(originalX, originalY, pointX, pointY){
    var diff_x = pointX - originalX,
        diff_y = pointY - originalY,
    //返回角度,不是弧度 （Math.atan(diff_y/diff_x) 获取的是弧度）
        rad=Math.atan(diff_y/diff_x);
    if((diff_x <0&&diff_y >=0)||(diff_x <0&&diff_y <0)){
        rad+=Math.PI;
    }else if(diff_x >=0&&diff_y <0){
        rad+=2*Math.PI;
    }
    return rad;
}
/**
 * 根据原点坐标及弧度 获取新坐标点
 * @param orPos 原点坐标 {x,y}
 * @param rad 弧度
 * @param radius 半径
 * @returns {{}}
 */
function getPosByRad(orPos, rad, radius) {
    var x = radius * Math.cos(rad) + orPos.x,
        y = radius * Math.sin(rad) + orPos.y;
    return {
        x: x,
        y: y
    };
}
/**
 * 获取两点距离
 * @param bx
 * @param by
 * @param ex
 * @param ey
 * @returns {number}
 */
function distance(bx, by, ex, ey) {
    var _x = Math.abs(bx - ex);
    var _y = Math.abs(by - ey);
    var sum = Math.pow(_x, 2) + Math.pow(_y, 2);
    return Math.sqrt(sum);
}

/**
 * 根据id过去画布对象
 * @param id
 * @returns {*}
 */
function getCanvasObjById(id){
    var o=null;
    _container.children.every((kid)=>{
        if(kid.id==id){
            o=kid;
            return false;
        }
        return true;
    })
    return o;
}

function getColorData(ctx) {

   var _image = ctx.getImageData(5, 10, 32, 200);
    for ( var x = 0; x < _image.width; x++) {
        for ( var y = 0; y < _image.height; y++) {

            // Index of the pixel in the array
            var idx = (x + y * _image.width) * 4;
            var r = _image.data[idx + 0];
            var g = _image.data[idx + 1];
            var b = _image.data[idx + 2];

            // calculate gray scale value
            var gray = .299 * r + .587 * g + .114 * b;

            // assign gray scale value
            _image.data[idx + 0] = gray; // Red channel
            _image.data[idx + 1] = gray; // Green channel
            _image.data[idx + 2] = gray; // Blue channel
            _image.data[idx + 3] = 255; // Alpha channel
        }
    }
    return _image;
}
function modifyChildName(nodePrefix,name){
    _container.children.every((kid)=>{
        if(kid.prefix==nodePrefix){
           var roundedRect=kid.findChildByName(kid.prefix + '_roundedRect_node');
            roundedRect.nodeName=name;
        }
        return true;
    })
    _stage.update();
}
function putColorData(ctx,image) {
    ctx.putImageData(image, 0, 0);
}

let getContainer=()=>{
    return _container;
}
let setContainer=(v)=>{
    _container=v;
}
let setUpdateStatus=(v)=>{
    _update=v
};
let getUpdateStatus=()=>{
    return _update;
};

function  drawCloseBtn(ctx){

    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = this.fillStyle;
    ctx.fillRect(0,0, this.width,this.height);
    ctx.restore();
    ctx.save();
    ctx.fillStyle="#d98d4f";
    ctx.font="normal bolder 10px icon";
    ctx.textBaseline="middle"
    ctx.textAlign="center";
    ctx.fillText('×',this.width/2,this.height/2);
    ctx.restore();
}


function shadow(ctx,arg){
    ctx.shadowOffsetX =arg.shadowOffsetX||2;
    ctx.shadowOffsetY = arg.shadowOffsetY|| 2;
    ctx.shadowColor =arg.shadowColor||_shadowNodeColor;
    ctx.shadowBlur =arg.shadowBlur||3;

}
function drawText(ctx,txt,w,h1,h2){
    var str = txt,str1,str2;
      if(txt.length>17){
        str=txt.substr(0, 14)+'...';
    }
    ctx.textAlign="center";
    ctx.textBaseline = "middle";
    ctx.fillText(str,w,h1);

}
function drawTips(ctx,txts,x,y){
    if(!txts||!txts.length){
       return;
    }
    ctx.textAlign="left";
    ctx.textBaseline = "middle";
    var lebals=[
        '执行开始时间：',
        '执行结束时间：'
    ];
    for(var i=0,len=txts.length;i<len;i++){
        ctx.fillText(lebals[i],x,i*15*2+15);
        ctx.fillText(txts[i],x,i*15*2+30);
    }


}

function drawFileDown(ctx){
    if(!this.texts||!this.texts.length){
        return;
    }
    ctx.textAlign="left";
    ctx.textBaseline = "middle";
    var lebals=[
        '执行开始时间：',
        '执行结束时间：'
    ];
    ctx.save();
    ctx.fillText("【点击下载日志】",4,80);
    ctx.restore();
    ctx.save();
    ctx.fillStyle = "RGBA(255,255,255,0.1)";
    ctx.fillRect(4,80,100,10);
    ctx.restore();



}
/**
 *  box prefix
 * @param id
 */
function setActiveNodeShadow(id){
    _container.children.forEach((kid,i)=>{
        if(kid.objType=='point'){
            var roundedRect= kid.findChildByName(kid.prefix + '_roundedRect_node');
            if(id==kid.prefix){
                roundedRect.shadowOffsetX =0;
                roundedRect.shadowOffsetY = 0;
                roundedRect.shadowBlur = 5;
                roundedRect.shadowColor=_activeNodeShodowClr;
            }else{
                roundedRect.shadowOffsetX = 2;
                roundedRect.shadowOffsetY = 2;
                roundedRect.shadowBlur = 3;
                roundedRect.shadowColor=_shadowNodeColor;
            }
        }
    })
};
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
function drawRoundedRect(ctx){
    ctx.save();
    shadow(ctx,this);
    ctx.fillStyle = colorMaps[this.jobExecuteStatus]||this.fillStyle;
    ctx.strokeStyle = this.strokeStyle||"RGBA(151,151,151,1)"||colorMaps[this.jobExecuteStatus]||this.strokeStyle;//'#d98d4f';
    ctx.strokeRect(0,0, this.width,this.height);
    ctx.fillRect(0,0, this.width,this.height);
    ctx.restore();

    //ctx.save();
    //ctx.beginPath();
    //ctx.strokeStyle = this.strokeStyle;
    //ctx.lineWidth = 4;
    //ctx.moveTo(2, 0);
    //ctx.lineTo(2, this.height);
    //ctx.lineJoin = 'miter';
    //ctx.stroke();
    //ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.fillStyle="#3c3c3c";
    ctx.font="normal bolder 10px icon";
    ctx.textBaseline="middle"
    // ctx.textAlign="center";
    // ctx.fillText('是否订阅公众号',this.width/2,15);
    drawText(ctx,this.nodeName,this.width/2,this.height/2,35);
    ctx.restore();

    //ctx.save();
    //ctx.beginPath();
    //ctx.fillStyle="#c8c8c8";
    //ctx.font="normal bolder 10px icon";
    //ctx.textBaseline="middle"
    //ctx.textAlign="center";
    //ctx.fillText('请双击开始设置',this.width/2,35);
    //ctx.restore();
    if(false&&this.imageBitmap){
        ctx.save();
        ctx.scale(this.scaleX,this.scaleY);
        ctx.drawImage(this.imageBitmap,0,0,32,25,5,10,32,26);
        var img=getColorData(ctx)
        putColorData(ctx,img)
        ctx.restore();
    }

    //console.log('-------------------drawRoundedRect',this.name+' '+this.x+' '+this.y)
}
let  createCloseBtn=(arg)=>{
    return new createjs.Brush({
        id:arg.id+'_closeBtn',
        name:arg.id+'_closeBtn',
        groupX:arg.groupX-1,
        groupY:arg.groupY||0,
        width:18,
        height:18,
        fillStyle:'#d9e6f3',
        draw:drawCloseBtn,
        visible:false,
        cursor:'pointer',
        listeners:{
            'rollover':function(e){
                this.visible=true;
                setUpdateStatus(true);

            },
            'rollout':function(e){
                this.visible=false;
                setUpdateStatus(true);
                //  stage.render();
            },
            'click':function(e){
                var nodePrefix=this.parent.prefix;
                _vm.deleteNode(nodePrefix)
                var nodePrefix=this.parent.prefix;
                delPointsLinesByEndPrefix(nodePrefix);
                getContainer().removeChild(this.parent)
                setUpdateStatus(true);
            }
        }
    });
};
function validateByModuleType(moduleType){
    return moduleType=='fork'|| moduleType=='start'|| moduleType=='end'||moduleType=='label'||moduleType=='join';
}
let createRoundedRect=(opt,imageBitmap)=>{
    var prefix=opt.id;
    return new createjs.Brush({
        name:prefix+'_roundedRect_node',
        id:prefix+'_roundedRect_node',
        prefix:prefix,
        groupX:0,
        groupY:0,
        z:prefix,
        //scaleX:.9,
        //scaleY:.9,
        shadowOffsetX:opt.shadowOffsetX||2,
        shadowOffsetY:opt.shadowOffsetY,
        shadowColor:opt.shadowColor,
        shadowBlur:opt.shadowBlur||3,
        objType:opt.roundedRect.objType,
        width:opt.roundedRect.width,
        height:opt.roundedRect.height,
        fillStyle:opt.roundedRect.fillStyle,
        strokeStyle:opt.roundedRect.strokeStyle,
        nodeType:opt.roundedRect.nodeType,
        nodeName:opt.roundedRect.nodeName,
        draw:drawRoundedRect,
        imageBitmap:imageBitmap,
        jobExecuteStatus:opt.roundedRect.jobExecuteStatus,
        moduleType:opt.roundedRect.moduleType,
        noTips:opt.roundedRect.noTips,
        listeners:{
            'rollover':function(e){
                if(this.noTips||validateByModuleType(this.moduleType)){
                    return;
                }
                this.parent.findChildByName(this.parent.prefix + '_tips').visible = true;
                this.parent.findChildByName(this.parent.prefix + '_file_down').visible = true;
                _container.addChild( this.parent)
                _stage.update();
            },
            'rollout':function(e){
                if(this.noTips||validateByModuleType(this.moduleType)){
                    return;
                }
                this.parent.findChildByName(this.parent.prefix+'_tips').visible=false;
                this.parent.findChildByName(this.parent.prefix + '_file_down').visible = false;
                _stage.update();

            }

        }
    });
}
function createInput(arg){
    return new createjs.Brush({
        id:arg.id+'_input',
        name:arg.id+'_input',
        prefix:arg.id,
        groupX:arg.roundedRect.width/2,
        groupY:0,
        radius:6.5,
        strokeStyle:'#d8d8d8',
        fillStyle:'#fafafa',
        draw:drawCircle

    });
}
function createOutput(arg,lineModel){
  return new createjs.Brush({
      id:arg.id+'_output',
      name:arg.id+'_output',
      groupX:arg.roundedRect.width/2,// width:opt.roundedRect.width, //height:opt.roundedRect.height,
      groupY:arg.roundedRect.height,//50,
      radius:6.5,
      strokeStyle:'#d8d8d8',
      fillStyle:'#fafafa',
      //strokeStyle:'#65bb43',
      //fillStyle:'#dcffce',
      draw:drawCircle

  });
}
function createBrushBox(arg){
    var prefix=arg.id;
   return  new createjs.BrushBox({
        id:prefix+'_node',
        prefix:prefix,
        name:prefix+'_node',
        moduleData:arg.moduleData,
        start:arg.start,
        end:arg.end,
        roundedRect:arg.roundedRect,
        edgeData:arg.edgeData,
        objType:arg.objType,
        groupX:arg.x,
        groupY:arg.y
    });
}

function getStartNodeCfg(){
  return {nodeName:"Start",id:"start","moduleId":"start","moduleType":"start","moduleName":"Start", objType:'point',x:_vm.canvasWith/2-85,y:30,roundedRect:{width:120,height:35,objType:'node'}}
}
function getEndNodeCfg(){
    return {nodeName:"End",id:"end","moduleId":"end","moduleType":"end","moduleName":"end",x:_vm.canvasWith/2-85, objType:'point',y:_vm.canvasHeight-100,roundedRect:{width:120,height:35,objType:'node'}}
}
function setView(v){
    _vm=v;
}
function getView(){
    return _vm;
}
function setImgObj(v){
    _imgObj=v;
}
function getImgObj(){
    return _imgObj;
}
function  getBetweenPosition(start,end){
    return {x:(start.x + end.x)/2,y:(start.y + end.y)/2};
}
function setLineEndName(v){
   _lineEndName=v;
}
function getLineEndName(){
  return _lineEndName;
}
function setStage(v){
    _stage=v;
}
function getStage(){
    return _stage;
}
//根据NodePrefix获取所有相关点
function getPointsByEndPrefix(prefix){
    var res=[];
    _container.children.forEach((kid)=>{
        if(kid.objType=='point'&&kid.edgeData.indexOf(prefix)>-1){
            res.push(kid);
        }
    })
    return res;
}
//根据NodePrefix获取所有相关线
function getLinesByNodePrefix(prefix){
    var res=[];
    _container.children.forEach((kid)=>{
        if(kid.objType=='line'){
            var inId=  kid.edgeData[0];
            var outId=  kid.edgeData[1];
            if(inId==prefix){
                res.push(kid)
            }else if(outId==prefix){
                res.push(kid)
            }
        }
    })
    return res;
}

/**
 * 删除所有与结束点相关的关系和线
 * @param prefix
 */
function delPointsLinesByEndPrefix(prefix){
    var points= getPointsByEndPrefix(prefix);
    //删除此node 在其他节点上的关系
    points.forEach((point,i)=>{
        var index=point.edgeData.indexOf(prefix)
        if(index>-1){
            point.edgeData.splice(index,1);
        }
    })
    var lines=getLinesByNodePrefix(prefix);
    //删除此node 相关线
    lines.forEach((line,i)=>{
        _container.removeChild(line)
    })
}

function createTipsBrush(arg){
    var color="RGBA(223,225,229,0.8)";
    var groupX=arg.roundedRect.tipsPosition.x;
    var groupY=arg.roundedRect.tipsPosition.y;
    if(arg.x+180>CANVASWITH){
        groupX-=180;
    }
    if(arg.y+160>CANVASHEIGHT){
        groupY-=160;
    }
    return new createjs.Brush({
        id:arg.id+'_tips',
        name:arg.id+'_tips',
        groupX,// width:opt.roundedRect.width, //height:opt.roundedRect.height,
        groupY,//50,
        radius:6.5,
        strokeStyle:color,
        fillStyle:color,
        texts:arg.roundedRect.texts,
        width:150,
        height:100,
        visible:false,
        //strokeStyle:'#65bb43',
        //fillStyle:'#dcffce',
        draw:function(ctx){
            if(!this.texts||!this.texts.length){
                return;
            }
            ctx.save();
            shadow(ctx,this);
            ctx.fillStyle =this.fillStyle;
            ctx.strokeStyle = this.strokeStyle;//'#d98d4f';
            ctx.strokeRect(0,0, this.width,this.height);
            ctx.fillRect(0,0, this.width,this.height);
            ctx.restore();
            ctx.save();
            ctx.beginPath();
            ctx.fillStyle="#3c3c3c";
            ctx.font="normal bolder 10px icon";
            ctx.textBaseline="middle"
            // ctx.textAlign="center";
            // ctx.fillText('是否订阅公众号',this.width/2,15);
            drawTips(ctx,this.texts,5,0);
            ctx.restore();
        },
        listeners:{
            'rollover':function(e){
                this.visible=true;
                this.parent.findChildByName(this.parent.prefix + '_file_down').visible = true;
                _stage.update();

            },
            'rollout':function(e){
                this.visible=false;
                this.parent.findChildByName(this.parent.prefix + '_file_down').visible = false;
                _stage.update();

            }
        }
    });
}
let createFileDown=(arg)=>{
    var prefix=arg.id;
    var groupX=arg.roundedRect.tipsPosition.x;
    var groupY=arg.roundedRect.tipsPosition.y;
    if(arg.x+180>CANVASWITH){
        groupX-=180;
    }
    if(arg.y+160>CANVASHEIGHT){
        groupY-=160;
    }
    return new createjs.Brush({
        name:prefix+'_file_down',
        id:prefix+'_file_down',
        prefix:prefix,
        groupX,// width:opt.roundedRect.width, //height:opt.roundedRect.height,
        groupY,//50,
        z:prefix,
        draw:drawFileDown,
        texts:arg.roundedRect.texts,
        jobExecutionId:arg.roundedRect.jobExecutionId,
        cursor:'pointer',
        visible:false,
        listeners:{
            'mousedown':function(e){
                var dateStr=_vm.date2String(_.string2Date(this.texts[0]),"yyyy-MM-dd")
                _vm.downloadFiler(dateStr,this.jobExecutionId)
            },
            'rollover':function(e){
                this.visible=true;
                this.parent.findChildByName(this.parent.prefix + '_tips').visible = true;
                _stage.update();

            },
            'rollout':function(e){
                _stage.update();

            }
        }
    });
}
export default {
    setView,
    getView,
    getContainer,
    setContainer,
    setUpdateStatus,
    getUpdateStatus,
    createCloseBtn,
    createRoundedRect,
    createBrushBox,
    drawCircle,
    drawText,
    shadow,
    drawRoundedRect,
    getStartNodeCfg,
    getBetweenPosition,
    getEndNodeCfg,
    setImgObj,
    getImgObj,
    setLineEndName,
    getLineEndName,
    setActiveNodeShadow,
    setStage,
    getStage,
    createOutput,
    createInput,
    modifyChildName,
    getPointsByEndPrefix,
    getLinesByNodePrefix,
    angle,
    distance,
    getPosByRad,
    createTipsBrush,
    createFileDown
};