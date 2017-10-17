<template>
    <div style="height: 100%;" id="chorus-layout" class="chorus-layout hidemenus">
        <container>
            <div slot="header">
                <div style="display: block;height: 22px;">
                    <div :style="changeMenuSwitchStyle" class="ion-navicon" @click="changemenu()" style="cursor: pointer; font-size: 24px;
        position: absolute;
        color: rgb(253, 251, 251);  padding: 0px 4px; top: 6px;
        left: 5px;
        z-index: 10;
        line-height:54px;"></div>
                    <div class="logo" style="float: left; margin-left: 20px;font-size: 22px;">
                        <span style="font-size: 32px;">Chorus</span> 一站式数据服务平台</div>
                    <div class="admin" style="float: right; " id="headerRight" ref="headerRight">
                        <span :style="showHideHeaderProjectSelectStyle" >
                            当前项目：
                            <ad-sug-input style="margin-right: 20px;" v-model="projectobj" :associations="projectSelectOptions" :small="true" placeholder="" @click="sugclick" @toggle-select="sugSelectClick" @input="sugChangeInput"></ad-sug-input>
                        </span>
                        <span style="height:40px;line-height:40px;display:inline-block;vertical-align: middle;"><img style="width:85%" :src="userImage"></span>
                        <span style="height:40px;line-height:40px;display:inline-block;vertical-align: middle;">
                            <ad-select-menu style="margin-right: 20px;color:#fff;width:auto;min-width: 125px;" :associations="headerSelectMenuOptions" :small="true" v-model="selectMenuVal" :text="userInfo.name" @toggle-select="selectMenuSelectClick"></ad-select-menu>
                        </span>
                    </div>
                </div>
            </div>
            <div slot="sidebar" id="navMenu">
                <nav-menu :menu-items="menus" @admin-menu-select="getUrl"></nav-menu>
            </div>
            <div slot="content">
                <Pannel class="chorus-main">
                    <router-view class="page" id="routerView" ref="routerView"></router-view>
                </Pannel>
            </div>
        </container>
        <ad-modal class="header-modal" height="240px" width="400px" title="提示" :display="logoutModalDisplay" :buttons="logoutModalButtons" @admin-modal-off="() => {logoutModalDisplay = false; }" @admin-modal-cancel="() => {logoutModalDisplay = false;}">
            <p style="font-size:16px;margin-bottom:20px;">确认退出吗？</p>
            <admin-checkbox :small="true" text="下次登录直接进入当前页" v-model="singleBoxValue"></admin-checkbox><br />
        </ad-modal>
    </div>
</template>
<style>
body {
    font-family: Helvetica, sans-serif;
}

@keyframes menuactionshow {
    from {
        min-width: 200px;
        width: 15%;
    }
    to {
        min-width: 1px;
        width: 1px;
        overflow: hidden;
    }
}

@-webkit-keyframes menuactionshow {
    from {
        min-width: 200px;
        width: 15%;
    }
    to {
        min-width: 1px;
        width: 1px;
        overflow: hidden;
    }
}

.chorus-layout.hidemenus .admin-page-sidebar {
    /* animation: menuactionshow 0.3s;*/
    min-width: 1px !important;
    width: 1px !important;
    overflow: hidden;
}

.admin-page-sidebar div {
    min-width: 200px;
}

.menusbutton {
    background-color: #fff;
}

.admin-page-header>div {
    height: 40px;
    line-height: 40px;
}

.admin-page-sidebar {
    overflow-y: auto;
    overflow-x: hidden;
}

.header-modal .admin-checkbox-text {
    font-size: 12px;
}

.header-modal .admin-checkbox-core {
    font-size: 12px;
    width: 14px !important;
    height: 14px !important;
    margin-right: 5px !important;
}

.header-modal input.admin-checkbox:checked+.admin-checkbox-sub:before {
    top: 3px !important;
    left: 2px !important;
}
</style>

<script>
import Container from "./admin-ui/components/admin-page-container.vue"
import Pannel from "./admin-ui/components/admin-pannel.vue"
import adSelect from './admin-ui/components/admin-select'
import AdSugInput from './admin-ui-extend/components/admin-input-custom.vue';
import AdSelectMenu from './admin-ui-extend/components/admin-select-menu.vue';
import navMenu from 'adminUI/components/admin-menu';
import CONSTANT from 'Utils/constant';
import AdModal from 'adminUI/components/admin-modal.vue';
import adminCheckbox from 'adminUI/components/admin-checkbox';
import userImg from './images/userimage.png';
let resizeTimer = null;
export default {
    data() {
        let _this = this;
        return {
            userImage: userImg,
            isHiddenProjectInput:false,
           
            logoutModalDisplay: false,
            singleBoxValue: true,
            selectMenuVal: '',
            userInfo: {},
            changeMenuSwitchStyle: { display: 'none' },
            showHideHeaderProjectSelectStyle: { display: 'none' },
            projectobj: "",
            projectSelectOptions: [],
            projectSelectOptionsInit: [],
            headerSelectMenuOptions: [{ text: '退出', value: 'logout' }],
            isHeaderSelectMenuOnlyLogout:false,
            menus: [],
            logoutModalButtons: [{
                text: '取消',
                buttonClass: 'ad-auxiliary admin-small',
                name: 'cancel'
            }, {
                text: '确定',
                buttonClass: 'ad-auxiliary admin-small',
                name: 'ok',
                handler() {
                    _this.logout();
                    _this.setDefaultEntryPage(_this.singleBoxValue);
                    _this.logoutModalDisplay = false;
                }
            }]
        }
    },
    watch: {
        //向导功能需要路由监控
        $route(route) {
            let flag = (CONSTANT.guideRouteArr.indexOf(route.path) > -1);
            //origin 页面来源
            let originPage = this.$route.params.origin;
            if (originPage) {
                flag = (CONSTANT.guideRouteArr.indexOf(`/${originPage}`) > -1);
            }
            this.showHideChangeMenuSwitchBtn(!flag)
            this.showHideHeaderProjectSelect(!flag&&!this.isHiddenProjectInput);
            console.log('route.path', route.path)
            if (route.path == '/impromptuqueryguide' || route.path == '/metaaccesshistory' || originPage == 'metaaccesshistory') {
                this.setBackMenu();
            } else if (route.path == '/guide') {
                this.setInitMenu();
            } else {
                this.setQuitMenu();
            }
            this.triggerMenuExpand(!flag)

        }
    },
    methods: {
        fetchOperationStatus(){
            let _this=this;
            _.ajax({
                url: "/api/projectmanagement/fetchoperationstatus",
                method: 'POST',
                success: function (res) {
                    let flag=(`${res.code}` == '0' && `${res.data.value}` == '1');
                    _this.isHiddenProjectInput=_this.isHeaderSelectMenuOnlyLogout=flag;
                    
                }
            })
        },
        setInitMenu() {
            let tmp = JSON.parse(JSON.stringify(this.headerSelectMenuOptions));
            tmp = tmp.slice(tmp.length - 1, tmp.length);
            this.headerSelectMenuOptions = tmp;
        },
        setBackMenu() {
            let tmp = JSON.parse(JSON.stringify(this.headerSelectMenuOptions));
            tmp = tmp.slice(tmp.length - 1, tmp.length);
            !this.isHeaderSelectMenuOnlyLogout&&tmp.unshift({ text: '返回', value: 'back' });
            this.headerSelectMenuOptions = tmp;
        },
        setQuitMenu() {
            let tmp = JSON.parse(JSON.stringify(this.headerSelectMenuOptions));
            tmp = tmp.slice(tmp.length - 1, tmp.length);
            !this.isHeaderSelectMenuOnlyLogout&&tmp.unshift({ text: '退出当前项目', value: 'quit' });
            this.headerSelectMenuOptions = tmp;
        },
        showHideChangeMenuSwitchBtn(type) {
            let display = type ? 'block' : 'none';
            this.changeMenuSwitchStyle = { display };
        },
        showHideHeaderProjectSelect(type) {
            let display = type ? 'inline-block' : 'none';
            this.showHideHeaderProjectSelectStyle = { display };
        },
        setCurrentProjectInfo(prom) {
            _.currentProjectCode.set(prom.projectCode)
            _.currentProjectId.set(prom.projectId)
            // console.log('_.currentProjectOwner.set',prom.userName)
            _.currentProjectOwner.set(prom.userName)
            _.currentProjectInfo.set(prom)
        },
        logout() {
            _.ajax({
                url: '/api/logout',
                method: 'POST'
            });
            window.location.href = '/login.html';

        },
        triggerMenuExpand(type) {
            let $sidebar = $('.chorus-layout');
            let $pageSidebar = $('.admin-page-sidebar');
            if (type == undefined) {
                if ($sidebar.hasClass('hidemenus')) {
                    $sidebar.removeClass('hidemenus');
                    $pageSidebar.width(227);
                } else {
                    $sidebar.addClass('hidemenus');
                    $pageSidebar.width(1);
                }
            } else if (type === true) {
                $sidebar.hasClass('hidemenus') && $sidebar.removeClass('hidemenus');
                $sidebar.hasClass('hidemenus') && $pageSidebar.width(227);
            } else if (type === false) {
                !$sidebar.hasClass('hidemenus') && $sidebar.addClass('hidemenus');
                !$sidebar.hasClass('hidemenus') && $pageSidebar.width(1);
            }
        },
        changemenu(type) {
            this.triggerMenuExpand(type);
            _.appResize()
            let _this = this;
            if (!this.sidebars) {
                let sidebars = document.querySelectorAll('.admin-page-sidebar')
                this.sidebars = sidebars[0];
            }
            setTimeout(function() { _.appResize() }, 1)
        },
        sugclick() {
            var showobj = [];
            this.projectSelectOptionsInit.forEach((substr, i) => {
                if (i < 11) {
                    showobj.push(substr);
                }
            });
            this.projectSelectOptions = JSON.parse(JSON.stringify(showobj));
        },
        sugChangeInput(v) {
            var subobj = this.projectSelectOptionsInit.filter((fliter) => {
                return fliter.text.indexOf(v) > -1
            });
            var showobj = [];
            subobj.forEach((substr, i) => {
                if (i < 11) {
                    showobj.push(substr);
                }
            });

            this.projectSelectOptions = JSON.parse(JSON.stringify(showobj));
        },
        sugSelectClick(rec) {
            let _this = this;
            _this.setCurrentProjectInfo(rec.value);
            window.localStorage.setItem("defaultProjectInfo", JSON.stringify(_.currentProjectInfo.get()));
            _this.projectobj = rec.value;
            _.ajax({
                url: '/api/projectmanagement/changeproject',
                method: 'POST',
                data: rec.value,
                success: function(res) {
                    if (res && res.code == 0) {
                        if (_.urltransfer(_this.$router, '/dashboard' + '?' + Math.random() * 10000)) {
                            _this.creatmenu(true, rec);
                        }
                        //window.location.href="#/dashboard"+'?'+Math.random()*10000;;
                    }

                }
            });
        },
        //头部下拉菜单点击事件
        selectMenuSelectClick(rec) {
            if (rec.value == 'logout') {
                this.logoutModalDisplay = true;
            } else if (rec.value == 'back' || rec.value == 'quit') {
                _.urltransfer(this.$router, '/guide');
                //this.$router.push('/guide')
            }

        },
        //设置默认登录后展示页面
        setDefaultEntryPage(f) {
            console.log('setDefaultEntryPage', f)
            if (!f) {
                window.localStorage.clear()
            } else {
                let arr = window.location.href.split("#");
                console.log(arr)
                window.localStorage.setItem("defaultEntryPage", `/#${arr[1]}`);
                window.localStorage.setItem("defaultProjectInfo", JSON.stringify(_.currentProjectInfo.get()));
            }


        },
        getUrl(item) {
            if (item.url) {
                _.urltransfer(this.$router, item.url);
            }
        },
        creatmenu(isasync, item) {
            var postobje = {};
            if (item) {
                postobje = { valueobje: JSON.stringify(item) };

            }
            let _this = this;
            _.ajax({
                url: '/api/getMenus',
                async: isasync,
                method: 'post',
                data: postobje,
                success: function(res) {
                    if (res && !res.code) {
                        _this.menus = res.data.menus;
                    }
                }
            })
        }
    },
    created() {
        this.menus = _.navMenus.get();
        _.appResize();
        window.onresize = function() {
            resizeTimer = resizeTimer ? null : setTimeout(() => {
                _.appResize();
            }, 0);
        }
        let _this = this;
        let defaultProjectInfo = window.localStorage.getItem('defaultProjectInfo')
        let changeproject = null;
        try {
            changeproject = JSON.parse(defaultProjectInfo);
        } catch (e) {
            console.log('defaultProjectInfo error')
        }
        if (changeproject) {
            _.ajax({
                url: '/api/projectmanagement/changeproject',
                async: false,
                method: 'POST',
                data: changeproject
            });
        }
        this.fetchOperationStatus();
        _.ajax({
            url: '/api/projectmanagement/selectlist',
            method: 'POST',
            async: false,
            data: {
                pageNum: 1,
                pageSize: 100
            },
            success: function(res) {
                if (res.code == "0") {
                    let currentArry = [];
                    let initArray = [];
                    res.data.list.forEach((prom, i) => {
                        var interobj = {
                            value: prom,
                            text: prom.projectName
                        };
                        if (prom.active) {
                            _this.setCurrentProjectInfo(prom);
                            _this.projectobj = prom.projectName;
                        }
                        if (i < 11) {
                            currentArry.push(interobj);
                        }
                        initArray.push(interobj);
                    });
                    _this.projectSelectOptions = currentArry;
                    _this.projectSelectOptionsInit = initArray;
                }
            },
            error: function(res) {
            }
        })
        //用户信息
        _.ajax({
            url: '/api/getUserInfo',
            method: 'POST',
            async: false,
            success: function(res) {
                if (res && res.code == 0) {
                    _this.userInfo = res.data;
                    _.currentUserInfo.set(res.data)
                    window.localStorage.setItem("defaultUserName", res.data.name);
                }
            }
        });
    },
    components: { Container, Pannel, adSelect, AdSugInput, navMenu, AdSelectMenu, AdModal, adminCheckbox }
}
</script>