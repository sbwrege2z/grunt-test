'use strict';

const tasks = require('./lib/grunt/tasks');
const multitask = require('./lib/grunt/shared/multitask');

module.exports = function(grunt) {
  require('load-grunt-config')(grunt);

  grunt.registerMultiTask('simple', 'Log some stuff.', tasks.simple);

  grunt.registerMultiTask('test', 'Test task', function() {
    let { options } = multitask.initialize(grunt, this);
    grunt.log.writeln('options = ' + JSON.stringify(options, null, 2));
  });

  tasks.mapDefaults('test', 'target1');
};
