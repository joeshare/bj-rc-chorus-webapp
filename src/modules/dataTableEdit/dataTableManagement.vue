<style lang="scss" scoped>
  .chorus-data-table-management {
    position: relative;
    display: flex;
    flex-flow: column;
    height: 100%;
    min-height:768px;
    color:rgb(136, 137, 140);

    .chorus-toolbar {
      padding-top: 10px;
    }
    .create-data-table-button {
      float: right;
    }
    .table-container, .paginator-container {
      width: 100%;
      padding: 0 20px;
    }
    .data-table-list {
      width: 100%;
      tbody td:last-Child {
        text-align: center;
      }
    }
  }
  .create-form-el {
    width: 100%;
  }
  .create-form-el-container {
    padding: 10px;
  }

  .field-table {
    th:last-Child {
      text-align: center;
    }
    th, td {
      vertical-align: middle;
    }
  }
  .field-table-form-el {
    width: 100%;
  }
  .create-form-step-2-container {
    width: 100%;
  }
  .field-table-container {
    width: 100%;
    height: 284px;
    overflow-x: auto;
    overflow-y: auto;
  }
  .field-table-container.detail {
    height: auto;
    min-height: 100px;
    padding: 10px;
  }
</style>
<template src="./template.html"></template>
<script src="./index.js"></script>