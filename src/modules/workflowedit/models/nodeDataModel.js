/**
 * Created by AnThen on 2017-4-15.
 */
/**
 * 节点数据model
 */
/**
   {
    id:arg.nodePrefix,
    propertyData:tmpPData
    }
 */
function model(){
    var _nodesMap={};
    function clone(o){
        return JSON.parse(JSON.stringify(o));
    }
    this.modifyNodeData=(data)=>{
        var cloneData=clone(data);
        for(var k in cloneData){
            _nodesMap[cloneData.id][k]=cloneData[k];
        }
    };
    this.setNodeData=(data)=>{
        _nodesMap[data.id]= clone(data);
    };
    this.getNodeData=(id)=>{
        return _nodesMap[id]?clone( _nodesMap[id]):null;
    };
    this.getAllData=()=>{
        return clone(_nodesMap);
    };
    this.deleteNode=(id)=>{
       delete _nodesMap[id];
    };
    this.deleteAllNode=()=>{
        for(var k in _nodesMap){
            delete  _nodesMap[k];
        }
    };
}
var instance=new model()
export default instance;