'use strict';

const grunt = require('grunt');
const shell = require('shelljs');
const multitask = require('./multitask');
const git = require('./git');
const prettier = require('./prettier');
const jshint = require('./jshint');

module.exports = {
  exec: execute
};

/****************************************
 *
 *  operations
 *
 ****************************************/

let operations = {
  commit: commit,
  status: status,
  showTags: showTags,
  showBranches: showBranches
};

/****************************************
 *
 *  execute
 *
 ****************************************/

function execute() {
  grunt.log.writeln('execute');
  let { task, target, options } = multitask.initialize(this);
  shell.config.verbose = options.verbose;
  shell.config.silent = options.silent;
  shell.config.fatal = options.fatal;
  if (operations[target]) {
    return operations[target](task, options);
  } else {
    grunt.fail.fatal('unknown target ' + target);
  }
}

/****************************************
 *
 *  status
 *
 ****************************************/

function commit(task, options) {
  grunt.task.run(['git:commit']);
}
function status(task, options) {
  grunt.task.run(['git:status']);
}
function showTags(task, options) {
  grunt.task.run(['git:showTags']);
}
function showBranches(task, options) {
  grunt.task.run(['git:showBranches']);
}
