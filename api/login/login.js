import _fetch from '../../utils/fetch.js'
export default {
    //  得到公司列表
    _getCompanys (obj) {
        return _fetch('/wechat/index/get_companys', obj, 'GET')
    },
     //  登录
    // _login (obj) {
    //     return _fetch('/wechat/login/dologin', obj, 'POST')
    // },
     //  得到个人信息,暂时无用
    _getUserInfo (obj) {
        return _fetch('/wechat/login/get_user_inf', obj, 'GET')
    },
    //  检查open_id有效性
    _checkToken (obj) {
        return _fetch('/wechat/login/check', obj, 'GET')
    },
    //  根据用户手机取企业数据
    _getCompanyByPhone (obj) {
        return _fetch('/wechat/login/getCompanyId', obj, 'POST')
    },
    // 获得open_id
    _getOpenId (obj) {
        return _fetch('/wechat/login/getOpenId', obj, 'POST')
    },
    // 注册一个用户
    _register (obj) {
        return _fetch('/buy/index/appRegister', obj, 'POST')
    },
    // 获取这个公司信息
    _getCompanyName (obj) {
        return _fetch('/buy/index/appRegisterPage', obj, 'GET')
    }
}