/**
 * Created by AnThen on 2017-3-3.
 */
import AdInput from 'adminUI/components/admin-input.vue';
import adSelect from 'adminUI/components/admin-select.vue';
import AdModal from 'adminUI/components/admin-modal.vue';
import Paginator from 'adminUI/components/admin-paginator.vue';
import Toast from 'adminUI/components/admin-toast/index';
import navBar  from '../../admin-ui-extend/components/admin-navbar.vue';
import jstree from '../impromptuQuery/plugins/jstree';
import {queryTableData as queryTableDatas,getdetialdata as getdetialdatas,getdatatype as getdatatypes} from  './mock.js';
import {tabs, activeTabId} from  './tabs.js';
import CONSTANT from  'Utils/constant';

export default {
    components: {
        AdInput,
        AdModal,
        Paginator,
        adSelect,
        Toast,
        navBar,
        'adTabs':resolve => require(['adminUI/components/admin-tabs.vue'], resolve)
    },
    data () {
        let _this=this;
        return {
            navlist:[{id:1,text:'数据分析',url:''},{id:2,text:'即席查询',url:'#/impromptuquery'}],
            data:[],
            totalCount: 0,
            pageSize: CONSTANT.pageSize,
            currentPage: 1,
            datahsy:[],
            totalCounthsy: 0,
            pageSizehsy: 10,
            currentPagehsy: 1,
            sqltextarea:'',
            options: [],
            tabs,
            activeTabval:'exeResouce',
            searchKey:'',
            currentSQL:'',
            alertDisplay:false,
            errorText:'',
            onerrors:false,
            searchmessage:'暂无数据',
            runing:false,
            alertModalBtns:[{
                text: '追加',
                buttonClass:'admin-small ad-auxiliary',
                name: 'add',
                handler(){
                    if( _this.sqltextarea){
                        _this.sqltextarea += "\r\n"+ _this.currentSQL;
                    }else{
                        _this.sqltextarea=_this.currentSQL;
                    }

                }
            },{
                text: '覆盖',
                buttonClass:'admin-small ad-auxiliary',
                name: 'cover',
                handler(){
                    _this.sqltextarea =  _this.currentSQL;
                }
            },{
                text: '放弃',
                buttonClass:'admin-small ad-auxiliary',
                name: 'cancel',
                handler(){

                }
            }]
        }
    },
    mounted(){
        this.initTree();
        this.fetchDatahsy(1);
    },
    created() {
        //this.data = getdatatypes().data;
    },
    methods: {
        sqlrun(){
            this.fetchData(1);
            this.activeTabval='exeResouce';
            this.onerrors = false;
            //this.fetchDatahsy(1);
        },
        seachTree(){
            let $tree= $('#tree_3');
            if($tree[0]&&$tree.jstree(true)){
                $tree.jstree(true).search(this.searchKey);
            }

        },
        dataformat(){
            let textval =  this.sqltextarea;
            textval = textval.replace(/[\r\n]/g," ");
            textval = textval.replace(/\ +/g," ");
            textval = textval.replace(/;/g,";\r\n");
            textval = textval.replace(/(?!\r\n)(select|Select|SELECT)/g,"\r\nselect");
            textval = textval.replace(/^\r\n/g,"");
            this.sqltextarea = textval;
        },
        dataclear(){
            //$('#sqlworkarea>textarea').val('');
            this.sqltextarea="";
        },
        addsqlhistory(params)
        {
            this.alertDisplay =true;
            if(params){
                this.currentSQL = params;
            }

        },
        toggleTab (currentTadId) {
            this.activeTabval=currentTadId;
            if(currentTadId=="exeHistory"){
                  this.fetchDatahsy(1);
            }
        },
        alertModalOn(){

        },
        //分页相应事件
        togglePage(indexPage){
            this.fetchData(indexPage)
        },
        //历史分页相应事件
        togglePagehsy(indexPage){
            this.fetchDatahsy(indexPage)
        },
        //初始化
        initTree(){
            let _this=this;
            $("#tree_3").jstree({
                "core" : {
                    "themes" : {
                        "responsive": false
                    },
                    "animation" : 0,
                    'data' : {
                        method:'post',
                        'url' : function (node) {
                            return `/server/api/impromptuquery/${node.id=="#"?'treeroot':'treeasync'}`;//node.id === '#' ?
                            //'ajax_demo_roots.json' : 'ajax_demo_children.json';
                        },
                        'data' : function (node) {
                            let parentType=node.data&&node.data.type;
                            let parent=node.id=='root'?"":node.id;
                            return { 'id' : node.id,parent,parentType };
                        }
                    },
                    "check_callback" : true,
                    // 'data': res.data
                },
                "types" : {
                    "default" : {

                    },
                    "file" : {
                        "icon" : "fa-file"
                    },
                    "folder":{
                        "icon" : "fa-folder"
                    }

                },
                'contextmenu' : {
                    'items' : function(node) {
                        var tmp = $.jstree.defaults.contextmenu.items();
                        delete tmp.create.action;
                        delete tmp.rename;
                        delete tmp.remove;
                        delete tmp.ccp.submenu;
                        delete tmp.ccp.action;
                        delete tmp.create;
                        delete tmp.ccp;

                        return tmp;
                    }
                },
                "plugins" : [ "search","types","contextmenu" ]
            });



            //绑定树节点点击事件
            $("#tree_3").on('select_node.jstree', function(e,data) {
                
                //});
            });
                        //绑定树节点点击事件
                       /* $('#tree_3').on('select_node.jstree', function(e,data) {
                            var ref = $('#tree_3').jstree(true),
                                sel = ref.get_selected();
                            var path = ref.get_path(sel) + "";
                            var nodes = path.split(",");
                        });*/

            //绑定树节点双击事件*
            $('#tree_3').on('dblclick.jstree', function(e,data) {
                var ref = $('#tree_3').jstree(true),
                    sel = ref.get_selected();
                var path = ref.get_path(sel) + "";
                var nodes = path.split(",");
                let $textarea =  $('#sqlworkarea>textarea');

                var sqlobj = $textarea[0];
                if(nodes&&nodes.length<2)
                    return false;
                var str = ' '+nodes[nodes.length-1]+' ';
                if (document.selection) {
                    sqlobj.focus();
                    var sel = document.selection.createRange();
                    sel&&(sel.text = str);
                } else if (typeof sqlobj.selectionStart === 'number' && typeof sqlobj.selectionEnd === 'number') {
                    var startPos = sqlobj.selectionStart;
                    var endPos = sqlobj.selectionEnd;
                    var tmpStr = sqlobj.value;
                    sqlobj.value = tmpStr.substring(0, startPos) + str + tmpStr.substring(endPos, tmpStr.length);

                } else {
                    sqlobj.value += str;
                }

                if(sqlobj.value)
                {
                    _this.sqltextarea =sqlobj.value;
                    sqlobj.focus();
                }
            });

        },

        //查询列表数据
        fetchData(curPage){
            let _this=this;
            this.searchmessage ="请稍后。。。"
            this.data =[] ;
            this.runing = true;
            //数据类型
            _.ajax({
                url:'/api/impromptuquery/result',
                method:'POST',
                timeout:5*60*1000,
                data:{
                    pageNum:curPage,
                    pageSize:5,
                    sql: _this.sqltextarea
                },
                success:function(res){
                    _this.runing = false;
                    if(res.code=="0"){
                        _this.onerrors = false;
                        _this.data = res.data;
                        _this.totalCount =res.data.total;
                        _this.currentPage = curPage;
                    }
                    else {
                        _this.onerrors = true;
                        if(res.msg&&res.msg.length>0)
                        {
                            _this.errorText = res.msg;
                        }else {
                            _this.errorText = "此数据请求失败！";
                        }

                    }
                    _this.searchmessage ='暂无数据';
                },
                error:function (err) {
                    _this.onerrors = true;
                    _this.errorText = "此数据请求失败！";
                }
            })
        }
        ,
        //历史查询列表数据
        fetchDatahsy(curPage){
            let _this=this;
              _.ajax({
             url:'/api/impromptuquery/history',
             method:'POST',
             data:{
             pageNum:curPage,
             pageSize:10
             },
             success:function(res){
                 if(res.code=="0"){
                     res.data.list.forEach((m)=>{
                         if(m.executeStatus==-1)
                         {
                             m.executeStatus= '执行失败';
                         }
                         if(m.executeStatus==0)
                         {
                             m.executeStatus= '执行中';
                         }
                         if(m.executeStatus==1)
                         {
                             m.executeStatus= '执行成功';
                         }
                         m.createTime = _.date2String(new Date(m.createTime),'yyyy-MM-dd hh:mm:ss');
                     });
                     _this.datahsy = res.data;
                     _this.totalCounthsy =res.data.total;
                     _this.currentPagehsy = curPage;
                 }
             }
             })
        }
    }
}