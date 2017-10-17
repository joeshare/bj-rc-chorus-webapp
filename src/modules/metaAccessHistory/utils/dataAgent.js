export  function setProjectSelectData(data,view){
    let currentArry = [];
    let initArray=[];
    data.list.forEach((prom,i)=>{
        var interobj ={
            value:prom,
            text: prom.projectName
        };
        if(prom.active) {
            view.setCurrentProjectInfo(prom);
            view.projectobj=prom.projectName;
            view.currentSelectRecorder=interobj;
        }
        if(i<11) {
            currentArry.push(interobj);
        }
        initArray.push(interobj);
    });
    view.projectSelectOptions=currentArry;
    view.projectSelectOptionsInit=initArray;
}