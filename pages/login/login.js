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
        code: '',
        open_id: '',
        company_id: '',
        phone: '',
        userName: '',
        idcard: '',
        date: '',
        companyName: '',
        img: '',
        filepath: '',
        limitSDKVersion: '1.9.0' // 版本兼容
    },
    onLoad: function (options) {
        let scene = decodeURIComponent(options.scene)
        this.checkVersion()
        let company_id = scene.split('=')[1]
        console.log(company_id)
        if (company_id) {
            this.setData({
                company_id: company_id
            }, () => {
                this.getLoginCode()
            })
        } else {
            this.getLoginCode()
        }
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
     * input输入姓名
     **/
    bindInputName: function (e) {
        this.setData({
            userName: e.detail.value
        })
    },
    /**
     * input身份证
     **/
    bindInputID: function (e) {
        this.setData({
            idcard: e.detail.value
        })
    },
    /**
     * input手机号码
     **/
    bindInputPhone: function (e) {
        this.setData({
            phone: e.detail.value
        })
    },
    /**
     * 选择入职日期
     **/
    bindDateChange (e) {
        console.log(e.detail.value)
        this.setData({
            date: e.detail.value
        })
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
                    console.log(`code:${res.code}`)
                    this.getOpenId()
                })
            }
        })
    },
    /**
     * 得到open_id
     */
    getOpenId () {
        Login._getOpenId({
            code: this.data.code
        }).then(result => {
            let res = result.data
            if (res.code === 0) {
                this.setData({
                    open_id: res.data.openid
                },() => {
                    console.log(`open_id:${res.data.openid}`)
                    wx.setStorageSync('open_id', res.data.openid)
                    this.testOpenid()
                })
            } else{
                wx.showToast({
                    title: '获取open_id失败',
                    icon: 'none',
                    duration: 2000
                })
            }
        })
    },
    /**
     * 测试open_id是否有效
     */
    testOpenid () {
        Login._checkToken().then(result => {
            let res = result.data
            if (res.code == 0) {
                wx.reLaunch({
                    url: '/pages/index/index'
                })
            } else {
                wx.removeStorageSync('open_id')
                this.getCompanyName()
            }
        })
    },
    /**
     * 获取这个公司信息
     */
    getCompanyName () {
        Login._getCompanyName({
            open_id: this.data.open_id,
            company_id: this.data.company_id
        }).then(result => {
            let res = result.data
            if (res.code === 0) {
                if (res.data.company_name) {
                    this.setData({
                        companyName: res.data.company_name
                    })
                }
            } else {
                wx.showToast({
                    title: res.msg,
                    icon: 'none',
                    duration: 2000
                })
            }
        })
    },
    /**
     * 注册检查输入
     */
    check () {
        if (!this.data.open_id) {
            wx.showToast({
                title: '获取open_id失败',
                icon: 'none',
                duration: 2000
            }, () => {
                this.getLoginCode()
            })
            return false
        }
        if (!this.data.company_id) {
            wx.showToast({
                title: '获取company_id失败',
                icon: 'none',
                duration: 2000
            })
            return false

        }
        if (!this.data.userName) {
            wx.showToast({
                title: '请输入用户姓名',
                icon: 'none',
                duration: 2000
            })
            return false
        }
        if (!this.data.idcard) {
            wx.showToast({
                title: '请输入身份证',
                icon: 'none',
                duration: 2000
            })
            return false
        }
        if (!this.data.phone) {
            wx.showToast({
                title: '请输入您的手机号码',
                icon: 'none',
                duration: 2000
            })
            return false
        }
        return true
    },
    /**
     * 注册
     */
    doRegister () {
        let res = this.check()
        if (!res) {
            return false
        }
        let params = {
            open_id: this.data.open_id,
            company_id: this.data.company_id,
            uname: this.data.userName,
            card_num: this.data.idcard,
            mobile: this.data.phone,
            date: this.data.date,
            pic: this.data.filepath
        }
        Login._register(params).then(result => {
            let res = result.data
            if (res.code === 0) {
                wx.showToast({
                    title: '注册成功！',
                    icon: 'none',
                    duration: 1000,
                    complete: function () {
                        wx.reLaunch({
                            url: '/pages/index/index'
                        })
                    }
                })
            } else {
                wx.showToast({
                    title: res.msg,
                    icon: 'none',
                    duration: 2000
                })
            }
        })
    },
    /**
     * 选择图片
     */
    chooseImg (e) {
        let that = this
        wx.chooseImage({
            sizeType: ['original', 'compressed'],  //可选择原图或压缩后的图片
            sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
            success: res => {
                let image = res.tempFilePaths;
                //启动上传等待中...
                wx.showToast({
                    title: '正在上传...',
                    icon: 'loading',
                    mask: true,
                    duration: 10000
                })
                wx.uploadFile({
                    url: 'https://study.joinersafe.com/wechat/index/uploadImg',
                    filePath: image[0],
                    name: 'file',
                    success: function (res) {
                        let data = JSON.parse(res.data)
                        wx.hideToast();
                        if (data.code === 0) {
                            that.setData({
                                img: 'https://study.joinersafe.com/' + data.data.filepath,
                                filepath: data.data.filepath
                            })
                        } else {
                            wx.showToast({
                                title: data.msg,
                                icon: 'none',
                                duration: 2000
                            })
                        }
                    },
                    fail: function (res) {
                        wx.hideToast();
                        wx.showModal({
                            title: '错误提示',
                            content: '上传图片失败',
                            showCancel: false
                        })
                    }
                });
            }
        })
    }
    /**
     * 登录
     */
    // doLogin () {
    //     console.log(this.data.userName, this.data.idcard, this.data.phone, this.data.date)
    //     return false
    //     if (this.data.index === '') {
    //         wx.showToast({
    //             title: '请选择企业',
    //             icon: 'none',
    //             duration: 2000
    //         })
    //         return false
    //     }else if (this.data.phone === '') {
    //         wx.showToast({
    //             title: '请输入手机号',
    //             icon: 'none',
    //             duration: 2000
    //         })
    //         return false
    //     }
    //     Login._login({
    //         code: this.data.code,
    //         company_id: this.data.array[this.data.index].company_id,
    //         mobile: this.data.phone
    //     }).then(result => {
    //         wx.hideLoading()
    //         let login_res = result.data
    //         if (login_res.code == 0) {
    //             wx.setStorageSync('open_id', login_res.data.open_id)
    //             wx.navigateTo({
    //                 url: '/pages/index/index'
    //             })
    //         } else {
    //             wx.showToast({
    //                 title: login_res.msg,
    //                 icon: 'none',
    //                 duration: 2000
    //             })
    //         }
    //     })
    // }
})