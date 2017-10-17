/**
 * Created by AnThen on 2017-9-5.
 */
import {angle as _angle,getPosByRad,distance,getInt as _getInt} from 'Utils/canvasUtil';
const RADIUS=25;
const OFFSET_X=5;
const MIN_ROW_HEIGHT=85;
let maxRowNumber=1;
function clone(o){
    return 0?JSON.parse(JSON.stringify(o)):o;
}
/**
 * 遍历关系
 * @param relations
 * @param array2D
 * @param tarEntity
 * @param entityMap
 * @param path
 */
function iterateRelations({relations,array2D,tarEntity,entityMap,path}){
    let [relation,fromEntityId,fromEntity]=[null];
    for(let len=relations.length-1;len>-1;len--){
        relation=relations[len];
        if(relation.toEntityId==tarEntity.guid){
            fromEntityId=relation.fromEntityId;
            fromEntity=entityMap[fromEntityId];
            //fromEntity.pos 表示已经被标记过了
            if(!fromEntity.pos){
                if(!array2D[path]){
                    array2D[path]=[];
                }
                fromEntity.pos=[path,array2D.length];
                array2D[path].push(fromEntity)
                //relations.splice(len,1)
            }

        }
    }
    if(array2D[path]){
        for(let tar of array2D[path]){
            iterateRelations({relations,array2D,tarEntity:tar,entityMap,path:path+1})
        }

    }
}
function _transformer2DArray(data,canvas){
    let [array,guidEntityMap,relations,relation,fromEntityId]=[[],data.guidEntityMap,data.relations];
    let baseEntity=guidEntityMap[data.baseEntityGuid];
    if(baseEntity){
        baseEntity.isBase=true;
        baseEntity.pos=[0,0];
        array[0]=[baseEntity];
        iterateRelations({relations,array2D:array,tarEntity:baseEntity,entityMap:guidEntityMap,path:1})
        _setPositionBy2DArray(array,canvas)
    }

    return array;
}
function _transformerEdgeData(entityMap,relations){
    let [edgeMaps,fromEntityId,toEntityId,fromEntity,toEntity,star,p1,p2,p3,dis,dis3,angle,isReverse,diffY]=[{}];
    for(let rel of relations){
        fromEntityId=rel.fromEntityId;
        toEntityId=rel.toEntityId;
        fromEntity=entityMap[fromEntityId]
        toEntity=entityMap[toEntityId];
        if(!fromEntity||!toEntity){
            continue;
        }
        //x轴的距离
        dis=distance(fromEntity.x,0,toEntity.x,0);
        dis3=_getInt(dis/3)
        diffY=Math.abs(fromEntity.y-toEntity.y);
        star={x:fromEntity.x,y:fromEntity.y};
        isReverse=false;
        rel.id=`${fromEntityId}||${toEntityId}`;
        if(toEntity.isBase){//基础点
            p1={x:fromEntity.x+dis3,y:fromEntity.y};
            p3={x:toEntity.x-RADIUS-OFFSET_X,y:toEntity.y};
            angle=Math.PI/2;
            let ftY_Diff=fromEntity.y-toEntity.y;
            if(ftY_Diff>RADIUS*3){//第一象限
                p2={x:toEntity.x,y:toEntity.y+diffY};
                p3=getPosByRad(toEntity,Math.PI/2,RADIUS+OFFSET_X);
                angle=0;
            }else if(ftY_Diff>0&&ftY_Diff<=RADIUS*2){//第一象限
                p3=getPosByRad(toEntity,11*Math.PI/12,RADIUS+OFFSET_X)
                p2=getPosByRad(p3,11*Math.PI/12,RADIUS*2);
                angle=5*Math.PI/12;
            }else if(ftY_Diff>0&&ftY_Diff<=RADIUS*3){//第一象限
                p3=getPosByRad(toEntity,3*Math.PI/4,RADIUS+OFFSET_X)
                p2=getPosByRad(p3,3*Math.PI/4,RADIUS*2);
                angle=Math.PI/4;
            }else if(ftY_Diff<0&&Math.abs(ftY_Diff)>RADIUS*3){//第4象限
                p2={x:toEntity.x,y:toEntity.y-diffY};
                p3=getPosByRad(toEntity,-Math.PI/2,RADIUS+OFFSET_X);
                angle=Math.PI;
            }else if(ftY_Diff<0&&Math.abs(ftY_Diff)<=RADIUS*2){//第4象限
                p3=getPosByRad(toEntity,-11*Math.PI/12,RADIUS+OFFSET_X);
                p2=getPosByRad(p3,-11*Math.PI/12,RADIUS*2);
                angle=7*Math.PI/12;
            }else if(ftY_Diff<0&&Math.abs(ftY_Diff)<=RADIUS*3){//第4象限
                p3=getPosByRad(toEntity,-3*Math.PI/4,RADIUS+OFFSET_X);
                p2=getPosByRad(p3,-3*Math.PI/4,RADIUS*2);
                angle=3*Math.PI/4;
            }else {
                p2={x:toEntity.x-RADIUS-OFFSET_X,y:toEntity.y};
            }


        }else if(fromEntity.x<toEntity.x){//非基础点
            if(fromEntity.y>toEntity.y){//第一象限
                p1={x:fromEntity.x,y:fromEntity.y-diffY};
            }else if(fromEntity.y<toEntity.y){//第4象限
                p1={x:fromEntity.x,y:fromEntity.y+diffY};
            }else {
                p1={x:fromEntity.x,y:fromEntity.y};
            }
            p2={x:toEntity.x-dis3,y:toEntity.y};
            p3={x:toEntity.x-RADIUS-OFFSET_X,y:toEntity.y};
            angle=Math.PI/2;
        }else if(fromEntity.x>toEntity.x){//回流方向
            star=getPosByRad(toEntity,Math.PI/4,RADIUS+OFFSET_X);
            angle=-Math.PI/4;
            p3={x:fromEntity.x-RADIUS,y:fromEntity.y};
            p2={x:fromEntity.x-dis3,y:fromEntity.y};
            if(fromEntity.y>toEntity.y){//第2象限
                p1={x:star.x,y:star.y+OFFSET_X};
            }else if(fromEntity.y<toEntity.y){//第3象限
                p1={x:toEntity.x,y:toEntity.y-OFFSET_X};
            }else {
                p1=getPosByRad(toEntity,Math.PI/4,RADIUS+dis3);
                p2=getPosByRad(fromEntity,3*Math.PI/4,RADIUS+dis3)
                p3=getPosByRad(fromEntity,3*Math.PI/4,RADIUS)
                isReverse=true;
            }
        }
        rel.bezierPos=[star,p1,p2,p3];
        rel.angle=angle;
        rel.isReverse=isReverse;
        edgeMaps[rel.id]=rel;
    }
    relations.forEach(rel=>{

    })
    return edgeMaps;
}
function _setPositionBy2DArray(array,canvas){
    if(!array.length) return ;
    let [width,height]=[canvas.width,canvas.height];
    let maxRow=1;
    array.forEach(arr=>{
        maxRow=arr.length>maxRow?arr.length:maxRow;
    })
    let [colWidth,rowHeight,colNum,tempRowNum]=[_getInt(width/array.length),0,array.length,0];
    array.forEach((arr,c)=>{
        tempRowNum=arr.length+1;
        //获取最大行数
        maxRowNumber=maxRowNumber<tempRowNum?tempRowNum:maxRowNumber;
        rowHeight=_getInt(height/tempRowNum);
        rowHeight=rowHeight<MIN_ROW_HEIGHT?MIN_ROW_HEIGHT:rowHeight;
        arr.forEach((a,i)=>{
            a.x=_getInt(colNum*colWidth-colWidth/2);
            a.y=(i+1)*rowHeight;
        })
        colNum--;
    })
}

exports.transformer2DArray=_transformer2DArray
exports.setPositionBy2DArray=_setPositionBy2DArray
exports.transformerEdgeData=_transformerEdgeData
exports.getMaxRowNumber=()=>{
    return maxRowNumber;
}