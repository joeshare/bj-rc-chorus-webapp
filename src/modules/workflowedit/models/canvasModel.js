/**
 * Created by AnThen on 2017-3-14.
 */
//require('!url?name=./dist/images/[name].[ext]!images/metaData/icon1.gif')
let imgUrl=require('images/metaData/node_icon.gif');
const radius=25;
import canvasUtils from  '../utils/canvasUtils.js';
import {createNode} from  './nodeModel.js';
import {model as lineModel} from  './lineModel.js';
import nodeDataModel from  './nodeDataModel.js';
let updateStatus=false;
let iconObj=null;
function model(){
    this.canvas=null;
    this.stage=null;
    this.container=null;
    this.nodeDataArr = [];
    this.lineDataArr = [];
    this.positionNodes={};
    this.isStop=true;
    let _this=this;

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
        if (canvasUtils.getUpdateStatus()) {
            canvasUtils.setUpdateStatus(false)
            _this.stage.update(event);
        }
    }
    this.load=(type)=> {
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
        canvasUtils.setContainer(_this.container);
        if(this.lines&&this.lines.length){
            this.lines.forEach((d,i)=>{
                _this.container.addChild(lineModel(d))
            })
        }
        if(this.data.length){
            this.data.forEach((d,i)=>{
                _this.container.addChild(createNode(d,iconObj))
            })
        }else{
            if(type==2){//批量
                var startOpt=canvasUtils.getStartNodeCfg();
                var endOpt=canvasUtils.getEndNodeCfg();
                nodeDataModel.setNodeData({id:startOpt.id,moduleData:startOpt,propertyData:{moduleType:"start",prefix:startOpt.id,taskReferenceName:'start',noShowTaskReferenceName:true}})
                nodeDataModel.setNodeData({id:endOpt.id,moduleData:endOpt,propertyData:{moduleType:"end",prefix:endOpt.id,taskReferenceName:'end',noShowTaskReferenceName:true}})
                _this.container.addChild(createNode(startOpt,iconObj))
                _this.container.addChild(createNode(endOpt,iconObj))
            }
        }
        this.setChidlrenDisabled(this.chidlrenDisabled)
        this.stage.update();
    }
    this.addChild=(kid)=>{
        _this.container.addChild(kid)
    };
    this.handleImageLoad=()=>{
        function getColorData() {

            myImage = ctx.getImageData(0, 0, 200, 200);

            // Loop through data.
            for (var i = 0; i < picLength * 4; i += 4) {

                // First bytes are red bytes.
                // Remove all red.
                myImage.data[i] = 0;

                // Second bytes are green bytes.
                // Third bytes are blue bytes.
                // Fourth bytes are alpha bytes
            }
        }

        function putColorData() {

            ctx.putImageData(myImage, 0, 0);
        }
        this.load(this.type);
    };
    this.setPoints=(data)=>{
        this.data=data;
    }
    this.setLine=(data)=>{
        this.lines=data;
    }
    this.reset=(data,lines)=>{
        //this.setPoints(data)
        //this.setLine(lines)
        //this.container.removeAllChildren();
        //this.load(this.type)
    }
    this.setChidlrenDisabled=(f)=>{
        _this.container&&_this.container.children.forEach((c,i)=>{
            c.disabled=f;
        })

    }
    this.init=(data,lines,type,canvasId,chidlrenDisabled)=>{
        //examples.showDistractor();
        // create stage and point it to the canvas:
        this.canvas=null;
        this.canvas = document.getElementById(canvasId||"workflow-edit-task-canvas");
        if(!this.canvas){
            return;
        }
        this.stage=null;
        this.stage = new createjs.Stage(this.canvas);
        this.stage.enableMouseOver(10);
        this.stage.mouseMoveOutside = false; // keep tracking the mouse even when it leaves the canvas
        this.data=data;
        this.lines=lines;
        this.type=type;
        this.chidlrenDisabled=chidlrenDisabled;
        iconObj=this.image = new Image();
        canvasUtils.setImgObj(iconObj);
        canvasUtils.setStage(this.stage);
        this.image.src = imgUrl;
        this.image.onload = this.handleImageLoad;
        createjs.Ticker.removeAllEventListeners("tick");
        createjs.Ticker.addEventListener("tick", tick);
    }
}
exports.canvas = new model();