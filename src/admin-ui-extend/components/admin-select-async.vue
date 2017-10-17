<template>
  <div class="admin-select" :class="classes">
    <div class="admin-select-label-text" @click="labelClick" v-if="label" @click.stop="()=>{}">{{ label }}</div>
    <div class="admin-select-core-container" @blur="blur" @focus="focus" @click="click" ref="coreContainer" tabindex="0">
      <div id="test" class="admin-select-core" ref="core" :title='this.tips?placeholderText:""'>
        {{ placeholderText }}
        <span class="admin-select-arrow" :class="optionDisplay ? 'admin-select-arrow-active' : ''">
          <admin-icon type="ion-android-arrow-dropdown"></admin-icon>
        </span>
      </div>
      <ul class="admin-select-option-container" :style="{display:optionDisplay?'block':'none'}" ref="options">
        <li v-for="option in options" @click.stop="select(option)" :class="option.value==localValue?'selected':''">{{ option.text }}</li>
      </ul>
    </div>
    <div class="admin-select-warning" v-for="warning in warnings">{{ warning }}</div>
    <div class="admin-select-warning" v-for="warning in localWarnings">{{ warning }}</div>
  </div>
</template>
<script>
  //异步加载options

  import adminIcon from 'adminUI/components/admin-icon'
  import localValidatorMixin from 'adminUI/helpers/local-validator-mixin'
  import standardFormApiMixin from 'adminUI/helpers/standard-form-api-mixin'
  export default {
    name: 'admin-select-async',
    mixins: [localValidatorMixin, standardFormApiMixin],
    components: {
      adminIcon
    },
    created () {
      let { options, localValue } = this
      for (let i = 0; i < options.length; i++) {
        if (options[i].value === localValue) {
          this.placeholderText = options[i].text
          break
        }
      }
    },
    destroyed () {
      window.document.body.removeEventListener('click', 'adSelectHide')
    },
    data () {
      return {
        isFirst:true,
        optionDisplay: false,
        placeholderText: this.placeholder
      }
    },
    props: {
      tips:{
         default: false
      },
      placeholder: {
        type: String,
        default: '请选择'
      },
      options: {
        type: Array,
        required: true
      }
    },
    watch: {
      localValue (v) {
        let options = this.options
        let isSelect=false;
        for (let i = 0; i < options.length; i++) {
          if (options[i].value === v) {
            isSelect=true
            this.placeholderText = options[i].text
            break
          }
        }
        if(!isSelect){
            this.placeholderText = "";
        }
        this.change()
        this.input()
      },
      options (options){//如果options 晚于localValue加载情况 async
         if(this.localValue){
            let option=null,text=null;
            for (let i = 0; i < options.length; i++) {
                 if (options[i].value === this.localValue) {
                     text= options[i].text
                     option=options[i]
                     break;
                 }
            }
            if(this.placeholderText != text){
                 this.placeholderText = text
                 this.change()
                 this.input()
            }
            if(this.isFirst){//必须有计数器否则就死循环了
                this.isFirst=false;
                this.change()
                this.input()
            }

         }
      }
    },
    methods: {
      labelClick () {
        if (this.disabled) return false
        this.$refs.coreContainer.focus()
        this.showOptions()
      },
      click () {
        if (this.disabled) return false
        this.toggleOptions()
      },
      blur () {
        this.hideOptions()
      },
      showOptions () {
        this.optionDisplay = true
      },
      hideOptions () {
        this.optionDisplay = false
      },
      toggleOptions () {
        this.optionDisplay = !this.optionDisplay
      },
      select (option) {
        this.localValue = option.value
        this.placeholderText = option.text
        this.optionDisplay = false
        this.$emit('select', option)
      }
    }
  }
</script>