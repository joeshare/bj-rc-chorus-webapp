/**
 * Created by AnThen on 2017-9-14.
 */
const projectmanagement = r => require.ensure([], () => r(require("../modules/projectManagement/index.vue")), 'projectmanagement')
exports.routes=[
    {
        name:'/projectmanagement',
        path:'/projectmanagement',
        //component:resolve => require(["../modules/projectManagement/index.vue?123"], resolve)
        component:projectmanagement
    },
    {
        name:'/membermanagement',
        path: '/membermanagement',
        component:resolve => require(["../modules/memberManagement/memberManagement.vue"], resolve)
    },
    {
        name: '/resourceallocation',
        path: '/resourceallocation',
        component: resolve => require(["../modules/resourceAllocation/resourceAllocation.vue"], resolve)
    },
    {
        name: '/externalresource',
        path: '/externalresource',
        component: resolve => require(["../modules/externalResource/externalResource.vue"], resolve)
    }, {
        name: '/datatablemanagement',
        path: '/datatablemanagement',
        component: resolve => require(["../modules/dataTableManagement/dataTableManagement.vue"], resolve)
    }, {
        name: '/datatablemanagement/edit',
        path: '/datatablemanagement/edit/:type/:Id',
        component: resolve => require(["../modules/dataTableEdit/dataTableManagement.vue"], resolve)
    }, {////详情页 origin 页面来源
        name: '/metadatamanagement/info',
        path: '/metadatamanagement/info/:type/:origin/:id',
        component:resolve => require(["../modules/metaDataDetail/index.vue"], resolve)
    },{// 元数据查询(与/metadatamanagement 指向同一地址)此路由是通过快捷方式进入并返回时使用不能删除
        name: '/metadatamanagement/list',
        path: '/metadatamanagement/list/:origin',
        component:resolve => require(["../modules/metaDataManagement/index.vue"], resolve)
    }
    ,{// 元数据查询（必须有）
        name: '/metadatamanagement',
        path: '/metadatamanagement',
        component:resolve => require(["../modules/metaDataManagement/index.vue"], resolve)
    }
    , {
        name: '/dataaccessmanagement',
        path: '/dataaccessmanagement',
        component: resolve => require(["../modules/dataAccessManagement/dataAccessManagement.vue"], resolve)
    },
    {
        'name': '/graphdatamanagement',
        'path': '/graphdatamanagement',
        component: resolve => require(["../modules/graphDataManagement/index.vue"], resolve)
    },
    {
        'name': '/datachartquery',
        'path': '/datachartquery',
        component: resolve => require(["../modules/dataChartQuery/index.vue"], resolve)
    },
    {
        'name':'/datalaboratory',
        'path':'/datalaboratory',
        component:resolve => require(["../modules/dataLaboratory/dataLaboratory.vue"], resolve)
    },
    {
        'name':'/resourcesapplication',
        'path':'/resourcesapplication',
        component:resolve => require(["../modules/resourcesapplication/resourcesapplication.vue"], resolve)
    },
    {
        'name':'/impromptuquery',
        'path':'/impromptuquery',
        component:resolve => require(["../modules/impromptuQuery/index.vue"], resolve)
    },
    {
        'name':'/impromptuqueryguide',//向导进入
        'path':'/impromptuqueryguide',
        component:resolve => require(["../modules/impromptuQuery/index.vue"], resolve)
    },
    {
        'name':'/taskdevelopment',
        'path':'/taskdevelopment',
        component: resolve => require(["../modules/taskdevelopment/index.vue"], resolve)
    },
    {
        'name':'/taskdevelopment/workflowedit',
        'path':'/taskdevelopment/workflowedit/:type/:status/:jobId',
        component:resolve => require(["../modules/workflowedit/index.vue"], resolve)
    },
    {
        'name':'/taskmonitor',
        'path':'/taskmonitor',
        component:resolve => require(["../modules/taskmonitor/index.vue"], resolve)
    },
    {
        'name':'/datacomponentmanagement',
        'path':'/datacomponentmanagement',
        component:resolve => require(["../modules/dataComponentManagement/index.vue"], resolve)
    },
    {
        'name':'/dashboard',
        'path':'/dashboard',
        component:resolve => require(["../modules/dashBoard/index.vue"], resolve)
    },
    {
        'name':'/guide',
        'path':'/guide',
        component:resolve => require(["../modules/guide/index.vue"], resolve)
    },
    {
        'name':'/metaaccesshistory',
        'path':'/metaaccesshistory',
        component:resolve => require(["../modules/metaAccessHistory/index.vue"], resolve)
    },
    {
        'name':'/admindashboard',
        'path':'/admindashboard',
        component:resolve => require(["../modules/adminDashboard/index.vue"], resolve)
    },
    {
        'name':'/operationmanagement',
        'path':'/operationmanagement',
        component:resolve => require(["../modules/operationManagement/index.vue"], resolve)
    }

];