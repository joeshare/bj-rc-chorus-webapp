<template>
<div class="admin-tabs-wrapper-vertical" :style="adminTabsWrapperStyle">
    <div style="">
      <div class="ion-navicon" @click="changemenu($event)" style="    padding-left: 3px;height:24px;line-height:24px;cursor: pointer; font-size: 24px;"></div>
    </div>
    <div class="admin-tabs-nav" >
        <ul>
            <li v-for="(entry, index) in tabs" :class="entry.name==activeTabName?'admin-tabs-active':''" :name="['tab-'+entry.name]"  @click="toggleTabs(entry.name);"><a href="javascript:void(0);" :title="entry.text">{{entry.text}}</a></li>
        </ul>
    </div>
    <div  class="admin-tabs-container" >
        <slot class="admin-tabs-content"></slot>
    </div>
</div>
</template>
<script>
//tabs 垂直版
export default {
  data () {
    return {
      adminTabsWrapperStyle:{width:'300px'},
      activeTabName: this.currentTabName
    }
  },
  props: ['tabs', 'currentTabName'],
  watch: {
    currentTabName (v) {
      this.activeTabName = this.currentTabName;
      if(this.currentTabName){
      this.toggleTabs(this.currentTabName)}
    }
  },
  methods: {
    changemenu(e){
         let type=this.adminTabsWrapperStyle.width=='300px'
         let width=type?26:300;
          //true 是展开
         this.$emit('before-change-spread',type, width)
         this.adminTabsWrapperStyle={width:width+"px"};


    },
    toggleTabs (name) {
      this.activeTabName = name
      this.$emit('toggle-tab', name)
      var cons = this.$el.querySelectorAll('.admin-tabs-container>*')
      var tabs = this.$el.querySelectorAll('.admin-tabs-nav li')
      var activeEl = this.$el.querySelectorAll('* [ name=' + name + ']')
      for (var i = 0, len = cons.length; i < len; i++) {
        cons[i].style.display = 'none'
      }
      if (activeEl && activeEl[0]) {
        activeEl[0].style.display = 'block'
      }
      for (var m = 0, num = tabs.length; m < num; m++) {
        var label = tabs[m]
        label.name === 'tab-' + name ? label.classList.add('admin-tabs-active') : label.classList.remove('admin-tabs-active')
      }
    }
  },
  components: {
    child: {template: '<div></div>'}
  },
  mounted () {
    var els = this.$el.querySelectorAll('.admin-tabs-container > *')
    for (var i = 0, len = els.length; i < len; i++) {
      els[i].classList.add('admin-tabs-content')
    }
  }
}
</script>
<style lang="scss">
  @import "../../stylesheets/vars.scss";
  .admin-tabs-wrapper-vertical {

    min-height:400px;
    overflow:hidden;
    position: relative;
    z-index: 0;
    height: 100%;
    display: block;

    .admin-tabs-nav {
        position: absolute;
        top: 24px;
        z-index: 2;
        right: 0;
        width:25px;
        & > ul:after {
          conten: '';
          display: block;
          clear: both;
        }
        li:first-child{
           border-top: 1px solid #dfe1e5;
        }
        li {
          border-right: 1px solid #dfe1e5;
          border-bottom: 1px solid #dfe1e5;
          border-top-right-radius:5px;
          border-bottom-right-radius:5px;
          text-align: center;
          padding: 10px 0;
          cursor: pointer;
          overflow: hidden;
          max-width: 24px;
          a {
            color: $grayDarken5;
            font-size: $normal;
          }
        }
        li:not(.admin-tabs-active):hover {
          a {
            color: $grayDarken25;
          }
        }
    }
      li.admin-tabs-active {
         border-left: 2px solid $primary;
        a {
          color: $grayDarken35;
        }
      }
    .admin-tabs-container {
        clear: both;
        border-top: 1px solid #dfe1e5;
        border-right: 1px solid #dfe1e5;
        position: absolute;
        top: 24px;
        left:0;
        z-index: 1;
        right: 24px;
        bottom: 1px;
        display: block;
        overflow-y: auto;
        .admin-tabs-content {
          display: none;
          padding: 10px;
        }
        .admin-tabs-content:first-child {
          display: block;
        }
    }
  }

</style>
