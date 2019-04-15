import _fetch from '../../utils/fetch.js'
export default {
    //  得到课程列表
    _getCourseList (obj) {
        return _fetch('/wechat/index/course_list', obj, 'GET')
    },
    //  点击考试按钮，通知后台，判断第一道题是什么类型,题目类型 1=单选 2=多选 3=判断 4=填空
    _getFirstQuestionType (obj) {
        return _fetch('/wechat/exam/questions', obj, 'GET')
    },
    //  得到这道题的详情
    _getQuestion (obj) {
        return _fetch('/wechat/exam/detail', obj, 'GET')
    },
    //  保存答案
    _saveAnswer (obj) {
        return _fetch('/wechat/exam/answer', obj, 'POST')
    },
    //  查看全部题目的状态
    _getAllQuestion (obj) {
        return _fetch('/wechat/exam/get_exam_question', obj, 'GET')
    },
    //  交卷
    _finishExam (obj) {
        return _fetch('/wechat/exam/finish_exam', obj, 'POST')
    }
}