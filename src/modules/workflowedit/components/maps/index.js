/**
 * Created by AnThen on 2017-4-14.
 */
import AdminInput from 'adminUI/components/admin-input.vue';
import fetchAgent from  '../../utils/fetchAgent.js';
export default {
    components: {
        AdminInput
    },
    props: ['jobId'],
    watch: {
        jobId(v){
            this.initData();
        }
    },
    data () {
        return {
            maps:[]
        }
    },
    created(){ },
    mounted(){
        this.initData();
    },
    methods: {
        initData(){
            let _this =this;
            _this.maps=[];
            if(this.jobId&&this.jobId!=='create'){
                fetchAgent.getJobinfo(this.jobId,function(res){
                    if(res&&res.code==0){
                        let [taskunit,oVariable,oWorkFlowDSL]=[];
                        res.data.taskList.forEach((mt)=>{
                            taskunit ={id:mt.taskName,name:'',value:[]};
                            oVariable =mt.variable;
                            oWorkFlowDSL = JSON.parse(res.data.workFlowDSL);
                            oWorkFlowDSL.tasks.forEach((task)=>{
                                if(task.name==mt.taskName)
                                {
                                    taskunit.name =task.taskReferenceName;
                                }
                            })

                            if(oVariable){
                                if(typeof mt.variable=='string')
                                {
                                    oVariable =JSON.parse(mt.variable);
                                }
                                for(let oVar in oVariable)
                                {
                                    let mapunit ={keyName:oVar,keyValue:oVariable[oVar]};
                                    taskunit.value.push(mapunit);
                                }
                            }
                            _this.maps.push(taskunit);
                        })
                    }
                })
            }
            this.$emit('maps-toggle',this.maps);
        },
        inputEvent(){
            this.$emit('maps-toggle',this.maps);
        }
    }
}