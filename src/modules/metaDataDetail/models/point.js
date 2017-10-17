/**
 * Created by AnThen on 2017-3-21.
 */
var iconObj=null;
const RADIUS=25;
function drawIcon(ctx,imageObj){
    var x=this.x,y=this.y;
    ctx.save();
    ctx.beginPath();
    ctx.drawImage(imageObj, 0, 0);
    ctx.restore();
}

function drawText(ctx,txt){
    var str1="",str2="",strLen=_.strLength(txt),isDouble=false,arrTxt,sum,tLen,t;
    if (strLen <= 20) {
        str1 = txt;
    }else if(strLen>20){
        isDouble=true;
        arrTxt=Array.from(txt);
        sum=0;
        for( t of arrTxt){
            tLen= _.strLength(t);
            sum+=tLen;
            if(sum>20){
                str1=`${str1.substr(0,19)}`;
                break;
            }
            str1+=t;
        }

        str2 = txt.replace( new RegExp(str1),"");
    }
    if(isDouble){
        ctx.fillText(str1,0,-RADIUS-25);
        ctx.fillText(str2,0,-RADIUS-10);
    }else{
        ctx.fillText(str1,0,-RADIUS-10);
    }
}
function drawCircle(ctx){
    ctx.save();
    ctx.beginPath();
    ctx.arc(0,0,this.radius,0*Math.PI,2*Math.PI)
    ctx.fillStyle = this.fillStyle;
    ctx.fill();
    ctx.strokeStyle =this.strokeStyle;
    ctx.stroke();
    ctx.restore();
    ctx.save();
    ctx.font="normal small-caps 8px";
    ctx.textBaseline="middle"
    ctx.textAlign="center";
    this.text&&drawText(ctx,this.text)
    ctx.restore();
    //icon
    ctx.save();
    //chor_hive_table,chor_mysql_table,chor_hive_process
    let [sx,sy,x,y]=[0,0,-20,-20]
    if(this.typeName=='chor_mysql_table'){
        //y=-20;
    }else if(this.typeName=='chor_hive_process'){
        sy=40;
    }else if(this.typeName=='chor_hive_table'){
        sy=80;
    }
    ctx.drawImage(this.image,sx,sy,40,40,x,y,40,40);
    ctx.restore();
}

exports.createPoint=({id,x,y,text,typeName,image})=>{
    var prefix=id;
    var circle=new createjs.Brush({
        name:prefix+'_node',
        id:prefix+'_node',
        radius:RADIUS,
        x,
        y,
        text,
        image,
        typeName,
        fillStyle:'RGBA(139,193,82,1)',
        strokeStyle:'#fff',
        draw:drawCircle
    });
    return circle;
}