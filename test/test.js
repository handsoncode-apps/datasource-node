/* eslint-env mocha */
'use strict'
const { exec } = require('child_process')
const fs = require('fs')
const rimraf = require('rimraf')
const path = require('path')

const request = require('request')

const projectName = 'testapp'

var baseURL = 'http://localhost:3000'

var generateProject = function() {
  return new Promise( (resolve, reject) => {
    console.log('generating project')
    var cmd = 'express --view=pug ' +  projectName

    exec(cmd, function(error, stdout, stderr) {
      if (error) {
        reject(error)
      } else {
        console.log(stdout, stderr)
        npmInstall('./' +  projectName, resolve, reject)
      }
    })
  })
}

var npmInstall = function(path, resolve, reject) {
  console.log('Running npm install...')
  var cmd = 'npm --prefix ' + path + ' install ' + path
  exec(cmd, function(error, stdout, stderr) {
    if (error) {
      reject(error)
    } else {
      console.log(stdout, stderr)
      runGenerator(resolve, reject)
    }
  })
}

var runGenerator = function(resolve, reject) {
  exec('sh ./test/generate.sh ' + projectName, function(error, stdout, stderr) {
    if (error) {
      reject(error)
    } else {
      console.log(stdout, stderr)
      insertLines(stdout, resolve, reject)
    }
  })
}

var removeProject = function(callback) {
  rimraf('./' + projectName, function (error) {
    if (error) {
      var warningMessage = error.code + '. Cannot remove test project ' + projectName
      if (error.code === 'EPERM') {
        warningMessage += '. Operation not permitted.'
      }
      if (error.code === 'EBUSY' || error.code === 'ENOTEMPTY') {
        warningMessage += '. Resource busy or locked'
      }
      if (error.code === 'ENOENT') {
        warningMessage += '. File does not exist.'
      }
      reject(warningMessage)
      process.exit(-1)
    } else {
      console.log('Test project is removed')
      if (callback) {
        return callback()
      }
    }
  })
}

var getLineToInsert = function(stdout) {
  var splited = stdout.trim().split("\n");
  return '\n' + splited[splited.length - 2].trim() + '\n' + splited[splited.length - 1].trim()
}

var insertLines = function(stdout, resolve, reject) {
  var partToInsert = getLineToInsert(stdout)
  var content = 'var app = express();'
  var appJsPath = path.join('.', projectName, 'app.js')

  fs.readFile(appJsPath, 'utf8', function(err, data) {
    if (err) {
      reject(err)
    }
    var result = data.replace("var app = express();", content + partToInsert)

    fs.writeFile(appJsPath, result, 'utf8', function(err) {
      if (err) {
        reject(err)
      } else {
        replaceInFile(resolve, reject)
      }
    })
  })
}

var replaceInFile = function(resolve, reject, callback) {
  fs.readFile(path.join('.', projectName, 'routes', 'test.js'), 'utf8', function(err, data) {
    if (err) {
      reject(err)
    }
    var result = data.replace(/\/\/ TODO:(.*?)/g, "res.json({ data: 'ok' }) //")
    console.log(result)

    fs.writeFile(path.join('.', projectName, 'routes', 'test.js'), result, 'utf8', function(err) {
      if (err) {
        reject(err)
      } else {
        if (callback) {
          callback()
        } else {
          console.log('resolve')
          resolve()
        }
      }
    })
  })
}


let server;
before(function(done) {
  this.timeout(120000)
  generateProject().then(() => {
    const app = require('../' + projectName + '/app');
    server = app.listen(3000, done)
  })

})

describe('/test/data', function () {
  describe('POST', function () {
    it('should not return 404 status code', function (done) {
      this.timeout(10000)
      request({
        url: baseURL + '/test/data',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      },
      function (error, res, body) {
        if (error) return done(error)
        res.statusCode.should.not.equal(404)
        done()
      })
    })
  })
})
describe('/test/move/column', function () {
  describe('POST', function () {
    it('should not return 404 status code', function (done) {
      this.timeout(5000)
      request({
        url: baseURL + '/test/move/column',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      },
      function (error, res, body) {
        if (error) return done(error)
        res.statusCode.should.not.equal(404)
        done()
      })
    })
  })
})
describe('/test/settings', function () {
  describe('GET', function () {
    it('should not return 404 status code', function (done) {
      this.timeout(5000)
      request({
        url: baseURL + '/test/settings',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      },
      function (error, res, body) {
        if (error) return done(error)
        res.statusCode.should.not.equal(404)
        done()
      })
    })
  })
})
describe('/test/create/column', function () {
  describe('POST', function () {
    it('should not return 404 status code', function (done) {
      this.timeout(5000)
      request({
        url: baseURL + '/test/create/column',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      },
      function (error, res, body) {
        if (error) return done(error)
        res.statusCode.should.not.equal(404)
        done()
      })
    })
  })
})
describe('/test/create/row', function () {
  describe('POST', function () {
    it('should not return 404 status code', function (done) {
      this.timeout(5000)
      request({
        url: baseURL + '/test/create/row',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      },
      function (error, res, body) {
        if (error) return done(error)
        res.statusCode.should.not.equal(404)
        done()
      })
    })
  })
})
describe('/test/update', function () {
  describe('POST', function () {
    it('should not return 404 status code', function (done) {
      this.timeout(5000)
      request({
        url: baseURL + '/test/update',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      },
      function (error, res, body) {
        if (error) return done(error)
        res.statusCode.should.not.equal(404)
        done()
      })
    })
  })
})

after(done => {
  server.close()
  removeProject(done)
})




