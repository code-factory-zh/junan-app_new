// pages/selectQuestion/selectQuestion.js
import CourseList from '../../api/courseList/courseList'
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        navHeight: app.globalData.navHeight,
        backImgTop: app.globalData.backImgTop,
        titleTop: app.globalData.titleTop,
        exam_question_id: '',
        now_question_id: '', // 返回哪个问题
        questionList: [] // 试题列表
    },
    onLoad () {
        this.setData({
            exam_question_id: wx.getStorageSync('exam_question_id'),
            now_question_id: wx.getStorageSync('now_question_id')
        }, () => {
            this.getQuestionList()
        })
    },
    // 选择一道题
    choose: function (event) {
         let item = event.currentTarget.dataset['item']
         console.log(item)
         this.goTo(item.question_id)
     },
    // 点击返回按钮
    goBack: function () {
        this.goTo(this.data.now_question_id)
    },
    // 请求第now_question_id个问题，看看是什么类型再决定跳转到哪里,1=单选 2=多选 3=判断
    goTo: function (now_question_id) {
        wx.setStorageSync('now_question_id', now_question_id)
        wx.redirectTo({
            url: '/pages/questions/questions'
        })
        // CourseList._getQuestion({
        //     question_id: now_question_id,
        //     exam_question_id: this.data.exam_question_id
        // }).then(result => {
        //     let res = result.data
        //     if (res.code == 0) {
        //         // if (res.data.type == 1) {
        //         //     wx.redirectTo({
        //         //         url: '/pages/singleChoose/singleChoose'
        //         //     })
        //         // } else if (res.data.type == 2) {
        //         //     wx.redirectTo({
        //         //          url: '/pages/mutipleChooice/mutipleChooice'
        //         //     })
        //         // } else if (res.data.type ==3) {
        //         //     wx.redirectTo({
        //         //         url: '/pages/judge/judge'
        //         //     })
        //         // }
        //     } else {
        //          wx.showToast({
        //             title: res.msg,
        //             icon: 'none',
        //             duration: 2000
        //         })
        //     }
        // })
    },
    getQuestionList () {
        wx.showLoading({
          title: '加载中',
          mask: true
        })
        CourseList._getAllQuestion({
            exam_question_id: this.data.exam_question_id
        }).then(result => {
            wx.hideLoading()
            let res = result.data
            if (res.code == 0) {
                console.log(res)
                this.setData({
                    questionList: res.data.question_info
                })
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