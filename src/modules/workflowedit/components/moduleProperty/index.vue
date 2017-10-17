/**
 * Created by AnThen on 2017-4-14.
 */
<template src="./template.html">
</template>
<script src="./index.js"></script>
<style lang="scss">
 .workflow-edit-property-panel-field{
    margin:0 0 25px 0;
    width:100%;
    .admin-select-core{ width:244px !important;
    }
 }
 .workflow-edit-property-field-required{
  margin-right: 5px;
  vertical-align: middle;
 }
 .workflow-edit-property-maps-row{
  .workflow-edit-property-panel-field-key, .workflow-edit-property-panel-field-val{
    margin-bottom:5px;
    width:100px;
    display: inline-block;
    vertical-align: middle;
  }
  .workflow-edit-property-panel-field .admin-select-core{width:100% !important;}
 }
.workflow-edit-module-property-group{
    height: 34px;
    line-height: 34px;
    display:flex;
    flex-flow: row;
    margin-bottom: 15px;
    .group-line-short,.group-line-long{ 
      height:17px;
      border-bottom: 1px;
      border-bottom-color: #999;
      border-bottom-style: solid;
      display: inline-block;}
    .group-line-short{width:15px;}
    .group-line-long{flex:1}
    .group-line-text{padding:0 5px;width: auto;}
  }
  
</style>