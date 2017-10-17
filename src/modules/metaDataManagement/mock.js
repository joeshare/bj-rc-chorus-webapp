/**
 * Created by AnThen on 2017-3-6.
 */
function queryTableData() {
    return {
        "code": "0",
        "msg": "成功",
        "data": {
            "pageNum": 1,
            "pageSize": 10,
            "size": 10,
            "orderBy": "",
            "startRow": 1,
            "endRow": 10,
            "total": 109,
            "pages": 11,
            "list": [{
                "tableInfoId": 111,
                "projectId": 1,
                "projectCode": "pj_001",
                "projectName": "大连测试1",
                "tableName": "table_test1",
                "securityLevel": "A",
                "tableDes": "测试表"
            }, {
                "tableInfoId": 112,
                "projectId": 1,
                "projectCode": "pj_001",
                "projectName": "大连测试1",
                "tableName": "table_test2",
                "securityLevel": "A",
                "tableDes": "测试表"
            }, {
                "tableInfoId": 113,
                "projectId": 1,
                "projectCode": "pj_001",
                "projectName": "大连测试1",
                "tableName": "table_test3",
                "securityLevel": "A",
                "tableDes": "测试表"
            }, {
                "tableInfoId": 114,
                "projectId": 1,
                "projectCode": "pj_001",
                "projectName": "大连测试1",
                "tableName": "table_test4",
                "securityLevel": "B",
                "tableDes": "测试表"
            }, {
                "tableInfoId": 115,
                "projectId": 1,
                "projectCode": "pj_001",
                "projectName": "大连测试1",
                "tableName": "table_test5",
                "securityLevel": "B",
                "tableDes": "测试表"
            }, {
                "tableInfoId": 116,
                "projectId": 1,
                "projectCode": "pj_001",
                "projectName": "大连测试1",
                "tableName": "table_test6",
                "securityLevel": "B",
                "tableDes": "测试表"
            }, {
                "tableInfoId": 117,
                "projectId": 1,
                "projectCode": "pj_001",
                "projectName": "大连测试1",
                "tableName": "table_test7",
                "securityLevel": "C",
                "tableDes": "测试表"
            }, {
                "tableInfoId": 118,
                "projectId": 1,
                "projectCode": "pj_001",
                "projectName": "大连测试1",
                "tableName": "table_test8",
                "securityLevel": "C",
                "tableDes": "测试表"
            }, {
                "tableInfoId": 119,
                "projectId": 1,
                "projectCode": "pj_001",
                "projectName": "大连测试1",
                "tableName": "table_test9",
                "securityLevel": "C",
                "tableDes": "测试表"
            }, {
                "tableInfoId": 120,
                "projectId": 111111,
                "projectCode": "",
                "projectName": "",
                "tableName": "table_test10",
                "securityLevel": "A",
                "tableDes": "测试表"
            }],
            "firstPage": 1,
            "prePage": 0,
            "nextPage": 2,
            "lastPage": 8,
            "isFirstPage": true,
            "isLastPage": false,
            "hasPreviousPage": false,
            "hasNextPage": true,
            "navigatePages": 8,
            "navigatepageNums": [1, 2, 3, 4, 5, 6, 7, 8]
        }
    }
}
function fetchBlood() {
    return {
        "code": "0",
        "msg": "成功",
        "data": {
            "nodeId": "t_123456883-93264238",
            "nodeName": "project",
            "type": 0,
            "pathLevel": 0,
            "children": [{
                "nodeId": "j_93-149963162",
                "nodeName": "项目数据导入日任务项目",
                "type": 1,
                "pathLevel": 1,
                "children": [{
                    "nodeId": "chorus.project_info-71967507",
                    "nodeName": "chorus.project_info",
                    "type": 0,
                    "pathLevel": 2,
                    "children": []
                }]
            }]
        }
    };
}

//基础信息
function querymatedatatable() {
    return {
        "code" : "0",
        "msg" : "成功",
        "data" : {
            "tableInfoId" : 111,
            "projectId" : 1,
            "tableCode" : "111",
            "tableName" : "table_test1",
            "dataField" : "user",
            "tableType" : "基础表",
            "isSnapshot" : "0",
            "updateFrequence" : "周",
            "sla" : "0",
            "securityLevel" : "A",
            "isOpen" : 0,
            "tableDes" : "测试表",
            "createTime" : 1479267646000,
            "updateTime" : 1479267652000,
            "statusCode" : "111",
            "projectName" : "大连测试1"
        }
    }

}
//字段信息
function querymatedatacolumninfo() {
    return {
        "code" : "0",
        "msg" : "成功",
        "data" : [
        {
            "columnInfoId" : 1111,
            "tableInfoId" : 111,
            "columnName" : "tt_col1",
            "columnDesc" : "form me ddd ",
            "columnType" : "String",
            "columnLength" : "3333",
            "columnPrecision" : "32",
            "securityLevel" : "2",
            "isKey" : "1",
            "isRefKey" : "1",
            "isIndex" : "1",
            "isNull" : "1",
            "createTime" : 1479945600000,
            "updateTime" : "1",
            "statusCode" : "1"
        },
        {
            "columnInfoId" : 1112,
            "tableInfoId" : 111,
            "columnName" : "tt_col2",
            "columnDesc" : "",
            "columnType" : "String",
            "columnLength" : "",
            "columnPrecision" : "",
            "securityLevel" : "",
            "isKey" : "",
            "isRefKey" : "",
            "isIndex" : "",
            "isNull" : "",
            "createTime" : 1479945600000,
            "updateTime" : "",
            "statusCode" : "1"
        }
    ]
    }

}
//样列数据
function querymatesampledata() {
    return {
        "code" : "0",
        "msg" : "成功",
        "data" : {
            "headerSet" : [ "custom", "name" ],
            "data" : [
                {
                    "custom" : "ppo-cc",
                    "name" : "2004"
                },
                {
                    "custom" : "cctestone",
                    "name" : "2002"
                },
                {
                    "custom" : "zgy_test",
                    "name" : "2002"
                },
                {
                    "custom" : "mbxgroup1",
                    "name" : "2004"
                },
                {
                    "custom" : "mbxgroup2",
                    "name" : "2004"
                }
            ]
        }
    }

}


//申请权限
function  querypowerapply() {
    return {
        "code" : "0",
        "msg" : "成功",
        "data" : {
            "tableInfo" : {
                "tableInfoId" : 111,
                "projectId" : 1,
                "tableCode" : "111",
                "tableName" : "table_test1",
                "dataField" : "user",
                "tableType" : "基础表",
                "isSnapshot" : "0",
                "updateFrequence" : "周",
                "sla" : "0",
                "securityLevel" : "A",
                "isOpen" : 0,
                "tableDes" : "测试表",
                "createTime" : 1479267646000,
                "updateTime" : 1479267652000,
                "statusCode" : "111"
            },
            "columnList" : [
                {
                    "columnInfoId" : 1111,
                    "tableInfoId" : 111,
                    "columnName" : "tt_col1",
                    "columnDesc" : "333333",
                    "columnType" : "String",
                    "securityLevel" : "2",
                    "authorized" : false
                },
                {
                    "columnInfoId" : 1112,
                    "tableInfoId" : 111,
                    "columnName" : "tt_col2",
                    "columnDesc" : "444444444",
                    "columnType" : "String",
                    "securityLevel" : "2",
                    "authorized" : false
                },
                {
                    "columnInfoId" : 1113,
                    "tableInfoId" : 111,
                    "columnName" : "tt_col3",
                    "columnDesc" : "aaaaaaa",
                    "columnType" : "String",
                    "securityLevel" : "2",
                    "authorized" : false
                },
                {
                    "columnInfoId" : 1114,
                    "tableInfoId" : 111,
                    "columnName" : "tt_col4",
                    "columnDesc" : "ssssss",
                    "columnType" : "String",
                    "securityLevel" : "2",
                    "authorized" : false
                }
            ]
        }
    }

}
module.exports = {
    queryTableData,
    fetchBlood,
    querymatedatatable,
    querymatedatacolumninfo,
    querymatesampledata,
    querypowerapply
};