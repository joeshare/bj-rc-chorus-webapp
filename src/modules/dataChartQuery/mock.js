/**
 * Created by AnThen on 2017-3-6.
 */
function queryFiltersData() {
    var num=Math.ceil(Math.random()*10),arr=[];
    while(num--){
        arr.push({
            propertyName:'学生学生学生学生'+num,
            propertyCode:`student+${num}`
        })
    }
    return {
        "code": "0",
        "msg": "成功",
        "data": arr
    };
}
function queryPointData(){
    return {
        "code": "0",
        "msg": "成功",
        "data": [
            {
                "vertexName": "vertex1",
                "vertexId": 1
            },
            {
                "vertexName": "vertex2",
                "vertexId": 2
            }
        ]
    }
}
function queryProjectData(){
    return {
        code:0,
        data:[{
            "createUser": "",
            "createTime": 1490002841334,
            "updateUser": "",
            "updateTime": 1490002841334,
            "remark": "",
            "useYn": "",
            "createTimeLabel": "",
            "createTimeLabelSecond": "",
            "iTotalDisplayRecords": 2,
            "aaData": [
                {
                    "projectId": 222292,
                    "projectCode": "ccp_2636",
                    "projectName": "CCP"
                },
                {
                    "projectId": 222301,
                    "projectCode": "ppo_cs783",
                    "projectName": "PPO"
                }
            ]
        }]
    };
}
function queryChartData(){
    return {
        "code": 0,
        "colNames": [],
        "data": [
            {
                "edgeOutVoes": [
                    {
                        "codeNameMap": {
                            "label": "边名称",
                            "id": "ID",
                            "type": "类型"
                        },
                        "propertymap": {
                            "index": "98578",
                            "label": "gudong",
                            "id": {
                                "inVertexId": 4106,
                                "longRepresentation": [
                                    28672046593,
                                    12288434184,
                                    3093,
                                    4106
                                ],
                                "outVertexId": 12288434184,
                                "relationId": 28672046593,
                                "typeId": 3093
                            },
                            "type": "odd"
                        }
                    },
                    {
                        "codeNameMap": {
                            "label": "边名称",
                            "id": "ID",
                            "type": "类型"
                        },
                        "propertymap": {
                            "index": "110761",
                            "label": "gudong",
                            "id": {
                                "inVertexId": 4312,
                                "longRepresentation": [
                                    69632129562,
                                    32768418000,
                                    3093,
                                    4312
                                ],
                                "outVertexId": 32768418000,
                                "relationId": 69632129562,
                                "typeId": 3093
                            },
                            "type": "even"
                        }
                    }
                ],
                "vertexOutVoes": [
                    {
                        "codeNameMap": {
                            "dianhua": "电话",
                            "label": "顶点名称",
                            "id": "ID"
                        },
                        "propertymap": {
                            "dianhua": "13866664500",
                            "label": "jibenxinxis123",
                            "id": 12288434184
                        }
                    },
                    {
                        "codeNameMap": {
                            "type": "类型",
                            "lable": "顶点名称",
                            "id": "ID"
                        },
                        "propertymap": {
                            "label": "odd",
                            "id": 4106,
                            "type": "odd"
                        }
                    },
                    {
                        "codeNameMap": {
                            "dianhua": "电话",
                            "lable": "顶点名称",
                            "id": "ID"
                        },
                        "propertymap": {
                            "dianhua": "13866664500",
                            "label": "jibenxinxi",
                            "id": 32768418000
                        }
                    },
                    {
                        "codeNameMap": {
                            "type": "类型",
                            "lable": "顶点名称",
                            "id": "ID"
                        },
                        "propertymap": {
                            "label": "even",
                            "id": 4312,
                            "type": "even"
                        }
                    }
                ]
            }
        ],
        "date": "2017-03-20",
        "msg": "success",
        "total": 0,
        "totalCount": 0
    };
}
module.exports = {
    queryFiltersData,
    queryPointData,
    queryProjectData,
    queryChartData
};