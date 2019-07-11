//MWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMW
//MW  GRUNT TASK FUNCTIONS - LIBRARY OF ALL CUSTOM TASKS
//MWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMW

'use strict';

const grunt = require('grunt');
const git = require('./shared/git');
const slamdev = require('./shared/slamdev');
const prettier = require('./shared/prettier');
const jshint = require('./shared/jshint');
const multitask = require('./shared/multitask');

module.exports = {
  simple,
  test,
  prettier: prettier.exec,
  jshint: jshint.exec,
  multitask: multitask.exec,
  git: git.exec,
  slamdev: slamdev.exec,
  mapDefaults
};

function test() {
  let { options } = multitask.initialize(this);
  grunt.log.writeln('options = ' + JSON.stringify(options, null, 2));
}

function simple() {
  //let parameters = multitask.initialize(this);
  //let task = parameters.task;
  //let target = parameters.target;
  //let options = parameters.options;

  let { options } = multitask.initialize(this);
  grunt.log.writeln('Logging some stuff...');
  grunt.log.writeln('options = ' + JSON.stringify(options, null, 2));
  grunt.log.ok();
}

function mapDefaults(taskname, default_target, arbitrary_target) {
  let decoratedFn = grunt.task._tasks[taskname].fn;

  function decorator(target) {
    let args = grunt.util.toArray(arguments);
    if (!target) {
      args = [default_target].concat(args.slice(1));
    } else if (arbitrary_target && !grunt.config([taskname, target])) {
      args = [arbitrary_target, target].concat(args.slice(1));
    }
    this.nameArgs = taskname + ':' + args[0];
    this.args = args;
    decoratedFn.apply(this, args);
  }

  grunt.task._tasks[taskname].fn = decorator;
}
