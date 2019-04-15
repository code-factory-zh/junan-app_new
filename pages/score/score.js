// pages/score/score.js
import Score from '../../api/score/score'
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        navHeight: app.globalData.navHeight,
        backImgTop: app.globalData.backImgTop,
        titleTop: app.globalData.titleTop,
        list: []
    },
    onLoad: function () {
        this.getScoreList()
    },
    goBack: function () {
        wx.navigateBack({
            delta: 1
        })
    },
    // 得到成绩列表
    getScoreList: function () {
        wx.showLoading({
          title: '加载中',
          mask: true
        })
        Score._getScoreList().then(result => {
            wx.hideLoading()
            let res = result.data
            if (res.code == 0) {
                let list = res.data.list || []
                for (let i = 0; i < list.length; i++) {
                    let time = list[i].use_time
                    let min = Math.floor(time / 60)
                    let second = Math.floor(time % 60)
                    list[i].use_time = min + '分' + second + '秒'
                    let day = new Date(list[i].created_time * 1000)
                    let created_time = (day.getMonth() + 1) + '月' + day.getDate() + '日'
                    list[i].created_time = created_time
                }
                this.setData({
                    list: list
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