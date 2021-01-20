module.exports = (tt) => {
    var promisify = {}
    for (var key in tt) {
        if (typeof tt[key] === 'function') {
            // console.log(`${key} : ${typeof tt[key]}`)
            promisify[key] = ((method, api) => {
                return ((opts) => {
                    return new Promise((resolve, reject) => {
                        var modified = opts || {}
                        var successCallback = modified.success
                        var failCallback = modified.fail

                        modified.success = (res) => {
                            successCallback && successCallback(res)
                            resolve(res)
                        }
                        modified.fail = (res) => {
                            failCallback && failCallback(res)
                            reject(res)
                        }
                        api[method](modified)
                    })
                });
            })(key, tt)

        } else {
            promisify[key] = tt[key]
        }
    }

    return promisify
}