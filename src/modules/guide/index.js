import {setProjectSelectData,validateCreateFormData} from './utils/dataAgent.js';
import {fetchProjectSelect,promiseFetch} from './utils/fetchAgent.js';
import AdSugInput from '../../admin-ui-extend/components/admin-input-custom.vue';
import Toast from 'adminUI/components/admin-toast/index';
import AdInput from 'adminUI/components/admin-input.vue';
import adSelect from 'adminUI/components/admin-select.vue';
import AdModal from 'adminUI/components/admin-modal.vue';
import projectManagementBase from '../projectManagement/index.js';
import resourceAllocationBase from '../resourceAllocation/base.js';
import images1 from '../../images/guidepng/gaoji1.png';
import images2 from '../../images/guidepng/gaoji2.png';
import images3 from '../../images/guidepng/gaoji3.png';
import images4 from '../../images/guidepng/gaoji4.png';
export default {
    mixins: [projectManagementBase,resourceAllocationBase],
    components: {AdSugInput,Toast, AdInput,AdModal},
    data () {
        let _this=this;
        return {
            "projectCode":"",
            "projectDesc": "",
            "projectName": "",
            "cpu":"",
            "memory":"",
            "storage":"",
            "reason":"",
            images:[images1,images2,images3,images4],
            //applyWarningsMap 是针对cpu，memory，storage，reason
            applyWarningsMap:{},
            createModalDisplay:false,
            projectobj:"",
            currentSelectRecorder:null,
            projectSelectOptions: [],
            projectSelectOptionsInit: [],
            projectCodeWarnings:null,
            projectNameWarnings:null,
            projectDescWarnings:null,
            btnDisabled:false,
            //输入框是否有动作
            isSugChangeInput:false,
            createModalButtons:[{
                text: '取消',
                buttonClass:'ad-auxiliary admin-small',
                name: 'cancel'
            }, {
                text: '确定',
                name: 'ok',
                buttonClass:'admin-small',
                handler:this.createHandler.bind(this)
            } ],
            createbuttonActive:[{
                text: '取消',
                buttonClass:'ad-auxiliary admin-small',
                name: 'cancel'
            }, {
                text: '确定',
                name: 'ok',
                buttonClass:'admin-small',
                handler:this.createHandler.bind(this)
            } ],
            createbuttonDesiable:[{
                text: '关闭',
                buttonClass:'ad-auxiliary admin-small',
                name: 'cancel'
            }]

        }
    },
    created() {},
    mounted(){
        this.initSelectList();
    },
    watch: {
        projectSelectOptions(v){
            this.btnDisabled=!v||v.length<1;
        },
        projectobj(v){
        }
    },
    methods: {
        hideCreateModalHandler(){
            this.createModalDisplay = false;
            let initArr=['projectdesc',
                'projectcode','projectname',
                "cpu","memory","storage",
                "reason"];
            initArr.forEach(function(k){this[k]=""}.bind(this))
            let initWarningsArr=['projectCodeWarnings','projectNameWarnings','projectDescWarnings'];
            initWarningsArr.forEach(function(k){this[k]=null}.bind(this))
            for(let k in this.applyWarningsMap){
                this.applyWarningsMap[k]=null;
            }
            this.createModalButtons = this.createbuttonActive;
        },
        //创建 handler
        createHandler(){
            let _this=this;
            let flag=validateCreateFormData(this);
            if(flag){
                let createUrl='/api/projectmanagement/addinfo';
                let {projectCode,projectDesc,projectName}=this;
                let createArg={projectCode,projectDesc,projectName};
                let applyUrl='/api/resourceallocation/addprosecution';
                let {cpu,memory,storage,reason}=this;
                let applyArg={cpu,memory,storage,reason};
                let _this=this;
                this.createModalButtons = this.createbuttonDesiable;
                promiseFetch(createUrl,createArg).then((data)=>{
                    if(data&&data.code==0&&data.data){
                        applyArg['projectId']=data.data.projectId;
                        let len= _this.$parent.$parent.$parent.projectSelectOptions.length;
                        let interobj={
                            text:data.data.projectName,
                            value:data.data
                        };
                        if(len<11) {
                            _this.$parent.$parent.$parent.projectSelectOptions.push(interobj);
                            _this.projectSelectOptions=_this.$parent.$parent.$parent.projectSelectOptions;
                        }
                        _this.$parent.$parent.$parent.projectSelectOptionsInit.push(interobj);
                        _this.projectSelectOptionsInit=_this.$parent.$parent.$parent.projectSelectOptionsInit;
                        _this.setCurrentProjectInfo(interobj.value);
                        window.localStorage.setItem("defaultProjectInfo", JSON.stringify(_.currentProjectInfo.get()));
                        _this.currentSelectRecorder=interobj;
                        _this.projectobj =interobj.value.projectName;
                        return promiseFetch(applyUrl,applyArg)
                    }else{
                        return Promise.reject({code:data&&data.code||8000,msg:data&&data.msg||'项目创建失败！'});
                    }
                    return promiseFetch(applyUrl,applyArg)
                }).then(data => {
                    _this.createModalDisplay =false;
                    _this.createModalButtons = _this.createbuttonActive;
                    if(data&&data.code==0){
                        Toast({
                            message: '创建项目及资源申请成功'
                        })
                    }else{
                        Toast({
                            message: '创建项目，资源申请失败'
                        })
                    }
                    setTimeout(function(){
                        this.page2entry()
                    }.bind(this),1500)
                }).catch(ex => {
                    _this.createModalButtons = _this.createbuttonActive;
                    Toast({
                        message: "创建项目失败"
                    })
                });
            }
            return true
        },
        initSelectList(){
            let _this=this;
            fetchProjectSelect((res)=>{
                if(res.code=="0"){
                    setProjectSelectData(res.data,_this)
                }
            })
        },
        sugclick(){
            var showobj =[];
            this.projectSelectOptionsInit.forEach((substr,i)=>{
                if(i<11)
                {
                    showobj.push(substr);
                }
            });
            this.projectSelectOptions=JSON.parse(JSON.stringify(showobj));
        },
        sugInputChangeEvent(v){
            this.isSugChangeInput=true;
        },
        sugChangeInput(v){
            var subobj =  this.projectSelectOptionsInit.filter((fliter)=>
            {
                return  fliter.text.indexOf(v)>-1
            });
            var showobj =[];
            subobj.forEach((substr,i)=>{
                if(i<11){
                    showobj.push(substr);
                }
            });
            this.projectSelectOptions=JSON.parse(JSON.stringify(showobj));
        },
        setCurrentProjectInfo(prom){
            _.currentProjectCode.set(prom.projectCode)
            _.currentProjectId.set(prom.projectId)
            _.currentProjectOwner.set(prom.userName)
            _.currentProjectInfo.set(prom)
        },
        sugSelectClick(rec){
            this.setCurrentProjectInfo(rec.value);
            window.localStorage.setItem("defaultProjectInfo", JSON.stringify(_.currentProjectInfo.get()));
            this.projectobj =rec.value;
            this.currentSelectRecorder=rec;
            this.isSugChangeInput=false;
        },
        txtAreaVali:function (val,key) {
            if(val.length>100){
                this.$set(this.applyWarningsMap,key, ['长度不能超过100字'])
            }else {
                this.$set(this.applyWarningsMap, key, null)
            }
        },
        creatmenu(isasync,item){
            var postobje={};
            if(item) {
                postobje ={valueobje:JSON.stringify(item)};
            }
            let _this = this;
            _.ajax({
                url:'/api/getMenus',
                async: isasync,
                method:'post',
                data:postobje,
                success:function(res){
                    if(res&&!res.code){
                        _this.$parent.$parent.$parent.menus=res.data.menus;
                    }
                }
            })
        },
        //查询授权
        page2search(){
            this.$router.push('/impromptuqueryguide')
            //window.location.href="#/impromptuqueryguide";
        },
        //了解
        page2know(){
            this.$router.push('/metaaccesshistory')
            //window.location.href="#/metaaccesshistory";
        },
        //进入
        page2entry(){
            let _this=this;
            if(this.isSugChangeInput){
                _this.projectobj="";
                return;
            }
            _.ajax({
                url:'/api/projectmanagement/changeproject',
                method:'POST',
                data:_this.currentSelectRecorder.value,
                success:function(res){
                    if(res&&res.code==0){
                        _this.creatmenu(true,_this.currentSelectRecorder);
                        _this.$parent.$parent.$parent.projectobj=_this.projectobj;
                        _this.$router.push('/dashboard'+'?'+Math.random()*10000)
                        //window.location.href="#/dashboard";;
                    }

                }
            });
        },
        createBtnClick(){
            let arr=["projectCode","projectDesc","projectName","cpu","memory","storage","reason"];
            for(let v of arr){
                this[v]="";
            }
            this.createModalDisplay=true;
        }
    }
}
