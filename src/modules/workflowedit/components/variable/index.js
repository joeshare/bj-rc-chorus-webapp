/**
 * Created by AnThen on 2017-4-14.
 */
export default {
    props: ['option'],
    components: {
    },
    created () {
        this.entry = this.option
    },
    computed: {
    },
    watch: {
        option (v) {
            this.entry = v;
        }
    },
    data() {
        return {
            entry: this.option
        }
    },
    methods: {
        //是否有变量
        hasVariable(entry){
            return !!entry.variable;
        },
        clickShowVariable(entry,e){
            var panel=e.target.parentNode.parentNode.querySelector('.panel');
            if(entry.isShowVariable){
                entry.isShowVariable=false;
                panel.style.display = 'none';
            }else{
                entry.isShowVariable=true;
                panel.style.display = 'block';
            }
        },
        str2Arr(str){
            var res=[];
            try{
                res=str?JSON.parse(str):[];
            }catch (e){
                console.log("variable not json ",e)
                res=[];
            }
            return res;
        }
    }
}