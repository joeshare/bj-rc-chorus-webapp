/**
 * Created by AnThen on 2017-3-14.
 */
//require('!url?name=./dist/images/[name].[ext]!images/metaData/icon1.gif')
let imgUrl=require('images/metaData/node_icon.gif');
import {fetchBlood as fetchMockBlood} from '../mock.js';
import {angle,getPosByRad,distance} from './utils.js';
import {createNode }from './node.js';
import {createLine }from './line.js';
import {createArrow }from './arrow.js';
let iconObj=null;
let canW= 740;
let canH= 368;

function model(){
    this.canvas=null;
    this.stage=null;
    this.container=null;
    this.image=null;
    this.nodeDataArr = [];
    this.lineDataArr = [];
    this.tableid = "";
    this.levelDataArr = [];
    this.ajaxqurey= null;
    this.defaultColumnSpace=canW;
    this.defaultRowSpace=canH;
    this.isStop=true;
    let _this=this;

    function clearData(){
        //节点数据
        _this.nodeDataArr = [];
        //连线数据
        _this.lineDataArr = [];
        _this.levelDataArr = [];
        _this.defaultColumnSpace=canW;
        _this.defaultRowSpace=canH;
    }
    function  compareFuntion (propertyName) {
        return function(object1,object2){
            var value1=object1[propertyName];
            var value2=object2[propertyName];
            if(value1<value2){
                return -1;
            }else if(value1>value2){
                return 1;
            }else{
                return 0;
            }
        };
    }
    function cloneProperty(obj){
        var proNames=["nodeId","nodeName","pathLevel","type"];
        var nObj = {};
        if (!obj) {
            return null;
        }
        proNames.forEach(function(n,i){
            nObj[n] = obj[n];
        })
        return nObj;
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

    function setSize() {
        var  mxColumn=getMaxColumn();
        var  mxRow=getMaxPathLevel();
        if(mxColumn>3){
            _this.canvas.width=_this.defaultColumnSpace+260*mxColumn/2;
        }
        if(mxRow>3){
            _this.canvas.height=_this.defaultRowSpace+200*(mxRow-3);
        }
        var tempColumnSpace=_this.canvas.width/mxColumn;
        var tempRowSpace=_this.canvas.height/mxRow;
        if(tempColumnSpace<_this.defaultColumnSpace){
            _this.defaultColumnSpace=tempColumnSpace;
        }
        if(tempRowSpace<_this.defaultRowSpace){
            _this.defaultRowSpace=tempRowSpace;
        }

    }
    function transformerLineData(obj) {
        if (obj) {
            var children = obj.children;
            if (children && children.length) {
                for (var i = 0, len = children.length; i < len; i++) {
                    var child=children[i];
                    var rec = cloneProperty(obj);
                    rec['end']= cloneProperty(child);
                    _this.lineDataArr.push(rec);
                    if(child.children&&child.children.length){
                        transformerLineData(child)
                    }

                }
            }
        }

    }

    function transformerNodeData(obj,parentId) {
        if (obj) {
            var rec = cloneProperty(obj);
            var level=rec.pathLevel;
            if(!_this.levelDataArr[level]){
                _this.levelDataArr[level]=[];
            }
            rec.parentId=parentId;
            rec.childrenNum=0;
            _this.levelDataArr[level].push(rec)
            _this.nodeDataArr.push(rec)
            var children = obj.children;
            if (children && children.length) {
                rec.childrenNum=children.length;
                for (var i = 0, len = children.length; i < len; i++) {
                    transformerNodeData(children[i],rec.parentId);
                }
            }
        }

    }
    function getNodeData(id,level){
        var p=null;
        if(_this.levelDataArr[level]){
            _this.levelDataArr[level].every(function(node,i){
                if(node.nodeId==id){
                    p=cloneObj(node);
                    return false;
                }
                return true;
            })
        }
        return p;
    }
    function setPostData(){
        var offsetX=85,offsetY=25;
        var levelLen=getMaxPathLevel();
        _this.levelDataArr.forEach(function(nodes,i){
            //注意根节点在顶部
            //var y=(++i)*_this.defaultRowSpace-_this.defaultRowSpace/2;
            //nodes.forEach(function(node,m){
            //    var len=nodes.length+1;
            //    node.x=(++m)*_this.canvas.width/len-offsetX;
            //    node.y=y-offsetY;
            //})
            //注意根节点在底部
            var y=(levelLen)*_this.defaultRowSpace-_this.defaultRowSpace/2;
            nodes.forEach(function(node,m){
                var len=nodes.length+1;
                node.x=(++m)*_this.canvas.width/len-offsetX;
                node.y=y-offsetY;
            })
            levelLen--;
        })

    }
    function getMaxPathLevel(){
        _this.nodeDataArr.sort(compareFuntion("pathLevel"));
        return _this.nodeDataArr[ _this.nodeDataArr.length-1].pathLevel+1;
    }
    function getMaxColumn(){
        var max=0;
        _this.levelDataArr.forEach(function(x,i){
            max=x.length>max?x.length:max;
        })
        return max;
    }
    this.switchNodeByType=(type,x,y,arg)=>{
        let opt={
            roundedRect:{
                strokeStyle:'#d98d4f',
                fillStyle:'#fafafa',
                nodeType:arg.nodeType,
                nodeName:arg.nodeName
            }
        };
        if(type){
            opt.roundedRect.strokeStyle='rgb(171,108,225)';
        }
        return createNode(1,x,y,opt,iconObj)
    };

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
                if(res.code =='0')
                {

                    transformerLineData(res.data);
                    transformerNodeData(res.data,0);
                    setSize();
                    setPostData();
                    cb&&cb(res);
                    if(res.data.children.length==0&&!res.data.nodeId)
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
                console.log(err);
                $('#nodatas').show();
                _this.vm.isHiddenLoading=true;
            }
        });



    };
    this.handleImageLoad=()=> { }
    this.clearData=()=>{

    };
    this.clearCanvas=()=>{
        if(this.container){
            this.container.removeAllChildren();
            this.stage.update();
        }
    };
    this.fetch=(tableid)=>{
        this.tableid = tableid;
        this.image.src = imgUrl;
        this.clearCanvas();
        this.fetchData(()=>{

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
            var lineArr=[];
            _this.lineDataArr.forEach(function(node,i){
                var startNode=getNodeData(node.nodeId,node.pathLevel);
                var endNode=getNodeData(node.end.nodeId,node.end.pathLevel);
                if(startNode&&endNode){
                    var id=`${node.nodeId}-${node.end.nodeId}`;
                    var lineOpt={
                        id:id,
                        name:id,
                        start:{
                            x:startNode.x+85,
                            y:startNode.y
                        },
                        end:{
                            x:endNode.x+85,
                            y:endNode.y+50
                        }
                    }
                    lineArr.push(lineOpt);
                    _this.container.addChild(createLine(lineOpt));
                    lineOpt.id+="-arrow";
                    lineOpt.name+="-arrow";
                    _this.container.addChild(createArrow(lineOpt))
                    // new DrawLine(_this.context,startNode.x+50, startNode.y+50, endNode.x+50,endNode.y).draw();
                }
            })
            _this.levelDataArr.forEach(function(nodes,i){
                nodes.forEach(function(node,m){
                    // 1 job//0 table
                    var box=_this.switchNodeByType(node.type,node.x,node.y,{nodeType:node.type,nodeName:node.nodeName})
                    _this.container.addChild(box);
                })


            })
            this.stage.update();
        })
    }
    this.init=(vm)=>{
        if(this.canvas){
            return;
        }
        this.canvas = document.getElementById("meta-data-canvas");
        if(this.canvas){
            this.stage = new createjs.Stage(this.canvas);
            iconObj=this.image = new Image();
            this.image.src = imgUrl;
            this.image.onload = this.handleImageLoad;
            this.vm=vm;
        }

    }
}
module.exports = {
    blood:new model()
};