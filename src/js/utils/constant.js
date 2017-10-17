/**
 * Created by AnThen on 2017-2-23.
 */

module.exports ={
    pageSize: 15,
    host:"server",
    websocket:"ws://{domain}/websocket/",
    laboratoryPageUrl:"/datalab/{projectCode}-{labCode}/#/notebook/2A94M5J1Z",
    fileDownload:"",
    fileUpload:"",
    dwConnectUrl:"jdbc:hive2://dl-rc-optd-ambari-master-v-test-1.host.dataengine.com:10000",
    serverUrl:"jdbc:hive2://dl-rc-optd-ambari-master-v-test-1.host.dataengine.com:10000",
    //向导路由配置（向导页跳转必须进行配置）
    guideRouteArr:['/impromptuqueryguide','/guide','/metaaccesshistory']
};
