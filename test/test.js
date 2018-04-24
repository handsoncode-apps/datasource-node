/* eslint-env mocha */

const { exec } = require('child_process');
const fs = require('fs');
const rimraf = require('rimraf');
const path = require('path');
const chai = require('chai');

chai.should();

const request = require('request');

const projectName = 'testapp';

var baseURL = 'http://localhost:3000';

var generateProject = function() {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line no-console
    console.log('generating project');
    var cmd = `express --view=pug ${projectName}`;

    exec(cmd, (error) => {
      if (error) {
        reject(error);
      } else {
        npmInstall(`./${projectName}`, resolve, reject);
      }
    });
  });
};

var npmInstall = function(dir, resolve, reject) {
  // eslint-disable-next-line no-console
  console.log('Running npm install...');
  var cmd = `npm --prefix ${dir} install ${dir}`;
  exec(cmd, (error) => {
    if (error) {
      reject(error);
    } else {
      runGenerator(resolve, reject);
    }
  });
};

var runGenerator = function(resolve, reject) {
  exec('node ../bin/index.js --engine pug test', { cwd: path.resolve(__dirname, '..', projectName)}, (error, stdout) => {
    if (error) {
      reject(error);
    } else {
      insertLines(stdout, resolve, reject);
    }
  });
};

var removeProject = function(callback) {
  rimraf(`./${projectName}`, (error) => {
    if (error) {
      var warningMessage = `${error.code}. Cannot remove test project ${projectName}`;
      if (error.code === 'EPERM') {
        warningMessage += '. Operation not permitted.';
      }
      if (error.code === 'EBUSY' || error.code === 'ENOTEMPTY') {
        warningMessage += '. Resource busy or locked';
      }
      if (error.code === 'ENOENT') {
        warningMessage += '. File does not exist.';
      }
      reject(warningMessage);
      return process.exit(-1);
    }
    // eslint-disable-next-line no-console
    console.log('Test project is removed');
    return callback();
  });
};

var getLineToInsert = function() {
  return '\nconst test = require(\'./routes/test\');\n' +
            'app.use(\'/test\',test);\n';
};

var insertLines = function(stdout, resolve, reject) {
  var partToInsert = getLineToInsert();
  var content = 'var app = express();';
  var appJsPath = path.join('.', projectName, 'app.js');

  fs.readFile(appJsPath, 'utf8', (errorRead, data) => {
    if (errorRead) {
      reject(errorRead);
    }
    var result = data.replace('var app = express();', content + partToInsert);

    fs.writeFile(appJsPath, result, 'utf8', (errorWrite) => {
      if (errorWrite) {
        reject(errorWrite);
      } else {
        replaceInFile(resolve, reject);
      }
    });
  });
};

var replaceInFile = function(resolve, reject, callback) {
  fs.readFile(path.join('.', projectName, 'routes', 'test.js'), 'utf8', (err, data) => {
    if (err) {
      reject(err);
    }
    var result = data.replace(/\/\/ TODO:([^{]+?)}/g, 'res.json({ data: \'ok\' }) }); //');

    fs.writeFile(path.join('.', projectName, 'routes', 'test.js'), result, 'utf8', (errorWrite) => {
      if (errorWrite) {
        reject(errorWrite);
      } else if (callback) {
        callback();
      } else {
        resolve();
      }
    });
  });
};

let server;
before(function(done) {
  this.timeout(120000);
  generateProject().then(() => {
    // eslint-disable-next-line
    const app = require(`../${projectName}/app`);
    server = app.listen(3000, done);
  });
});

describe('/test/data', () => {
  describe('POST', () => {
    it('should not return 404 status code', function (done) {
      this.timeout(10000);
      request(
        {
          url: `${baseURL}/test/data`,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        },
        (error, res) => {
          if (error) { return done(error); }
          res.statusCode.should.not.equal(404);
          done();
        }
      );
    });
  });
});
describe('/test/column/move', () => {
  describe('POST', () => {
    it('should not return 404 status code', function (done) {
      this.timeout(5000);
      request(
        {
          url: `${baseURL}/test/column/move`,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        },
        (error, res) => {
          if (error) { return done(error); }
          res.statusCode.should.not.equal(404);
          done();
        }
      );
    });
  });
});
describe('/test/settings', () => {
  describe('GET', () => {
    it('should not return 404 status code', function (done) {
      this.timeout(5000);
      request(
        {
          url: `${baseURL}/test/settings`,
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        },
        (error, res) => {
          if (error) { return done(error); }
          res.statusCode.should.not.equal(404);
          done();
        }
      );
    });
  });
});

describe('/test/column', () => {
  describe('DELETE', () => {
    it('should not return 404 status code', function (done) {
      this.timeout(5000);
      request(
        {
          url: `${baseURL}/test/column`,
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        },
        (error, res) => {
          if (error) { return done(error); }
          res.statusCode.should.not.equal(404);
          done();
        }
      );
    });
  });
  describe('PUT', () => {
    it('should not return 404 status code', function (done) {
      this.timeout(5000);
      request(
        {
          url: `${baseURL}/test/column`,
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          }
        },
        (error, res) => {
          if (error) { return done(error); }
          res.statusCode.should.not.equal(404);
          done();
        }
      );
    });
  });
});
describe('/test/row', () => {
  describe('DELETE', () => {
    it('should not return 404 status code', function (done) {
      this.timeout(5000);
      request(
        {
          url: `${baseURL}/test/row`,
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        },
        (error, res) => {
          if (error) { return done(error); }
          res.statusCode.should.not.equal(404);
          done();
        }
      );
    });
  });
  describe('PUT', () => {
    it('should not return 404 status code', function (done) {
      this.timeout(5000);
      request(
        {
          url: `${baseURL}/test/row`,
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          }
        },
        (error, res) => {
          if (error) { return done(error); }
          res.statusCode.should.not.equal(404);
          done();
        }
      );
    });
  });
});
describe('/test/cell', () => {
  describe('POST', () => {
    it('should not return 404 status code', function (done) {
      this.timeout(5000);
      request(
        {
          url: `${baseURL}/test/cell`,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        },
        (error, res) => {
          if (error) { return done(error); }
          res.statusCode.should.not.equal(404);
          done();
        }
      );
    });
  });
});
describe('/test/cell/meta', () => {
  describe('POST', () => {
    it('should not return 404 status code', function (done) {
      this.timeout(5000);
      request(
        {
          url: `${baseURL}/test/cell/meta`,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        },
        (error, res) => {
          if (error) { return done(error); }
          res.statusCode.should.not.equal(404);
          done();
        }
      );
    });
  });
});

after((done) => {
  server.close();
  removeProject(done);
});

