'use strict';

const grunt = require('grunt');
const shell = require('shelljs');
//const multitask = require('./multitask');

module.exports = { exec };

function exec() {
  //let { task } = multitask.initialize(this);

  shell.config.verbose = false;
  shell.config.silent = false;
  shell.config.fatal = true;

  if (!shell.which('jshint')) return grunt.fail.warn('This script requires jshint to be installed');
  shell.exec('jshint .');
  grunt.log.writeln('No errors found.');

  /*
  for (let fileOptions of task.data.files) {
    let files = grunt.file.expandMapping(fileOptions.src, fileOptions.dest, fileOptions);
    let max = files.length;
    grunt.log.writeln(max + ' matching files');
    if (files.length === 0) return grunt.log.ok();

    grunt.log.writeln('Linting ' + files.length + ' files.');
    for (let file of files) {
      grunt.log.writeln(file.dest);
      //grunt.log.write('.');
      shell.exec('jshint ' + file.dest);
    }
    grunt.log.writeln('\n');
  }
  */
}
