<template src="./template.html"></template>
<script src="./index.js">

</script>
<style lang="scss">
    .admindashboard{
    .order-type{cursor: pointer; color: #0e9ee2;}
     .topboard{margin-right: 1.5%; width: 13%; border-radius: 10px; border: 1px solid #ccc;height: 160px;box-shadow:rgba(218, 210, 210, 0.96) 5px 5px 2px;
         .topboard-top{text-align:center;font-size:large; font-weight: bold; margin: 25px 0 10px 0; vertical-align: middle;}
         .topboard-middle{text-align: center;font-size: 10px; height: 10%;}
         .topboard-bottom{text-align: center;font-size: xx-large; color: green; line-height: 70px;height: 70px;vertical-align: middle;}
     }
     .res_con{    border-bottom: 2px solid #cecbce;
         margin-bottom: 8px;
         padding-bottom: 8px;}
    .chorus-grid td{ overflow: inherit;}
 .board-title{
     border-top-left-radius: 15px;
     border-top-right-radius: 15px;
     background-color: #f5f5f5;
     border-top:1px solid #ccc;
     border-left:1px solid #ccc;
     border-right:1px solid #ccc;
     padding: 8px 10px;
     /*background-color: rgba(74, 109, 210, 0.5);
     padding: 8px 10px;
     color:white;*/
 }
 .admin-grid-container{
        .resouce-continer{height: 180px;border-right: 1px solid #dfe1e5;
            .resouce-li{text-align:left; padding-top: 15px;padding-left:5%;
                border-left: 1px solid #dfe1e5;
                border-bottom: 1px solid #dfe1e5;
                span{color:green !important;}
                div{height: 40px;}
                div:nth-child(1){font-weight: bold;}

            }
        }

         .member{text-align: center; padding-top: 10px;border: 1px solid #dfe1e5; height: 180px;}
         #member{width: 95%; height: 250px; margin-top: -75px;}
        .data-continer{text-align:left; padding-left: 5%;padding-top: 15px;
            border-left: 1px solid #dfe1e5;
            border-bottom: 1px solid #dfe1e5;
        }

         .text-top-race{
            div{height: 30px;}
         }

        .continer-task{text-align: center; padding-top: 10px;border: 1px solid #dfe1e5;}
        .data-continer-time{text-align:left; padding-left: 5%; padding-top: 15px;border: 1px solid #dfe1e5;}
        .data-title{height: 30px; font-weight: bold;}
        .text-overflower{max-width:120px;width: 115px; display:inline-block;text-overflow:ellipsis; overflow: hidden;}
        .text-overflower-value{display: inline-block;vertical-align:top;color: green;
            text-overflow: ellipsis;
            overflow: hidden;
            max-width: 150px;
            white-space:nowrap;
        }
        .bottom-continer{text-align: center; padding-top: 10px;border: 1px solid #dfe1e5;}
        .bottom-map{width: 99%; margin-left: 10px; height: 250px;}
        .admin-tabs-container{ position: initial !important; margin-top:34px;}
    }
 }



</style>