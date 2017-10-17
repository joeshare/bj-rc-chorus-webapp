<template src="./template.html"></template>
<script src="./index.js">

</script>
<style lang="scss">
.job-monitor-wrapper {

.loglist {
    line-height: 20px;
}

.admin-tabs-container {
    overflow-y: inherit !important;
}

.motitor-window {
.admin-modal-dec-line{border-bottom:0px;}
.admin-modal {
    background-color: black;
    .close-icon{    position: absolute;
        right: 20px;
        top: 20px;
        color: wheat;
        cursor: pointer;
    }
}
.search-text{background-color: black; color: white;height: 25px; user-select:text;width: 450px; border-top:0px;border-left:0px; border-right:0px;}
.admin-modal-content {
    font-size: 13px;
    user-select:text;
    position: absolute;
    top: 50px;
    left: 25px;
    right: 25px;
    bottom: -10px;
    width:auto !important;
    height:auto !important;
    .WARN{color: bisque;word-break:keep-all;  }
    .INFO{color: #eef7fb;word-break:keep-all;  }
    .ERROR{color: #f97070;word-break:keep-all;  }

    .nowarpcss{white-space: nowrap;word-break:keep-all;}
    .warpcss{white-space:normal;word-break:normal; }
    .logpanel{
        height: auto !important;
        width: auto !important;
        position: absolute !important;
        overflow: auto;
        top: 2px;
        bottom: 60px;
        left:0px;
        right:0px;
    }
}
.admin-modal{
    margin-left: 10px;
    margin-right: 10px;
    margin-top: 10px !important;
    margin-bottom: 10px;
    top:10px !important;
    bottom: 10px;
    left:10px;
    right:10px;
    width: auto !important;
    height: auto !important;
    position: absolute !important;
}
.admin-modal-operations{
    position: absolute;
    right: 20px;
    bottom: 15px;
}

.admin-modal-title{
    color:antiquewhite
}
}

}
 #task-monitor-canvas{
    background: url("../../images/workflow/flow-bg.png") repeat;
 }
 .task-monitor-hidden{
     display:none;
  }
  .task-monitor-disabled{
      cursor: not-allowed !important;
      background-color: rgba(14,158,226,.3) !important;
  }
::-webkit-scrollbar-thumb:vertical
{
    border-radius: 4px;
    background-color: white;
    box-shadow: inset 0 0 6px rgba(0,0,0,0.5);
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5);
    -moz-box-shadow: inset 0 0 6px rgba(0,0,0,0.5);
}
::-webkit-scrollbar-thumb:horizontal
{
    border-radius: 4px;
    background-color:white;
    box-shadow: inset 0 0 6px rgba(0,0,0,0.5);
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.5);
    -moz-box-shadow: inset 0 0 6px rgba(0,0,0,0.5);
}
.tip-command-div{
line-height: 18px;
}
.tip-command-ul{
    padding:10px;
    li{
        line-height: 19px;
    }
    span{font-size: 12px; font-family:Verdana ; display:block;}
    .span-text{margin-left: 20px;}
}
</style>