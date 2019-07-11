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
  checkout: checkout,
  commit: commit,
  initializeBranch: initializeBranch,
  mergeToDevelopment: mergeToDevelopment,
  newBranch: newBranch,
  pull: pull,
  showBranches: showBranches,
  showTags: showTags,
  status: status
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
 *  initializeBranch
 *
 ****************************************/

function initializeBranch(task, options) {
  git.shellExec('npm install');
  git.shellExec('bit import');
}

/****************************************
 *
 *  task runners
 *
 ****************************************/

function checkout(task, options) {
  grunt.task.run(['git:checkout', 'slamdev:initializeBranch']);
}
function commit(task, options) {
  grunt.task.run(['jshint', 'newer:prettier:all', 'git:commit']);
}
function mergeToDevelopment(task, options) {
  grunt.task.run(['jshint', 'newer:prettier:all', 'git:commit', 'git:mergeToDevelopment']);
}
function newBranch(task, options) {
  grunt.task.run(['git:newBranch', 'slamdev:initialize']);
}
function pull(task, options) {
  grunt.task.run(['git:pull']);
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
