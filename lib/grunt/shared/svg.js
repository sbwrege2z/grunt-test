'use strict';

const grunt = require('grunt');
const svg2png = require('svg2png');
const multitask = require('./multitask');
//const fs = require('pn/fs');

module.exports = {
  convertToPng
};

function convertToPng() {
  function writeProgress() {
    let temp = Math.floor(total / 50) * 50;
    grunt.log.writeln(' ' + Math.round((100 * temp) / max) + '%');
  }

  function incProgress() {
    count++;
    total++;
    if (count > 50) {
      count -= 50;
      writeProgress();
    }
    grunt.log.write('.');
  }

  function convertFile(file) {
    return new Promise(function(resolve, reject) {
      file.src = file.src[0];
      //grunt.log.writeln(file.src + ' => ' + file.dest);
      if (grunt.file.exists(file.dest)) {
        skipped++;
        incProgress();
        return resolve();
      }

      let buffer = grunt.file.read(file.src);
      svg2png(buffer, { width: options.width, height: options.height })
        //fs.readFile(file .src)
        //	.then(buffer => svg2png(buffer, { width: options.width, height: options.height }))
        //	.then(buffer => fs.writeFile(file.dest, buffer))

        .then((buffer) => {
          grunt.file.write(file.dest, buffer);

          converted++;
          incProgress();
        })
        /* jshint ignore:start */
        .then(() => resolve())
        /* jshint ignore:end */
        .catch((error) => reject(error));
    });
  }

  function convertFiles(files) {
    return new Promise(function(resolve, reject) {
      if (files.length > 0) {
        let threads = options.concurrent;
        let promises = [];
        while (threads > 0 && files.length > 0) {
          promises.push(convertFile(files.shift()));
          threads--;
        }
        Promise.all(promises)
          .then(() => convertFiles(files))
          .then(() => resolve())
          .catch((error) => reject(error));
      } else {
        grunt.log.writeln(' 100%');
        resolve();
      }
    });
  }

  let files = null;
  let count = 0;
  let total = 0;
  let max = 0;
  let converted = 0;
  let skipped = 0;

  let { task, options } = multitask.initialize(this, { concurrent: 5, showProgress: true });

  for (let fileOptions of this.data.files) {
    files = grunt.file.expandMapping(fileOptions.src, fileOptions.dest, fileOptions);
    max = files.length;
    grunt.log.writeln(max + ' matching teams');
    if (files.length === 0) return grunt.log.ok();

    let done = task.async();
    convertFiles(files)
      /* jshint ignore:start */
      .then(() => {
        grunt.log.writeln('Converted: ' + converted);
        grunt.log.writeln('Skipped: ' + skipped);
        return done();
      })
      /* jshint ignore:end */
      .catch((error) => grunt.fail.fatal(error));
  }
}
