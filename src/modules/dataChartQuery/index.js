/**
 * Created by AnThen on 2017-3-3.
 */
import AdInput from 'adminUI/components/admin-input';
import AdSugInput from './components/admin-input-custom.vue';

import adSpinner from 'adminUI/components/admin-spinner'
import AdModal from 'adminUI/components/admin-modal';
import {queryFiltersData as queryMockFiltersData,
    queryProjectData as queryMockProjectData,
    queryPointData as queryMockPointData,
    queryChartData as queryMockChartData} from  './mock.js';
import adSelect from 'adminUI/components/admin-select';
import {point} from './models/pointModel.js';
import {setVM} from './models/utils.js';
import navBar  from '../../admin-ui-extend/components/admin-navbar.vue';
const hasReg=/^\s+$/;
let isClickSelect=false;
export default {
    components: {
        AdInput,
        AdSugInput,
        adSelect,
        adSpinner,
        navBar,
    },
    data () {

        let _this=this;
        return {
            navlist:[{id:1,text:'数据分析',url:''},{id:2,text:'数据图谱',url:''}],
            testValue:"",
            showloading:false,
            associations:[],
            data:[],
            options: [],
            vertexCode:'',
            selectValue:'',
            sugInputText:'',
            projectValue:'',
            filters:[],
            projects:[],
            filtersPanelHeight:'170',
            propertyList:[]
        }
    },
    created() {
      //  this.fetchProjectData();
        this.fetchFiltersData();
        setVM(this)
    },
    mounted(){
        this.setCanStyle();
    },
    methods: {
        //suggest内容变换时
        sugChangeInput(v){

            this.filters=[];

        if(isClickSelect){
            isClickSelect=false;
            return;
        }
            //提交参数
          var postParams={
              dataName:v
          };
            v=v.trim();
            if(v.length&&v.length>0)
            {
                let _this =this;
                _.ajax({
                    url:'/api/datachartquery/getvertexlistbyname',
                    method:'POST',
                    data:postParams,
                    success:function(res){
                        if(res.code=="0"){
                            var data=res.data;
                            var arr=[];
                            data.forEach((d,i)=>{
                                arr.push({
                                    text:d.vertexName,
                                    value:d.vertexLabel
                                })
                            })
                           // _this.fetchPointData(1);
                            _this.associations=arr;
                        }
                    }
                })
            }
        },
        //suggest 下拉框点击
        sugSelectClick(rec){
            isClickSelect=true;
            this.sugInputText=rec.text;
            this.vertexCode=rec.value;
            this.fetchFiltersData();
            //this.
        },
        setCanStyle(){
            var w=$('.chorus-main').width()-32;
            this.$refs.canvas.width=(w>1200?(w-40-188):1200-200);
        },
        filterPanelMoreOpen(){
            document.querySelector('#data-chart-more-open').style.display='none';
            document.querySelector('#data-chart-more-close').style.display='block';
            document.querySelector('#data-chart-filter-panel').style.height='auto';
        },
        filterPanelMoreClose(){
            if(document.querySelector('#data-chart-more-open'))
            {
            document.querySelector('#data-chart-more-open').style.display='block';
            document.querySelector('#data-chart-more-close').style.display='none';
            document.querySelector('#data-chart-filter-panel').style.height='';
            }
        },
        //获取点属性数据
        fetchFiltersData(){
            //提交参数
            var postData={
               // projectCode:this.projectValue,
                dataCode:this.vertexCode
            }
            let _this = this;
            _.ajax({
                url:'/api/datachartquery/getpropertybyvertexid',
                method:'POST',
                data:postData,
                success:function(res){
                    if(res.code=="0"){
                        var data=res.data;
                        data.forEach((f,i)=>{
                            f.propertyValue="";
                        })
                        if(data.length>6){
                            _this.filtersPanelHeight='170';
                        }else if( data.length>=1&& data.length<4){
                            _this.filtersPanelHeight='95';
                        }
                        _this.filters=data;
                        _this.filterPanelMoreClose();
                        document.querySelector('#data-chart-filter-panel').style.height=_this.filtersPanelHeight+'px';
                    }
                }
            })
        },
        /*//获取项目数据
        fetchProjectData(){
            //var data=queryMockProjectData().data[0].aaData;
            let _this = this;
            _.ajax({
                url:'/api/datachartquery/projectlist',
                method:'POST',
                success:function(res){
                    if(res.code=="0"){
                        var selectData= [];
                        res.data.forEach((d,i)=>{
                            if(!i){
                                _this.projectValue=d.projectCode;
                            }
                            selectData.push({
                                text: d.projectName,
                                value: d.projectCode
                            })
                        })
                        _this.projects=selectData;
                        if(selectData&&selectData.length){
                            _this.projectValue=selectData[0].value
                        }
                        _this.projectValue
                    }
                }
            })

        },*/
        //点线查询
        fetchPointData(){
            this.showloading =true;
            var properties=[],size=10,project='';
            this.filters.forEach((f,i)=>{

                if(f.propertyValue&&f.propertyValue.length)
                {
                    properties.push({
                        name:f.propertyCode,
                        value:f.propertyValue
                    })
                }
            })
            var vertexInput={
                //点code
                vertexCode:this.vertexCode,
                //点属性
                properties
                //边
               // edgeInputVo:null
            };

            if(!vertexInput.properties||vertexInput.properties.length==0){
                delete vertexInput.properties;
            };
            var postData={
                size,
                project,
                vertexInput
            };

            let _this =this;
            _.ajax({
                url:'/api/datachartquery/vertexedgelist',
                method:'POST',
                data:{object:JSON.stringify(postData)},
                success:function(res){

                    if(res.code=="0"){
                        _this.showloading =false;
                        point.init(res.data);
                    }
                }
            });
        }

    }

}
