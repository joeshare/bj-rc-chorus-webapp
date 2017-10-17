/**
 * Created by AnThen on 2017-3-14.
 */
//require('!url?name=./dist/images/[name].[ext]!images/metaData/icon1.gif')
import {fetchBlood as fetchMockBlood} from '../mock.js';
import modelUtil from './utils.js';
import {createNode }from './node.js';
import {createLine }from './line.js';
const radius=25;
function transformVertexProperts(codeNameMap,propertymap){
    var properts=[];
    for(var k in  codeNameMap){
        properts.push({
            _label:codeNameMap[k],
            _code:k,
            _value:propertymap[k]
        })
    }
    return properts;
}
function transformEdgeProperts(codeNameMap,propertymap){
    var properts=[];
    for(var k in  codeNameMap){
        properts.push({
            _label:codeNameMap[k],
            _code:k,
            _value:k=='id'?propertymap[k].relationId:propertymap[k]
        })
    }
    return properts;
}

function model(){
    this.canvas=null;
    this.stage=null;
    this.container=null;
    this.nodeDataArr = [];
    this.lineDataArr = [];
    this.positionNodes={};
    this.isStop=true;
    let _this=this;
    function getRandomPosition(totalCount){
        var x= _this.canvas.width*Math.random();
        var y= _this.canvas.height*Math.random();
        var minX=radius+10;
        var maxX=_this.canvas.width-radius-10;
        var minY=radius+10;
        var maxY=_this.canvas.height-radius-10;
        if(totalCount<20){
            minX+=maxX*0.1;
            maxX*=0.9;
            minY+=maxY*0.1;
            maxY*=0.5;
        }else if(totalCount>=20&&totalCount<50){
            maxY*=0.7;
        }
        x=x<radius?minX:x;
        x=x>maxX?maxX:x;
        y=y<radius?minY:y;
        y=y>maxY?maxY:y;
        return {
            x,
            y
        };
    }
    function clearCanvas(ctx){
        ctx.clearRect(0,0,_this.canvas.width,_this.canvas.height);
    }
    function clearData(){
        //节点数据
        _this.nodeDataArr = [];
        //连线数据
        _this.lineDataArr = [];
        _this.positionNodes={};
    }

    function cloneObj(obj) {
        var nObj = {};
        if (!obj) {
            return null;
        }
        for(var k in obj){
            nObj[k] = obj[k];
        }
        return nObj;
    }
    function tick(event) {
        if (modelUtil.getUpdateStatus()) {
            modelUtil.setUpdateStatus(false)
            _this.stage.update(event);
        }
    }
    this.load=(data)=> {
        modelUtil.setChartData(data);
        if(!this.container){
            this.container = new createjs.Container();
        }else{
            this.container.removeAllChildren();
            this.stage.update();
        }
        // this.container = new createjs.Container();
        this.stage.removeAllChildren();
        this.stage.addChild(this.container);
        clearData();
        modelUtil.setContainer(_this.container);
        if(data.vertexOutputs&&data.vertexOutputs.length){
            data.vertexOutputs.forEach((vertex,i)=>{
                var nodeName= vertex.propertymap.label;
                var pId= vertex.propertymap.id;
                var properts=transformVertexProperts(vertex.codeNameMap,vertex.propertymap);
                var randomPos=getRandomPosition(data.vertexOutputs.length);
                var x=randomPos.x,y=randomPos.y
                _this.positionNodes[pId]={
                    objType:"node",
                    id:pId,
                    x,
                    y
                };
                _this.container.addChild(createNode(pId,x,y,{
                    strokeStyle:modelUtil.circleStrokeStyle,
                    fillStyle:'#fafafa',
                    nodeType:1,
                    radius,
                    properts,
                    nodeName
                }))
                if(i==0){
                    modelUtil.setPropertyList(properts);
                    modelUtil.setActiveNodeShadow(pId);
                }
            })
        }

        if(data.edgeOutputs&&data.edgeOutputs.length){
            data.edgeOutputs.forEach((edge,i)=>{
                var id=edge.propertymap.id.relationId;
                var name=edge.propertymap.label;
                var inNodeId=edge.propertymap.id.inVertexId;
                var outNodeId=edge.propertymap.id.outVertexId;
                var start=_this.positionNodes[inNodeId];
                var end=_this.positionNodes[outNodeId];
                var properts=transformEdgeProperts(edge.codeNameMap,edge.propertymap);
                _this.container.addChild(createLine({
                    id,
                    name,
                    start,
                    end,
                    properts,
                    edgeData:[inNodeId,outNodeId]
                }))
            })
        }
        modelUtil.setPosition(_this.positionNodes);
        this.stage.update();

    }
    this.init=(data)=>{
        //examples.showDistractor();
        // create stage and point it to the canvas:
        this.canvas=null;
        this.canvas = document.getElementById("data-chart-canvas");
        this.stage=null;
        this.stage = new createjs.Stage(this.canvas);
        this.stage.enableMouseOver(10);
        this.stage.mouseMoveOutside = true; // keep tracking the mouse even when it leaves the canvas
        this.load(data[0])
        createjs.Ticker.removeAllEventListeners("tick");
        createjs.Ticker.addEventListener("tick", tick);
    }
}
module.exports = {
    point:new model()
};