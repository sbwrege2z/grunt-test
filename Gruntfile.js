'use strict';

const path = require('path');
const grunt_ = require('grunt');
const tasks = require('./lib/grunt/tasks');
const multitask = require('./lib/grunt/shared/multitask');

module.exports = function(grunt) {
  console.log(grunt === grunt_);
  require('load-grunt-config')(grunt, {
    init: true,
    configPath: [path.join(process.cwd(), 'grunt'), path.join(process.cwd(), 'grunt/shared')]
  });

  grunt.registerMultiTask('test', 'Test task', tasks.test);
  grunt.registerMultiTask('simple', 'Log some stuff.', tasks.simple);

  tasks.mapDefaults('test', 'target1');
};
