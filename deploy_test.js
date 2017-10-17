/**
 * Created by AnThen on 2016-11-24.
 */
'use strict'
var login = "/login.html";
var fs = require('fs')


function modifyConstant(){
    var file = "/src/js/utils/constant.js";
    var data = fs.readFileSync(__dirname + file,'utf-8');
    data = data + "";
 
    data = data.replace(/dwConnectUrl:('|")?.+('|")?,?/g,function (word){
        return 'dwConnectUrl:"jdbc:hive2://dl-rc-optd-ambari-master-v-test-1.host.dataengine.com:10000",';
    });
    data = data.replace(/serverUrl:('|")?.+('|")?,?/g,function (word){
        return 'serverUrl:"jdbc:hive2://dl-rc-optd-ambari-master-v-test-1.host.dataengine.com:10000",';
    });
    fs.writeFile(__dirname + file, data, function(err){
        if(err){
            console.log("error! " + file);
            console.log(err);
        }else{
            console.log("constant.js success! ");
        }
    });
}
function modifyLoginBackGroudImg(){
    var file = "/src/stylesheets/login/assets/js/supersized-init.js";
    var data = fs.readFileSync(__dirname + file,'utf-8');
    data = data + "";
    data = data.replace(/dist\/stylesheets\/login\/assets\/img\/backgrounds/g,function (word){
        return 'stylesheets/login/assets/img/backgrounds';//"development",
    });
    fs.writeFile(__dirname + file, data, function(err){
        if(err){
            console.log("error! " + file);
            console.log(err);
        }else{
            console.log("supersized-init.js success! ");
        }
    });
}
modifyConstant();
modifyLoginBackGroudImg();




