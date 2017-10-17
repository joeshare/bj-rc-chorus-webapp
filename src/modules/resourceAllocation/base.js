export default {
    name:'resourceAllocationBase',
    methods: {
        //申请资源校验
        //此方法 向导页guide 也在使用 注意！！！！
        validateNotEmptyApply:function(v, key){
            if(/^\s+$/.test(v) || v.length ==0){
                this.$set(this.applyWarningsMap, key, ['不能为空'])
            }else if(!/^[1-9][0-9]*$/.test(v)){
                this.$set(this.applyWarningsMap, key, ['必须为整数，且大于0'])
            }else{
                this.$set(this.applyWarningsMap, key, null)
            }
        },
        //此方法 向导页guide 已覆写 注意！！！！
        txtAreaVali:function (purpose) {
            if(purpose.length>100){
                this.$set(this.applyWarningsMap,"purpose", ['长度不能超过100字'])
            }else {
                this.$set(this.applyWarningsMap, "purpose", null)
            }
        },
        //创建容器校验
        validateNotEmpty:function(v, key){
            if(/^\s+$/.test(v) || v.length ==0){
                this.$set(this.conWarningsMap, key, ['不能为空'])
            }else if(key.indexOf('count') ===0 && !/^[0-9]+$/g.test(v)){
                this.$set(this.conWarningsMap, key, ['必须为数字'])
            }else if (key ==="remark" && v.length>100){
                this.$set(this.conWarningsMap, key, ['长度不能超过100'])
            }else {
                this.$set(this.conWarningsMap, key, null)
            }
        },
        validateInstanceSize:function(key){
            if(!/^[1-9]\d*$/g.test(this.adjustmentObject.count)){
                this.$set(this.adCount, key, ['必须为正整数'])
            }else{
                this.$set(this.adCount, key, null)
            }
        }

    }

}