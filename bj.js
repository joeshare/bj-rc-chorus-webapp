/**
 * Created by AnThen on 2016-11-24.
 */
'use strict'
var path = require("path");
var webpack = require("webpack");
var webpackDevServer = require("webpack-dev-server");
var webpackCfg = require("./webpack.config.hot.js");
var compiler = webpack(webpackCfg);
let filesOpt = require("./filesOpt.js");
filesOpt.copyFolder(path.resolve(__dirname,'./src/js'),path.resolve(__dirname,'./dist/js'))
filesOpt.copyFolder(path.resolve(__dirname,'./src/images'),path.resolve(__dirname,'./dist/images'))
filesOpt.copyFolder(path.resolve(__dirname,'./src/stylesheets'),path.resolve(__dirname,'./dist/js/stylesheets'))
//TODO create
filesOpt.copyFolder(path.resolve(__dirname,'./src/create'),path.resolve(__dirname,'./dist/create'))

var fs = require('fs');// 加载编码转换模块
var path = require("path");

function modifyConstant(){
    var file = "/src/js/utils/constant.js";
    var data = fs.readFileSync(__dirname + file,'utf-8');
    data = data + "";

    data = data.replace(/dwConnectUrl:('|")?.+('|")?,?/g,function (word){
        return 'dwConnectUrl:"jdbc:hive2://bj-rc-dptd-ambari-rm-2-v-test-1.host.dataengine.com:10000",';//"development",
    });
    data = data.replace(/serverUrl:('|")?.+('|")?,?/g,function (word){
        return 'serverUrl:"jdbc:hive2://bj-rc-dptd-ambari-rm-2-v-test-1.host.dataengine.com:10000",';
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
modifyConstant();
//init server
var app = new webpackDevServer(compiler, {
    //注意此处publicPath必填
    publicPath: webpackCfg.output.publicPath
});

console.log('start')
app.listen(8080, function (err) {
    if (err) {
        console.log(err);
    }else{
        console.log("listen at http://localhost:8080");
    }
});

