/**
 * Created by AnThen on 2017-3-21.
 */
import {setPropertyList,setActiveNodeShadow} from './utils.js';
exports.createLine=(opt)=>{
    var line=new createjs.Brush({
        id:opt.id,
        name:opt.name,
        start:opt.start,
        end:opt.end,
        globalCompositeOperation:'destination-over',
        cursor:"pointer",
        strokeStyle:'#3498db',
        lineJoin : 'miter',
        lineWidth:3,
        objType:"line",
        edgeData:opt.edgeData,
        draw:createjs.brushUtils.drawLine,
        properts:opt.properts,
        listeners:{
            click:function(e){
                setPropertyList(this.properts);
                setActiveNodeShadow(this.id);
            }
        }
    });
    return line;
};