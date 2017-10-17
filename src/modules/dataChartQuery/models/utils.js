/**
 * Created by AnThen on 2017-3-21.
 */
var _update=true;
var _container=null;
var _chartData=null;
var _positionNodes=null;
var _nodeShodowClr="rgba(100,100,100,0.3)";
var _activeNodeShodowClr='#b35202';
var _circleStrokeStyle='#d98d4f';
//主vue 对象
var _vm=null;
/**
 * 获取指定点的夹角弧度
 * @param originalX  原点x
 * @param originalY 原点y
 * @param pointX 某点x
 * @param pointY 某点y
 * @returns {number} 弧度
 */
exports.angle=(originalX, originalY, pointX, pointY)=>{
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
exports.getPosByRad=(orPos, rad, radius)=> {
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
exports.distance=(bx, by, ex, ey)=> {
    var _x = Math.abs(bx - ex);
    var _y = Math.abs(by - ey);
    var sum = Math.pow(_x, 2) + Math.pow(_y, 2);
    return Math.sqrt(sum);
}
exports.setChartData=(data)=>{
    _chartData=data;
};
exports.setContainer=(con)=>{
    _container=con;
};
exports.setNodeMaxZ=(node)=>{
    _container.addChild(node);
};
exports.setPropertyList=(list)=>{
    _vm.propertyList=list;
};
exports.setVM=(vm)=>{
    _vm=vm;
};
exports.setActiveNodeShadow=(id)=>{
    _container.children.forEach((kid,i)=>{
        if(kid.objType=='point'){
            kid.shadowColor=kid.id==id?_activeNodeShodowClr:_nodeShodowClr;
        }
    })
};
exports.circleStrokeStyle=_circleStrokeStyle;
//modifyNode 被修改坐标的点
function resetAllObjPosition(modifyNode){
    _container.children.every((kid)=>{
        if(kid.objType=='line'){
            var inId=  kid.edgeData[0];
            var outId=  kid.edgeData[1];
            if(inId==modifyNode.id){
                kid.start=modifyNode;
               return false;
            }
            if(outId==modifyNode.id){
                kid.end=modifyNode;
                return false;
            }
        }
        return true;
    })
}

exports.resetNodePosition=(node)=>{
   var p= _positionNodes[node.id];
    p.x=node.x;
    p.y=node.y;
    resetAllObjPosition(node);
};
exports.setPosition=(data)=>{
    _positionNodes=data;
};
exports.setUpdateStatus=(v)=>{
    _update=v
};
exports.getUpdateStatus=()=>{
    return _update;
};