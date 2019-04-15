//app.js
import Login from './api/login/login'
App({
    onLaunch: function () {
        // navHeight导航高度 backImgTop图片top titleTop是title的top
        wx.getSystemInfo({
            success: res => {
                this.globalData.backImgTop = res.statusBarHeight + 12;
                this.globalData.titleTop = res.statusBarHeight + 8;
                if (res.system.includes('iOS')) {
                    this.globalData.navHeight = res.statusBarHeight + 44;
                } else if (res.system.includes('Android')) {
                    this.globalData.navHeight = res.statusBarHeight + 48;
                }
            }, fail(err) {
                console.log(err);
            }
        })
        // 检查token
        this.checkToken()
    },
    // 检查token
    checkToken: function () {
        let signal = false // 是否过期
        if (wx.getStorageSync('token')) { // 有token检查token
            Login._checkToken().then(result => {
                let res = result.data
                if (res.code == 0) {
                } else {
                    signal = true
                }
            })
        } else { // 没token直接到login页
            signal = false
            wx.reLaunch({
                url: '/pages/login/login'
            })
        }
        if (signal) { // 有token但是token不对，提示并跳转
            wx.removeStorageSync('token')
            wx.showToast({
                title: '登录过期！',
                icon: 'none',
                duration: 2000,
                complete: function () {
                    setTimeout(() => {
                        wx.reLaunch({
                            url: '/pages/login/login'
                        })
                    }, 2000)
                }
            })
        }
    },
    globalData: {
        backImgTop: 0, // 返回按钮图片的top值
        navHeight: 0, // 头部高度
        titleTop: 0 // 标题top值
    }
})