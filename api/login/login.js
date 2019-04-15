import _fetch from '../../utils/fetch.js'
export default {
    //  得到公司列表
    _getCompanys (obj) {
        return _fetch('/wechat/index/get_companys', obj, 'GET')
    },
     //  登录
    _login (obj) {
        return _fetch('/wechat/login/dologin', obj, 'POST')
    },
     //  得到个人信息,暂时无用
    _getUserInfo (obj) {
        return _fetch('/wechat/login/get_user_inf', obj, 'GET')
    },
    //  检查token有效性
    _checkToken (obj) {
        return _fetch('/wechat/login/check', obj, 'GET')
    },
    //  根据用户手机取企业数据
    _getCompanyByPhone (obj) {
        return _fetch('/wechat/login/getCompanyId', obj, 'POST')
    }
}