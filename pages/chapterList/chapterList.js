// pages/chapterList/chapterList.js
import ChapterList from '../../api/chapterList/chapterList.js'
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        navHeight: app.globalData.navHeight,
        backImgTop: app.globalData.backImgTop,
        titleTop: app.globalData.titleTop,
        tab: 2, // 1简介 2章节，默认章节
        isShowVideo: false,
        videoUrl: '',
        course_id: '',
        chapter_id: '',
        isFirstComeCourse: false,
        courseName: '',
        course_into: '', // 简介
        chapterList: [] // 章节列表
    },
    onLoad: function(){
        // 如果是第一次来到课程，isFirstComeCourse为true,chapter_id使用返回数据中detail的,否则使用storage中的chapterd
        this.setData({
            course_id: wx.getStorageSync('course_id'),
            isFirstComeCourse: wx.getStorageSync('isFirstComeCourse')
        }, () => {
            this.getCourseData()
        })
    },
    /**
     * 请求章节详情
    **/
    getChapterData () {
        ChapterList._getChapterData({
            course_id: this.data.course_id,
            id: this.data.chapter_id
        }).then(result => {
            let res = result.data
            if (parseInt(res.code) === 0) {
                // 1=文字 2=ppt 3=视频,这个页面只有当本章节是视频才会显示
                if (parseInt(res.data.type) === 3) {
                    this.setData({
                        videoUrl: res.data.content,
                        isShowVideo: true
                    })
                } else {
                    this.setData({
                        isShowVideo: false
                    })
                    if (parseInt(res.data.type) === 2) {
                        wx.showLoading({
                          title: '加载中',
                          mask: true
                        })
                        wx.downloadFile({
                            url: res.data.content,
                            success(r) {
                                wx.hideLoading()
                                const filePath = r.tempFilePath
                                wx.openDocument({
                                    filePath,
                                    success(r) {
                                        console.log('打开文档成功')
                                    }
                                })
                            }
                        })
                    }
                }
                this.setData({
                    courseName: res.data.course_name
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
    goBack: function () {
        wx.navigateBack({
            delta: 1
        })
    },
    /**
     * 切换显示tab
    **/
    toggleTab:function (e) {
        this.setData({
            tab: parseInt(e.target.dataset.num)
        })
    },
    /**
     * 获取章节列表及第一章的内容数据
    **/
    getCourseData () {
        ChapterList._getCourseData({
            course_id: this.data.course_id
        }).then(result => {
            let res = result.data
            if (parseInt(res.code) === 0) {
                // 如果是第一次来到课程，isFirstComeCourse为true,chapter_id使用返回数据中detail的,否则使用storage中的chapter_id
                let chapter_id = ''
                if (this.data.isFirstComeCourse) {
                    chapter_id = res.data.detail.id
                } else {
                    chapter_id = wx.getStorageSync('chapter_id')
                }
                wx.removeStorageSync('isFirstComeCourse')
                this.setData({
                    chapter_id: chapter_id,
                    chapterList: res.data.list,
                    course_into: res.data.detail.course_detail
                }, () => {
                    this.getChapterData()
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
     * 检查章节的类型，跳转不同的页面
    **/
    checkChapterType (event) {
        let item = event.currentTarget.dataset['item']
        console.log(item)
        // 1=文字 2=ppt 3=视频
        let type = parseInt(item.type)
        wx.setStorageSync('chapter_id', item.id)
        if (type === 1) {
            console.log('跳转文字')
            wx.redirectTo({
                url: '/pages/text/text'
            })
        } else if (type === 2) {
            console.log('ppt')
            this.setData({
                chapter_id: item.id
            }, () => {
                this.getChapterData()
            })
        } else if (type === 3) {
            wx.redirectTo({
                url: '/pages/chapterList/chapterList'
            })
        }
    }
})