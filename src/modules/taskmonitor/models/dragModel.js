/**
 * Author LLJ
 * Date 2016-4-26 9:42
 */
var BaseDrag=require('./baseDrag.js');
import canvasUtils from  '../utils/canvasUtils.js';
import {createNode} from  './nodeModel.js';
import nodeDataModel from  './nodeDataModel.js';
import fetchAgent from  '../utils/fetchAgent.js';
import dataUtils from  '../utils/dataUtils.js';

//拖动对象原始坐标
var dragTarOriginal={};
var TmpDrag=null;
var isEnter=false;
function createTmpNode(itm, data) {
    var inner = itm.innerHTML;
    var tmp = $('<div></div>').html(inner)
        .addClass(itm.className + "tmp-drag dragging ")
        .css({
            'zIndex': 1000,
            'width':itm.offsetWidth
        })

    $('body').append(tmp);
    return tmp;
};
function model(mv){
    var _this=this;
    _this.view=mv;
    var cfg={
        root:'workflow-edit-wrapper',
        listeners:{
            beforedrag:function(e){
                var drag=this.getDragTarget(e),$drag=$(drag);
                drag.style.zIndex=1000;
                var con=$('.admin-page-content-main').get(0);
                isEnter=false;
                var top=con.scrollTop,
                    left=con.scrollLeft;
                //_this.clone(drag);
                dragTarOriginal={
                    x:drag.offsetLeft-left,
                    y:drag.offsetTop-top
                };
                if(TmpDrag){
                    TmpDrag.remove();
                    TmpDrag=null;
                }
                TmpDrag= createTmpNode(drag);
                TmpDrag.addClass('workflow-tmp-drag');
                TmpDrag.css({left: dragTarOriginal.x,
                    top:dragTarOriginal.y
                })
                TmpDrag[0].style.zIndex=_this.getMaxZIndex();
                e.target.dragTarget=TmpDrag[0];

            },
            dragging:function(e,domDrag){
                var $itm=$('#workflow-edit-task-canvas'),itm=$itm[0];
                if( domDrag.isEnterRect(itm.getBoundingClientRect())){
                    _this.view.isCanvasActive=true;
                 }else{
                    _this.view.isCanvasActive=false;
                }
            },
            drop:function(e){
                if(_this.view.isCanvasActive){
                    _this.view.isCanvasActive=false;
                    if(!TmpDrag){
                        return;
                    }
                    var rect=TmpDrag[0].getBoundingClientRect();
                    var canRect=$('#workflow-edit-task-canvas')[0].getBoundingClientRect();
                    var x=rect.left-canRect.left;
                    var y=rect.top-canRect.top;
                    var id=_.uuid(50);
                    var objType='node';
                    var moduleData=_this.view.currentDragData;
                    var nodeName=moduleData.moduleName;
                    var moduleType=moduleData.moduleType;
                    var moduleName=moduleData.moduleName;
                    var opt=$.extend(true,{id,x,y,objType,nodeName,moduleData},_this.view.currentDragData);
                    canvasUtils.getContainer().addChild(createNode(opt,canvasUtils.getImgObj()))
                    canvasUtils.setActiveNodeShadow(id);
                    canvasUtils.setUpdateStatus(true);
                    if(moduleType=='fork'||moduleType=='join'){
                        _this.view.setActiveTabId('componentInfo');
                        var propertyData={
                            moduleName:nodeName,
                            moduleType:moduleType,
                            taskReferenceName:nodeName,
                            taskType:dataUtils.getTaskType(moduleType),
                            nodePrefix:id,
                            taskId:"",
                            hiddenTaskParams:true,
                            taskReferenceNameWarnings:null,
                            isShowModuleProperty:false,
                            options:[]
                        };
                        nodeDataModel.setNodeData({
                            id,
                            propertyData
                        })
                        _this.view.showModuleProperty({
                            code:0,
                            data:propertyData
                        });
                        _this.view.setActiveTabId('componentInfo');
                    }else{
                        fetchAgent.fetchModuleProperty({moduleType,moduleName},function(res){
                            var propertyData={
                                moduleName:nodeName,
                                moduleType:moduleType,
                                taskReferenceName:nodeName,
                                taskType:dataUtils.getTaskType(moduleType),
                                nodePrefix:id,
                                taskReferenceNameWarnings:null,
                                timeoutPolicy:"",
                                hiddenTaskParams:false,
                                isShowModuleProperty:dataUtils.isShowModuleProperty(moduleType),
                                options:[]
                            };
                            if(res&&!(res.code*1)){
                                dataUtils.transform2ModulePropertyData($.extend(true,propertyData,res.data))
                            }
                            _this.view.showModuleProperty({
                                code:0,
                                data:propertyData
                            });
                            _this.view.setActiveTabId('componentInfo');
                            nodeDataModel.setNodeData({
                                id,
                                propertyData
                            })
                        })
                    }

                    _this.view.currentDragData=null;
                }
                if(TmpDrag){
                    TmpDrag.remove();
                    TmpDrag=null;
                }


            }
        }
    };
    this.getMaxZIndex=function(){
        //var tmpZ=0;
        //_this.view.$el.find(".dom-dragable").each(function(i,item){
        //    var z=  $(this).css("z-Index");
        //    tmpZ= tmpZ<z?z:tmpZ;
        //})
        //return ++tmpZ;
    };
    this.dragDisable=function(type){
        if(type){
           // _this.view.$el.find(".dom-dragable").addClass("dom-dragdisable")
        }else{
          //  _this.view.$el.find(".dom-dragable").removeClass("dom-dragdisable")
        }
    }
     this.setView=(v)=>{
         _this.view=v;
     }
    var baseDrag=new BaseDrag(cfg);
    this.unBindAllEvent=()=>{
        baseDrag.unBindAllEvent();
    }

}
var instance=new model();
export default instance;
