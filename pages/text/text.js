// pages/text/text.js
import ChapterList from '../../api/chapterList/chapterList'
const app = getApp()
var WxParse = require('../../utils/wxParse/wxParse.js');
Page({
    /**
     * 页面的初始数据
     */
    data: {
        navHeight: app.globalData.navHeight,
        backImgTop: app.globalData.backImgTop,
        titleTop: app.globalData.titleTop,
        course_id: '',
        chapter_id: '',
        chapterData: {},
        chapterList: [],
        isShowSelChapter: false
    },
    onLoad: function () {
        this.setData({
            chapter_id: wx.getStorageSync('chapter_id'),
            course_id: wx.getStorageSync('course_id')
        }, () => {
            console.log(this.data.chapter_id)
            this.getChapterData()
        })
    },
    goBack: function () {
        wx.navigateBack({
            delta: 1
        })
    },
    _close: function () {
        this.setData({
            isShowSelChapter: false
        })
    },
    /**
     * 获取章节列表
    **/
    getCourseData () {
        ChapterList._getCourseData({
            course_id: this.data.course_id
        }).then(result => {
            let res = result.data
            if (parseInt(res.code) === 0) {
                this.setData({
                    chapterList: res.data.list,
                    isShowSelChapter: true
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
    // 第一次进来获取文章
    getChapterData:function() {
        ChapterList._getChapterData({
            id: this.data.chapter_id,
            course_id: this.data.course_id
        }).then(result => {
            let res = result.data
            if (res.code == 0) {
                this.setData({
                    chapterData: res.data
                })
                let str = res.data.content
                WxParse.wxParse('article', 'html', str, this, 5);
            } else {
                wx.showToast({
                    title: res.msg,
                    icon: 'none',
                    duration: 2000
                })
            }
        })
    },
    // 上一章
    goShang: function () {
        let shang = this.data.chapterData.prev
        if (shang == 0) {
            wx.showToast({
                title: '已经在第一章了哦!',
                icon: 'none',
                duration: 2000
            })
        } else{
            wx.setStorageSync('chapter_id', shang)
            this.getType(shang)
        }
    },
    // 下一章
    goXia: function () {
        let xia = this.data.chapterData.next
        if (xia == 0) {
            wx.showToast({
                title: '已经在最后一章了哦!',
                icon: 'none',
                duration: 2000
            })
        } else{
            wx.setStorageSync('chapter_id', xia)
            this.getType(xia)
        }
    },
    checkType: function (event) {
        let item = event.currentTarget.dataset.item
        wx.setStorageSync('chapter_id', item.id)
        this.getType(item.id)
    },
    prevent: function() {},
    /**
     * 请求即将到达的章节类型
    **/
    getType (id) {
        ChapterList._getChapterData({
            course_id: this.data.course_id,
            id: id
        }).then(result => {
            let res = result.data
            if (parseInt(res.code) === 0) {
                console.log(res)
                // 1=文字 2=ppt 3=视频,这个页面只有当本章节是视频才会显示
                let type = parseInt(res.data.type)
                if (type === 1) {
                    console.log('跳转文字')
                    this.setData({
                        chapter_id: id,
                        isShowSelChapter: false
                    }, () => {
                        this.getChapterData()
                    })
                } else if (type === 2) {
                    console.log('dakai ppt')
                    wx.redirectTo({
                        url: '/pages/chapterList/chapterList'
                    })
                } else if (type === 3) {
                    wx.redirectTo({
                        url: '/pages/chapterList/chapterList'
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
    }
})