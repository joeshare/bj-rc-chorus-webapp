<template src="./template.html"></template>
<script src="./index.js">

</script>
<style lang="scss">
.workflow-hidden{
  display:none !important;
}
 .workflow-edit-wrapper{
    position: relative;
    display: flex;
    flex-flow: column;
    height: 100%;
    color:rgb(136, 137, 140)

 }
  .workflow-edit-containter{
     display: flex;
     flex-flow: row;
     height: 100%;
  }
 .workflow-edit-task-l-panel{
    font-size:12px;
    width:150px;
    background:rgba(251, 251, 251, 0.76);
    .dom-dragable{
      cursor: pointer;
    }
    .panel-wrap{
     min-height:60px;
     overflow: hidden;
    }

    .panel-title{
      height:30px;
      line-height:30px;
      text-align:center;
      font-weight:bold;
      border-bottom: 1px solid rgb(239, 239, 239);
      border-top: 1px solid #fff;
      background: rgba(204,204,204,0.5);
      .text{
        line-height:28px;
        display: inline-block;
        vertical-align: top;
        font-size: 12px;
      }
    }
    .workflow-panel-content-wrap{
       position: absolute;top: 30px;left: 0;right: 0;bottom: 0;
    }
    .workflow-panel-container{
           overflow-y:auto;height:100%;
     }
    .panel-container{
       overflow-y:auto;max-height: 215px;
    }
    .noData{
         height: 30px;
         line-height: 30px;
         text-align: center;
    }
    .workflow-icon{
      font-size:16px;
      width:16px;
      margin-right:5px;
      display: inline-block;
    }
 }
 .workflow-edit-module-node{
           font-size:12px;
           color:rgb(136, 137, 140);
           border-top: 1px solid #efeeee;
           border-left: 1px solid #efeeee;
           border-right: 1px solid #fff;
           border-bottom: 1px solid #fff;
           margin:5px 0px;
           height:30px;
           line-height:30px;
           text-align:center;
           background:#f5f5f5;
           overflow: hidden;
           white-space: nowrap;
           text-overflow: ellipsis;
           padding:0 10px;
           cursor:no-drop;
           .title{
                 display:block;
                 vertical-align: middle;
                 line-height: 28px;
                 height: 30px;
                 overflow: hidden;
                 white-space: nowrap;
                 text-overflow: ellipsis;
                 max-width: 100px;
           }
 }
 #workflow-edit-task-canvas{
    background: url("../../images/workflow/flow-bg.png") repeat;
 }
 .workflow-edit-task-r-panel{
    flex:1;
    .workflow-edit-task-can-wrap{}
    .workflow-edit-task-can-wrap{}
 }
 .workflow-tmp-drag{
     position: relative;
     border: 1px solid #ddd;
 }
 .workflow-canvas-active{
   box-shadow: 0px 0px 2px 1px #0e9ee2;
 }
 .workflow-edit-task-deploy-panel-title{
    height: 34px;
    line-height: 34px;
    display:flex;
    flex-flow: row;
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
 
 .workflow-edit-task-deploy-panel-container{
   margin:15px 0;
   .field{
       margin:0 0 25px 0;
       width:100%;
   }
 }
 .workflow-edit-task-property-panel .admin-tabs-container{
 }
 .workflow-edit-property-panel-field-key,.workflow-edit-property-panel-field-val{
      margin:0 0 25px 0;
      width:187px
 }
</style>