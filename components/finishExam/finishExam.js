// components/finishExam/finishExam.js
import CourseList from '../../api/courseList/courseList'
const app = getApp();
Component({
    data: {
        showFlag: false,
        timer: null,
        countDown: ''
    },
    methods: {
        // 交卷
        finishExam: function () {
            CourseList._finishExam({
                exam_question_id: this.data.exam_question_id
            }).then(result => {
                let res = result.data
                if (res.code == 0) {
                    wx.redirectTo({
                        url: '/pages/scoreInfo/scoreInfo?score=' + res.data.score + '&isPass=' + res.data.is_pass_exam
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
        _show: function () {
            this.calCountDown()
            let timer = setInterval(() => {
                this.calCountDown()
            },1000)
            this.setData({
                showFlag: true,
                timer: timer,
                exam_question_id: wx.getStorageSync('exam_question_id')
            })
            this.getAllQuestion()
        },
        // 倒计时
        calCountDown: function () {
            let expireTime = wx.getStorageSync('exam_finish_time')
            let now = new Date().getTime()
            let timeExpire = expireTime - now
            if (timeExpire >= 0) { // 时间还有剩余就倒数
                let mins = parseInt(timeExpire / 1000 / 60)
                let seconds = parseInt(timeExpire / 1000 % 60)
                let time = mins + ':' + seconds
                this.setData({
                    countDown: time
                })
            } else {
                clearInterval(this.data.timer)
            }
        },
        _close () {
            this.setData({
                showFlag: false
            })
        },
        prevent() { },
        // 得到所有题目的状态
        getAllQuestion: function () {
            CourseList._getAllQuestion({
                exam_question_id: this.data.exam_question_id
            }).then(result => {
                let res = result.data
                if (parseInt(res.code) === 0) {
                    console.log(res)
                    let total = res.data.question_info.length // 总数
                    let count = 0 // 已答
                    for (let i = 0; i < total; i++) {
                        if (res.data.question_info[i].is_answer == 1) { // 已经答了
                            count++
                        }
                    }
                    let percent = count / total
                    let notAnswer = total - count
                    this.drawCanvas(percent, notAnswer)
                } else {
                    wx.showToast({
                        title: res.msg,
                        icon: 'none',
                        duration: 2000
                    })
                }
            })
        },
        drawCanvas: function (percent, notAnswer) {
            console.log()
            let x = 76 // x坐标
            let y = 76 // y坐标
            let width = 8 // 画笔宽度 
            let r = 76 - width / 2  // r - 画笔宽度
            let context = wx.createCanvasContext('examCanvas', this)
            // 绘制深色扇形
            context.setStrokeStyle('#eeeeee')
            context.setLineWidth(width)
            context.arc(x, y, r, 0, 2 * Math.PI)
            context.setLineCap("round")
            context.stroke()
            context.closePath()
            // 绘制红色的扇形
            context.beginPath()
            context.setStrokeStyle('#ff4400')
            context.arc(x, y, r, 0, 2 * Math.PI * percent)
            context.setLineCap("round")
            context.stroke()
            // 未做题描述
            context.setFontSize(15)
            context.setFillStyle('#5a5a5a')
            context.setTextAlign('center')
            context.setTextBaseline('top')
            context.fillText('未做题', x, 55)
            // num
            context.setFontSize(18)
            context.setFillStyle('#ff4400')
            context.setTextAlign('center')
            context.setTextBaseline('top')
            context.fillText(notAnswer + '题', x, 78)
            context.draw()
        }
    }
})