//MWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMW
//MW  GRUNT TASK FUNCTION: MULTITASK
//MWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMWMW

'use strict';

const grunt = require('grunt');

module.exports = {
  exec,
  initialize
};

function initialize(task, defaultOptions) {
  //console.log(grunt === grunt_);
  let options = {
    default: defaultOptions || {},
    task: grunt.config(task.name + '.options'),
    target: grunt.config(task.name + '.' + task.target + '.options'), // task.data.options
    args: {}
  };
  let parameters = {
    task: task,
    target: task.target,
    options: Object.assign(options.default, options.task, options.target)
  };
  for (let key in parameters.options) {
    //grunt.log.writeln(key);
    let value = grunt.option(key);
    if (value !== undefined) options.args[key] = value;
  }
  Object.assign(parameters.options, options.args);
  //grunt.log.writeln('options = ' + JSON.stringify(options, null, 2));
  //grunt.log.writeln('task params = ' + JSON.stringify(parameters, null, 2));
  return parameters;
}

function exec() {
  let { task, target } = initialize(this);
  let tasks = task.data.tasks;

  // MAKE REQUESTED CHANGES TO CONFIGURATION BEFORE RUNNING TASKS
  let config = task.data.config;
  if (config) {
    if (config.set) {
      for (let parameter of config.set) {
        grunt.config.set(parameter.key, parameter.value);
      }
    }
  }

  // IF ALL, THEN QUEUE UP ALL THE OTHER TASKS IN THE CONFIG
  if (target === 'all') {
    tasks = [];
    for (let target in grunt.config.get(task.name)) {
      if (target !== 'options' && target !== 'all') {
        tasks.push(task.name + ':' + target);
      }
    }
  }

  // RUN THE TASKS
  if (tasks) {
    grunt.task.run(tasks);
  }
}
