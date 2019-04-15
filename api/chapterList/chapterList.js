import _fetch from '../../utils/fetch.js'
export default {
    //  获取章节列表及第一章的内容数据
    _getCourseData (obj) {
        return _fetch('/wechat/Detail/courseDetail', obj, 'GET')
    },
    //  根据章节ID取数据
    _getChapterData (obj) {
        return _fetch('/wechat/Detail/detailById', obj, 'GET')
    }
}