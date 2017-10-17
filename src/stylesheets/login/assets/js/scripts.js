function getDefaultProjectInfo() {
    let defaultProjectInfo = window.localStorage.getItem('defaultProjectInfo')
    let changeproject = null;
    try {
        changeproject = JSON.parse(defaultProjectInfo);
    } catch (e) {
        console.log('login scripts defaultProjectInfo error')
    }
    return changeproject;
}

function getDefaultUserName() {
    return window.localStorage.getItem("defaultUserName");
}
//var rsaService = require('node-rsa');
function fetchEntry(pd, usr, $errMsg, originUsr) {
    new Promise(function (resolve, reject) {
        $.ajax({
            url: "/server/api/login/entry",
            method: 'POST',
            data: {
                password: pd, // $.md5(pd)
                login_name: usr
            },
            success: function (res) {
                console.log(res)
                if (`${res.code}` == '0') {
                    let href = "";
                    let defaultEntryPage = window.localStorage.getItem("defaultEntryPage");
                    let userName = getDefaultUserName();
                    if (defaultEntryPage && userName && originUsr == userName) {
                        href = defaultEntryPage;
                    }
                    if (href.length < 4) {
                        href = "/#/guide"
                    }
                    resolve({code: 0, data: {
                            href
                        }});
                } else {
                    reject({code: res.code})
                }
            }
        })
    }).then(function (ag1) {
            console.log(ag1.data.href)
            $.ajax({
                url: "/server/api/projectmanagement/fetchoperationstatus",
                method: 'POST',
                success: function (res) {
                    let [code,value]=[`${res.code}`,res.data&&`${res.data.value}`];
                    if (code=='8200'||(code == '0' &&  value== '1')) {
                        window.location.href = "/#/admindashboard";
                    } else if (code == '0' && value == '0') {
                        window.location.href = ag1.data.href;
                    } else {
                        $errMsg.removeClass('msg-info').text("登录失败，请联系管理员")
                    }
                }
            })
        }, function (res) {
            if (`${res.code}` == '502') {
                $errMsg.removeClass('msg-info').text("登录失败，请联系管理员")
            } else {
                //屏蔽后端异常
                $errMsg.removeClass('msg-info').text("用户名或密码错误，请联系管理员")
            }
        });

}
function doSubmit() {
    var $errMsg = $('#errMsg');
    $errMsg.addClass('msg-info').text("登录中...");
    var pd = $('#password').val();
    var usr = $('#username').val();
    if (!pd || !usr) {
        $errMsg.removeClass('msg-info').text('用户名密码不能为空！')
        return;
    }
    let clientKey = new window.rsaService({b: 512});
    $.when($.ajax({url: "/server/api/getPublicKey", method: 'POST'}))
    .then(function (data, textStatus, jqXHR) {
            console.log(data); // alerts 200
            if (data && data.publickey) {
                clientKey.importKey(data.publickey);
                pd = clientKey.encrypt(pd, 'base64');
                let clientKeyUsr = clientKey.encrypt(usr, 'base64');
                fetchEntry(pd, clientKeyUsr, $errMsg, usr)
            }
        });

}
