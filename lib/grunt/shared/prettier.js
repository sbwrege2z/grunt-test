'use strict';

const grunt = require('grunt');
const shell = require('shelljs');
const multitask = require('./multitask');

module.exports = { exec };

function exec() {
  let { task, options } = multitask.initialize(this);
  let check = grunt.option('check') || options.check;

  shell.config.verbose = false;
  shell.config.silent = true;
  shell.config.fatal = false; //!options.check;
  if (!shell.which('prettier'))
    return grunt.fail.warn('This script requires prettier to be installed');
  for (let fileOptions of task.data.files) {
    let files = grunt.file.expandMapping(fileOptions.src, fileOptions.dest, fileOptions);
    let max = files.length;
    grunt.log.writeln(max + ' matching files');
    if (files.length === 0) return grunt.log.ok();

    grunt.log.writeln(
      (check ? 'Checking' : 'Correcting') + ' styles of ' + files.length + ' files.'
    );
    for (let file of files) {
      grunt.log.writeln(file.dest);
      //grunt.log.write('.');
      let result = shell.exec('prettier ' + file.dest + ' --' + (check ? 'check' : 'write'));
      if (result.match(/Code style issues found/)) {
        grunt.log.writeln('');
        return grunt.fail.warn('Code style issues found in "' + file.dest + '"');
      }
    }
    grunt.log.writeln('\n');
  }
}
