// pages/scoreInfo/scoreInfo.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        navHeight: app.globalData.navHeight,
        backImgTop: app.globalData.backImgTop,
        titleTop: app.globalData.titleTop
    },
    onLoad: function (data) {
        this.drawCanvas(data.score)
    },
    goBack: function () {
        wx.navigateBack({
            delta: 1
        })
        // wx.redirectTo({
        //     url: '/pages/courseList/courseList'
        // })
    },
    // 绘制环形成绩
    drawCanvas: function (score) {
        console.log(score)
        let x = 96 // x轴
        let y = 96 // y轴
        let width = 16
        let r = 96 - (width / 2) // r减线条粗的一半
        // 起始点
        let beginAngle = 0.75 * Math.PI
        // 深色环形结束弧度
        let darkEndAngle = 0.25 * Math.PI
        // 白色环形结束弧度
        let whiteEndAngle = (parseInt(score) / 100 * 1.5 + 0.75) * Math.PI
        if (whiteEndAngle > Math.PI * 2) {
            whiteEndAngle -= Math.PI * 2
        }
        let context = wx.createCanvasContext('scoreCanvas')
        // 分数的描述，<60 不及格 60-70及格 70-80中等 80-90良好 90-100优秀
        let infoDes = ''
        if (score < 60) {
            infoDes = '不及格'
        } else if (score <= 70) {
             infoDes = '及格'
        } else if (score <= 80) {
             infoDes = '中等'
        } else if (score <= 90) {
             infoDes = '良好'
        } else if (score <= 100) {
             infoDes = '优秀'
        }
        // 绘制深色扇形
        context.setStrokeStyle('#4f7be9')
        context.setLineWidth(width)
        context.arc(x, y, r, beginAngle, darkEndAngle)
        context.setLineCap("round")
        context.stroke()
        context.closePath()
        // 绘制白色环形
        context.beginPath()
        context.setStrokeStyle('#ffffff')
        context.arc(x, y, r, beginAngle, whiteEndAngle)
        context.setLineCap("round")
        context.stroke()
        // 分数
        context.setFontSize(75)
        context.setFillStyle('#fff')
        context.setTextAlign('center')
        context.setTextBaseline('top')
        context.fillText(score, x, 35)
        //对于分数的描述
        context.setFontSize(24)
        context.setFillStyle('#fff')
        context.setTextAlign('center')
        context.setTextBaseline('top')
        context.fillText(infoDes, x, 130)
        context.draw()
    }
})