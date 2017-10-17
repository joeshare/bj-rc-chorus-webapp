//{"code":0,"msg":"成功","data":{"jobId":227,"jobName":"job1wwwww wofkflow","jobAliasName":"job1wwwww","jobType":2,"labJobType":"定期","instanceId":119,"status":"UNDEPLOY","workFlowDSL":"{\"name\":\"job1wwwww wofkflow\",\"description\":\"wwwwww\",\"version\":1,\"tasks\":[{\"name\":\"guPuoJE9xBAUZSisiVdlpbFqKI8qUgSLxQqvwHVRkqbVOf0aXG\",\"taskReferenceName\":\"分支\",\"type\":\"FORK\",\"forkTasks\":[[{\"name\":\"tJFEhiXTLBbO05lnWmnfiy4vS6rrUXfndh7kEcjC0UWOtmwZbS\",\"taskReferenceName\":\"2\",\"type\":\"SIMPLE\"}]]},{\"name\":\"LPuOiWFByUvgFjXk8SJqwB1xYKAv2SqCNc626lVa3NPypLLuOz\",\"taskReferenceName\":\"合并\",\"type\":\"JOIN\"}]}","description":"wwwwww","deployUserId":"","deployUserName":"","createUserName":"","createUser":"307e5c3a-ab7b-4ba2-9e89-e69bc5b71f13","createTime":"2017-01-09 18:44:32","warningConfig":"{\"timeOutInterval\":\"2111\",\"excuteErrorFlg\":0,\"timeOutFlg\":1}","schedule":{"scheduleId":202,"scheduleType":2,"labScheduleType":"周期","cronExpression":""},"taskList":[{"taskId":444,"taskName":"tJFEhiXTLBbO05lnWmnfiy4vS6rrUXfndh7kEcjC0UWOtmwZbS","moduleType":1,"moduleName":"RDB2Hive","taskDSL":"{\"name\":\"tJFEhiXTLBbO05lnWmnfiy4vS6rrUXfndh7kEcjC0UWOtmwZbS\",\"taskId\":\"tJFEhiXTLBbO05lnWmnfiy4vS6rrUXfndh7kEcjC0UWOtmwZbS\",\"staticParams\":{},\"timeoutPolicy\":\"RETRY\"}"}]}}
var info = {
    "code": 0,
    "msg": "成功",
    "data": {
        "jobId": 227,
        "jobName": "job1wwwww wofkflow",
        "jobAliasName": "job1wwwww",
        "jobType": 2,
        "labJobType": "定期",
        "instanceId": 119,
        "status": "UNDEPLOY",
        "workFlowDSL": "{\"name\":\"job1wwwww wofkflow\",\"description\":\"wwwwww\",\"version\":1,\"tasks\":[{\"name\":\"guPuoJE9xBAUZSisiVdlpbFqKI8qUgSLxQqvwHVRkqbVOf0aXG\",\"taskReferenceName\":\"分支\",\"type\":\"FORK\",\"forkTasks\":[[{\"name\":\"tJFEhiXTLBbO05lnWmnfiy4vS6rrUXfndh7kEcjC0UWOtmwZbS\",\"taskReferenceName\":\"2\",\"type\":\"SIMPLE\"}]]},{\"name\":\"LPuOiWFByUvgFjXk8SJqwB1xYKAv2SqCNc626lVa3NPypLLuOz\",\"taskReferenceName\":\"合并\",\"type\":\"JOIN\"}]}",
        "description": "wwwwww",
        "deployUserId": "",
        "deployUserName": "",
        "createUserName": "",
        "createUser": "307e5c3a-ab7b-4ba2-9e89-e69bc5b71f13",
        "createTime": "2017-01-09 18:44:32",
        "warningConfig": "{\"timeOutInterval\":\"2111\",\"excuteErrorFlg\":0,\"timeOutFlg\":1}",
        "schedule": {"scheduleId": 202, "scheduleType": 2, "labScheduleType": "周期", "cronExpression": ""},
        "list": [
            {
                "jobId": "",
                "jobExecutionId": 2380,
                "jobInstanceId": 2372,
                "jobName": "chorus_9c3d82e5-89bf-4f12-8d60-c069e32b5ee4",
                "jobAliasName": "RDB2Hive",
                "jobDescription": "",
                "jobExecuteStatus": "FAILED",
                "jobStatus": "",
                "jobStartTime": "2017-02-08 14:29:30",
                "jobStopTime": "2017-02-08 14:31:10"
            },
            {
                "moduleType": 1,
                "moduleName": "RDB2Hive",
                "jobId": "",
                "jobExecutionId": 2379,
                "jobInstanceId": 2371,
                "jobName": "tJFEhiXTLBbO05lnWmnfiy4vS6rrUXfndh7kEcjC0UWOtmwZbS",
                "jobAliasName": "RDB2Hive",
                "jobDescription": "",
                "jobExecuteStatus": "COMPLETED",//FAILED STARTED
                "jobStatus": "",
                "jobStartTime": "2017-02-08 14:29:30",
                "jobStopTime": "2017-02-08 14:30:39"
        }],
        "taskList": [{
            "taskId": 444,
            "taskName": "tJFEhiXTLBbO05lnWmnfiy4vS6rrUXfndh7kEcjC0UWOtmwZbS",
            "moduleType": 1,
            "moduleName": "RDB2Hive",
            "taskDSL": "{\"name\":\"tJFEhiXTLBbO05lnWmnfiy4vS6rrUXfndh7kEcjC0UWOtmwZbS\",\"taskId\":\"tJFEhiXTLBbO05lnWmnfiy4vS6rrUXfndh7kEcjC0UWOtmwZbS\",\"staticParams\":{},\"timeoutPolicy\":\"RETRY\"}"
        }]
    }
}

export {
    info
    }
