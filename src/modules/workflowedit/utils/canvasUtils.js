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
 * 是否可以连线
 * @param startModuleType
 * @param endModuleType
 * @returns {boolean}
 */
function isRelated(startModuleType,endModuleType){
    var success=true,msg="";
    if(startModuleType=="start"&&endModuleType=="join"){
        success=false;
        msg="开始点不能直接连接合并组件";
    }
    if(startModuleType=="fork"&&endModuleType=="join"){
        success=false;
        msg="分支组件不能直接连接合并组件";
    }
    if(startModuleType=="fork"&&endModuleType=="end"){
        success=false;
        msg="分支组件不能直接连接结束点";
    }
    return {
        success,
        msg
    };
}
/**
 *  是否只有一个结束点
 *  根据模块type 判断 是否要重置 结束点
 * @param type
 * @returns {boolean}
 */
function isOnlyEndByModuleType(type){
    //1,2处理（批处理）
    //3,4应该代表输入
    //5,6代表处理
    //7,8代表输出
    return type!=="fork"
    //if(type=="start"){
    //    return true
    //}
    //type*=1;
    //if(type>=1&&type<=8){
    //    return true
    //}
   //s return false;
}
/**
 *  结束点是否只能有一个输入点
 *  根据模块type 判断
 * @param type
 * @returns {boolean}
 */
function isOnlyInputNodeByModuleType(type){
   return type=="fork"||type=="1"||type=="2"||type=="end";
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
function resetAllLinePosition(modifyNode){
    _container.children.every((kid)=>{
        if(kid.objType=='line'){
            var inId=  kid.edgeData[0];
            var outId=  kid.edgeData[1];
            var line= kid.findChildByName(kid.prefix + '_line');
            if(inId==modifyNode.prefix){
                var moveTarget=modifyNode.findChildByName(modifyNode.prefix + '_roundedRect_node');
                //var btnTarget=kid.findChildByName(kid.prefix + '_closeBtn');

                kid.start={
                    x:modifyNode.groupX+moveTarget.width/2,
                    y:modifyNode.groupY+moveTarget.height
                };
                kid.groupX=kid.start.x;
                kid.groupY=kid.start.y;
                kid.setChildPosition();
                //line.start={
                //    x:modifyNode.groupX+moveTarget.width/2,
                //    y:modifyNode.groupY+moveTarget.height
                //};
            }
            if(outId==modifyNode.prefix){
                var moveTarget=modifyNode.findChildByName(modifyNode.prefix + '_roundedRect_node');
                //var btnTarget=kid.findChildByName(kid.prefix + '_closeBtn');
                kid.end={
                    x:modifyNode.groupX+moveTarget.width/2,
                    y:modifyNode.groupY
                };
                kid.groupX=kid.start.x;
                kid.groupY=kid.start.y;
                kid.setChildPosition();
            }
        }
        return true;
    })
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
    ctx.save();
    ctx.beginPath();
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
    ctx.fillStyle = this.fillStyle;
    ctx.strokeStyle = this.strokeStyle;//'#d98d4f';
    ctx.strokeRect(0,0, this.width,this.height);
    ctx.fillRect(0,0, this.width,this.height);
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = this.strokeStyle;
    ctx.lineWidth = 4;
    ctx.moveTo(2, 0);
    ctx.lineTo(2, this.height);
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
}

/**
 * 创建关闭按钮
 * @param arg
 * @returns {createjs.Brush}
 */
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
                if(this.parent.disabled){
                    return;
                }
                this.visible=true;
                setUpdateStatus(true);

            },
            'rollout':function(e){
                if(this.parent.disabled){
                    return;
                }
                this.visible=false;
                setUpdateStatus(true);
                //  stage.render();
            },
            'click':function(e){
                if(this.parent.disabled){
                    return;
                }
                var nodePrefix=this.parent.prefix;
                _vm.deleteNode(nodePrefix);
                _vm.deleteDataInPoints(nodePrefix);
                var nodePrefix=this.parent.prefix;
                delPointsLinesByEndPrefix(nodePrefix);
                getContainer().removeChild(this.parent)
                setUpdateStatus(true);
            }
        }
    });
};
/**
 *  创建矩形框
 * @param opt
 * @param imageBitmap
 * @returns {createjs.Brush}
 */
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
        listeners:{
            'pressmove':function(e){
                if(this.parent.disabled){
                    return;
                }
                if(_isDrawLineMoving){
                    return;
                }
                this.parent.originalGroupX=this.parent.groupX = e.stageX + this.offset.x;
                this.parent.originalGroupY=this.parent.groupY = e.stageY + this.offset.y;
                resetAllLinePosition(this.parent)
                setUpdateStatus(true);
            },
            'rollover':function(e){
                if(this.parent.disabled){
                    return;
                }
                if(_isDrawLineMoving){
                    return;
                }
                if(this.name!="start_roundedRect_node"&&this.name!="end_roundedRect_node") {
                    this.parent.findChildByName(this.parent.prefix + '_closeBtn').visible = true;
                    setUpdateStatus(true);
                }
                //  this.getChild(this.id+'_closeBtn').visible=true;
            },
            'rollout':function(e){
                if(this.parent.disabled){
                    return;
                }
                if(_isDrawLineMoving){
                    return;
                }
                if(this.name!="start_roundedRect_node"&&this.name!="end_roundedRect_node"){
                    this.parent.findChildByName(this.parent.prefix+'_closeBtn').visible=false;
                    setUpdateStatus(true);
                }
            },
            'dblclick':function(e){
            },
            'pressup':function(e){
                if(this.parent.disabled){
                    return;
                }
                _isDrawLineMoving=false;
            },
            'mousedown':function(e){
                this.offset = {x: this.x - e.stageX, y: this.y - e.stageY};
                _container.addChild(this.parent);
                setActiveNodeShadow(this.parent.prefix);
                setUpdateStatus(true);
                if(this.parent.prefix=='start'||this.parent.prefix=='end'){
                    _vm.setActiveTabId('baseInfo');
                    _vm.showModuleProperty({
                        code:0,
                        data:{noShowTaskReferenceName:true}
                    })
                    return;
                }

                var nodeData=_vm.nodeDataModel.getNodeData(this.parent.prefix);
                if(!nodeData||!nodeData.propertyData) {//报nodeData.propertyData is undefined 问题待检查
                    return;
                }
                nodeData.propertyData.nodePrefix=this.parent.prefix;
                _vm.validateTaskReferenceName(nodeData.propertyData);
                if(nodeData.propertyData.moduleType=="join"||nodeData.propertyData.moduleType=="fork"){
                    _vm.showModuleProperty({
                        code:0,
                        data:nodeData.propertyData
                    })
                    _vm.setActiveTabId('componentInfo');

                }else if(!nodeData.propertyData.options||!nodeData.propertyData.options.length){
                    var moduleType=nodeData.propertyData.moduleType,moduleName=nodeData.propertyData.moduleName;
                    var staticParams=nodeData.propertyData.taskDSL.staticParams;
                    _vm.fetchModuleProperty(moduleType,moduleName,function(res){
                        var options=[];
                        if(res.code==0){
                            options= _vm.setfetchModulePropertyData(res.data.options,staticParams)
                        }

                        if(nodeData.propertyData){//报nodeData.propertyData is undefined 问题待检查
                            nodeData.propertyData.options=options;
                            _vm.showModuleProperty({
                                code:0,
                                data:nodeData.propertyData
                            })
                            _vm.setFetchModulePropertySourceData();
                            _vm.setActiveTabId('componentInfo');
                        }

                    })
                }else{
                    _vm.showModuleProperty({
                        code:0,
                        data:nodeData.propertyData
                    })
                    _vm.setActiveTabId('componentInfo');
                    _vm.setFetchModulePropertySourceData();
                }
            }
            ,
            'click':function(e){

                // setUpdateStatus(true);
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
        draw:drawCircle,
        listeners:{
            'mouseover':function(e){
                if(this.parent.disabled){
                    return;
                }
                this.fillStyle='#d98d4f';
                _lineEndName=this.prefix;
                _lineEndModuleType=this.parent.moduleData.moduleType;
                //getStage().update()
            },
            'mouseout':function(e){
                if(this.parent.disabled){
                    return;
                }
                this.fillStyle='#fafafa';
                _lineEndName=null;
                _lineEndModuleType=null;
                //getStage().update()
            },
            'click':function(e){
            }
        }
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
      draw:drawCircle,
      listeners:{
          'mouseover':function(e){
              if(this.parent.disabled){
                  return;
              }
              this.fillStyle='#d98d4f';
              getStage().update()
          },
          'mouseout':function(e){
              if(this.parent.disabled){
                  return;
              }
              this.fillStyle='#fafafa';
              getStage().update()
          },
          'click':function(e){
          },
          'pressup':function(e){
              if(this.parent.disabled){
                  return;
              }
              if(_lineEndName){
                  var startPrefix=this.parent.prefix;
                  var moduleType=this.parent.moduleData.moduleType;
                  //验证是否可以连接
                  var validate=isRelated(moduleType,_lineEndModuleType);
                  if(!validate.success){
                      _vm.messageAlert(validate.msg);
                      _isDrawLineMoving=false;
                      getStage().update();
                      return ;
                  }
                  //验证结束点是否只能有输入 (必须在isOnlyEndByModuleType之前执行)
                  if(isOnlyInputNodeByModuleType(_lineEndModuleType)){
                      delEndPointsLinesByPrefix(_lineEndName);
                  }
                  //验证是否只有一个结束点
                  if(isOnlyEndByModuleType(this.parent.moduleData.moduleType)){
                      var endPrefix=this.parent.edgeData?this.parent.edgeData[0]:"";
                      var id=`${startPrefix}_${endPrefix}_line`;
                      var o=getCanvasObjById(id)
                      getContainer().removeChild(o)
                      _vm.deleteDataInLines(`${startPrefix}_${endPrefix}`);
                      this.parent.edgeData=[_lineEndName]
                  }else{
                      if(!this.parent.edgeData){
                          this.parent.edgeData=[];
                      }
                      this.parent.edgeData.push(_lineEndName)
                  }

                  var endChild=null;
                  _container.children.every((c,i)=>{
                      if(c.prefix==_lineEndName){
                          endChild=c;
                          return false;
                      }
                      return true;
                  })
                  var startx=this.x,starty=this.y,
                      endx=endChild.groupX+endChild.cfg.roundedRect.width/2,
                      endy=endChild.groupY;
                  var lineOpt={
                      start:{x:startx,y:starty},
                      end:{x:endx,y:endy},
                      id:`${startPrefix}_${_lineEndName}`,
                      edgeData:[startPrefix,_lineEndName]
                  };
                  var line=lineModel(lineOpt);
                  _vm.addData2Lines(lineOpt);
                  getContainer().addChildAt(line,0);
              }
              _isDrawLineMoving=false;
              getStage().update();
          },
          'pressmove':function(e){
              if(this.parent.disabled){
                  return;
              }
              _isDrawLineMoving=true;
              var startx=this.x,starty=this.y,endx=e.stageX,endy=e.stageY;
              getStage().update();
              var opt={
                  id:_.uuid(108),
                  start:{x:startx,y:starty},
                  end:{x:endx,y:endy},
                  globalCompositeOperation:'destination-over',
                  lineWidth:2.5,
                  strokeStyle:'#d98d4f'
              };
              createjs.brushUtils.drawLine(getStage().canvas.getContext("2d"),opt)
          }
      }
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
        disabled:false,
        groupX:arg.x,
        groupY:arg.y,
        originalGroupX:arg.x,
        originalGroupY:arg.y
    });
}

function getStartNodeCfg(){
  return {nodeName:"Start",id:"start","moduleId":"start","moduleType":"start","moduleName":"Start", objType:'point',x:_vm.canvasWith/2-85,y:30,roundedRect:{width:120,height:35,objType:'node'}}
}
function getEndNodeCfg(){
    return {nodeName:"End",id:"end","moduleId":"end","moduleType":"end","moduleName":"end",x:_vm.canvasWith/2-85, objType:'point',y:_vm.canvasHeight-300,roundedRect:{width:120,height:35,objType:'node'}}
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
//获取所有连线中end 是它的线
function getLinesByEndPrefix(prefix){
    var res=[];
    _container.children.forEach((kid)=>{
        if(kid.objType=='line'){
            var outId=  kid.edgeData[1];
            if(outId==prefix){
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
        _vm.deleteDataInLines(line.prefix)
    })
}
/**
 *  删除与这个点有关联系，及结束点是它的所有line
 * @param prefix
 */
function delEndPointsLinesByPrefix(prefix){
    var points= getPointsByEndPrefix(prefix);
    //删除此node 在其他节点上的关系
    points.forEach((point,i)=>{
        var index=point.edgeData.indexOf(prefix)
        if(index>-1){
            point.edgeData.splice(index,1);
        }
    })
    var lines=getLinesByEndPrefix(prefix);
    //删除此node 相关线
    lines.forEach((line,i)=>{
        _container.removeChild(line)
    })
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
    isRelated,
    angle,
    distance,
    getPosByRad,
    resetAllLinePosition
};