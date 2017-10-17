/**
 * Created by AnThen on 2016-11-23.
 */
'use strict';
let path = require("path");
let webpack = require("webpack");
let webpackBase = require("./webpack.config.base.js");
let filesOpt = require("./filesOpt.js");
let fs = require("fs");
function modifyIndex(){
    var page = '/dist/index.html';
    var data = fs.readFileSync(__dirname + page,'utf-8');
    data = data + "";
    data = data.replace(/.\/.+\.js/g,function (word){
        console.log(word)
        return`${ word}?t=${new Date().getTime()}`;//"development",10.200.32.217:8888
    });
    fs.writeFile(__dirname + page, data, function(err){
        if(err){
            console.log("error! " + page);
            console.log(err);
        }else{
            console.log("index.html success! ");
        }
    });

}
function replaceFile(srcFile,dst,reg1,reg2,replaceStr1,replaceStr2,reg3,replaceStr3){
    let tmpArr=srcFile.split(path.sep);
    let fileName = tmpArr[tmpArr.length-1];
    let dstFile =  path.join(dst, fileName );
    var data = fs.readFileSync(srcFile,'utf-8');
    //console.log(data)
    //console.log(reg,replaceStr)
    //console.log("dstFile",dstFile)
    data = data + "";
    data = data.replace(reg1,function (word){
        return replaceStr1;
    });
    data = data.replace(reg2,function (word){
        return replaceStr2;
    });
    if(reg3&&typeof reg3=='object')
    {
        data = data.replace(reg3,function (word){
            return replaceStr3;
        });
    }
    fs.writeFile(dstFile, data, function(err){
        if(err){
            console.log(err);
        }else{
            console.log(`copyReplaceFile ${srcFile} success! `);
            if(typeof reg3=='function'){
                reg3();
            }
        }
    });
}
replaceFile(path.resolve(__dirname,'./index.html'),path.resolve(__dirname,'./dist'),/src="\/dist/g,/href="\/dist/g,'src=".','href=".',modifyIndex)
replaceFile(path.resolve(__dirname,'./login.html'),path.resolve(__dirname,'./dist'),/src="\/dist/g,/href="\/dist/g,'src=".','href=".',/url\(\/dist/g,'url(\.')
replaceFile(path.resolve(__dirname,'./welcome.html'),path.resolve(__dirname,'./dist'),/src="\/dist/g,/href="\/dist/g,'src=".','href=".')
replaceFile(path.resolve(__dirname,'./maintained.html'),path.resolve(__dirname,'./dist'),/src="\/dist/g,/href="\/dist/g,'src=".','href=".')

let cfg = Object.assign(webpackBase, {
    devtool: "cheap-module-source-map",
    cache: true,
});
//entry
Object.getOwnPropertyNames((webpackBase.entry || {})).map(function (name) {
    cfg.entry[name] = [].concat(webpackBase.entry[name])
});

//plugins
cfg.plugins = (webpackBase.plugins || []);
module.exports = cfg;