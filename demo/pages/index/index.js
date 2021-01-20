const ttp = require('../../lib/tt-promisify.js')(tt)

Page({
  data: {
    consoleMessage: "hello world"
  },
  onLoad: function () {
    let self = this

    ttp.getHostLaunchQuery().then(res => {
      if (res && res.launchQuery) {
        return Promise.resolve(res.launchQuery)
      } else {
        return Promise.reject({errMsg: `no launch query detected`})
      }
    })
    .then(queryString => {
      try{
        return Promise.resolve(JSON.parse(queryString))
      }catch(e) {
        return Promise.reject({errmsg: e})
      }
    })
    .then(query => {
      if (query.__trigger_id__) {
        return Promise.resolve(query.__trigger_id__)
      } else {
        return Promise.reject({errMsg: `no trigger id detected`})
      }
    }) 
    .then(triggerId => {
      self.output(`trigger_id: ${triggerId}`)
    })
    .catch(err => {
      self.output(err)
    })

    ttp.login().then(res => {
      self.output('login successful')
    }).catch(err => {
      self.output('login error')
      self.output(err)
    })

  },

  output: function(obj) {
    var message = ''
    if (typeof obj == 'object') {
      message = JSON.stringify(obj)
    } else {
      message = '' + obj
    }

    var all = this.data.consoleMessage || "";
    all += (message? "\r" : "") + message
    this.setData({consoleMessage: all})
  }
})