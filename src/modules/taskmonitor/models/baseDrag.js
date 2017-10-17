/**
 * Author LLJ
 * Date 2016-4-29 14:29
 */

var EventEmitter=require('Plugins/EventEmitter.js');
window.EventEmitter=EventEmitter;
var DOMDrag=require('Plugins/DOMDrag.js');

//Private

var defaultCfg={
    root:"",
    listener:{
        beforedrag:null,
        dragging:null,
        drop:null
    }
};

//基类

var Base=function(arg){
    this.initialize(arg);
};
Base.prototype.initialize=function(arg){
     var opt=$.extend(true,defaultCfg,arg);
     this.create(opt);
};
Base.prototype.create=function(arg){
    this.drag = DOMDrag.create(arg.root, {});
    var _this=this;
    this.cfg=arg;
    this.unBindAllEvent();
    if(arg.listeners){
        for(var i in arg.listeners){
            this.bindEvent(i,arg.listeners[i]);
        }
    }

};
Base.prototype.bindEvent=function(event,callBack){
    var _this=this;
    callBack&&_this.drag.on(event,function(e){
        callBack.call(_this,e,this);
    })
};
Base.prototype.unBindAllEvent=function(){
    var _this=this;
    if(_this.cfg.listeners){
        for(var i in _this.cfg.listeners){

            this.unBindEvent(i,_this.cfg.listeners[i]);
        }
    }
};
Base.prototype.unBindEvent=function(event,callBack){
    this.drag.off(event,callBack);
};
/**
 *  判断是否进入目标区域
 * @param target
 * @param x
 * @param y
 * @returns {*}
 */
Base.prototype.isEnterRect=function(target,x,y){
// 检测一个坐标点x, y是否在某个矩形范围内
    return DOMDrag.isEnterRect(target.getBoundingClientRect(),x,y)
};
/**
 * 判断是否进入目标区域
 * @param target
 * @param source
 * @returns boolean
 */
Base.prototype.isEnterElement=function(target,source){
    var rect=source.getBoundingClientRect();
    return this.isEnterRect(target,rect.left,rect.top);
};

Base.prototype.getDragTarget=function(e){
    return e.target.dragTarget;
};
Base.prototype.getClientRect=function(e){
    return e.target.dragTarget.getBoundingClientRect();
};
/**
 * 获取相对位置
 * @param content 容器dom
 * @param el 拖动dom
 * @param offsetX x偏移量
 * @param offsetY y偏移量
 * @returns {{x: (*|number), y: (*|number)}}
 */
Base.prototype.getRelPost=function(content,el,offsetX,offsetY){
    var _this=this;
    var conRect=content.getBoundingClientRect(),
        dragRect=el.getBoundingClientRect();

    return {
        x:dragRect.left-conRect.left+document.body.scrollLeft+content.scrollLeft+(offsetX||0),
        y:dragRect.top-conRect.top+document.body.scrollTop+content.scrollTop+(offsetY||0)
    }
};
Base.prototype.changeDragTarget=function(e,el){
    e.target.dragTarget=el;
};
module.exports=Base;
