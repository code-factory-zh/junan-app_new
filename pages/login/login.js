// pages/login/login.js
import Login from '../../api/login/login.js'
const { compareVersion } = require('../../utils/util.js'); // 判断微信sdk的版本号
Page({

    /**
     * 页面的初始数据
     */
    data: {
        appName: '君安',
        array: [],
        index: '',
        phone: '',
        code: '',
        limitSDKVersion: '1.9.0' // 版本兼容
    },
    onLoad: function () {
        this.checkVersion()
    },
    // 搜索企业列表
    searchCompany: function () {
        if (this.data.phone) {
            wx.showLoading({
                title: '加载中',
                mask: true
            })
            Login._getCompanyByPhone({
                mobile: this.data.phone
            }).then(result => {
                wx.hideLoading()
                let res = result.data
                console.log(res)
                if (res.code == 0) {
                    this.setData({
                        array: res.data
                    })
                    if (res.data.length == 1) {
                        this.setData({
                            index: 0
                        })
                    }
                } else {
                    wx.showToast({
                        title: '获取企业列表失败！',
                        icon: 'none',
                        duration: 2000
                    })
                }
            })
        }
    },
    // 微信sdk版本限制功能
    checkVersion: function () {
        let flagNumber = this.is_suitable_version()
        if (flagNumber < 0) {
            // 版本过低
            wx.showModal({
                title: '提示',
                content: '当前微信版本过低，请升级到最新微信版本后重试。'
            })
        }
    },
    // 验证用户使用的微信版本号是否合适
    is_suitable_version: function () {
        let datas = wx.getSystemInfoSync()
        let flag = null
        flag = compareVersion(datas.SDKVersion, this.data.limitSDKVersion)
        return flag
    },
    /**
     * 得到公司列表
    **/
    getCompanys () {
        Login._getCompanys().then(result => {
            let res = result.data
            if (res.code == 0) {
                this.setData({
                    appName: res.data.company_name,
                    array: res.data.list
                })
            } else {
                this.setData({
                    array: []
                })
                wx.showToast({
                    title: '获取企业列表失败！',
                    icon: 'none',
                    duration: 2000
                })
            }
        })
    },
    /**
     * 切换公司
     **/
    bindPickerChange: function (e) {
        this.setData({
            index: e.detail.value
        })
    },
    /**
     * input输入改变手机号的值
    **/
    bindKeyInput: function (e) {
        this.setData({
            phone: e.detail.value,
            array: [],
            index: ''
        })
    },
    /**
     * 点击登录的回调
     **/
    getUserInfoCallback: function (userInfo) {
        wx.showLoading({
            title: '加载中',
            mask: true
        })
        if (userInfo.detail.errMsg === 'getUserInfo:ok') {
            this.getLoginCode(userInfo)
        } else {
            console.log(userInfo)
        }
    },
    /**
     * 得到登录用的code
    **/
    getLoginCode () {
        wx.login({
            success: res => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
                this.setData({
                    code: res.code
                },() => {
                    console.log(res.code)
                    if (this.data.index === '') {
                        wx.showToast({
                          title: '请选择企业',
                          icon: 'none',
                          duration: 2000
                        })
                        return false
                    }else if (this.data.phone === '') {
                       wx.showToast({
                          title: '请输入手机号',
                          icon: 'none',
                          duration: 2000
                        })
                        return false
                    }
                    Login._login({
                        code: this.data.code,
                        company_id: this.data.array[this.data.index].company_id,
                        mobile: this.data.phone
                    }).then(result => {
                        wx.hideLoading()
                        let login_res = result.data
                         if (login_res.code == 0) {
                             wx.setStorageSync('token', login_res.data.token)
                             wx.navigateTo({
                                 url: '/pages/index/index'
                             })
                        } else {
                            wx.showToast({
                              title: login_res.msg,
                              icon: 'none',
                              duration: 2000
                            })
                        }
                    })
                })
            }
        })
    }
})