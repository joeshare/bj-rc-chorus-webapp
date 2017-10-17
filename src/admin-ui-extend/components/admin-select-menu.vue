<style lang="scss">
  @import "../../stylesheets/vars.scss";
  .admin-select-menu-text{
    color:#fff;
    padding:0 15px;
    cursor:pointer;
    .ion-ios-arrow-down{
      margin-left:15px;
    }
  }
  .admin-input {
    display: inline-block;
    .admin-input-label {
      display: inline-block;
    }
    .admin-input-label-text {
      margin-bottom: 8px;
      font-size: $small;
      color: darken($gray, 25%);
    }
    .admin-input-warning {
      margin-top: 4px;
      font-size: $small;
      color: $danger;
    }
    .admin-input-container {
      position: relative;
      line-height: 32px;
      display: inline-block;
      color: darken($gray, 25%);
    }
    .admin-input-icon {
      position: absolute;
      top: 50%;
      left: 8px;
      height: 30px;
      margin-top: -15px;
      line-height: 32px;
    }
    .admin-input-core {
      line-height: 32px;
    }
  }
  .admin-input-associations-container-custom {
    position: absolute;
    z-index: 9999;
    top: 36px;
    border: 1px solid lighten($gray, 5%);
    border-radius: 2px;
    padding: 4px 0;
    min-width: 84px;
    width: 100%;
    box-shadow: $shadowLevel3;
    background-color: #fff;
    li {
      height: 32px;
      padding: 0 8px;
      line-height: 32px;
      font-size: $normal;
      color: darken($gray, 35%);
      word-break: keep-all;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      user-select: none;
      cursor: default;
      color: darken($gray, 35%);
    }
    li:not(.selected):hover {
      background-color: lighten($gray, 20%);
    }
  }
  .admin-input.warning {
    .admin-input-warning {
      margin-top: 6px;
      font-size: $small;
      color: $danger;
    }
    .admin-input-core {
      border-color: $danger !important;
    }
    .admin-input-core:focus {
      box-shadow: 0 0 4px $danger;
    }
  }
  .admin-input.icon {
    .admin-input-core {
      padding-left: 34px;
    }
  }
  .admin-input.small {
    .admin-input-label-text {
      margin-bottom: 6px;
    }
    .admin-input-core {
      height: 26px;
    }
    .admin-input-container {
      line-height: 26px;
    }
    .admin-input-associations-container-custom {
      top: 28px;
      max-height: 140px;
      overflow-y: auto;
      li {
        height: 26px;
        padding: 0 8px;
        line-height: 26px;
        font-size: $small;
      }
    }
  }
  .admin-input.small.icon {
    .admin-input-core {
      padding-left: 30px;
    }
  }
  .disabled {
    .admin-input-label-text, .admin-input-container {
      cursor: not-allowed;
    }
  }
</style>
<template>
  <div class="admin-input" :class="classes">
    <div class="admin-input-label-text" v-if="label"  @click.stop="labelClick()">{{ label }}</div>
    <span class="admin-input-container" v-else>
      <ad-icon v-if="icon" class="admin-input-icon" :type="icon" size="16px"></ad-icon>
      <a class="admin-select-menu-text"
        href="javascript:void(0);"
        @click.stop="click($event)"
        @input="input($event)"
        @change="change($event)"
        @focus="focus($event)"
        @blur="blur($event)"
        @keyup="keyup($event)"
        @keypress="keypress($event)"
        @keydown="keydown($event)"
        ref="core">{{ text }} <i class="ion-ios-arrow-down"></i></a>
      <ul class="admin-input-associations-container-custom" v-show="associationsShow" ref="associations">
        <li v-for="(association,index ) in showSelectData" @click.stop="selectAssociation(association)">{{ association.text }}</li>
      </ul>
    </span>
    <div class="admin-input-warning" v-for="warning in warnings">{{ warning }}</div>
    <div class="admin-input-warning" v-for="warning of localWarnings">{{ warning }}</div>
  </div>
  
</template>
<script>
  // 下拉式menu
  import localValidatorMixin from 'adminUI/helpers/local-validator-mixin'
  import standardFormApiMixin from 'adminUI/helpers/standard-form-api-mixin'
  import AdIcon from 'adminUI/components/admin-icon'
  export default {
    name: 'ad-select-menu',
    mounted () {
      let vm = this
      window.document.addEventListener('click', function adAssociationsHide () {
       // vm.associationsShow = false
      })
    },
    destroyed () {
      window.document.removeEventListener('click', 'adAssociationsHide')
    },
    data () {
      return {
        // is the throttlling on
        showmorebtn:false,
        throttlling: true,
        associationsShow: false,
        showSelectData:this.associations
      }
    },
    mixins: [localValidatorMixin, standardFormApiMixin],
    props: {
      type: {
        type: String,
        default: 'text'
      },
      text: {
        type: String,
        default: ''
      },
      //限制显示下拉数量
      showLimit: {
        type: Number,
        default: 10
      },
      //下拉数据<text,value>
      associations: Array,
      icon: String
    },
    components: {
      AdIcon
    },
    watch: {
      associations (v) {
        if(v.length==0)
        {
          this.associationsShow = false;
        }
        let _this=this;
        _this.showSelectData=v;
      }
    },
    methods: {
      keyup (e) { this.$emit('keyup', e.target.value, e)
        this.changeAssociations(e);
      },
      keypress (e) { this.$emit('keypress', e.target.value, e)},
      keydown (e) { this.$emit('keydown', e.target.value, e) },
      click (e) {
        this.$emit('click', e.target.value, e)
        this.changeAssociations(e);
      },
      changeAssociations(e){
        console.log('changeAssociations',this.associations)
        if(this.associations.length>0)
        {
          this.associationsShow = true;
        }

      },
      blur(e){
        let _this =this;
        setTimeout(function () {
          _this.associationsShow = false;
        },200);
        this.$emit('blur', null)

      },
      labelClick () {
        this.$refs.core.focus()
      },
      toggleAssociations (v) {
      /*  if (v) this.associationsShow = !!this.associations
        else this.associationsShow = false*/
        this.associationsShow = false;
      },
      selectAssociation (rec) {
        this.toggleAssociations(false)
        this.localValue = rec.text
        this.$emit('toggle-select', rec)
        this.input()

      }
    }
  }
</script>