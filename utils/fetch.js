// const baseUrl = 'http://admin.joinersafe.com'
const baseUrl = 'https://study.joinersafe.com'
function fetch(url, data, type) {
    let currentData = {
        "token": wx.getStorageSync('token') || ''
    }
    if (!data) {
        data = {}
    }
    let newData = Object.assign({}, currentData, data)
    return new Promise((resolve, reject) => {
        wx.request({
            url: baseUrl + (url || ''),
            method: type || 'GET',
            data: newData,
            success (res) {
                if (parseInt(res.data.code) !== -1) {
                    resolve(res)
                } else {
                     try {
                        wx.removeStorageSync('token')
                        wx.showToast({
                          title: '登录过期！',
                          icon: 'none',
                          duration: 2000,
                          complete: function () {
                                setTimeout(() => {
                                    wx.reLaunch({
                                        url: '/pages/login/login'
                                    })
                                }, 2000)
                            }
                        })
                    } catch (e) {
                        // Do something when catch error
                        console.log(e)
                    }
                }
            },
            fail (res) {
                console.log(res)
            }
        })
    })
}
export default fetch