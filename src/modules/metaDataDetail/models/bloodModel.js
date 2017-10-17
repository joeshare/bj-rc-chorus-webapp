/**
 * Created by AnThen on 2017-3-14.
 */
//require('!url?name=./dist/images/[name].[ext]!images/metaData/icon1.gif')
let imgUrl=require('images/metaData/icons.png');
import {createPoint }from './point.js';
import {createEdge }from './edge.js';
import {blood as bloodMock, blood1, blood2, blood3, blood4, blood5, blood6, blood7, blood8, blood9}from '../mock.js';
import {transformer2DArray,transformerEdgeData,getMaxRowNumber }from '../utils/bloodUtil.js';
let iconObj=null;
let canW= 740;
let canH= 368;
const ROW_HEIGHT=85;
function model(){
    this.canvas=null;
    this.stage=null;
    this.container=null;
    this.image=null;
    this.tableid = "";
    this.isStop=true;
    let _this=this;

    function clearData(){

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
    this.setWidthHeight=(w,h)=>{
        let dom= document.getElementById("meta-data-canvas")
        if(dom){
            dom.width=w;
            dom.height=h;
        }
    }

    this.fetchData=(cb)=>{
        clearData();
        $('#nodatas').hide();
         this.ajaxqurey=  _.ajax({
            url:'/api/metadatamanagement/fetchblood',
            method:'POST',
            data:{
                tableid:_this.tableid
            },
            success:function(res){
                if(res.code ==0)
                {
                    let array2D=transformer2DArray(res.data,_this.canvas);
                    let edgeData=transformerEdgeData(res.data.guidEntityMap,res.data.relations);
                    _this.changeCanvasHeight()
                    cb&&cb(array2D,edgeData);
                    if(array2D.length==0)
                    {
                        $('#nodatas').show();
                    }
                    else {
                        $('#nodatas').hide();
                    }
                }else{
                    $('#nodatas').show();
                }
                _this.vm.isHiddenLoading=true;
            },
            error:function (err) {
                $('#nodatas').show();
                _this.vm.isHiddenLoading=true;
            }
        });
    };
    //根据行数改变画布的高度
    this.changeCanvasHeight=()=>{
       let realHeight= ROW_HEIGHT*getMaxRowNumber()
       if(realHeight>this.canvas.height){
           this.setWidthHeight(this.canvas.width,realHeight)
       }
    }
    this.handleImageLoad=()=> { }
    this.clearData=()=>{ };
    this.clearCanvas=()=>{
        if(this.container){
            this.container.removeAllChildren();
            this.stage.update();
        }
    };
    this.update=()=>{
        if(this.container&&this.stage){
            this.stage.update();
        }
    }
    this.fetch=(tableid)=>{
        this.tableid = tableid;
        this.image.src = imgUrl;
        this.clearCanvas();
        this.fetchData((entityData,edgeMaps)=>{
            // iconObj = event.target;
            if(!this.container){
                this.container = new createjs.Container();
            }else{
                this.container.removeAllChildren();
                this.stage.update();
            }
            // this.container = new createjs.Container();
            this.stage.removeAllChildren();
            this.stage.addChild(this.container);
            let [edge,edgeId]=[];
            //线
            for( edgeId in edgeMaps){
                edge=edgeMaps[edgeId];
                _this.container.addChild(createEdge({id:edgeId,bezierPos:edge.bezierPos,angle:edge.angle,isReverse:edge.isReverse}));
            }
            //点
            entityData.forEach(arr=>{
                arr.forEach(p=>{
                    _this.container.addChild(createPoint({id:p.guid,x:p.x,y:p.y,text:p.displayText,typeName:p.typeName,image:this.image}));
                })
            })
            this.stage.update();
        })

    }
    this.init=(vm)=>{
        this.vm=vm;
        this.canvas=null;
        this.canvas = document.getElementById("meta-data-canvas");
        if(this.canvas){
            this.stage = new createjs.Stage(this.canvas);
            iconObj=this.image = new Image();
            this.image.src = imgUrl;
            this.image.onload = this.handleImageLoad;
        }

    }
}
module.exports = {
    blood:new model()
};